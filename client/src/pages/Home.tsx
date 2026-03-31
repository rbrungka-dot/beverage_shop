import { Link } from "wouter";
import { ArrowRight, Leaf, Award, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663084993239/YGoR3BS934bR93H6563cHY/hero-drinks_9c02699d.png";

export default function Home() {
  const { data: featuredProducts, isLoading } = trpc.products.list.useQuery({ featuredOnly: true });
  const { data: categories } = trpc.categories.list.useQuery();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-secondary">
        <div className="container py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block text-xs font-medium text-accent uppercase tracking-[0.2em] border border-accent/30 rounded-full px-4 py-1.5">
                Premium Artisan Beverages
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight">
                The Art of{" "}
                <span className="text-primary italic">Exceptional</span>{" "}
                Drinks
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                คัดสรรเครื่องดื่มคุณภาพพรีเมียมจากวัตถุดิบธรรมชาติ สำหรับผู้ที่ใส่ใจในรสชาติและคุณภาพ
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/products">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                    ดูสินค้าทั้งหมด <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="border-border hover:bg-secondary">
                    เกี่ยวกับเรา
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img src={HERO_IMAGE} alt="Premium Beverages" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/10 rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-background border-y border-border">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Leaf, title: "วัตถุดิบธรรมชาติ", desc: "คัดสรรจากแหล่งวัตถุดิบคุณภาพสูง ปลอดสารเคมี" },
              { icon: Award, title: "คุณภาพพรีเมียม", desc: "ผ่านกระบวนการผลิตที่ได้มาตรฐาน ทุกขวดทุกกล่อง" },
              { icon: Truck, title: "จัดส่งทั่วประเทศ", desc: "บริการจัดส่งรวดเร็ว ถึงมือคุณในสภาพสมบูรณ์" },
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

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="py-16 bg-secondary/50">
          <div className="container">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">หมวดหมู่สินค้า</h2>
              <p className="text-muted-foreground">เลือกเครื่องดื่มที่คุณชื่นชอบ</p>
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

      {/* About Snippet */}
      <section className="py-16 bg-secondary/50">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="font-serif text-3xl font-semibold text-foreground">ศาสตร์แห่งการสร้างสรรค์เครื่องดื่ม</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Modern Alchemist เชื่อว่าเครื่องดื่มที่ดีคือการผสมผสานระหว่างศาสตร์และศิลป์ เราคัดสรรวัตถุดิบจากธรรมชาติ ผ่านกระบวนการผลิตที่ใส่ใจทุกรายละเอียด เพื่อมอบประสบการณ์การดื่มที่ไม่เหมือนใคร
            </p>
            <Link href="/about">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">อ่านเพิ่มเติม</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
