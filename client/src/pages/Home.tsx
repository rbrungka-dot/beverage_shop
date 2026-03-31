import { Link } from "wouter";
import { ArrowRight, Leaf, Award, FlaskConical, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

const HERO_BOTTLE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663084993239/YGoR3BS934bR93H6563cHY/bienvica_hero_real_v2-2sL3KWZN2ju2MAKCpkKAtE.webp";
const HERO_LIFESTYLE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663084993239/YGoR3BS934bR93H6563cHY/bienvica_lifestyle_real_v2-TvgyPfMY9Qw6rfcXSQd6YC.webp";
const INGREDIENTS_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663084993239/YGoR3BS934bR93H6563cHY/bienvica_ingredients_real_v2-ahVK4XsKggF9475yzR82SH.webp";
const TRIPLE_ACTION_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663084993239/YGoR3BS934bR93H6563cHY/bienvica_triple_real_v2-PANMxwndfT6ZXrSN5iLQcm.webp";

export default function Home() {
  const { data: featuredProducts, isLoading } = trpc.products.list.useQuery({ featuredOnly: true });
  const { data: categories } = trpc.categories.list.useQuery();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-secondary">
        <div className="container py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block text-xs font-medium text-accent uppercase tracking-[0.2em] border border-accent/30 rounded-full px-4 py-1.5">
                Premium Science-Backed Wellness Beverage
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight">
                Beyond Cider™{" "}
                <span className="text-primary italic">เบียงวิก้า</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                เครื่องดื่ม 0% แชมเปญเพื่อสุขภาพ ผสานพลังจากกุหลาบมอญ กระบองเพชร และแอปเปิ้ลไซเดอร์ ผ่านการพิสูจน์ทางวิทยาศาสตร์ระดับเซลล์
              </p>
              <p className="text-sm text-accent font-medium italic">
                "ความสุขที่เริ่มต้นจากสุขภาพที่ดีและช่วงเวลาเรียบง่ายที่ใส่ใจ"
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
                <img src={HERO_BOTTLE} alt="Bienvica Beyond Cider" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/10 rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Bar */}
      <section className="py-12 bg-background border-y border-border">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Leaf, title: "วัตถุดิบธรรมชาติ", desc: "กุหลาบมอญ + กระบองเพชร + แอปเปิ้ลไซเดอร์ จากแหล่งท้องถิ่น" },
              { icon: FlaskConical, title: "พิสูจน์ทางวิทยาศาสตร์", desc: "ทดสอบผ่านโมเดลเซลล์ลำไส้มนุษย์ (Caco-2) อย่างเป็นทางการ" },
              { icon: Sparkles, title: "0% แอลกอฮอล์", desc: "เพลิดเพลินแบบแชมเปญ ดูแลสุขภาพได้โดยไม่ต้องกังวล" },
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

      {/* Triple Action Science Section */}
      <section className="py-16 bg-secondary/30">
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
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img src={TRIPLE_ACTION_IMG} alt="Bienvica Triple Action Benefits" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Ingredients Section */}
      <section className="py-16">
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

      {/* Lifestyle Section */}
      <section className="py-16 bg-secondary/30">
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
                เหมาะสำหรับผู้หญิงอายุ 40 ปีขึ้นไปที่ต้องการเครื่องดื่มพิเศษ ทดแทนแอลกอฮอล์ ดีต่อสุขภาพ และยังดูสวยดูดีทั้งขณะดื่มและหลังดื่ม
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

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="py-12 bg-background border-y border-border">
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
      <section className="py-16">
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

      {/* Brand Philosophy Quote */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-secondary to-accent/5">
        <div className="container max-w-3xl text-center space-y-6">
          <div className="w-12 h-0.5 bg-primary/40 mx-auto" />
          <blockquote className="font-serif text-2xl md:text-3xl font-medium text-foreground leading-relaxed italic">
            "เราเชื่อว่าความสุขที่แท้จริงนั้นแฝงอยู่ในช่วงเวลาเรียบง่ายของชีวิต — ในมื้ออาหารอบอุ่นกับครอบครัว ในรอยยิ้มและน้ำใจที่เพื่อนมอบให้กัน และในการดูแลสุขภาพของตัวเราเองและคนที่เรารัก"
          </blockquote>
          <div className="w-12 h-0.5 bg-primary/40 mx-auto" />
          <p className="text-muted-foreground text-sm uppercase tracking-widest">— Bienvica Brand Philosophy</p>
          <Link href="/about">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground mt-2">
              เรื่องราวของเรา
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
