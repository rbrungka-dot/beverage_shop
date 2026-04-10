/**
 * Seed script: นำเข้าบทความแรกจาก Facebook Page ของ Bienvica
 * รัน: node seed-article.mjs
 */
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

const article = {
  title: "ความลับของกุหลาบมอญ — เมื่อ \"ธรรมชาติ\" ทำงานได้ชาญฉลาดกว่าที่เคย",
  slug: "secret-of-damask-rose-corilagin-dual-action",
  excerpt:
    "เบื้องหลังความหรูหราของ Bienvica คือการค้นพบอัญมณีทางพฤกษเคมีที่ชื่อว่า \"Corilagin\" ในกุหลาบมอญ (Damask Rose) — สารกลุ่ม Hydrolysable Tannin ที่ทำงาน Dual-Action เพื่อปกป้องความอ่อนเยาว์ของคุณจากภายใน",
  content: `ไม่ใช่กุหลาบทุกสายพันธุ์ที่จะดูแลผิวได้ลึกถึงระดับโมเลกุลนะคะ

เบื้องหลังความหรูหราของ Bienvica (เบียงวิก้า) คือการค้นพบอัญมณีทางพฤกษเคมีที่ชื่อว่า **"Corilagin"** ในกุหลาบมอญ (Damask Rose) สารกลุ่ม Hydrolysable Tannin นี้คือกุญแจสำคัญของกลไก Dual-Action ที่ทำงานประสานกันเพื่อปกป้องความอ่อนเยาว์ของคุณจากภายใน

## 1. The Sugar Blocker: หยุดยั้งที่ต้นเหตุ

Corilagin คือสารออกฤทธิ์หลักที่งานวิจัยยืนยันว่ามีประสิทธิภาพสูงสุดในการยับยั้งเอนไซม์ย่อยคาร์โบไฮเดรต ด้วยค่า IC50 ที่ระดับ **0.27%** ซึ่งทรงพลังกว่าไซเดอร์ทั่วไปอย่างมีนัยสำคัญ เพื่อลดการพุ่งสูงของน้ำตาลหลังมื้ออาหาร และปกป้องคอลลาเจนไม่ให้ถูกทำลาย

## 2. The Cellular Protector: เกราะป้องกันที่เหนือระดับ

มากกว่าการคุมน้ำตาล คือการต้านอนุมูลอิสระ (Broad-spectrum Antioxidant) ที่เข้มข้นที่สุด:

- สารสกัดจากกุหลาบมอญของเรามีประสิทธิภาพในการกำจัดอนุมูลอิสระ DPPH ด้วยค่า IC50 ต่ำเพียง **4.7 µL/mL** (ยิ่งค่าน้อย ประสิทธิภาพยิ่งสูง)
- มีค่าความสามารถในการดูดซับอนุมูลอิสระ (ORAC) สูงถึง **99 µmol TE/mL**

นี่คือเกราะป้องกันระดับเซลล์ที่ช่วยหยุดยั้งความเสียหายก่อนที่จะปรากฏเป็นริ้วรอยและความหมองคล้ำค่ะ

---

นี่คือเหตุผลที่ Beyond Cider™ แตกต่าง เพราะเราไม่ได้ทำเพียงแค่เครื่องดื่ม แต่เรากำลังส่งมอบ **"มาตรฐานใหม่"** ของการดูแลความอ่อนเยาว์อย่างยั่งยืนระดับเซลล์ให้กับคุณในทุกวัน

สัมผัสวิถีแห่ง Modern Alchemist — วิทยาศาสตร์ความงามที่ดื่มได้

---

*อ้างอิงงานวิจัยจากโครงการ RAINS for Semi-Industrial Food Valley (Functional food and Personalized food) ประจำปี 2568 สนับสนุนโดย สวก.*`,
  coverImage:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663084993239/YGoR3BS934bR93H6563cHY/article_corilagin_cover_901d22fb.webp",
  authorName: "Bienvica",
  isPublished: true,
};

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  // ตรวจสอบว่ามี slug นี้อยู่แล้วหรือยัง
  const [existing] = await conn.execute(
    "SELECT id FROM articles WHERE slug = ?",
    [article.slug]
  );

  if (existing.length > 0) {
    console.log("บทความนี้มีอยู่แล้ว (slug ซ้ำ) — ข้ามการ insert");
    await conn.end();
    return;
  }

  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  await conn.execute(
    `INSERT INTO articles (title, slug, excerpt, content, coverImage, authorName, isPublished, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      article.title,
      article.slug,
      article.excerpt,
      article.content,
      article.coverImage,
      article.authorName,
      article.isPublished ? 1 : 0,
      now,
      now,
    ]
  );

  console.log("✅ นำเข้าบทความสำเร็จ:", article.title);
  await conn.end();
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
