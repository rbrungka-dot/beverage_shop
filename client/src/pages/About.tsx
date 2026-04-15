import { useState } from "react";
import { Link } from "wouter";
import { Leaf, Award, Heart, Users, FlaskConical, Sparkles, Phone, Mail, Globe, MessageCircle, ArrowRight, ChevronLeft, ChevronRight, Factory } from "lucide-react";
import { Button } from "@/components/ui/button";

const CACTUS_FARM_HERO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663084993239/YGoR3BS934bR93H6563cHY/bienvica_cactus_farm_hero-QuXeEiKTEEEXoFzBj3NUUQ.webp";
const CACTUS_FARM_FOUNDER = "https://d2xsxph8kpxj0f.cloudfront.net/310519663084993239/YGoR3BS934bR93H6563cHY/founder-cactus-farm_f30070a5.webp";
const CORE_TECH = [
  {
    id: 1,
    label: "Double Blockade",
    title: "Double Blockade of Glucose Transporters",
    subtitle: "Dermal Longevity · Multi-Target Sugar Management",
    desc: "Cactus p-Coumaric Acid ยับยั้ง SGLT-1 และ ACV Phloretin ยับยั้ง GLUT2 พร้อมกัน ปิดกั้นการดูดซึมน้ำตาลแบบ Dual Pathway",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663084993239/YGoR3BS934bR93H6563cHY/bienvica_tech_double_blockade_f696356e.jpg",
  },
  {
    id: 2,
    label: "10x Efficiency",
    title: "The 10x Efficiency Breakthrough",
    subtitle: "IC50 ต่ำกว่า = ประสิทธิภาพสูงกว่า",
    desc: "งานวิจัยยืนยัน Bienvica มีประสิทธิภาพยับยั้งเอนไซม์ย่อยคาร์โบไฮเดรตสูงกว่า ACV ทั่วไปถึง 10 เท่า (IC50: 0.27% vs 2.89%)",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663084993239/YGoR3BS934bR93H6563cHY/bienvica_tech_10x_efficiency_60560f37.jpg",
  },
  {
    id: 3,
    label: "Steady State",
    title: "The Steady State Secret",
    subtitle: "Proven at Cellular Level",
    desc: "Bienvica ชะลอการขนส่งน้ำตาลเข้าสู่กระแสเลือดอย่างต่อเนื่องและยั่งยืน — กราฟ Glucose Transport แบน Flat Curve ตลอด 100 นาที",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663084993239/YGoR3BS934bR93H6563cHY/bienvica_tech_steady_state_2df1fcd8.jpg",
  },
  {
    id: 4,
    label: "Dual Incretin",
    title: "Dual Incretin Effect: GLP-1 & GIP",
    subtitle: "Beyond Blocking Sugar",
    desc: "Bienvica สื่อสารกับร่างกายผ่านฮอร์โมน Incretin (GLP-1 & GIP) เพื่อจัดการความหิวและน้ำตาลหลังอาหารอย่างเป็นธรรมชาติ",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663084993239/YGoR3BS934bR93H6563cHY/bienvica_tech_dual_incretin_286d3cb1.jpg",
  },
];

const STORY_TIMELINE = [
  {
    year: "18 ปีก่อน",
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
    desc: "ด้วยประสบการณ์กว่า 18 ปีในการปลูกกระบองเพชร ผสานกับความรู้ด้านวิทยาศาสตร์การอาหาร เราได้สร้าง Bienvica Beyond Cider™ — เครื่องดื่มที่นำสารสกัดจากกระบองเพชรมาเป็นหัวใจสำคัญ ร่วมกับกุหลาบมอญและ Apple Cider Vinegar เพื่อดูแลสุขภาพระดับเซลล์",
  },
];

