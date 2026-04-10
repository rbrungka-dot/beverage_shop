# Beverage Shop - Project TODO

## Database & Backend
- [x] Products table (id, name, description, price, category, imageUrl, stock, isActive)
- [x] Categories table (id, name, slug, description)
- [x] Cart items table (id, userId, productId, quantity)
- [x] Orders table (id, userId, status, totalAmount, stripePaymentIntentId, shippingAddress)
- [x] Order items table (id, orderId, productId, quantity, priceAtTime)
- [x] tRPC router: products (list, getById, create, update, delete - admin)
- [x] tRPC router: categories (list, create, update, delete - admin)
- [x] tRPC router: cart (get, addItem, updateItem, removeItem, clear)
- [x] tRPC router: orders (create, list, getById, updateStatus - admin)
- [x] tRPC router: stripe (createCheckoutSession, webhook)
- [x] Seed initial product data (8 products, 4 categories)

## Frontend - Global
- [x] Global CSS theme (rose-pink/copper/cream color palette, Playfair Display + Inter fonts)
- [x] App.tsx routes setup
- [x] Navbar component (logo, nav links, cart icon, auth button)
- [x] Footer component

## Frontend - Pages
- [x] Home page (hero, featured products, categories, about snippet)
- [x] Products listing page (grid, search, category filter)
- [x] Product detail page (image, description, add to cart)
- [x] Cart page (item list, quantity controls, subtotal, checkout button)
- [x] Checkout (Stripe Checkout Session via cart page)
- [x] My Orders page (order history, status)
- [x] Order detail page (with success confirmation)
- [x] About page (company info, values, contact)
- [x] Admin Panel - Products management (list, add, edit, delete)
- [x] Admin Panel - Categories management
- [x] Admin Panel - Orders management (list, update status)

## Integrations
- [x] Stripe payment integration (Stripe Checkout Session)
- [x] Stripe webhook handler (payment success → update order status)
- [x] Owner notification on new order (via notifyOwner)

## Testing
- [x] Vitest: categories router tests
- [x] Vitest: products router tests
- [x] Vitest: cart router tests (auth guard, get, add)
- [x] Vitest: orders router tests (auth guard, myOrders, getById, adminList)
- [x] Vitest: auth logout test
- [x] All 13 tests passing

## Brand Update
- [x] เปลี่ยนชื่อแบรนด์จาก "The Modern Alchemist" เป็น "Bienvica" ในทุกไฟล์

## Lifestyle Image Update
- [x] สร้างภาพบรรยากาศ "คุณแพร" กับ Bienvica สไตล์ Sophisticated Elegance และอัปเดต Lifestyle Section

## About Page Story Update
- [x] เรียบเรียงสตอรี่ใหม่ "จากคนปลูกกระบองเพชร → ไม้ประดับ → เครื่องดื่มกินได้"
- [x] สร้างภาพฟาร์มกระบองเพชร (wide farm shot + founder portrait) ด้วย AI
- [x] อัปเดต About page ด้วย Hero ภาพฟาร์ม, Timeline section, สตอรี่ใหม่

## Stripe Payment Test Page
- [x] สร้างหน้า /test-payment สำหรับทดสอบการชำระเงิน Stripe
- [x] สร้างหน้า /payment/success และ /payment/cancel (redirect ไปที่ /orders)
- [x] ลงทะเบียน routes ใน App.tsx

## Bug Fixes
- [x] แก้ไขปุ่ม "เข้าสู่ระบบ" ในหน้า /test-payment: เพิ่ม returnPath ใน getLoginUrl และ OAuth callback redirect กลับหน้าเดิม
- [ ] แก้ไข OAuth returnPath ด้วย state parameter encoding แทน localStorage/cookie
- [ ] แก้ไข Stripe Checkout Session ไม่เปิดหลัง login สำเร็จในหน้า /test-payment
- [x] แก้ไขให้ Order status อัปเดตเป็น "paid" ทันทีเมื่อ user กลับมาที่ success URL (verify session จาก Stripe API)

## New Features (Round 2)
- [x] Admin Dashboard: หน้า /admin/orders แสดงรายการคำสั่งซื้อทั้งหมด
- [x] Admin Dashboard: เปลี่ยนสถานะ Order (processing → shipped → delivered)
- [x] Admin Dashboard: ป้องกันด้วย adminProcedure (role = admin เท่านั้น)
- [x] Email ยืนยันคำสั่งซื้อ: ส่งอัตโนมัติหลัง verifyPayment สำเร็จ
- [x] Email ยืนยันคำสั่งซื้อ: แสดงรายการสินค้า ราคา และที่อยู่จัดส่ง

