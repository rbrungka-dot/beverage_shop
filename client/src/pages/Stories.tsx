import { useState } from "react";
import { Heart, Quote, Send, Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("th-TH", {
    year: "numeric", month: "long", day: "numeric",
  });
}

function StoryCard({ story }: { story: { id: number; authorName: string; authorTitle: string | null; content: string; imageUrl: string | null; isFeatured: boolean; createdAt: Date } }) {
  return (
    <div className={`bg-card rounded-2xl border ${story.isFeatured ? "border-primary/40 shadow-md" : "border-border"} p-6 flex flex-col gap-4 h-full`}>
      {story.isFeatured && (
        <div className="flex items-center gap-1.5 text-primary text-xs font-medium">
          <Star className="h-3.5 w-3.5 fill-primary" />
          เรื่องเล่าแนะนำ
        </div>
      )}
      <Quote className="h-7 w-7 text-primary/30 flex-shrink-0" />
      <p className="text-foreground/85 leading-relaxed text-sm flex-1 whitespace-pre-line">
        {story.content}
      </p>
      <div className="flex items-center gap-3 pt-2 border-t border-border/60">
        {story.imageUrl ? (
          <img
            src={story.imageUrl}
            alt={story.authorName}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <User className="h-5 w-5 text-primary/60" />
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-foreground">{story.authorName}</p>
          {story.authorTitle && (
            <p className="text-xs text-muted-foreground">{story.authorTitle}</p>
          )}
          <p className="text-xs text-muted-foreground/70">{formatDate(story.createdAt)}</p>
        </div>
      </div>
    </div>
  );
}

function SubmitForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({
    authorName: "",
    authorTitle: "",
    content: "",
    imageUrl: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const submit = trpc.stories.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      onSuccess();
    },
    onError: (e) => toast.error(e.message || "เกิดข้อผิดพลาด กรุณาลองใหม่"),
  });

  if (submitted) {
    return (
      <div className="text-center py-10 space-y-3">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <Heart className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-serif text-xl font-semibold text-foreground">ขอบคุณสำหรับเรื่องเล่าของคุณ</h3>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          ทีมงาน Bienvica จะตรวจสอบและนำเรื่องเล่าของคุณขึ้นแสดงบนหน้าเว็บในเร็วๆ นี้
        </p>
        <Button variant="outline" size="sm" onClick={() => setSubmitted(false)} className="mt-2">
          ส่งเรื่องเล่าอีกครั้ง
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="authorName">ชื่อของคุณ *</Label>
          <Input
            id="authorName"
            value={form.authorName}
            onChange={(e) => setForm({ ...form, authorName: e.target.value })}
            placeholder="เช่น คุณแพร, คุณมิ้น"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="authorTitle">ตัวตนของคุณ (ไม่บังคับ)</Label>
          <Input
            id="authorTitle"
            value={form.authorTitle}
            onChange={(e) => setForm({ ...form, authorTitle: e.target.value })}
            placeholder="เช่น นักวิ่งมาราธอน, คุณแม่วัย 35"
            className="mt-1"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="content">เรื่องเล่าของคุณ *</Label>
        <Textarea
          id="content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="เล่าให้เราฟังว่า Bienvica เข้ามาในชีวิตคุณตอนไหน และมันเปลี่ยนอะไรบ้าง..."
          className="mt-1 resize-none"
          rows={5}
        />
        <p className="text-xs text-muted-foreground mt-1">{form.content.length} ตัวอักษร (ขั้นต่ำ 20)</p>
      </div>
      <div>
        <Label htmlFor="imageUrl">รูปโปรไฟล์ของคุณ (URL, ไม่บังคับ)</Label>
        <Input
          id="imageUrl"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          placeholder="https://..."
          className="mt-1"
        />
      </div>
      <Button
        onClick={() => {
          if (!form.authorName.trim()) { toast.error("กรุณาระบุชื่อของคุณ"); return; }
          if (form.content.trim().length < 20) { toast.error("เรื่องเล่าต้องมีอย่างน้อย 20 ตัวอักษร"); return; }
          submit.mutate({
            authorName: form.authorName.trim(),
            authorTitle: form.authorTitle.trim() || undefined,
            content: form.content.trim(),
            imageUrl: form.imageUrl.trim() || undefined,
          });
        }}
        disabled={submit.isPending}
        className="w-full bg-primary text-primary-foreground gap-2"
      >
        <Send className="h-4 w-4" />
        {submit.isPending ? "กำลังส่ง..." : "ส่งเรื่องเล่าของฉัน"}
      </Button>
    </div>
  );
}

export default function Stories() {
  const [showForm, setShowForm] = useState(false);
  const { data: stories, isLoading, refetch } = trpc.stories.list.useQuery();

  const featured = stories?.filter((s) => s.isFeatured) ?? [];
  const regular = stories?.filter((s) => !s.isFeatured) ?? [];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-rose-50/60 to-background">
        <div className="container max-w-3xl text-center">
          <Badge variant="outline" className="mb-4 text-primary border-primary/30">
            Wall of Stories
          </Badge>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-foreground leading-tight mb-4">
            เรื่องเล่าจาก<br />
            <span className="text-primary italic">ครอบครัว Bienvica</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto">
            ทุกขวดมีเรื่องราว ทุกคนมีจุดเริ่มต้นของตัวเอง
            นี่คือพื้นที่สำหรับแบ่งปันประสบการณ์จริงจากคนที่เลือก Bienvica
          </p>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="mt-8 bg-primary text-primary-foreground px-8"
            size="lg"
          >
            {showForm ? "ปิดฟอร์ม" : "แบ่งปันเรื่องเล่าของคุณ"}
          </Button>
        </div>
      </section>

      {/* Submission Form */}
      {showForm && (
        <section className="py-12 bg-secondary/30 border-y border-border">
          <div className="container max-w-2xl">
            <div className="bg-background rounded-2xl border border-border p-8 shadow-sm">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">
                เล่าให้เราฟัง
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                เรื่องเล่าของคุณจะถูกตรวจสอบก่อนนำขึ้นแสดง ใช้เวลาไม่นาน
              </p>
              <SubmitForm onSuccess={() => { refetch(); setTimeout(() => setShowForm(false), 3000); }} />
            </div>
          </div>
        </section>
      )}

      {/* Featured Stories */}
      {featured.length > 0 && (
        <section className="py-16">
          <div className="container max-w-5xl">
            <div className="flex items-center gap-2 mb-8">
              <Star className="h-5 w-5 text-primary fill-primary" />
              <h2 className="font-serif text-2xl font-semibold text-foreground">เรื่องเล่าแนะนำ</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featured.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Stories */}
      <section className={`py-16 ${featured.length > 0 ? "bg-secondary/20" : ""}`}>
        <div className="container max-w-5xl">
          {featured.length > 0 && (
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-8">
              เรื่องเล่าทั้งหมด
            </h2>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-56 rounded-2xl" />
              ))}
            </div>
          ) : regular.length === 0 && featured.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Heart className="h-10 w-10 text-primary/40" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground">
                ยังไม่มีเรื่องเล่า
              </h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                เป็นคนแรกที่แบ่งปันประสบการณ์กับ Bienvica
              </p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-primary text-primary-foreground"
              >
                แบ่งปันเรื่องเล่าแรก
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regular.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      {(stories?.length ?? 0) > 0 && (
        <section className="py-16 bg-primary/5 border-t border-primary/10">
          <div className="container max-w-xl text-center space-y-4">
            <h2 className="font-serif text-2xl font-semibold text-foreground">
              คุณก็มีเรื่องเล่าของตัวเอง
            </h2>
            <p className="text-muted-foreground">
              ไม่ต้องสวยหรือสมบูรณ์แบบ แค่จริงใจก็พอ
            </p>
            <Button
              onClick={() => { setShowForm(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="bg-primary text-primary-foreground px-8"
            >
              แบ่งปันเรื่องเล่าของฉัน
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
