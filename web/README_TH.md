# Bienvica — เว็บไซต์บริษัท ร้านค้า และวงสนทนา

โปรเจกต์ใหม่สำหรับ **Netlify + Firebase + Stripe** แยกจากโค้ด Manus เดิมในโฟลเดอร์ `web/` โค้ดเดิมและโดเมนเดิมยังไม่ถูกเปลี่ยน

## ทำแล้วในรุ่นนี้

- หน้าแรกใช้โลโก้จริงทั้งสามแบรนด์ ภาพสวนที่ผู้ใช้อนุมัติ (ภาพมีการแต่งดวงตาด้วย AI) และลายเส้นโนปาล
- หน้าเรื่องของเรา วิจัย ติดต่อ ร้านค้า รายละเอียดสินค้า ตะกร้า และซื้อโดยไม่สมัครสมาชิก
- สมาชิกแบบอีเมล/รหัสผ่านและ Google ผ่าน Firebase Authentication
- วงสนทนา: โพสต์ตามแบรนด์/หมวด แนบภาพ ส่งรีวิว ความคิดเห็นและคำตอบจากทีม ตรวจสอบก่อนเผยแพร่ โหวตหนึ่งคำตอบต่อบัญชี
- หลังบ้าน: แก้ข้อความ/รูปพร้อมตัวอย่าง บันทึกร่างแยกจากเผยแพร่ เพิ่ม/แก้สินค้า ราคา สต็อก ค่าจัดส่ง ดูคำสั่งซื้อ ใส่เลขพัสดุ อนุมัติโพสต์ ลงบทความ และดูสมาชิก
- Stripe Checkout สำหรับบัตรและ PromptPay โดยต้องเปิดวิธีรับเงินในบัญชี Stripe ของเจ้าของ
- ตรวจราคาจาก Firestore ฝั่งเซิร์ฟเวอร์ สำรองสต็อกด้วย transaction ยืนยันเงินผ่าน webhook และตรวจซ้ำด้วย scheduled function ทุก 15 นาที
- คำสั่งซื้อแขกเข้าถึงด้วยลิงก์ HMAC ส่วนตัว สมาชิกเห็นเฉพาะคำสั่งซื้อของตัวเอง ผู้ดูแลต้องมี custom claim

**ยังไม่ได้เชื่อมบริการจริง:** เจ้าของยังไม่ได้สร้าง Firebase project หรือ Netlify site และยังไม่ได้ใส่คีย์ Stripe ไม่ได้ย้ายฐานข้อมูล Manus ไม่ได้ทดสอบรับเงินจริง โหมด `demo` ไม่สมัครบัญชีจริงและไม่รับเงิน

## 1. ทดลองในเครื่อง

ใช้ Node.js 22 ขึ้นไป เปิด terminal ในโฟลเดอร์ `web`:

```sh
npm ci
npm test
npm run dev
```

เปิด `http://127.0.0.1:5173` โหมดทดลองเก็บข้อมูลใน localStorage ของเบราว์เซอร์นั้น ให้เข้าเมนูเข้าสู่ระบบแล้วเลือก “ทดลองหลังบ้าน”

การแก้ไขในโหมดทดลอง **ไม่ใช่ข้อมูลจริงและไม่ซิงก์ระหว่างเครื่อง** อย่าใช้เก็บข้อมูลลูกค้า หากล้างข้อมูลเบราว์เซอร์จะหาย

## 2. สร้าง Firebase project ของบริษัท

1. ที่ https://console.firebase.google.com สร้าง project ใหม่ ไม่ใช้ร่วมกับงานอื่น
2. เพิ่ม Web app และจด public web config ไว้ตั้งใน Netlify
3. เปิด Authentication → Email/Password และ Google ใส่ support email และ authorized domains ของ Netlify/โดเมนจริง
4. สร้าง Cloud Firestore ในโหมด Production เลือก region ที่เหมาะกับลูกค้าไทยก่อนสร้าง (ย้ายภายหลังไม่ใช่งานเล็ก)
5. หากต้องอัปโหลดรูป เปิด Cloud Storage ด้วย **Blaze billing** ตามข้อกำหนดปัจจุบัน ตั้งงบแจ้งเตือน Google Cloud; งบแจ้งเตือนไม่ใช่เพดานตัดค่าใช้จ่าย
6. ใช้ Firebase CLI ที่ล็อกอินด้วยเจ้าของ deploy rules:

```sh
firebase deploy --only firestore:rules,firestore:indexes,storage --project YOUR_PROJECT_ID
```

ให้ deploy rules ก่อนใช้งานจริง กฎในชุดนี้ไม่อนุญาต client เขียนราคา สต็อก คำสั่งซื้อ สิทธิ์สมาชิก หรือสถานะการอนุมัติโดยตรง การเขียนข้อมูลผ่าน server API ที่ตรวจ Firebase ID token

