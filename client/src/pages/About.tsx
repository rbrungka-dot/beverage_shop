import { Leaf, Award, Heart, Users, FlaskConical, Sparkles, Phone, Mail, Globe, MessageCircle } from "lucide-react";

const LIFESTYLE_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663084993239/YGoR3BS934bR93H6563cHY/bienvica_hero_lifestyle_3b3efb7e.png";
const INGREDIENTS_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663084993239/YGoR3BS934bR93H6563cHY/bienvica_ingredients_d1905de7.png";

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
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            สตาร์ทอัพด้าน Food &amp; Wellness Technology ที่มุ่งสร้างผลิตภัณฑ์เพื่อสุขภาพที่มีงานวิจัยรองรับ ผสานความงดงามของธรรมชาติกับนวัตกรรมทางวิทยาศาสตร์
          </p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-serif text-3xl font-semibold text-foreground">จุดเริ่มต้นของเรา</h2>
              <p className="text-muted-foreground leading-relaxed">
                Bienvica เกิดจากความเชื่อว่าความสุขที่แท้จริงนั้นแฝงอยู่ในช่วงเวลาเรียบง่ายของชีวิต — ในมื้ออาหารอบอุ่นกับครอบครัว ในรอยยิ้มและน้ำใจที่เพื่อนมอบให้กัน และในการดูแลสุขภาพของตัวเราเองและคนที่เรารัก
              </p>
              <p className="text-muted-foreground leading-relaxed">
                ด้วยความเชื่อนี้ เราจึงสร้างสรรค์เครื่องดื่มที่ไม่เพียงดีต่อสุขภาพ แต่ยังเป็นส่วนหนึ่งของช่วงเวลาแห่งความสุขในชีวิตประจำวัน เพราะเราเข้าใจว่าสุขภาพที่ดีคือรากฐานของชีวิตที่มีความสุข
              </p>
              <p className="text-muted-foreground leading-relaxed">
                ผลิตภัณฑ์ของเราถูกออกแบบขวดสไตล์แชมเปญ เพื่อบอกว่าระหว่างที่เราดูแลคนอื่น เราก็ดูแลตัวเองและมีความสุขเล็กๆ ได้พร้อมกัน
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="bg-secondary rounded-lg px-4 py-2 text-sm">
                  <span className="font-semibold text-foreground">2,000 ขวด/ปี</span>
                  <span className="text-muted-foreground ml-1">ยอดขาย</span>
                </div>
                <div className="bg-secondary rounded-lg px-4 py-2 text-sm">
                  <span className="font-semibold text-foreground">Tops Supermarket</span>
                  <span className="text-muted-foreground ml-1">พาร์ทเนอร์</span>
                </div>
                <div className="bg-secondary rounded-lg px-4 py-2 text-sm">
                  <span className="font-semibold text-foreground">THAIFEX</span>
                  <span className="text-muted-foreground ml-1">ออกบูธ</span>
                </div>
              </div>
            </div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <img src={LIFESTYLE_IMG} alt="Bienvica Lifestyle" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-secondary/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">ค่านิยมหลักของเรา</h2>
            <p className="text-muted-foreground">สิ่งที่เราเชื่อและยึดถือในทุกขั้นตอน</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Award, title: "Quality & Craftsmanship", desc: "มุ่งมั่นส่งมอบสิ่งที่ดีที่สุด สร้างสรรค์ด้วยความพิถีพิถันในทุกขั้นตอนการผลิต" },
              { icon: Heart, title: "Wellness & Care", desc: "ใส่ใจในสุขภาพและความสุขทั้งตนเองและคนที่รัก เพราะสุขภาพที่ดีคือรากฐานของชีวิต" },
              { icon: FlaskConical, title: "Thoughtful Innovation", desc: "คิดค้นอย่างชาญฉลาด มีหลักการและงานวิจัยรองรับ ไม่ใช่แค่กระแส" },
              { icon: Users, title: "Authentic Connection", desc: "สร้างความสัมพันธ์ที่จริงใจ เป็นส่วนหนึ่งของช่วงเวลาดีๆ ในชีวิตของลูกค้า" },
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

      {/* Science Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img src={INGREDIENTS_IMG} alt="Natural Ingredients" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-6">
              <span className="inline-block text-xs font-medium text-accent uppercase tracking-[0.2em] border border-accent/30 rounded-full px-4 py-1.5">
                Evidence-Based Nutrition
              </span>
              <h2 className="font-serif text-3xl font-semibold text-foreground">เทคโนโลยีที่เป็นหัวใจของเรา</h2>
              <p className="text-muted-foreground leading-relaxed">
                Bienvica มุ่งเน้นการสร้างความแตกต่างด้วย Evidence-based Nutrition โดยมีการศึกษาประสิทธิภาพของผลิตภัณฑ์ผ่านโมเดลเซลล์ลำไส้มนุษย์จำลอง (Caco-2 cell model) เพื่อศึกษาการดูดซึมและความสามารถในการนำสารสำคัญไปใช้ประโยชน์ในร่างกาย
              </p>
              <div className="space-y-3">
                {[
                  { icon: Leaf, text: "Quercetin 21.25 mg ต่อขวด ≈ แอปเปิ้ล 2–3 ผล" },
                  { icon: FlaskConical, text: "ยับยั้ง α-glucosidase ได้สูงกว่ายามาตรฐาน Acarbose" },
                  { icon: Sparkles, text: "กระตุ้น GLP-1 ใกล้เคียงยามาตรฐาน Metformin" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 bg-secondary/50">
        <div className="container max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-semibold text-foreground mb-4">พันธมิตรของเรา</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            เพื่อกระจายรายได้สู่ชุมชนและสร้างผลกระทบเชิงบวกต่อสังคม เราทำงานร่วมกับพันธมิตรท้องถิ่นเพื่อจัดหาวัตถุดิบจากผู้ผลิตในชุมชน
          </p>
          <div className="bg-card rounded-xl p-8 border border-border inline-block">
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">สวนกระเลิงผักเทิงภู</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              พันธมิตรสำคัญในการรับซื้อกุหลาบมอญคุณภาพสูง ทำให้เรามั่นใจว่าวัตถุดิบในผลิตภัณฑ์ของเราไม่เพียงแต่สดใหม่และเป็นธรรมชาติ แต่ยังช่วยส่งเสริมรายได้ที่ยั่งยืนให้กับเกษตรกรท้องถิ่นอีกด้วย
            </p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {[
              { icon: Phone, label: "โทรศัพท์", value: "+666-4654-0592" },
              { icon: Mail, label: "อีเมล", value: "thanakrittum@gmail.com" },
              { icon: Globe, label: "เว็บไซต์", value: "www.bienvica.com" },
              { icon: MessageCircle, label: "Line", value: "@bienvica" },
            ].map((c) => (
              <div key={c.label} className="bg-secondary rounded-xl p-4 flex items-center gap-3 text-left">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <c.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-xs uppercase tracking-wide mb-0.5">{c.label}</p>
                  <p className="text-muted-foreground">{c.value}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-6">บริษัท สกลนคร สร้างสุข จำกัด</p>
        </div>
      </section>
    </div>
  );
}
