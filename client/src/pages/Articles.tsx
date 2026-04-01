import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, User, ChevronRight, BookOpen } from "lucide-react";

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Articles() {
  const { data: articles, isLoading } = trpc.articles.list.useQuery();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <BookOpen className="w-12 h-12 opacity-80" />
          </div>
          <h1 className="text-4xl font-bold mb-3">บทความและข่าวสาร</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            ติดตามข่าวสาร ความรู้ด้านสุขภาพ และอัปเดตล่าสุดจาก Bienvica
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="h-48 bg-emerald-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && (!articles || articles.length === 0) && (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-emerald-200 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-500 mb-2">ยังไม่มีบทความ</h2>
            <p className="text-gray-400">กรุณากลับมาใหม่ในภายหลัง</p>
          </div>
        )}

        {!isLoading && articles && articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link key={article.id} href={`/articles/${article.slug}`}>
                <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden border-0 shadow-sm h-full flex flex-col">
                  {/* Cover Image */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-emerald-100 to-emerald-200">
                    {article.coverImage ? (
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-emerald-400 opacity-50" />
                      </div>
                    )}
                  </div>

                  <CardContent className="p-5 flex flex-col flex-1">
                    <h2 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {article.title}
                    </h2>

                    {article.excerpt && (
                      <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-1">
                        {article.excerpt}
                      </p>
                    )}

                    <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {article.authorName || "Bienvica"}
                        </span>
                        {article.publishedAt && (
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" />
                            {formatDate(article.publishedAt)}
                          </span>
                        )}
                      </div>
                      <span className="flex items-center gap-1 text-emerald-600 font-medium">
                        อ่านต่อ <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