## 3. เตรียมข้อมูลเริ่มต้นและผู้ดูแล

สร้าง Firebase service account สำหรับฝั่ง server ในบัญชีบริษัท เก็บ JSON ใน secret ของเครื่องหรือ Netlify ห้ามวางใน `public/`, `dist/`, GitHub หรือแชต

เมื่อมี `FIREBASE_SERVICE_ACCOUNT_JSON` ใน environment ของ terminal หรือใช้ Application Default Credentials:

```sh
npm run admin -- seed
```

คำสั่ง seed สร้างเฉพาะเอกสารที่ยังไม่มี ไม่ทับข้อมูลเดิม ราคาสินค้า สต็อก และค่าจัดส่งยังว่าง ไม่มีการสร้างโหวตจำลองในระบบจริง

ให้เจ้าของสมัครสมาชิกผ่านเว็บจริงก่อน จากนั้นให้ operator ที่มีสิทธิ์รัน:

```sh
npm run admin -- grant-admin owner@example.com
```

ออกจากระบบและเข้าสู่ระบบใหม่เพื่อรับสิทธิ์ admin ใหม่ หน้าเว็บไม่มีปุ่มยกระดับสิทธิ์สมาชิกตัวเอง

## 4. ตั้ง Netlify

Import repository `rbrungka-dot/beverage_shop` เลือก branch ที่มีโค้ดใหม่

| ค่า | ตั้งเป็น |
| --- | --- |
| Base directory | `web` |
| Build command | `npm run build` |
| Publish directory | `dist` (สัมพันธ์กับ base directory) |
| Functions directory | อ่านจาก `web/netlify.toml` |

เริ่ม deployment ทดลองด้วย `APP_MODE=demo` ก่อน ห้ามเชื่อมโดเมนขายจริงทันที

เมื่อต่อ Firebase พร้อมแล้วตั้ง Environment variables ตาม `.env.example`:

| ตัวแปร | ประเภท |
| --- | --- |
| FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_APP_ID | public web config จาก Firebase |
| FIREBASE_SERVICE_ACCOUNT_JSON | secret ฝั่ง Netlify Functions เท่านั้น |
| STRIPE_SECRET_KEY | secret เริ่มจาก test mode |
| STRIPE_WEBHOOK_SECRET | secret ของ endpoint นี้โดยเฉพาะ |
| ORDER_TOKEN_SECRET | secret สุ่มอย่างน้อย 32 ตัวอักษร ต้องเก็บสำรอง ไม่เปลี่ยนโดยไม่วางแผนเพราะลิงก์ติดตามเดิมจะใช้ไม่ได้ |
| SITE_URL | `https://ชื่อเว็บ.netlify.app` ไม่มี slash ท้าย |
| APP_MODE | `live` หลังตั้ง Firebase และ deploy rules |
| CHECKOUT_ENABLED | `false` จนกว่าจะผ่านการตรวจ ก่อนเปิดขายจึงเป็น `true` |

`live` หมายถึงเชื่อม Firebase จริง ไม่ได้แปลว่า Stripe ต้องรับเงินจริง ใช้ `sk_test_...` ทดสอบได้ build script ส่งออกเฉพาะ public config 5 รายการ ไม่ส่ง secrets ไปเบราว์เซอร์

กำหนด secret ให้ใช้ได้ทั้ง Functions และ scheduled reconciliation ตั้ง public config ใน build environment แล้ว redeploy

## 5. ต่อ Stripe และทดสอบ

1. ใช้บัญชี Stripe เดิม ตั้ง test secret ใน Netlify
2. สร้าง webhook ปลายทาง `https://ชื่อเว็บ.netlify.app/api/stripe-webhook`
3. รับ events `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`
4. ใส่ `STRIPE_WEBHOOK_SECRET` จาก endpoint ใหม่นี้ ไม่ใช้ secret ของ Manus endpoint เดิม
5. หลังบ้านกำหนดราคา สต็อก และค่าจัดส่งเป็นเงินบาท เปิดแสดงเฉพาะสินค้าที่พร้อมขาย
6. ตั้ง `CHECKOUT_ENABLED=true` เฉพาะ deployment ทดสอบที่ต่อ Stripe test mode แล้ว
7. ทดสอบซื้อแบบแขกและสมาชิก ชำระสำเร็จ ไม่สำเร็จ หมดเวลา webhook ซ้ำ และจำนวนสต็อก รวมถึงการเข้าถึงคำสั่งซื้อของผู้อื่น
8. ตรวจ Netlify scheduled function `reconcile` และ log: ช่วยกู้สถานะเมื่อ webhook ตกหล่น และคืนสต็อกคำสั่งซื้อที่ไม่จ่ายหลัง session หมดเวลา

