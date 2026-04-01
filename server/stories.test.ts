import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./db", () => ({
  getApprovedStories: vi.fn(),
  getAllStories: vi.fn(),
  createStory: vi.fn(),
  approveStory: vi.fn(),
  featureStory: vi.fn(),
  deleteStory: vi.fn(),
  // other db exports used by routers
  getCategories: vi.fn().mockResolvedValue([]),
  getProducts: vi.fn().mockResolvedValue([]),
  getProductById: vi.fn().mockResolvedValue(undefined),
  getCartItems: vi.fn().mockResolvedValue([]),
  upsertCartItem: vi.fn().mockResolvedValue(undefined),
  updateCartItemQuantity: vi.fn().mockResolvedValue(undefined),
  removeCartItem: vi.fn().mockResolvedValue(undefined),
  clearCart: vi.fn().mockResolvedValue(undefined),
  createOrder: vi.fn().mockResolvedValue(1),
  getOrdersByUser: vi.fn().mockResolvedValue([]),
  getAllOrders: vi.fn().mockResolvedValue([]),
  getOrderById: vi.fn().mockResolvedValue(undefined),
  getOrderItems: vi.fn().mockResolvedValue([]),
  updateOrderStatus: vi.fn().mockResolvedValue(undefined),
  updateOrderByStripeSession: vi.fn().mockResolvedValue(undefined),
  getOrderByStripeSession: vi.fn().mockResolvedValue(undefined),
  getPublishedArticles: vi.fn().mockResolvedValue([]),
  getAllArticles: vi.fn().mockResolvedValue([]),
  getArticleBySlug: vi.fn().mockResolvedValue(undefined),
  getArticleById: vi.fn().mockResolvedValue(undefined),
  createArticle: vi.fn().mockResolvedValue(1),
  updateArticle: vi.fn().mockResolvedValue(undefined),
  deleteArticle: vi.fn().mockResolvedValue(undefined),
  upsertUser: vi.fn().mockResolvedValue(undefined),
  getUserByOpenId: vi.fn().mockResolvedValue(undefined),
  updateUserStripeCustomerId: vi.fn().mockResolvedValue(undefined),
  createCategory: vi.fn().mockResolvedValue(undefined),
  updateCategory: vi.fn().mockResolvedValue(undefined),
  deleteCategory: vi.fn().mockResolvedValue(undefined),
  createProduct: vi.fn().mockResolvedValue(undefined),
  updateProduct: vi.fn().mockResolvedValue(undefined),
  deleteProduct: vi.fn().mockResolvedValue(undefined),
  getDb: vi.fn().mockResolvedValue(null),
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

vi.mock("./email", () => ({
  sendOrderConfirmationEmail: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("stripe", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      checkout: { sessions: { create: vi.fn(), retrieve: vi.fn() } },
      webhooks: { constructEvent: vi.fn() },
    })),
  };
});

import {
  getApprovedStories,
  getAllStories,
  createStory,
  approveStory,
  featureStory,
  deleteStory,
} from "./db";
import { appRouter } from "./routers";

const mockStory = {
  id: 1,
  authorName: "คุณแพร",
  authorTitle: "นักวิ่งมาราธอน",
  content: "ฉันเริ่มดื่ม Bienvica ตอนที่ต้องการพลังงานก่อนวิ่ง มันเปลี่ยนชีวิตฉันไปมาก",
  imageUrl: null,
  isApproved: true,
  isFeatured: false,
  createdAt: new Date("2026-01-01"),
};

const publicCtx = { user: null, req: {} as any, res: {} as any };
const adminCtx = { user: { id: 1, role: "admin" as const, name: "Admin", email: "admin@test.com", openId: "admin-open-id", loginMethod: null, stripeCustomerId: null, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }, req: {} as any, res: {} as any };

describe("stories.list", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns only approved stories for public", async () => {
    (getApprovedStories as any).mockResolvedValue([mockStory]);
    const caller = appRouter.createCaller(publicCtx);
    const result = await caller.stories.list();
    expect(result).toHaveLength(1);
    expect(result[0].authorName).toBe("คุณแพร");
    expect(getApprovedStories).toHaveBeenCalledOnce();
  });

  it("returns empty array when no stories", async () => {
    (getApprovedStories as any).mockResolvedValue([]);
    const caller = appRouter.createCaller(publicCtx);
    const result = await caller.stories.list();
    expect(result).toHaveLength(0);
  });
});

describe("stories.submit", () => {
  beforeEach(() => vi.clearAllMocks());

  it("creates a story with isApproved=false", async () => {
    (createStory as any).mockResolvedValue(42);
    const caller = appRouter.createCaller(publicCtx);
    const result = await caller.stories.submit({
      authorName: "คุณมิ้น",
      content: "เรื่องเล่าของฉันกับ Bienvica ที่ยาวพอสมควร",
    });
    expect(result.id).toBe(42);
    expect(createStory).toHaveBeenCalledWith(
      expect.objectContaining({ isApproved: false, isFeatured: false })
    );
  });

  it("rejects content shorter than 20 chars", async () => {
    const caller = appRouter.createCaller(publicCtx);
    await expect(
      caller.stories.submit({ authorName: "Test", content: "สั้นเกินไป" })
    ).rejects.toThrow();
  });

  it("rejects empty authorName", async () => {
    const caller = appRouter.createCaller(publicCtx);
    await expect(
      caller.stories.submit({ authorName: "", content: "เนื้อหายาวพอสมควรมากกว่า 20 ตัวอักษร" })
    ).rejects.toThrow();
  });
});

describe("stories admin procedures", () => {
  beforeEach(() => vi.clearAllMocks());

  it("adminList requires admin role", async () => {
    const userCtx = { ...publicCtx, user: { ...adminCtx.user, role: "user" as const } };
    const caller = appRouter.createCaller(userCtx);
    await expect(caller.stories.adminList()).rejects.toThrow();
  });

  it("adminList returns all stories for admin", async () => {
    const draft = { ...mockStory, id: 2, isApproved: false };
    (getAllStories as any).mockResolvedValue([mockStory, draft]);
    const caller = appRouter.createCaller(adminCtx);
    const result = await caller.stories.adminList();
    expect(result).toHaveLength(2);
  });

  it("approve sets isApproved=true", async () => {
    (approveStory as any).mockResolvedValue(undefined);
    const caller = appRouter.createCaller(adminCtx);
    await caller.stories.approve({ id: 1, isApproved: true });
    expect(approveStory).toHaveBeenCalledWith(1, true);
  });

  it("feature sets isFeatured=true", async () => {
    (featureStory as any).mockResolvedValue(undefined);
    const caller = appRouter.createCaller(adminCtx);
    await caller.stories.feature({ id: 1, isFeatured: true });
    expect(featureStory).toHaveBeenCalledWith(1, true);
  });

  it("delete removes story", async () => {
    (deleteStory as any).mockResolvedValue(undefined);
    const caller = appRouter.createCaller(adminCtx);
    await caller.stories.delete({ id: 1 });
    expect(deleteStory).toHaveBeenCalledWith(1);
  });
});
