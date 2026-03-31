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
