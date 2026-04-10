import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const SKINCARE_CAT_ID = 30001;
const TEA_CAT_ID = 30002;

const products = [
  // Skincare
  {
    name: "Rose & Cactus Radiance Serum",
    description: "เซรั่มบำรุงผิวสูตรพิเศษผสานพลังจากกุหลาบมอญและกระบองเพชร ช่วยฟื้นฟูผิวระดับเซลล์ ลดริ้วรอยและเพิ่มความชุ่มชื้น เหมาะสำหรับผิวทุกประเภท",
    price: "1290.00",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663084993239/YGoR3BS934bR93H6563cHY/skincare_serum_placeholder-L5VRsV6HQoau87PgBWwSaw.webp",
    categoryId: SKINCARE_CAT_ID,
    stock: 50,
    isActive: true,
    isFeatured: false,
  },
  {
    name: "Quiet Ritual Renewal Cream",
    description: "ครีมบำรุงผิวหน้าเนื้อเนียนนุ่ม สูตร deep moisture ด้วยสารสกัดจากกุหลาบมอญและน้ำมันธรรมชาติ บำรุงผิวให้นุ่มชุ่มชื้นตลอดวัน",
    price: "1590.00",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663084993239/YGoR3BS934bR93H6563cHY/skincare_cream_placeholder-oL3bQpJqN9YAAb3CRDs2gk.webp",
    categoryId: SKINCARE_CAT_ID,
    stock: 40,
    isActive: true,
    isFeatured: false,
  },
  {
    name: "Rose Facial Toner Mist",
    description: "โทนเนอร์น้ำกุหลาบบริสุทธิ์ในรูปแบบสเปรย์ ช่วยปรับสมดุลผิว เติมความชุ่มชื้น และเตรียมผิวรับการบำรุงขั้นต่อไป กลิ่นหอมอ่อนๆ จากกุหลาบธรรมชาติ",
    price: "890.00",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663084993239/YGoR3BS934bR93H6563cHY/skincare_toner_placeholder-5utksS64T58J4negHUcdLo.webp",
    categoryId: SKINCARE_CAT_ID,
    stock: 60,
    isActive: true,
    isFeatured: false,
  },
  // Tea
  {
    name: "Rose Reserve Loose Leaf Tea",
    description: "ชากุหลาบมอญแท้ 100% คัดสรรดอกกุหลาบมอญจากแหล่งปลูกธรรมชาติ อุดมด้วยสารต้านอนุมูลอิสระ กลิ่นหอมละมุน รสชาติอ่อนหวานเป็นธรรมชาติ",
    price: "490.00",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663084993239/YGoR3BS934bR93H6563cHY/tea_rose_placeholder-Pvbex96pFTzpeZH4NSpK7U.webp",
    categoryId: TEA_CAT_ID,
    stock: 80,
    isActive: true,
    isFeatured: false,
  },
  {
    name: "Wellness Herbal Blend Tea",
    description: "ชาสมุนไพรผสมพิเศษ ผสานพลังจากดอกคาโมมายล์ ลาเวนเดอร์ และกุหลาบ ช่วยผ่อนคลาย ลดความเครียด เหมาะดื่มก่อนนอนเพื่อการพักผ่อนที่ดี",
    price: "590.00",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663084993239/YGoR3BS934bR93H6563cHY/tea_herbal_placeholder-fZiCSMWPJgPAiajMGx3NPs.webp",
    categoryId: TEA_CAT_ID,
    stock: 70,
    isActive: true,
    isFeatured: false,
  },
  {
    name: "Cactus Pear & Rose Herbal Tea",
    description: "ชาสมุนไพรสูตรพิเศษจากกระบองเพชรและกุหลาบมอญ อุดมด้วย Corilagin และ Betacyanin ช่วยบำรุงร่างกายจากภายใน เสริมสร้างภูมิคุ้มกัน",
    price: "650.00",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663084993239/YGoR3BS934bR93H6563cHY/tea_cactus_placeholder-fZHDC9LDAQ685TEByXNuFe.webp",
    categoryId: TEA_CAT_ID,
    stock: 65,
    isActive: true,
    isFeatured: false,
  },
];

async function seed() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  try {
    for (const p of products) {
      await conn.execute(
        `INSERT INTO products (name, description, price, imageUrl, categoryId, stock, isActive, isFeatured, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [p.name, p.description, p.price, p.imageUrl, p.categoryId, p.stock, p.isActive ? 1 : 0, p.isFeatured ? 1 : 0]
      );
      console.log(`✅ Added: ${p.name}`);
    }
    console.log("\n🎉 All Curated Collection products seeded!");
  } finally {
    await conn.end();
  }
}

seed().catch(console.error);
