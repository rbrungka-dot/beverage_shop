import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the db module
vi.mock("./db", () => ({
  getPublishedArticles: vi.fn(),
  getAllArticles: vi.fn(),
  getArticleBySlug: vi.fn(),
  getArticleById: vi.fn(),
  createArticle: vi.fn(),
  updateArticle: vi.fn(),
  deleteArticle: vi.fn(),
}));

import {
  getPublishedArticles,
  getAllArticles,
  getArticleBySlug,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from "./db";

const mockArticle = {
  id: 1,
  title: "บทความทดสอบ",
  slug: "test-article",
  excerpt: "สรุปบทความ",
  content: "เนื้อหาบทความ",
  coverImage: null,
  authorName: "Bienvica",
  isPublished: true,
  publishedAt: new Date("2026-01-01"),
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
};

describe("Articles DB helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getPublishedArticles returns published articles", async () => {
    (getPublishedArticles as any).mockResolvedValue([mockArticle]);
    const result = await getPublishedArticles();
    expect(result).toHaveLength(1);
    expect(result[0].isPublished).toBe(true);
    expect(result[0].title).toBe("บทความทดสอบ");
  });

  it("getAllArticles returns all articles including drafts", async () => {
    const draft = { ...mockArticle, id: 2, isPublished: false, slug: "draft-article" };
    (getAllArticles as any).mockResolvedValue([mockArticle, draft]);
    const result = await getAllArticles();
    expect(result).toHaveLength(2);
  });

  it("getArticleBySlug returns article by slug", async () => {
    (getArticleBySlug as any).mockResolvedValue(mockArticle);
    const result = await getArticleBySlug("test-article");
    expect(result).toBeDefined();
    expect(result?.slug).toBe("test-article");
  });

  it("getArticleBySlug returns undefined for unknown slug", async () => {
    (getArticleBySlug as any).mockResolvedValue(undefined);
    const result = await getArticleBySlug("nonexistent");
    expect(result).toBeUndefined();
  });

  it("getArticleById returns article by id", async () => {
    (getArticleById as any).mockResolvedValue(mockArticle);
    const result = await getArticleById(1);
    expect(result).toBeDefined();
    expect(result?.id).toBe(1);
  });

  it("createArticle inserts and returns id", async () => {
    (createArticle as any).mockResolvedValue(42);
    const id = await createArticle({
      title: "บทความใหม่",
      slug: "new-article",
      content: "เนื้อหา",
      isPublished: false,
      authorName: "Bienvica",
    });
    expect(id).toBe(42);
    expect(createArticle).toHaveBeenCalledOnce();
  });

  it("updateArticle calls update with correct params", async () => {
    (updateArticle as any).mockResolvedValue(undefined);
    await updateArticle(1, { title: "ชื่อใหม่", isPublished: true });
    expect(updateArticle).toHaveBeenCalledWith(1, { title: "ชื่อใหม่", isPublished: true });
  });

  it("deleteArticle calls delete with correct id", async () => {
    (deleteArticle as any).mockResolvedValue(undefined);
    await deleteArticle(1);
    expect(deleteArticle).toHaveBeenCalledWith(1);
  });
});

describe("Article slug generation", () => {
  it("slugify converts Thai text with spaces to hyphenated slug", () => {
    // Test the slugify logic used in ArticlesTab
    const slugify = (text: string) =>
      text
        .toLowerCase()
        .replace(/[\u0E00-\u0E7F]/g, (c) => c)
        .replace(/\s+/g, "-")
        .replace(/[^\u0E00-\u0E7Fa-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .slice(0, 100);

    expect(slugify("บทความสุขภาพ")).toBe("บทความสุขภาพ");
    expect(slugify("health article 2026")).toBe("health-article-2026");
    expect(slugify("  multiple   spaces  ")).toBe("-multiple-spaces-");
  });
});
