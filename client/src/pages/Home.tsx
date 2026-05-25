import React from "react";
import { Link } from "wouter";
import { ArrowRight, Leaf, Award, FlaskConical, Sparkles, Droplets, Flower2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

function CuratedCollectionSection() {
  const { data: skincareProducts, isLoading: loadingSkincare } = trpc.products.list.useQuery({ categoryId: 30001 });
  const { data: teaProducts, isLoading: loadingTea } = trpc.products.list.useQuery({ categoryId: 30002 });

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-medium text-accent uppercase tracking-[0.2em] border border-accent/30 rounded-full px-4 py-1.5 mb-4">
            Curated Collection
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-3">
            คัดสรรพิเศษ เพื่อคุณ
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Bienvica คัดสรรสินค้าที่เราเชื่อว่าดีจริง สำหรับผู้หญิงที่ดูแลตัวเองอย่างมีสไตล์ — ทั้งจากข้างในและข้างนอก
          </p>
        </div>

        {/* Skincare */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10">
              <Flower2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-foreground">Skincare</h3>
              <p className="text-xs text-muted-foreground">ผลิตภัณฑ์ดูแลผิวพรรณคัดสรรพิเศษ</p>
            </div>
            <Link href="/products?category=30001" className="ml-auto">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 gap-1">
                ดูทั้งหมด <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          {loadingSkincare ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {(skincareProducts ?? []).slice(0, 3).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="gold-divider mx-auto max-w-xs mb-14" />

        {/* Tea */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10">
              <Droplets className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-foreground">Tea & Herbal</h3>
              <p className="text-xs text-muted-foreground">ชาและเครื่องดื่มสมุนไพรคัดสรร</p>
            </div>
            <Link href="/products?category=30002" className="ml-auto">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 gap-1">
                ดูทั้งหมด <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          {loadingTea ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {(teaProducts ?? []).slice(0, 3).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ComingSoonNotifyButton({ productName }: { productName: string }) {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setShowForm(false);
    }
  };

  if (submitted) {
    return (
      <p className="text-xs text-accent font-medium">✓ เราจะแจ้งคุณเมื่อพร้อมแล้วค่ะ</p>
    );
  }

  if (showForm) {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full">
        <input
          type="email"
          placeholder="อีเมลของคุณ"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full text-sm px-3 py-2 rounded-full border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <Button type="submit" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-full">
          แจ้งฉันเมื่อพร้อม
        </Button>
      </form>
    );
  }

  return (
    <Button
      size="sm"
      variant="outline"
      className="border-border/60 text-muted-foreground hover:border-primary hover:text-primary rounded-full px-6"
      onClick={() => setShowForm(true)}
    >
      แจ้งฉันเมื่อพร้อม
    </Button>
  );
}

const HERO_BOTTLE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663084993239/YGoR3BS934bR93H6563cHY/bienvica_hero_real_v2-2sL3KWZN2ju2MAKCpkKAtE.webp";
const HERO_LIFESTYLE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663084993239/YGoR3BS934bR93H6563cHY/bienvica_lifestyle_khunprae-M6RLqrJpXieJGgJuZ7wYAD.webp";
const INGREDIENTS_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663084993239/YGoR3BS934bR93H6563cHY/bienvica_ingredients_real_v2-ahVK4XsKggF9475yzR82SH.webp";
const TRIPLE_ACTION_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663084993239/YGoR3BS934bR93H6563cHY/bienvica_triple_action_infographic_38140c3c.png";

export default function Home() {
  const { data: featuredProducts, isLoading } = trpc.products.list.useQuery({ featuredOnly: true });
  const { data: categories } = trpc.categories.list.useQuery();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-muted via-background to-muted">
        {/* เบียงวิก้า — มุมซ้ายบน */}
        <div className="absolute top-6 left-6 md:top-8 md:left-10 z-10">
          <span className="font-serif text-sm md:text-base text-primary/70 italic tracking-wider">เบียงวิก้า</span>
        </div>
        <div className="container py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block text-xs font-medium text-accent uppercase tracking-[0.2em] border border-accent/30 rounded-full px-4 py-1.5">
                Premium Science-Backed Wellness
              </span>
              {/* ชื่อหลัก: Bienvica */}
              <div>
                <h1
                  className="font-serif font-bold leading-none tracking-tight"
                  style={{
                    fontSize: 'clamp(3.5rem, 10vw, 7rem)',
                    background: 'linear-gradient(135deg, oklch(0.28 0.025 50) 0%, oklch(0.60 0.065 10) 45%, oklch(0.73 0.085 72) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Bienvica
                </h1>
              </div>
              {/* Tagline ภายใต้ Return to Self */}
              <div className="space-y-1">
                <p className="font-serif text-xl md:text-2xl font-semibold text-foreground leading-snug">
                  คืนสู่ตัวเอง ในทุก moment ที่เป็นตัวคุณ
                </p>
                <p className="font-serif text-lg md:text-xl text-muted-foreground leading-snug">
                  การดูแลตัวเองไม่ใช่ความฟุ่มเฟือย — มันคือวิถีที่คุณกลับมาเป็นคุณ
                </p>
              </div>
              <p className="text-muted-foreground text-base leading-relaxed max-w-md">
                wellness ecosystem ที่ออกแบบมาเพื่อทุก moment ของวัน — ผสานพลังจากกุหลาบมอญ กระบองเพชร และแอปเปิ้ลไซเดอร์ ผ่านการพิสูจน์ทางวิทยาศาสตร์ระดับเซลล์
              </p>
              <p className="text-sm text-accent font-medium italic">
                "Feel Like Myself Again — คุณเลือกที่จะเป็นตัวเองที่มีความสุขได้"
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/products">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                    สั่งซื้อเลย <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="border-border hover:bg-secondary">
                    เรียนรู้เพิ่มเติม
                  </Button>
                </Link>
              </div>
              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Award className="h-3.5 w-3.5 text-accent" />
                  <span>Best of the Best — Genius AGRO360</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <FlaskConical className="h-3.5 w-3.5 text-accent" />
                  <span>วิจัยผ่าน Caco-2 Cell Model</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[3/4] max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl">
                <img src={HERO_BOTTLE} alt="Bienvica Beyond Cider™" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/10 rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Gold divider */}
      <div className="gold-divider mx-auto max-w-3xl" />

      {/* Key Features Bar */}
      <section className="py-14 bg-background border-y border-border/60">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Leaf, title: "วัตถุดิบธรรมชาติ", desc: "กุหลาบมอญ + กระบองเพชร + แอปเปิ้ลไซเดอร์ จากแหล่งท้องถิ่น" },
              { icon: FlaskConical, title: "พิสูจน์ทางวิทยาศาสตร์", desc: "ทดสอบผ่านโมเดลเซลล์ลำไส้มนุษย์ (Caco-2) อย่างเป็นทางการ" },
              { icon: Sparkles, title: "Balance & Restore", desc: "สมดุลจากข้างใน เพื่อให้คุณสวยและดีจากข้างนอก" },
              { icon: Award, title: "รางวัลระดับประเทศ", desc: "ได้รับรางวัล Best of the Best จากโครงการ Genius AGRO360" },
            ].map((f) => (
              <div key={f.title} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-foreground mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gold divider */}
      <div className="gold-divider mx-auto max-w-3xl" />

      {/* Triple Action Science Section */}
      <section className="py-20 bg-gradient-to-b from-muted/60 to-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block text-xs font-medium text-accent uppercase tracking-[0.2em] border border-accent/30 rounded-full px-4 py-1.5">
                Science-Backed
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground leading-tight">
                กลไก{" "}
                <span className="text-primary italic">Triple Action™</span>
                <br />จัดการน้ำตาลอย่างมีประสิทธิภาพ
              </h2>
              <div className="space-y-4">
                {[
                  {
                    num: "01",
                    title: "ยับยั้งการย่อย",
                    desc: "สาร Corilagin จากกุหลาบมอญยับยั้งเอนไซม์ α-glucosidase ได้สูงกว่ายามาตรฐาน Acarbose",
                  },
                  {
                    num: "02",
                    title: "ชะลอการดูดซึม",
                    desc: "กรด p-Coumaric จากแคคตัสบล็อกตัวขนส่งน้ำตาล SGLT1 และ GLUT2 ลดน้ำตาลเข้าสู่กระแสเลือด",
                  },
                  {
                    num: "03",
                    title: "กระตุ้นสมดุลธรรมชาติ",
                    desc: "กระตุ้นฮอร์โมนอิ่ม GLP-1 และ GIP ใกล้เคียงยามาตรฐาน Metformin ให้ร่างกายจัดการน้ำตาลเองตามธรรมชาติ",
                  },
                ].map((item) => (
                  <div key={item.num} className="flex gap-4">
                    <span className="font-serif text-2xl font-bold text-primary/30 leading-none mt-0.5 w-8 flex-shrink-0">{item.num}</span>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl bg-white">
              <img src={TRIPLE_ACTION_IMG} alt="Bienvica Triple Action — Damask Rose, Cactus, Apple Cider" className="w-full h-auto object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* Gold divider */}
      <div className="gold-divider mx-auto max-w-3xl" />

      {/* Ingredients Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden shadow-xl order-2 md:order-1">
              <img src={INGREDIENTS_IMG} alt="Natural Ingredients" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-6 order-1 md:order-2">
              <span className="inline-block text-xs font-medium text-accent uppercase tracking-[0.2em] border border-accent/30 rounded-full px-4 py-1.5">
                Natural Ingredients
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground leading-tight">
                3 วัตถุดิบ{" "}
                <span className="text-primary italic">จากธรรมชาติ</span>
              </h2>
              <div className="space-y-4">
                {[
                  {
                    name: "กุหลาบมอญ (Rosa Damascena)",
                    detail: "อุดมด้วยสาร Corilagin และ Quercetin ช่วยยับยั้งเอนไซม์ย่อยน้ำตาล และต้านอนุมูลอิสระ จัดหาจากสวนกระเลิงผักเทิงภู พันธมิตรชุมชนของเรา",
                  },
                  {
                    name: "กระบองเพชร (Nopal Cactus)",
                    detail: "มี Mucilage ดักจับไขมัน และกรด p-Coumaric ชะลอการดูดซึมน้ำตาล ปลูกโดย Founder ผู้มีประสบการณ์กว่า 18 ปี",
                  },
                  {
                    name: "แอปเปิ้ลไซเดอร์ (Apple Cider)",
                    detail: "ให้สาร Dihydrochalcone ช่วยบล็อกตัวขนส่งน้ำตาล GLUT2 และมอบรสชาติที่สดชื่น ใกล้เคียงแชมเปญ",
                  },
                ].map((ing) => (
                  <div key={ing.name} className="border-l-2 border-primary/30 pl-4">
                    <h4 className="font-semibold text-foreground mb-1">{ing.name}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{ing.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gold divider */}
      <div className="gold-divider mx-auto max-w-3xl" />

      {/* Lifestyle Section */}
      <section className="py-20 bg-gradient-to-b from-muted/40 to-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block text-xs font-medium text-accent uppercase tracking-[0.2em] border border-accent/30 rounded-full px-4 py-1.5">
                For Modern Women
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground leading-tight">
                ดูแลตัวเองใน{" "}
                <span className="text-primary italic">ช่วงเวลาที่คุณสมควรได้รับ</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Bienvica ถูกสร้างขึ้นสำหรับผู้หญิงยุคใหม่ที่ทุ่มเทให้กับทุกบทบาทในชีวิต ทั้งในบ้านและนอกบ้าน ขวดสไตล์แชมเปญของเราบอกว่า ระหว่างที่คุณดูแลคนอื่น คุณก็ดูแลตัวเองและมีความสุขเล็กๆ ได้พร้อมกัน
              </p>
              <p className="text-muted-foreground leading-relaxed">
                เราเชื่อว่าผู้หญิงบางทีก็มีช่วงเวลาที่รู้สึกว่าตัวเองหายไป - ท่ามกลางความรับผิดชอบ ความคาดหวัง และการเปลี่ยนแปลงของร่างกาย Bienvica ถูกสร้างขึ้นเพื่อช่วยให้คุณกลับมาพบตัวเองอีกครั้ง
              </p>
              <Link href="/products">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                  สั่งซื้อ Bienvica <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img src={HERO_LIFESTYLE} alt="Bienvica Lifestyle" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Gold divider */}
      <div className="gold-divider mx-auto max-w-3xl" />

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="py-14 bg-background border-y border-border/60">
          <div className="container">
            <div className="text-center mb-8">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">เลือกตามหมวดหมู่</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/products">
                <Button variant="outline" className="rounded-full border-border hover:border-primary hover:text-primary">ทั้งหมด</Button>
              </Link>
              {categories.map((cat) => (
                <Link key={cat.id} href={`/products?category=${cat.id}`}>
                  <Button variant="outline" className="rounded-full border-border hover:border-primary hover:text-primary">{cat.name}</Button>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-20">
        <div className="container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">สินค้าแนะนำ</h2>
              <p className="text-muted-foreground">คัดสรรพิเศษสำหรับคุณ</p>
            </div>
            <Link href="/products">
              <Button variant="ghost" className="text-primary hover:text-primary/80 gap-1">
                ดูทั้งหมด <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">ยังไม่มีสินค้าแนะนำในขณะนี้</p>
              <Link href="/products"><Button variant="outline">ดูสินค้าทั้งหมด</Button></Link>
            </div>
          )}
        </div>
      </section>

      {/* Gold divider */}
      <div className="gold-divider mx-auto max-w-3xl" />

      {/* Curated Collection */}
      <CuratedCollectionSection />

      {/* Gold divider */}
      <div className="gold-divider mx-auto max-w-3xl" />

      {/* Science & Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-medium text-accent uppercase tracking-[0.2em] border border-accent/30 rounded-full px-4 py-1.5 mb-4">
              Science-Backed Formula
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-3">
              3 ชั้นปกป้อง — ก่อนออกไปเผชิญวัน
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              ทุกเช้า ร่างกายต้องรับมือกับ Free Radicals ที่สะสมระหว่างนอนหลับ เมื่ออายุมากขึ้น CoQ10 ลดลง ทำให้เกิด Brain Fog และแสงแดดยิ่งเพิ่ม Oxidative Stress
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            {/* Active Phenolic Compounds */}
            <div className="bg-card rounded-2xl p-8 border border-border shadow-sm text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <FlaskConical className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-foreground mb-2">Active Phenolic Compounds</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">ลดการอักเสบในระบบประสาท เคลียร์สมองให้โล่ง ลดความล้าสะสมที่สะสมจากการทำงานหนักและความเครียด</p>
            </div>
            {/* CoQ10 */}
            <div className="bg-card rounded-2xl p-8 border border-border shadow-sm text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-foreground mb-2">CoQ10</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">สนับสนุนพลังงาน ATP ให้เซลล์สมองและร่างกาย ช่วยฟื้นฟูพลังงานที่สูญหายไปตามอายุ ทำให้รู้สึกตื่นตัวและมีสมาธิมากขึ้น</p>
            </div>
            {/* Rose Antioxidant */}
            <div className="bg-card rounded-2xl p-8 border border-border shadow-sm text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <Flower2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-foreground mb-2">Rose Antioxidant Extract</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">สร้าง Inner Shield ปกป้องเซลล์จากมลภาวะ ฟื้นฟูผิวให้อ่อนใสและสดใสจากภายใน ผลิตจากกุหลาบมอญแห่งสกลนคร</p>
            </div>
          </div>

          {/* Gummy Product Highlight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Afternoon Awake */}
            <div className="bg-gradient-to-br from-[#e8f0e0] to-[#f5f8f0] dark:from-muted/30 dark:to-muted/10 rounded-2xl p-8 border border-border">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 rounded-full bg-[#6b8c5a]/20 flex items-center justify-center flex-shrink-0">
                  <Leaf className="h-5 w-5 text-[#6b8c5a]" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#6b8c5a] uppercase tracking-widest mb-0.5">Afternoon Awake — ซองเขียว</p>
                  <h3 className="font-serif text-xl font-semibold text-foreground">Nopal Cactus Gummy</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Nopal + Magnesium Malate + Green Apple</p>
                </div>
              </div>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><span className="text-[#6b8c5a] font-bold mt-0.5">✓</span>ปลุกสมองล้า คลายปวดเมื่อยบ่าไหล่</li>
                <li className="flex items-start gap-2"><span className="text-[#6b8c5a] font-bold mt-0.5">✓</span>สนับสนุน GLP-1 คุมหิวอิ่มนาน พลังงานต่อเนื่อง</li>
                <li className="flex items-start gap-2"><span className="text-[#6b8c5a] font-bold mt-0.5">✓</span>คุมสมดุลน้ำตาล ลดอาการง่วงนอนหลังมื้อเที่ยง</li>
                <li className="flex items-start gap-2"><span className="text-[#6b8c5a] font-bold mt-0.5">✓</span>0% Sugar Added · 6 เม็ด/ซอง</li>
              </ul>
              <p className="mt-5 text-lg font-semibold text-foreground">59 บาท</p>
            </div>

            {/* Midnight Rose */}
            <div className="bg-gradient-to-br from-[#f5e8ed] to-[#fdf5f7] dark:from-muted/30 dark:to-muted/10 rounded-2xl p-8 border border-border">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 rounded-full bg-[#c07a8a]/20 flex items-center justify-center flex-shrink-0">
                  <Flower2 className="h-5 w-5 text-[#c07a8a]" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#c07a8a] uppercase tracking-widest mb-0.5">Midnight Rose — ซองชมพู</p>
                  <h3 className="font-serif text-xl font-semibold text-foreground">Nopal Cactus Gummy</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Nopal + Magnesium Bisglycinate + Rosa damascena</p>
                </div>
              </div>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><span className="text-[#c07a8a] font-bold mt-0.5">✓</span>ผ่อนคลายระบบประสาท ลดความตึงเครียดของกล้ามเนื้อ</li>
                <li className="flex items-start gap-2"><span className="text-[#c07a8a] font-bold mt-0.5">✓</span>สนับสนุน GABA หลับลึกและยาวนานขึ้น</li>
                <li className="flex items-start gap-2"><span className="text-[#c07a8a] font-bold mt-0.5">✓</span>อโรมากุหลาบช่วยให้ใจสงบ ฟื้นฟูผิวขณะนอนหลับ</li>
                <li className="flex items-start gap-2"><span className="text-[#c07a8a] font-bold mt-0.5">✓</span>0% Sugar Added · 6 เม็ด/ซอง</li>
              </ul>
              <p className="mt-5 text-lg font-semibold text-foreground">59 บาท</p>
            </div>
          </div>

          {/* Morning Veil Shot Highlight */}
          <div className="mt-8 max-w-4xl mx-auto bg-gradient-to-r from-[#3a2a1a]/5 to-[#5a3a1a]/10 dark:from-muted/20 dark:to-muted/10 rounded-2xl p-8 border border-border">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-[#5a3a1a]/10 flex items-center justify-center">
                  <Droplets className="h-6 w-6 text-[#5a3a1a] dark:text-accent" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-accent uppercase tracking-widest mb-1">Morning Veil Shot — 50ml Ready to Drink</p>
                <h3 className="font-serif text-2xl font-semibold text-foreground mb-3">เตรียมร่างกายก่อนเริ่มวัน</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                  <div className="text-center p-3 bg-background/60 rounded-xl">
                    <p className="text-xs font-semibold text-foreground mb-1">ACV</p>
                    <p className="text-xs text-muted-foreground">คุมสมดุลน้ำตาล</p>
                  </div>
                  <div className="text-center p-3 bg-background/60 rounded-xl">
                    <p className="text-xs font-semibold text-foreground mb-1">Nopal</p>
                    <p className="text-xs text-muted-foreground">สนับสนุน GLP-1</p>
                  </div>
                  <div className="text-center p-3 bg-background/60 rounded-xl">
                    <p className="text-xs font-semibold text-foreground mb-1">Rose</p>
                    <p className="text-xs text-muted-foreground">ฟื้นฟูผิวผุดผ่อง</p>
                  </div>
                  <div className="text-center p-3 bg-background/60 rounded-xl">
                    <p className="text-xs font-semibold text-foreground mb-1">CoQ10</p>
                    <p className="text-xs text-muted-foreground">พลังงานระดับเซลล์</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">ผลิตจากงานวิจัยรังกราค RAINS for Semi-Industrial Food Valley ประจำปี 2568 สนับสนุนโดย สวก. — ทดสอบใน CaCo-2 intestinal cell model</p>
                <div className="flex items-center gap-4">
                  <p className="text-xl font-semibold text-foreground">40 บาท</p>
                  <Link href="/products">
                    <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6">
                      สั่งซื้อเลย
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gold divider */}
      <div className="gold-divider mx-auto max-w-3xl" />

      {/* Coming Soon — Gummies & Shot */}
      <section className="py-20 bg-gradient-to-b from-muted/40 to-background">
        <div className="container">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-medium text-accent uppercase tracking-[0.2em] border border-accent/30 rounded-full px-4 py-1.5 mb-4">
              Wellness Ecosystem
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-3">
              ทุก moment ของวัน มีสินค้าของ Bienvica
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Balance · Reset · Celebrate — สามเสาหลักที่ดูแลคุณตั้งแต่เช้าจนค่ำ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Sparkling — Available */}
            <div className="relative rounded-2xl border border-border bg-card p-8 text-center flex flex-col items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">🥂</div>
              <div>
                <p className="text-xs font-medium text-accent uppercase tracking-widest mb-1">Celebrate</p>
                <h3 className="font-serif text-xl font-semibold text-foreground">Sparkling</h3>
                <p className="text-sm text-muted-foreground mt-2">ฉลองตัวเอง ในแบบที่ดูแลร่างกายด้วย</p>
              </div>
              <Link href="/products">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6">
                  ดูสินค้า
                </Button>
              </Link>
            </div>

            {/* Gummies — Available */}
            <div className="relative rounded-2xl border border-border bg-card p-8 text-center flex flex-col items-center gap-4 shadow-sm">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                  New
                </span>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">🌿</div>
              <div>
                <p className="text-xs font-medium text-accent uppercase tracking-widest mb-1">Balance</p>
                <h3 className="font-serif text-xl font-semibold text-foreground">Nopal Cactus Gummy</h3>
                <p className="text-sm text-muted-foreground mt-2">2 รสชาติ — Afternoon Awake &amp; Midnight Rose ซองละ 6 เม็ด ดูแลคุณทั้งกลางวันและกลางคืน</p>
              </div>
              <Link href="/products">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6">
                  ดูสินค้า
                </Button>
              </Link>
            </div>

            {/* Morning Veil Shot — Available */}
            <div className="relative rounded-2xl border border-border bg-card p-8 text-center flex flex-col items-center gap-4 shadow-sm">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                  New
                </span>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">⚡</div>
              <div>
                <p className="text-xs font-medium text-accent uppercase tracking-widest mb-1">Reset</p>
                <h3 className="font-serif text-xl font-semibold text-foreground">Morning Veil Shot</h3>
                <p className="text-sm text-muted-foreground mt-2">50ml พร้อมดื่ม เตรียมร่างกายก่อนเริ่มวัน ACV · Nopal · Rose · CoQ10 ไม่มีน้ำตาลเพิ่ม</p>
              </div>
              <Link href="/products">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6">
                  ดูสินค้า
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gold divider */}
      <div className="gold-divider mx-auto max-w-3xl" />

      {/* Brand Philosophy Quote */}
      <section className="py-20 bg-gradient-to-br from-muted/80 via-background to-muted/50">
        <div className="container max-w-3xl text-center space-y-8">
          <div className="gold-divider mx-auto w-16" />
          <blockquote className="font-serif text-2xl md:text-3xl font-medium text-foreground leading-relaxed italic">
            "ร่างกายและจิตใจของผู้หญิงมีความต้องการที่แตกต่างกันในแต่ละช่วงเวลาของวัน — และในแต่ละช่วงของชีวิต Bienvica เชื่อว่าการดูแลตัวเองไม่ควรซับซ้อน ไม่ควรรู้สึกเหมือนยา และไม่ควรให้เธอต้องเลือกระหว่างสุขภาพกับความสุข"
          </blockquote>
          <div className="gold-divider mx-auto w-16" />
          <p className="text-muted-foreground text-sm uppercase tracking-widest">— Bienvica Brand Philosophy</p>
          <Link href="/about">
            <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground mt-2 rounded-full px-8">
              เรื่องราวของเรา
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
