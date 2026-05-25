import { createConnection } from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { eq, inArray } from "drizzle-orm";

// Read env from process
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const connection = await createConnection(DATABASE_URL);
const db = drizzle(connection);

// Import schema tables
const { products, cartItems, orderItems } = await import("../drizzle/schema.js");

// IDs to delete
const deleteIds = [2, 30001, 30002, 30003, 30004];

console.log("Deleting order_items for removed products...");
await db.delete(orderItems).where(inArray(orderItems.productId, deleteIds));

console.log("Deleting cart_items for removed products...");
await db.delete(cartItems).where(inArray(cartItems.productId, deleteIds));

console.log("Deleting products...");
await db.delete(products).where(inArray(products.id, deleteIds));

console.log("Updating prices...");
// 1 ขวด = 240 บาท
await db.update(products).set({ price: "240" }).where(eq(products.id, 1));
// 12 ขวด = 2,400 บาท
await db.update(products).set({ price: "2400", name: "Bienvica Beyond Cider™ แพ็ค 12 ขวด" }).where(eq(products.id, 3));
// Gift Set 6 ขวด = 1,500 บาท
await db.update(products).set({ price: "1500", name: "Bienvica Gift Set — ชุดของขวัญ 6 ขวด" }).where(eq(products.id, 4));

console.log("Verifying remaining products...");
const remaining = await db.select({ id: products.id, name: products.name, price: products.price }).from(products);
console.log("Remaining products:", JSON.stringify(remaining, null, 2));

await connection.end();
console.log("Done!");
