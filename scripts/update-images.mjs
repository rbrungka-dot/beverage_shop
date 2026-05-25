import { createConnection } from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";

const DATABASE_URL = process.env.DATABASE_URL;
const connection = await createConnection(DATABASE_URL);
const db = drizzle(connection);
const { products } = await import("../drizzle/schema.js");

// อัปเดตรูป Gift Set ด้วยรูปจริง (ขวดในชาม)
await db.update(products).set({ 
  imageUrl: "/manus-storage/gift-set-bottles_4a1b0fc3.jpg",
  description: "ชุดของขวัญสุดพิเศษ Bienvica Beyond Cider™ 6 ขวด บรรจุในชามแก้วพรีเมียม ตกแต่งด้วยกระดาษห่อสวยงาม พร้อมการ์ดแบรนด์ เหมาะสำหรับมอบเป็นของขวัญวันเกิด วันครบรอบ หรือเทศกาลพิเศษ ส่งมอบความห่วงใยและสุขภาพที่ดีให้คนที่คุณรัก"
}).where(eq(products.id, 4));
console.log("Updated Gift Set image and description");

// อัปเดต description สินค้า 1 ขวด
await db.update(products).set({ 
  description: "Bienvica Beyond Cider™ 250ml (1 ขวด) — เครื่องดื่มสุขภาพ 0% แชมเปญเพื่อสุขภาพ ผสานพลังจากกุหลาบมอญ กระบองเพชร Nopal และ Apple Cider Vinegar ผ่านการพิสูจน์ทางวิทยาศาสตร์ระดับเซลล์ (Caco-2 Cell Model) ช่วยคุมน้ำตาล ลดการอักเสบ และฟื้นฟูพลังงาน ไม่มีน้ำตาลเพิ่ม ไม่มีแอลกอฮอล์ รสชาติสดชื่นใกล้เคียงแชมเปญ"
}).where(eq(products.id, 1));
console.log("Updated 1-bottle description");

// อัปเดต description 12 ขวด
await db.update(products).set({ 
  description: "Bienvica Beyond Cider™ 250ml แพ็ค 12 ขวด — ซัพพลายรายเดือนที่คุ้มค่าที่สุด! ดื่มต่อเนื่อง 2 สัปดาห์ เห็นผลชัดเจนยิ่งขึ้น ผสานพลัง Triple Action™ ยับยั้งการย่อยน้ำตาล ชะลอการดูดซึม และกระตุ้นสมดุลธรรมชาติ เหมาะสำหรับผู้ที่ต้องการดูแลสุขภาพอย่างจริงจัง ประหยัดกว่าซื้อทีละขวด"
}).where(eq(products.id, 3));
console.log("Updated 12-bottle description");

// ดูสินค้าทั้งหมด
const all = await db.select({ id: products.id, name: products.name, price: products.price }).from(products);
console.log("All products:", JSON.stringify(all, null, 2));

await connection.end();
console.log("Done!");
