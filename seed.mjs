import mysql from "mysql2/promise";

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Insert categories
await conn.execute(`INSERT IGNORE INTO categories (name, slug, description) VALUES
  ('ชาและสมุนไพร', 'tea-herbal', 'ชาและเครื่องดื่มสมุนไพรธรรมชาติ'),
  ('กาแฟ', 'coffee', 'กาแฟคั่วบดคุณภาพพรีเมียม'),
  ('น้ำผลไม้', 'juice', 'น้ำผลไม้สดคั้นธรรมชาติ'),
  ('เครื่องดื่มสุขภาพ', 'health', 'เครื่องดื่มเพื่อสุขภาพและความงาม')`);

const [cats] = await conn.execute("SELECT id, slug FROM categories");
const catMap = Object.fromEntries(cats.map(c => [c.slug, c.id]));

const HERO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663084993239/YGoR3BS934bR93H6563cHY/hero-drinks_9c02699d.png";
const COCKTAIL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663084993239/YGoR3BS934bR93H6563cHY/cocktail-premium_8e7175d2.jpg";
const BOTTLE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663084993239/YGoR3BS934bR93H6563cHY/artisan-bottle_f7fe3e99.jpg";

const products = [
  { name: "Rose Hibiscus Tea", desc: "ชาดอกกระเจี๊ยบผสมกุหลาบ หอมละมุน รสเปรี้ยวอมหวาน", price: "280", catSlug: "tea-herbal", img: HERO, stock: 50, featured: true },
  { name: "Golden Turmeric Latte", desc: "ขมิ้นชันออร์แกนิคผสมนมอัลมอนด์ ต้านอนุมูลอิสระ", price: "320", catSlug: "health", img: COCKTAIL, stock: 30, featured: true },
  { name: "Artisan Cold Brew", desc: "กาแฟโคลด์บรูว์ชงนาน 24 ชั่วโมง รสเข้มกลมกล่อม", price: "350", catSlug: "coffee", img: BOTTLE, stock: 25, featured: true },
  { name: "Butterfly Pea Lemonade", desc: "ดอกอัญชันผสมมะนาวสด เปลี่ยนสีได้ตามธรรมชาติ", price: "260", catSlug: "tea-herbal", img: HERO, stock: 40, featured: false },
  { name: "Mango Passion Juice", desc: "มะม่วงสุกผสมเสาวรสสด คั้นสดทุกวัน", price: "240", catSlug: "juice", img: COCKTAIL, stock: 35, featured: false },
  { name: "Matcha Ceremonial Grade", desc: "มัทฉะเกรดพิธีการจากญี่ปุ่น บดละเอียดพิเศษ", price: "420", catSlug: "tea-herbal", img: BOTTLE, stock: 20, featured: true },
  { name: "Collagen Berry Boost", desc: "คอลลาเจนผสมเบอร์รี่รวม บำรุงผิวจากภายใน", price: "380", catSlug: "health", img: HERO, stock: 15, featured: false },
  { name: "Single Origin Espresso", desc: "เอสเปรสโซ่ซิงเกิ้ลออริจิ้น จากไร่กาแฟดอยช้าง", price: "290", catSlug: "coffee", img: COCKTAIL, stock: 45, featured: false },
];

for (const p of products) {
  await conn.execute(
    `INSERT IGNORE INTO products (name, description, price, categoryId, imageUrl, stock, isActive, isFeatured) VALUES (?, ?, ?, ?, ?, ?, 1, ?)`,
    [p.name, p.desc, p.price, catMap[p.catSlug], p.img, p.stock, p.featured ? 1 : 0]
  );
}

console.log("Seed complete!");
await conn.end();