ราคาจากเบราว์เซอร์ถูกละทิ้ง เซิร์ฟเวอร์อ่านราคาจริงและรวมเงินหน่วยสตางค์ ตะกร้าที่ checkout ซ้ำใช้ idempotency key เดิมและสำรองสต็อกครั้งเดียว รองรับการรอผล PromptPay โดยไม่ถือว่าแค่กลับมาหน้าเว็บคือชำระแล้ว

ลิงก์ติดตามคำสั่งซื้อแขกปรากฏในหน้าที่กลับจาก Stripe และเก็บใน sessionStorage ของเครื่อง ไม่แสดงที่อยู่และอีเมลในหน้าติดตาม **รุ่นนี้ยังไม่มีอีเมลยืนยัน/แจ้งเลขพัสดุอัตโนมัติ** ต้องเลือกบริการอีเมลและตั้งผู้ส่งก่อนเปิดขายจริง หากแขกปิด Stripe ก่อนกลับเว็บ อาจต้องติดต่อทีมเพื่อรับลิงก์ใหม่

## ก่อนย้าย Bienvica.com

- ยืนยันข้อความสินค้า ราคา สต็อก วิธีใช้ โภชนาการ รูปสินค้า ข้อมูลติดต่อ และการสะกดชื่อแบรนด์ (ไฟล์โลโก้ใช้ Kaktu-X แต่ชื่อที่ตกลงในเว็บยังเป็น Xactu-X)
- จัดทำนโยบายจัดส่ง คืนสินค้า และความเป็นส่วนตัวฉบับสมบูรณ์ หน้าในรุ่นนี้ยังเป็นข้อความรอยืนยัน
- ตัดสินใจเรื่องอีเมลยืนยันและการกู้ลิงก์คำสั่งซื้อแขกก่อนรับเงินจริง
- กู้ข้อมูลสินค้า บทความ ลูกค้า และคำสั่งซื้อเก่าจาก Manus หากต้องการย้าย GitHub มี schema/code แต่ไม่ใช่ฐานข้อมูลทั้งหมด
- ตรวจ Security Rules ด้วย Firebase Emulator และทดสอบ Firebase/Stripe/Netlify แบบ end-to-end จริง ชุด tests ที่รันในโค้ดนี้ไม่ได้แทนการทดสอบบริการภายนอก
- กำหนด Firebase billing alerts/quotas, backup และการเก็บข้อมูล; โค้ด reconciliation ตรวจคำสั่งซื้อ pending สูงสุด 100 รายการต่อรอบ ให้ติดตาม backlog เมื่อยอดขายเพิ่ม
- เปลี่ยน `SITE_URL` เป็นโดเมนจริง เพิ่ม Firebase authorized domain และตั้ง Stripe webhook ของ production ให้ถูกต้อง
- เริ่ม Stripe live keys เมื่อ test mode ผ่านแล้วเท่านั้น จากนั้นจึงชี้ DNS ใน Canva ไป Netlify โดยรักษา records ของอีเมลเดิม

## สิ่งที่ทดสอบอัตโนมัติ

`npm test` รวม 12 รายการ ตรวจการปิด API เมื่อยังไม่ตั้งค่า และตรวจราคาฝั่ง server จำนวนสินค้า token คำสั่งซื้อ การจ่ายแบบ asynchronous เหตุการณ์ซ้ำ การคืนสต็อก รวมถึงเดินหน้าร้าน/ตะกร้าและบันทึกร่าง/เผยแพร่หลังบ้านใน DOM จำลอง

ยังไม่ได้ใช้ Firebase project หรือ Stripe ของเจ้าของ ไม่มีการทดสอบรับเงินจริง และยังไม่ได้ตรวจภาพด้วย browser จริง

## แหล่งอ้างอิงเทคนิค

- https://firebase.google.com/docs/web/setup
- https://firebase.google.com/docs/auth/admin/custom-claims
- https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024
- https://docs.netlify.com/build/functions/api/
- https://docs.stripe.com/payments/checkout/fulfill-orders

## โครงสร้าง

`src/` หน้าเว็บและ adapter, `shared/` ข้อมูลเริ่มต้นและกฎเงิน, `netlify/functions/` API และ reconciliation, `public/assets/` โลโก้และรูป, `scripts/` build/seed/admin, `tests/` automated tests

## Shipping rate approved 18 October 2026

Current shipping is 50 THB per order, regardless of quantity or sellable unit. The shared shipping policy supplies the same rate to the public bootstrap, cart/checkout display and server-side quote. Unconfirmed legacy settings use the newly approved 50 THB rate. Later authenticated admin changes save the current policy version and take effect on new orders. Existing orders retain their recorded amounts. Only public fee information is exposed, never Stripe keys. Payment remains disabled until Stripe is connected and verified.

Validation: 18 tests pass, including legacy-rate migration and one shipping fee across mixed products/quantities. Browser verified three single bottles: 720 THB subtotal + 50 THB shipping = 770 THB in cart and checkout. No checkout order or payment was submitted.
