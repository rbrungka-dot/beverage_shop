import { Leaf, Award, Heart, Users, FlaskConical, Sparkles, Phone, Mail, Globe, MessageCircle, ArrowRight } from "lucide-react";

const CACTUS_FARM_HERO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663084993239/YGoR3BS934bR93H6563cHY/bienvica_cactus_farm_hero-QuXeEiKTEEEXoFzBj3NUUQ.webp";
const CACTUS_FARM_FOUNDER = "https://d2xsxph8kpxj0f.cloudfront.net/310519663084993239/YGoR3BS934bR93H6563cHY/bienvica_ceo_tum_farm_23f95aab.png";
const INGREDIENTS_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663084993239/YGoR3BS934bR93H6563cHY/bienvica_ingredients_d1905de7.png";

const STORY_TIMELINE = [
  {
    year: "16 ปีก่อน",
    title: "จุดเริ่มต้นจากไม้ประดับ",
    desc: "ทุกอย่างเริ่มต้นจากความหลงใหลในกระบองเพชร — พืชที่แข็งแกร่ง สวยงาม และซ่อนคุณค่าไว้มากกว่าที่ตาเห็น ผู้ก่อตั้งของเราเริ่มปลูกกระบองเพชรเป็นไม้ประดับ ดูแลด้วยมือตัวเอง และค่อยๆ สะสมความรู้เกี่ยวกับพืชชนิดนี้อย่างลึกซึ้ง",
  },
  {
    year: "ต่อมา",
    title: "จากไม้ประดับสู่วัตถุดิบอาหาร",
    desc: "เมื่อฟาร์มกระบองเพชรขยายใหญ่ขึ้น คำถามหนึ่งก็ผุดขึ้นมา — \"ถ้ากระบองเพชรกินได้ และมีสารอาหารที่ดีต่อร่างกาย ทำไมเราถึงไม่ทำให้มันกลายเป็นมากกว่าแค่ไม้ประดับ?\" จากนั้นการศึกษาด้าน Food Science จึงเริ่มต้นขึ้น",
  },
  {
    year: "วันนี้",
    title: "Bienvica — เครื่องดื่มที่กินได้จากฟาร์ม",
    desc: "ด้วยประสบการณ์กว่า 16 ปีในการปลูกกระบองเพชร ผสานกับความรู้ด้านวิทยาศาสตร์การอาหาร เราได้สร้าง Bienvica Beyond Cider™ — เครื่องดื่มที่นำ p-Coumaric acid จากกระบองเพชรมาเป็นหัวใจสำคัญ ร่วมกับ Damask Rose และ Apple Cider Vinegar เพื่อดูแลสุขภาพระดับเซลล์",
  },
];

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero with Farm Image */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <img
          src={CACTUS_FARM_HERO}
          alt="ฟาร์มกระบองเพชร Bienvica"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 text-center px-4">
          <span className="inline-block text-xs font-medium text-accent uppercase tracking-[0.2em] border border-accent/60 rounded-full px-4 py-1.5 mb-4 bg-black/20 backdrop-blur-sm">
            Our Story
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-white mb-3 leading-tight drop-shadow-lg">
            จากฟาร์มกระบองเพชร<br />
            <span className="text-accent italic">สู่เครื่องดื่มดูแลสุขภาพ</span>
          </h1>
          <p className="text-white/80 text-lg max-w-xl drop-shadow">
            16 ปีแห่งความรัก ความอดทน และความเชื่อว่ากระบองเพชรมีคุณค่ามากกว่าที่ตาเห็น
          </p>
        </div>
      </section>

      {/* Origin Story with Founder Photo */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            {/* Founder Photo */}
            <div className="relative">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={CACTUS_FARM_FOUNDER}
                  alt="คุณตั้ม CEO Bienvica ในฟาร์มกระบองเพชร"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-card border border-border rounded-xl px-5 py-3 shadow-xl">
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">ประสบการณ์</p>
                <p className="font-serif text-2xl font-bold text-foreground">16 ปี</p>
                <p className="text-xs text-muted-foreground">การปลูกกระบองเพชร</p>
              </div>
            </div>

            {/* Story Text */}
            <div className="space-y-8">
              <div>
                <span className="inline-block text-xs font-medium text-accent uppercase tracking-[0.2em] border border-accent/30 rounded-full px-4 py-1.5 mb-4">
                  จุดเริ่มต้นของเรา
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground leading-tight mb-4">
                  ทุกอย่างเริ่มจาก<br />
                  <span className="text-primary italic">คนปลูกกระบองเพชร</span>
                </h2>
              </div>

              <p className="text-muted-foreground leading-relaxed text-base">
                ก่อนที่จะมี Bienvica มีฟาร์มกระบองเพชรเล็กๆ ในสกลนคร ที่เริ่มต้นจากความหลงใหลในพืชที่แข็งแกร่งและงดงามชนิดนี้ ผู้ก่อตั้งของเราดูแลกระบองเพชรด้วยมือตัวเองมานานกว่า 16 ปี เรียนรู้ทุกรายละเอียดของพืชชนิดนี้อย่างลึกซึ้ง
              </p>

              <p className="text-muted-foreground leading-relaxed text-base">
                จนวันหนึ่ง คำถามง่ายๆ ก็เปลี่ยนทุกอย่าง — <em className="text-foreground font-medium">"ถ้ากระบองเพชรกินได้ และมีสารอาหารที่ดีต่อร่างกาย ทำไมเราถึงไม่ทำให้มันกลายเป็นมากกว่าแค่ไม้ประดับ?"</em>
              </p>

              <p className="text-muted-foreground leading-relaxed text-base">
                นั่นคือจุดเริ่มต้นของการศึกษาด้าน Food Science อย่างจริงจัง และในที่สุด Bienvica Beyond Cider™ ก็ถือกำเนิดขึ้น — เครื่องดื่มที่นำ p-Coumaric acid จากกระบองเพชรมาเป็นหัวใจสำคัญ ผสานกับ Damask Rose และ Apple Cider Vinegar เพื่อดูแลสุขภาพระดับเซลล์
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
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
          </div>
        </div>
      </section>

      {/* Timeline — The Journey */}
      <section className="py-16 bg-secondary/40">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">เส้นทางของเรา</h2>
            <p className="text-muted-foreground">จากไม้ประดับสู่นวัตกรรมเครื่องดื่มเพื่อสุขภาพ</p>
          </div>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 hidden md:block" />
            <div className="space-y-10">
              {STORY_TIMELINE.map((item, idx) => (
                <div
                  key={idx}
                  className={`relative flex flex-col md:flex-row gap-6 md:gap-10 items-start ${
                    idx % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Content */}
                  <div className="flex-1 bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <span className="text-xs font-medium text-accent uppercase tracking-widest mb-2 block">{item.year}</span>
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </div>
                  {/* Center dot */}
                  <div className="hidden md:flex w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/30 items-center justify-center flex-shrink-0 z-10">
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </div>
                  {/* Spacer for alternating layout */}
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
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
      <section className="py-16 bg-secondary/40">
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
      <section className="py-16">
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
      <section className="py-16 bg-secondary/40">
        <div className="container max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-semibold text-foreground mb-4">ติดต่อเรา</h2>
          <p className="text-muted-foreground mb-8">
            มีคำถามหรือต้องการข้อมูลเพิ่มเติม? เราพร้อมให้บริการ
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {[
              { icon: Phone, label: "โทรศัพท์", value: "+66 64 654 0592" },
              { icon: Mail, label: "อีเมล", value: "thanakrittum@gmail.com" },
              { icon: Globe, label: "เว็บไซต์", value: "www.bienvica.com" },
              { icon: MessageCircle, label: "Line", value: "@bienvica" },
            ].map((c) => (
              <div key={c.label} className="bg-card rounded-xl p-4 flex items-center gap-3 text-left border border-border">
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
