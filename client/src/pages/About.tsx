import { Leaf, Award, Heart, Users } from "lucide-react";

const COCKTAIL_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663084993239/YGoR3BS934bR93H6563cHY/cocktail-premium_8e7175d2.jpg";

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-secondary via-background to-secondary">
        <div className="container max-w-3xl text-center">
          <span className="inline-block text-xs font-medium text-accent uppercase tracking-[0.2em] border border-accent/30 rounded-full px-4 py-1.5 mb-6">
            Our Story
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-6 leading-tight">
            เกี่ยวกับ{" "}
            <span className="text-primary italic">Bienvica</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            เราเชื่อว่าเครื่องดื่มที่ดีสามารถเปลี่ยนแปลงประสบการณ์ชีวิตประจำวันให้พิเศษขึ้นได้
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-serif text-3xl font-semibold text-foreground">จุดเริ่มต้นของเรา</h2>
              <p className="text-muted-foreground leading-relaxed">
               Bienvica ก่อตั้งขึ้นจากความหลงใหลังในศาสตร์การสร้างสรรค์เครื่องดื่ม                เราเริ่มต้นจากห้องครัวเล็กๆ ด้วยความตั้งใจที่จะนำวัตถุดิบธรรมชาติมาสร้างสรรค์
                เป็นเครื่องดื่มที่มีรสชาติเป็นเอกลักษณ์
              </p>
              <p className="text-muted-foreground leading-relaxed">
                ทุกผลิตภัณฑ์ของเราผ่านการคิดค้นและทดสอบอย่างละเอียด เพื่อให้ได้สูตรที่สมบูรณ์แบบที่สุด
                เราใช้วัตถุดิบคุณภาพสูงจากแหล่งที่เชื่อถือได้ ปราศจากสารเคมีที่ไม่จำเป็น
              </p>
            </div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <img src={COCKTAIL_IMAGE} alt="Premium Cocktails" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-secondary/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">ค่านิยมของเรา</h2>
            <p className="text-muted-foreground">สิ่งที่เราเชื่อและยึดถือในทุกขั้นตอนการผลิต</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Leaf, title: "ธรรมชาติ", desc: "วัตถุดิบจากธรรมชาติ 100% ไม่มีสารเคมีสังเคราะห์" },
              { icon: Award, title: "คุณภาพ", desc: "มาตรฐานการผลิตระดับสูง ผ่านการตรวจสอบทุกขั้นตอน" },
              { icon: Heart, title: "ใส่ใจ", desc: "ทุกผลิตภัณฑ์สร้างสรรค์ด้วยความรักและความใส่ใจ" },
              { icon: Users, title: "ชุมชน", desc: "สนับสนุนเกษตรกรท้องถิ่นและชุมชนในการจัดหาวัตถุดิบ" },
            ].map((v) => (
              <div key={v.title} className="bg-card rounded-xl p-6 border border-border text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-serif font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16">
        <div className="container max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-semibold text-foreground mb-4">ติดต่อเรา</h2>
          <p className="text-muted-foreground mb-8">
            มีคำถามหรือต้องการข้อมูลเพิ่มเติม? เราพร้อมให้บริการ
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            {[
              { label: "อีเมล", value: "hello@modernalchemist.com" },
              { label: "โทรศัพท์", value: "02-xxx-xxxx" },
              { label: "เวลาทำการ", value: "จันทร์–ศุกร์ 9:00–18:00" },
            ].map((c) => (
              <div key={c.label} className="bg-secondary rounded-xl p-4">
                <p className="font-medium text-foreground mb-1">{c.label}</p>
                <p className="text-muted-foreground">{c.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
