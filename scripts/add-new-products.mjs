import { createConnection } from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const connection = await createConnection(DATABASE_URL);
const db = drizzle(connection);

const { products, categories } = await import("../drizzle/schema.js");

// ดู categories ที่มีอยู่
const cats = await db.select().from(categories);
console.log("Categories:", cats.map(c => `${c.id}: ${c.name}`).join(", "));

// รูปภาพ CDN paths
const MORNING_VEIL_IMG = "/manus-storage/morning-veil-shot_75db085b.jpg";
const GUMMY_DAILY_BALANCE_IMG = "/manus-storage/gummy-daily-balance_02163e00.png";
const GUMMY_AFTERNOON_IMG = "/manus-storage/gummy-afternoon-awake_5fe35ea9.png";
const GUMMY_MIDNIGHT_IMG = "/manus-storage/gummy-midnight-rose_935444d7.jpg";

// หา category id สำหรับ Beyond Cider™ (id=1)
// และ Gummy จะอยู่ใน category ใหม่หรือ Beyond Cider™ ก็ได้

// เพิ่ม Morning Veil Shot 50ml
console.log("Adding Morning Veil Shot...");
await db.insert(products).values({
  id: 70001,
  name: "Bienvica Morning Veil Shot — เตรียมร่างกายก่อนเริ่มวัน",
  description: "Morning Veil Shot 50ml — ดื่มง่าย ปลุกความสดชื่นทันที ผสาน Active Phenolic Compounds ลดความล้าสะสม เคลียร์สมองให้เฟรช Nopal + Rose + ACV Blend รักษาสมดุลน้ำตาลและระบบเผาผลาญ CoQ10 + Rose Extract ปกป้องผิวและเซลล์จากอนุมูลอิสระ ไม่มีน้ำตาลเพิ่ม พร้อมดื่ม 50ml",
  price: "40",
  categoryId: 1,
  imageUrl: MORNING_VEIL_IMG,
  stock: 100,
  isActive: true,
  isFeatured: false,
});

// เพิ่ม Gummy Afternoon Awake (ซองเขียว)
console.log("Adding Gummy Afternoon Awake...");
await db.insert(products).values({
  id: 70002,
  name: "Bienvica Gummy Afternoon Awake — Nopal Cactus Gummy (ซองเขียว)",
  description: "Afternoon Awake — กัมมี่สำหรับช่วงบ่ายที่ยังต้องไปต่อ ทาน 2 เม็ด มื้อกลางวัน สดชื่น มีสมาธิ โฟกัสงาน คลายปวดเมื่อยล้า Nopal Cactus + Magnesium Malate ปลุกสมองล้า คลายปวดเมื่อยบ่าไหล่ Green Apple สารต้านอนุมูลอิสระธรรมชาติ รีเฟรชร่างกายให้สดชื่น ACV คุมสมดุลน้ำตาล ลดอาการง่วงนอนหลังมื้อเที่ยง 0% Sugar Added วัตถุดิบพรีเมียมจากฟาร์ม Nopal Cactus สกลนคร ซองละ 6 เม็ด",
  price: "59",
  categoryId: 1,
  imageUrl: GUMMY_AFTERNOON_IMG,
  stock: 100,
  isActive: true,
  isFeatured: true,
});

// เพิ่ม Gummy Midnight Rose (ซองชมพู)
console.log("Adding Gummy Midnight Rose...");
await db.insert(products).values({
  id: 70003,
  name: "Bienvica Gummy Midnight Rose — Nopal Cactus Gummy (ซองชมพู)",
  description: "Midnight Rose — Bedtime Ritual ที่ร่างกายรอคอย ทาน 2 เม็ด ก่อนนอน ผ่อนคลายระบบประสาท หลับลึกสนิท ไม่สะดุ้งตื่นกลางดึก Nopal Cactus + ACV Blend ดูแลสมดุลน้ำตาล ฟื้นฟูเซลล์ระหว่างหลับ Magnesium Bisglycinate ผ่อนคลายระบบประสาท ลดความตึงเครียดของกล้ามเนื้อ Glycine สนับสนุนสารสื่อประสาท GABA ช่วยให้หลับลึกและยาวนานขึ้น Rosa damascena อโรมาช่วยให้ใจสงบ พร้อมฟื้นฟูผิวขณะนอนหลับ 0% Sugar Added ซองละ 6 เม็ด",
  price: "59",
  categoryId: 1,
  imageUrl: GUMMY_MIDNIGHT_IMG,
  stock: 100,
  isActive: true,
  isFeatured: true,
});

// อัปเดตรูปภาพ Gift Set (id=4) ด้วยรูปจริงจากผู้ใช้
// ใช้รูป gummy-daily-balance ที่มีขวด Bienvica สวยงาม
// (รูป Gift Set จริงๆ คือรูปขวดในชาม)
// อัปโหลดรูป Gift Set แยกต่างหาก

console.log("Verifying new products...");
const newProds = await db.select({ id: products.id, name: products.name, price: products.price }).from(products).where(eq(products.id, 70001));
console.log("Morning Veil Shot:", newProds);

await connection.end();
console.log("Done!");
