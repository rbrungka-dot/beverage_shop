import { createConnection } from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";

const DATABASE_URL = process.env.DATABASE_URL;
const connection = await createConnection(DATABASE_URL);
const db = drizzle(connection);
const { products } = await import("../drizzle/schema.js");

// อัปเดตรูปภาพ Morning Veil Shot
await db.update(products).set({ 
  imageUrl: "/manus-storage/morning-veil-shot_3213c34d.png"
}).where(eq(products.id, 70001));
console.log("Updated Morning Veil Shot image");

// อัปเดตรูปภาพ Gummy Afternoon Awake
await db.update(products).set({ 
  imageUrl: "/manus-storage/gummy-afternoon-awake_6f08a1b2.jpg"
}).where(eq(products.id, 70002));
console.log("Updated Gummy Afternoon Awake image");

// อัปเดตรูปภาพ Gummy Midnight Rose
await db.update(products).set({ 
  imageUrl: "/manus-storage/gummy-midnight-rose_33809d03.jpg"
}).where(eq(products.id, 70003));
console.log("Updated Gummy Midnight Rose image");

// ตรวจสอบ
const newProds = await db.select({ id: products.id, name: products.name, imageUrl: products.imageUrl })
  .from(products)
  .where(eq(products.id, 70001));
console.log("Morning Veil Shot:", newProds);

await connection.end();
console.log("Done!");