## New Features (Round 3)
- [x] สร้างหน้า /custom สำหรับบริการรับจ้างผลิต (OEM/ODM)
- [x] เพิ่ม tRPC procedure สำหรับรับ inquiry form (ชื่อ, บริษัท, อีเมล, เบอร์, รายละเอียด)
- [x] เพิ่ม link "รับจ้างผลิต" ใน Navbar
- [x] เพิ่ม section รับจ้างผลิตใน Landing page (Home.tsx)
- [x] แจ้ง owner เมื่อมี inquiry ใหม่ผ่าน notifyOwner

## Bug Fixes (Round 3)
- [x] ลบ OEM/รับจ้างผลิต section ออกจากหน้าแรก (Home.tsx)
- [x] เพิ่ม OEM section ในหน้า About.tsx ก่อน section ติดต่อเรา

## New Features (Round 4)
- [ ] เปลี่ยนหัวข้อ "แพ็คเกจพิเศษ" เป็น "บทความ" ในหน้าสินค้า
- [ ] สร้าง articles table ใน schema.ts
- [ ] เพิ่ม tRPC procedures สำหรับ articles (list, getById)
- [ ] เพิ่ม admin procedure สำหรับสร้าง/แก้ไข/ลบบทความ
- [ ] สร้าง Articles section ในหน้าสินค้า แสดง card บทความ
- [ ] สร้างหน้า /articles/:id สำหรับอ่านบทความเต็ม

## New Features (Round 5 - Articles)
- [ ] ลบหมวดหมู่ "แพ็คเกจพิเศษ" ออกจากฐานข้อมูล
- [x] สร้าง articles table ใน schema.ts (title, content, coverImage, excerpt, publishedAt, authorName)
- [x] Apply migration SQL สำหรับ articles table
- [x] เพิ่ม tRPC procedures: articles.list, articles.getBySlug, articles.create (admin), articles.update (admin), articles.delete (admin)
- [x] สร้างหน้า /articles แสดง card บทความทั้งหมด
- [x] สร้างหน้า /articles/:slug สำหรับอ่านบทความเต็ม
- [x] เพิ่ม link "บทความ" ใน Navbar
- [x] เพิ่ม Articles tab ใน Admin Dashboard สำหรับสร้าง/แก้ไข/ลบบทความ
- [x] เขียน Vitest tests สำหรับ articles DB helpers (22 tests ผ่านทั้งหมด)

## Wall of Stories (Round 6)
- [x] สร้าง stories table ใน schema.ts (id, authorName, authorTitle, content, imageUrl, isApproved, isFeatured, createdAt)
- [x] Apply migration SQL สำหรับ stories table
- [x] เพิ่ม DB helpers: getApprovedStories, getAllStories, createStory, approveStory, featureStory, deleteStory
- [x] เพิ่ม tRPC procedures: stories.list, stories.submit, stories.adminList, stories.approve, stories.feature, stories.delete
- [x] สร้างหน้า /stories แสดง Wall of Stories แบบ card grid พร้อม featured section
- [x] เพิ่ม submission form ในหน้า /stories พร้อม success state
- [x] เพิ่ม Stories tab ใน Admin Dashboard (อนุมัติ/ปฏิเสธ/แนะนำ/ลบ)
- [x] เพิ่ม link "เรื่องเล่า" ใน Navbar
- [ ] เพิ่ม Stories section preview ในหน้าแรก (Home.tsx)
- [x] เขียน Vitest tests สำหรับ stories procedures (32 tests ผ่านทั้งหมด)

## Visual Theme Update — Quiet Ritual Moodboard (Round 7)
- [x] ปรับ background เป็น warm cream (oklch(0.975 0.008 75)) แทนขาวสะอาด
- [x] เพิ่ม sage green (oklch(0.70 0.055 165)) เป็น secondary color
- [x] Playfair Display serif font สำหรับ h1-h6 ทั้งหมด
- [x] เพิ่ม gold divider, badge-gold, badge-sage utility classes
- [x] เพิ่ม whitespace (py-20) ระหว่าง section และ gold divider คั่นระหว่าง section

## Bug Fix — Footer Color (Round 7b)
- [x] แก้ Footer สีเขียว sage green ให้กลับเป็น dusty rose (bg-primary/10) เหมือนเดิม
- [x] ปรับ secondary เป็น warm blush rose, sage green เป็น --sage custom property แทน

## PromptPay Integration (Round 8)
- [x] เพิ่ม promptpay ใน payment_method_types ของ Stripe Checkout session
- [x] ตรวจสอบว่า currency เป็น thb เรียบร้อยแล้ว

## Curated Collection (Round 9)
- [x] Generate placeholder images สำหรับ Skincare (3 ชิ้น) และ Tea (3 ชิ้น) โทน Quiet Ritual
- [x] เพิ่มสินค้า placeholder Skincare + Tea ในฐานข้อมูล (6 SKU)
- [x] สร้าง Curated Collection section ในหน้าแรก (Home.tsx) พร้อม Skincare + Tea grid
- [ ] เพิ่ม filter category Skincare/Tea ในหน้า /products
