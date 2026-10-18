// Recovered from legacy products 1, 3 and 4; prices from update-products.mjs.
// Temporary stock counts sellable units: bottles for singles, sets for packs.
export const bienvicaCatalog = [
  {id:'bienvica-beyond-cider-250',name:'Bienvica Beyond Cider™ 250 mL (1 ขวด)',brand:'Bienvica',description:'เครื่องดื่มสปาร์กลิงไร้แอลกอฮอล์ จากแคคตัส กุหลาบ และแอปเปิ้ลไซเดอร์ ขนาด 250 mL จำนวน 1 ขวด',instructions:'แช่เย็นก่อนเสิร์ฟ ข้อมูลส่วนประกอบและวิธีเก็บรักษาให้ยึดตามฉลากผลิตภัณฑ์',image:'/assets/sparkling.webp',priceSatang:24000,stock:100,active:true,legacyProductId:'1',stockUnit:'bottle',bottlesPerUnit:1},
  {id:'bienvica-beyond-cider-12',name:'Bienvica Beyond Cider™ แพ็ค 12 ขวด',brand:'Bienvica',description:'Bienvica Beyond Cider™ ขนาด 250 mL จำนวน 12 ขวดต่อแพ็ค',instructions:'แช่เย็นก่อนเสิร์ฟ ข้อมูลส่วนประกอบและวิธีเก็บรักษาให้ยึดตามฉลากผลิตภัณฑ์',image:'/assets/sparkling.webp',priceSatang:240000,stock:100,active:true,legacyProductId:'3',stockUnit:'pack',bottlesPerUnit:12},
  {id:'bienvica-gift-set-6',name:'Bienvica Gift Set — ชุดของขวัญ 6 ขวด',brand:'Bienvica',description:'ชุดของขวัญ Bienvica Beyond Cider™ ขนาด 250 mL จำนวน 6 ขวดต่อชุด',instructions:'แช่เย็นก่อนเสิร์ฟ ข้อมูลส่วนประกอบและวิธีเก็บรักษาให้ยึดตามฉลากผลิตภัณฑ์',image:'/assets/sparkling.webp',priceSatang:150000,stock:100,active:true,legacyProductId:'4',stockUnit:'set',bottlesPerUnit:6}
];

// One transaction: rerunning preserves every existing product and stock value.
export async function importBienvicaCatalog(db, actor) {
  const refs=bienvicaCatalog.map(p=>db.doc('products/'+p.id));
  return db.runTransaction(async transaction=>{
    const snapshots=await transaction.getAll(...refs);
    const created=[],skipped=[];
    snapshots.forEach((snapshot,index)=>{
      const {id,...product}=bienvicaCatalog[index];
      if(snapshot.exists){skipped.push(id);return;}
      transaction.create(refs[index],{...product,stockSource:'temporary-manual',importedBy:actor,importedAt:new Date().toISOString()});
      created.push(id);
    });
    return {created,skipped};
  });
}
