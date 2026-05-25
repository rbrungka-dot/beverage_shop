import { createConnection } from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { eq, or, inArray } from "drizzle-orm";
import { products, cartItems, orderItems } from "../drizzle/schema.js";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const connection = await createConnection(DATABASE_URL);
const db = drizzle(connection);

// หา product ids ในกลุ่ม Skincare (30001) และ Tea (30002)
const skincareTeaProducts = await db.select({ id: products.id, name: products.name })
  .from(products)
  .where(or(eq(products.categoryId, 30001), eq(products.categoryId, 30002)));

console.log("Products to delete:", skincareTeaProducts.map(p => `${p.id}: ${p.name}`));

if (skincareTeaProducts.length === 0) {
  console.log("No products found in Skincare/Tea categories");
  await connection.end();
  process.exit(0);
}

const productIds = skincareTeaProducts.map(p => p.id);

// ลบ cart_items ก่อน
const deletedCart = await db.delete(cartItems).where(inArray(cartItems.productId, productIds));
console.log("Deleted cart items:", deletedCart);

// ลบ order_items
const deletedOrders = await db.delete(orderItems).where(inArray(orderItems.productId, productIds));
console.log("Deleted order items:", deletedOrders);

// ลบ products
const deletedProducts = await db.delete(products)
  .where(or(eq(products.categoryId, 30001), eq(products.categoryId, 30002)));
console.log("Deleted products:", deletedProducts);

// ตรวจสอบ
const remaining = await db.select({ id: products.id, name: products.name, categoryId: products.categoryId })
  .from(products);
console.log("Remaining products:", remaining.map(p => `${p.id}: ${p.name} (cat: ${p.categoryId})`));

await connection.end();
console.log("Done!");
