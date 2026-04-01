import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays, User, BookOpen } from "lucide-react";

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Simple renderer: convert newlines to <br> and support basic markdown-like **bold**
function renderContent(content: string) {
  return content
    .split("\n\n")
    .map((para, i) => {
      const withBold = para.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      const withItalic = withBold.replace(/\*(.*?)\*/g, "<em>$1</em>");
      const withBr = withItalic.replace(/\n/g, "<br/>");
      return `<p key="${i}" class="mb-4">${withBr}</p>`;
    })
    .join("");
}

export default function ArticleDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";

  const { data: article, isLoading } = trpc.articles.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
          <div className="h-64 bg-gray-100 rounded-xl mb-8" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <BookOpen className="w-16 h-16 text-emerald-200 mb-4" />
        <h1 className="text-2xl font-bold text-gray-600 mb-2">ไม่พบบทความ</h1>
        <p className="text-gray-400 mb-6">บทความที่คุณค้นหาอาจถูกลบหรือไม่มีอยู่</p>
        <Link href="/articles">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            กลับไปหน้าบทความ
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Back nav */}
      <div className="bg-emerald-50 border-b border-emerald-100">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <Link href="/articles">
            <button className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 text-sm font-medium transition-colors">
              <ArrowLeft className="w-4 h-4" />
              กลับไปหน้าบทความ
            </button>
          </Link>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 py-10">
        {/* Cover image */}
        {article.coverImage && (
          <div className="rounded-2xl overflow-hidden mb-8 shadow-md">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full max-h-96 object-cover"
            />
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {article.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-emerald-500" />
            {article.authorName || "Bienvica"}
          </span>
          {article.publishedAt && (
            <span className="flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-emerald-500" />
              {formatDate(article.publishedAt)}
            </span>
          )}
        </div>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-lg text-gray-600 mb-8 leading-relaxed font-medium border-l-4 border-emerald-400 pl-4 italic">
            {article.excerpt}
          </p>
        )}

        {/* Content */}
        <div
          className="prose prose-emerald max-w-none text-gray-700 leading-relaxed text-base"
          dangerouslySetInnerHTML={{ __html: renderContent(article.content) }}
        />

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
          <Link href="/articles">
            <Button variant="outline" className="flex items-center gap-2 mx-auto">
              <ArrowLeft className="w-4 h-4" />
              ดูบทความทั้งหมด
            </Button>
          </Link>
        </div>
      </article>
    </div>
  );
}
