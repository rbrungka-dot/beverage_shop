import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function RefundPolicy() {
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
          <h1 className="text-3xl font-bold text-foreground">นโยบายการคืนสินค้าและคืนเงิน</h1>
          <p className="text-muted-foreground text-sm">มีผลบังคับใช้ตั้งแต่วันที่ 1 มกราคม พ.ศ. 2568 | บริษัท สกลนคร สร้างสุข จำกัด</p>
        </div>

        <hr className="border-border/40" />

        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">1. ภาพรวมนโยบาย</h2>
          <p className="text-muted-foreground leading-relaxed">
            บริษัท สกลนคร สร้างสุข จำกัด ผู้ดำเนินการแบรนด์ Bienvica มุ่งมั่นในการส่งมอบสินค้าคุณภาพสูงให้แก่ลูกค้าทุกท่าน
            หากท่านได้รับสินค้าที่ไม่เป็นไปตามมาตรฐาน เราพร้อมดำเนินการแก้ไขตามเงื่อนไขที่ระบุไว้ในนโยบายนี้
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">2. เงื่อนไขการคืนสินค้า</h2>
          <p className="text-muted-foreground leading-relaxed">ท่านสามารถขอคืนสินค้าได้ภายใน <strong className="text-foreground">7 วันนับจากวันที่ได้รับสินค้า</strong> โดยสินค้าต้องเข้าเงื่อนไขดังต่อไปนี้:</p>
          <div className="space-y-3">
            {[
              { title: "สินค้าชำรุดหรือเสียหายจากการขนส่ง", desc: "บรรจุภัณฑ์แตก รั่ว หรือเสียหายก่อนถึงมือลูกค้า" },
              { title: "สินค้าผิดรายการ", desc: "ได้รับสินค้าไม่ตรงกับที่สั่งซื้อ เช่น รสชาติหรือขนาดผิด" },
              { title: "สินค้าหมดอายุหรือมีตำหนิจากโรงงาน", desc: "สินค้าหมดอายุก่อนวันที่ระบุ หรือมีปัญหาจากกระบวนการผลิต" },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 p-4 rounded-lg bg-secondary/50">
                <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{item.title}</p>
                  <p className="text-muted-foreground text-sm mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">3. กรณีที่ไม่สามารถคืนสินค้าได้</h2>
          <ul className="space-y-2 text-muted-foreground">
            {[
              "สินค้าที่เปิดใช้งานแล้วหรือบรรจุภัณฑ์ถูกแกะออก (ยกเว้นกรณีพบปัญหาจากโรงงาน)",
              "สินค้าที่เปลี่ยนสภาพเนื่องจากการจัดเก็บที่ไม่เหมาะสมของลูกค้า",
              "สินค้าที่เกินระยะเวลา 7 วันนับจากวันรับสินค้า",
              "การเปลี่ยนใจหลังจากสั่งซื้อโดยไม่มีเหตุผลอันสมควร",
              "สินค้าที่ซื้อในราคาโปรโมชั่นพิเศษหรือสินค้าตัวอย่าง",
            ].map((item, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="text-destructive/70 flex-shrink-0 mt-0.5">✕</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">4. ขั้นตอนการขอคืนสินค้า</h2>
          <div className="space-y-3">
            {[
              { step: "01", title: "แจ้งปัญหาภายใน 7 วัน", desc: "ติดต่อเราผ่าน Facebook: Bienvica เบียงวิก้า - Beyond Cider หรืออีเมล thanakrittum@gmail.com พร้อมแนบรูปถ่ายสินค้าที่มีปัญหา" },
              { step: "02", title: "รอการยืนยัน", desc: "ทีมงานจะตรวจสอบและยืนยันคำขอภายใน 1-2 วันทำการ" },
              { step: "03", title: "ส่งสินค้าคืน", desc: "หากได้รับการอนุมัติ ท่านจะได้รับที่อยู่สำหรับส่งคืนสินค้า ค่าจัดส่งในการคืนสินค้าจะได้รับการพิจารณาเป็นรายกรณี" },
              { step: "04", title: "รับเงินคืนหรือสินค้าทดแทน", desc: "เมื่อได้รับสินค้าคืนและตรวจสอบแล้ว จะดำเนินการคืนเงินหรือส่งสินค้าทดแทนภายใน 7 วันทำการ" },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 p-4 rounded-lg border border-border/40">
                <div className="text-2xl font-bold text-accent/30 flex-shrink-0 w-10">{item.step}</div>
                <div>
                  <p className="font-medium text-foreground text-sm">{item.title}</p>
                  <p className="text-muted-foreground text-sm mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">5. วิธีการคืนเงิน</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            การคืนเงินจะดำเนินการผ่านช่องทางเดิมที่ท่านชำระเงิน ได้แก่ บัตรเครดิต/เดบิต หรือ PromptPay
            โดยใช้เวลาประมาณ <strong className="text-foreground">5–10 วันทำการ</strong> ขึ้นอยู่กับธนาคารของท่าน
            ในกรณีที่ไม่สามารถคืนผ่านช่องทางเดิมได้ ทีมงานจะประสานงานกับท่านโดยตรง
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">6. ช่องทางติดต่อ</h2>
          <div className="p-5 rounded-xl bg-secondary/50 space-y-2 text-sm">
            <p className="text-foreground font-medium">บริษัท สกลนคร สร้างสุข จำกัด</p>
            <p className="text-muted-foreground">172 หมู่ที่ 5 ตำบลฮางโฮง อำเภอเมืองสกลนคร จังหวัดสกลนคร 47000</p>
            <p className="text-muted-foreground">Facebook: <a href="https://www.facebook.com/profile.php?id=61578488837019" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Bienvica เบียงวิก้า - Beyond Cider</a></p>
            <p className="text-muted-foreground">อีเมล: thanakrittum@gmail.com</p>
          </div>
        </section>

        <hr className="border-border/40" />

        <p className="text-xs text-muted-foreground text-center">
          นโยบายนี้อาจมีการเปลี่ยนแปลงโดยไม่ต้องแจ้งล่วงหน้า การใช้บริการของท่านถือว่าท่านยอมรับนโยบายฉบับล่าสุด
        </p>
      </div>
    </div>
  );
}
