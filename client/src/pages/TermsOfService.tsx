import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 text-sm">
            <ArrowLeft className="w-4 h-4" />
            กลับหน้าแรก
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-10">
        {/* Title */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-accent uppercase tracking-[0.2em]">Legal</p>
          <h1 className="text-3xl font-bold text-foreground">ข้อตกลงการใช้บริการ</h1>
          <p className="text-muted-foreground text-sm">มีผลบังคับใช้ตั้งแต่วันที่ 1 มกราคม พ.ศ. 2568 | บริษัท สกลนคร สร้างสุข จำกัด</p>
        </div>

        <hr className="border-border/40" />

        {/* Intro */}
        <p className="text-muted-foreground leading-relaxed text-sm">
          โปรดอ่านข้อตกลงการใช้บริการนี้อย่างละเอียดก่อนใช้งานเว็บไซต์ bienvica.com และบริการที่เกี่ยวข้อง
          การเข้าถึงหรือใช้งานเว็บไซต์ถือว่าท่านยอมรับข้อตกลงทั้งหมดที่ระบุไว้ในเอกสารนี้
        </p>

        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">1. ข้อมูลบริษัท</h2>
          <div className="p-5 rounded-xl bg-secondary/50 space-y-1 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">บริษัท สกลนคร สร้างสุข จำกัด</p>
            <p>ดำเนินธุรกิจภายใต้แบรนด์ <strong className="text-foreground">Bienvica เบียงวิก้า</strong></p>
            <p>172 หมู่ที่ 5 ตำบลฮางโฮง อำเภอเมืองสกลนคร จังหวัดสกลนคร 47000</p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">2. การยอมรับข้อตกลง</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            การใช้งานเว็บไซต์นี้ถือว่าท่านมีอายุครบ 18 ปีบริบูรณ์หรือได้รับความยินยอมจากผู้ปกครอง
            และยอมรับข้อตกลงฉบับนี้ทุกประการ หากท่านไม่ยอมรับข้อตกลงใดๆ กรุณาหยุดใช้งานเว็บไซต์
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">3. การสั่งซื้อสินค้า</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="leading-relaxed">การสั่งซื้อสินค้าผ่านเว็บไซต์นี้ถือเป็นข้อเสนอในการซื้อสินค้า ซึ่งจะสมบูรณ์เมื่อบริษัทยืนยันคำสั่งซื้อและได้รับชำระเงินแล้ว</p>
            <ul className="space-y-2">
              {[
                "บริษัทขอสงวนสิทธิ์ในการปฏิเสธหรือยกเลิกคำสั่งซื้อในกรณีที่สินค้าหมดสต็อก ราคาผิดพลาด หรือพบพฤติกรรมที่ผิดปกติ",
                "ราคาสินค้าที่แสดงบนเว็บไซต์เป็นราคารวมภาษีมูลค่าเพิ่ม (VAT) แล้ว",
                "บริษัทขอสงวนสิทธิ์ในการเปลี่ยนแปลงราคาสินค้าโดยไม่ต้องแจ้งล่วงหน้า",
                "การยืนยันคำสั่งซื้อจะส่งผ่านอีเมลที่ท่านลงทะเบียนไว้",
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-accent flex-shrink-0 mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">4. การชำระเงิน</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            เว็บไซต์รองรับการชำระเงินผ่านบัตรเครดิต/เดบิต และ PromptPay ผ่านระบบ Stripe
            ซึ่งเป็นระบบชำระเงินที่ได้มาตรฐาน PCI DSS ข้อมูลบัตรของท่านจะไม่ถูกจัดเก็บบนเซิร์ฟเวอร์ของบริษัท
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">5. การจัดส่งสินค้า</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            {[
              { label: "ระยะเวลาจัดส่ง", value: "3–7 วันทำการนับจากวันยืนยันคำสั่งซื้อ" },
              { label: "พื้นที่จัดส่ง", value: "ทั่วประเทศไทย" },
              { label: "ค่าจัดส่ง", value: "คำนวณตามน้ำหนักและพื้นที่ปลายทาง แสดงในขั้นตอนชำระเงิน" },
              { label: "การติดตามพัสดุ", value: "ท่านจะได้รับหมายเลขติดตามพัสดุทางอีเมลเมื่อสินค้าถูกจัดส่ง" },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 py-2 border-b border-border/30 last:border-0">
                <span className="font-medium text-foreground w-36 flex-shrink-0">{item.label}</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6 */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">6. ทรัพย์สินทางปัญญา</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            เนื้อหา รูปภาพ โลโก้ ชื่อแบรนด์ Bienvica และสื่อทั้งหมดบนเว็บไซต์นี้เป็นทรัพย์สินของบริษัท สกลนคร สร้างสุข จำกัด
            ห้ามนำไปใช้ คัดลอก ดัดแปลง หรือเผยแพร่โดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษร
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">7. นโยบายความเป็นส่วนตัว</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            บริษัทเก็บรวบรวมข้อมูลส่วนบุคคลเพื่อวัตถุประสงค์ในการประมวลผลคำสั่งซื้อ การจัดส่ง และการปรับปรุงบริการเท่านั้น
            บริษัทจะไม่เปิดเผยข้อมูลส่วนบุคคลของท่านแก่บุคคลที่สามโดยไม่ได้รับความยินยอม
            ยกเว้นกรณีที่กฎหมายกำหนด ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
          </p>
        </section>

        {/* Section 8 */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">8. ข้อจำกัดความรับผิด</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            บริษัทจะไม่รับผิดชอบต่อความเสียหายทางอ้อม ความเสียหายพิเศษ หรือความเสียหายที่เกิดจากการใช้งานผิดวัตถุประสงค์
            ผลิตภัณฑ์ Bienvica เป็นผลิตภัณฑ์เสริมสุขภาพ ไม่ใช่ยาและไม่สามารถใช้แทนการรักษาโรคได้
            กรุณาปรึกษาแพทย์หากมีโรคประจำตัวหรืออยู่ระหว่างการรักษา
          </p>
        </section>

        {/* Section 9 */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">9. กฎหมายที่ใช้บังคับ</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            ข้อตกลงนี้อยู่ภายใต้กฎหมายไทย ข้อพิพาทใดๆ ที่เกิดขึ้นจากการใช้บริการนี้จะอยู่ภายใต้เขตอำนาจศาลไทย
          </p>
        </section>

        {/* Section 10 */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">10. การเปลี่ยนแปลงข้อตกลง</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            บริษัทขอสงวนสิทธิ์ในการแก้ไขข้อตกลงนี้ได้ตลอดเวลา การเปลี่ยนแปลงจะมีผลทันทีเมื่อเผยแพร่บนเว็บไซต์
            การใช้งานเว็บไซต์ต่อเนื่องหลังจากการเปลี่ยนแปลงถือว่าท่านยอมรับข้อตกลงฉบับใหม่
          </p>
        </section>

        {/* Section 11 */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">11. ช่องทางติดต่อ</h2>
          <div className="p-5 rounded-xl bg-secondary/50 space-y-2 text-sm">
            <p className="text-foreground font-medium">บริษัท สกลนคร สร้างสุข จำกัด</p>
            <p className="text-muted-foreground">172 หมู่ที่ 5 ตำบลฮางโฮง อำเภอเมืองสกลนคร จังหวัดสกลนคร 47000</p>
            <p className="text-muted-foreground">Facebook: <a href="https://www.facebook.com/profile.php?id=61578488837019" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Bienvica เบียงวิก้า - Beyond Cider</a></p>
            <p className="text-muted-foreground">อีเมล: thanakrittum@gmail.com</p>
          </div>
        </section>

        <hr className="border-border/40" />

        <p className="text-xs text-muted-foreground text-center">
          ข้อตกลงนี้อาจมีการเปลี่ยนแปลงโดยไม่ต้องแจ้งล่วงหน้า การใช้บริการของท่านถือว่าท่านยอมรับข้อตกลงฉบับล่าสุด
        </p>
      </div>
    </div>
  );
}