function CoreTechnologySection() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-16 bg-secondary/40">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-medium text-accent uppercase tracking-[0.2em] border border-accent/30 rounded-full px-4 py-1.5 mb-4">
            Evidence-Based Nutrition
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-2">
            เทคโนโลยีที่เป็นหัวใจของเรา
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
            วิจัยและพิสูจน์ผ่านโมเดลเซลล์ลำไส้มนุษย์จำลอง (Caco-2 cell model)
            รองรับโดยโครงการ RAINS for Semi-Industrial Food Valley สวก.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CORE_TECH.map((tech, idx) => (
            <button
              key={tech.id}
              onClick={() => setActive(idx)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                active === idx
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {tech.label}
            </button>
          ))}
        </div>

        {/* Main Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl bg-card">
            <img
              key={active}
              src={CORE_TECH[active].img}
              alt={CORE_TECH[active].title}
              className="w-full aspect-square object-cover"
            />
            {/* Navigation arrows */}
            <button
              onClick={() => setActive((prev) => (prev - 1 + CORE_TECH.length) % CORE_TECH.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-white/60 flex items-center justify-center shadow-md hover:bg-white transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-foreground" />
            </button>
            <button
              onClick={() => setActive((prev) => (prev + 1) % CORE_TECH.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-white/60 flex items-center justify-center shadow-md hover:bg-white transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-foreground" />
            </button>
            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {CORE_TECH.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActive(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    active === idx ? "bg-primary w-5" : "bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-5">
            <div>
              <span className="text-xs font-medium text-accent uppercase tracking-widest mb-2 block">
                {active + 1} / {CORE_TECH.length}
              </span>
              <h3 className="font-serif text-2xl md:text-3xl font-semibold text-foreground leading-tight mb-1">
                {CORE_TECH[active].title}
              </h3>
              <p className="text-sm text-muted-foreground italic">{CORE_TECH[active].subtitle}</p>
            </div>
            <p className="text-muted-foreground leading-relaxed">{CORE_TECH[active].desc}</p>

            {/* Key stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { icon: Leaf, text: "High Antioxidant (เทียบเท่า Quercetin 17-20 mg/ขวด)" },
                { icon: FlaskConical, text: "ยับยั้งเอนไซม์ย่อยคาร์บ (anti alpha-glucosidase) ได้ดีกว่ายา Acarbose" },
                { icon: Sparkles, text: "Dual Incretin: GLP-1 & GIP เทียบเท่ายา Metformin" },
                { icon: Award, text: "Caco-2 Cell Model Validated" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2.5 bg-card rounded-lg px-3 py-2.5 border border-border">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">{item.text}</p>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground/60 leading-relaxed pt-1">
              อ้างอิงงานวิจัยจากโครงการ RAINS for Semi-Industrial Food Valley (Functional food and Personalized food) ประจำปี 2568 สนับสนุนโดย สวก.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

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
            18 ปีแห่งความรัก ความอดทน และความเชื่อว่ากระบองเพชรมีคุณค่ามากกว่าที่ตาเห็น
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
                  className="w-full h-full object-cover object-top"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-card border border-border rounded-xl px-5 py-3 shadow-xl">
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">ประสบการณ์</p>
                <p className="font-serif text-2xl font-bold text-foreground">18 ปี</p>
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
                ก่อนที่จะมี Bienvica มีฟาร์มกระบองเพชรเล็กๆ ในสกลนคร ที่เริ่มต้นจากความหลงใหลในพืชที่แข็งแกร่งและงดงามชนิดนี้ ผู้ก่อตั้งของเราดูแลกระบองเพชรด้วยมือตัวเองมานานกว่า 18 ปี เรียนรู้ทุกรายละเอียดของพืชชนิดนี้อย่างลึกซึ้ง
              </p>

              <p className="text-muted-foreground leading-relaxed text-base">
                จนวันหนึ่ง คำถามง่ายๆ ก็เปลี่ยนทุกอย่าง — <em className="text-foreground font-medium">"ถ้ากระบองเพชรกินได้ และมีสารอาหารที่ดีต่อร่างกาย ทำไมเราถึงไม่ทำให้มันกลายเป็นมากกว่าแค่ไม้ประดับ?"</em>
              </p>

              <p className="text-muted-foreground leading-relaxed text-base">
                นั่นคือจุดเริ่มต้นของการพัฒนาสูตรอย่างจริงจัง ร่วมกับการวิจัยเชิงลึกกับมหาวิทยาลัย และในที่สุด Bienvica Beyond Cider™ ก็ถือกำเนิดขึ้น — เครื่องดื่มที่นำสารสกัดจากกระบองเพชรมาเป็นหัวใจสำคัญ ผสานกับกุหลาบมอญและ Apple Cider Vinegar เพื่อดูแลสุขภาพระดับเซลล์
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <div className="bg-secondary rounded-lg px-4 py-2 text-sm">
                  <span className="font-semibold text-foreground">Scientific Formula</span>
                  <span className="text-muted-foreground ml-1">สูตรที่ผ่านการทดลอง</span>
                </div>
                <div className="bg-secondary rounded-lg px-4 py-2 text-sm">
                  <span className="font-semibold text-foreground">Tops Supermarket</span>
                  <span className="text-muted-foreground ml-1">พาร์ทเนอร์</span>
                </div>
                <div className="bg-secondary rounded-lg px-4 py-2 text-sm">
                  <span className="font-semibold text-foreground">Innovation Award</span>
                  <span className="text-muted-foreground ml-1">รางวัล</span>
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

      {/* Core Technology Section */}
      <CoreTechnologySection />

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

      {/* OEM/Custom Manufacturing */}
      <section className="py-16 bg-[#1a1a1a]">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-[#c8a96e] font-medium mb-5">
                <Factory className="h-3.5 w-3.5" />
                OEM / ODM Manufacturing
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                รับจ้างผลิต<br />
                <span className="text-[#c8a96e]">เครื่องดื่มแบรนด์ของคุณ</span>
              </h2>
              <p className="text-white/60 mb-6 leading-relaxed">
                ต้องการสร้างแบรนด์เครื่องดื่มของตัวเอง? เราพร้อมพัฒนาสูตร ผลิต
                และออกแบบบรรจุภัณฑ์ให้ครบวงจร ด้วยโรงงานมาตรฐาน GMP
                และทีม R&amp;D ที่มีประสบการณ์
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/custom">
                  <Button className="bg-[#c8a96e] hover:bg-[#b8995e] text-white px-6">
                    ขอใบเสนอราคา
                  </Button>
                </Link>
                <Link href="/custom">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent px-6">
                    ดูรายละเอียด
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: "GMP", label: "มาตรฐานโรงงาน" },
                { num: "R&D", label: "ทีมพัฒนาสูตร" },
                { num: "MOQ", label: "ปริมาณขั้นต่ำต่ำ" },
                { num: "360°", label: "บริการครบวงจร" },
              ].map(({ num, label }) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                  <div className="text-2xl font-bold text-[#c8a96e] mb-1">{num}</div>
                  <div className="text-sm text-white/60">{label}</div>
                </div>
              ))}
            </div>
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
