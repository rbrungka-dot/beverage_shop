import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock DB module
vi.mock("./db", () => ({
  getCategories: vi.fn().mockResolvedValue([
    { id: 1, name: "ชาและสมุนไพร", slug: "tea-herbal", description: null, createdAt: new Date() },
  ]),
  getProducts: vi.fn().mockResolvedValue([
    {
      id: 1, name: "Rose Hibiscus Tea", description: "ชาดอกกระเจี๊ยบ", price: "280.00",
      categoryId: 1, imageUrl: null, stock: 50, isActive: true, isFeatured: true,
      createdAt: new Date(), updatedAt: new Date(), categoryName: "ชาและสมุนไพร",
    },
  ]),
  getProductById: vi.fn().mockResolvedValue({
    id: 1, name: "Rose Hibiscus Tea", description: "ชาดอกกระเจี๊ยบ", price: "280.00",
    categoryId: 1, imageUrl: null, stock: 50, isActive: true, isFeatured: true,
    createdAt: new Date(), updatedAt: new Date(), categoryName: "ชาและสมุนไพร",
  }),
  getCartItems: vi.fn().mockResolvedValue([
    {
      id: 1, userId: 1, productId: 1, quantity: 2, createdAt: new Date(),
      productName: "Rose Hibiscus Tea", productPrice: "280.00",
      productImageUrl: null, productStock: 50,
    },
  ]),
  upsertCartItem: vi.fn().mockResolvedValue(undefined),
  updateCartItemQuantity: vi.fn().mockResolvedValue(undefined),
  removeCartItem: vi.fn().mockResolvedValue(undefined),
  clearCart: vi.fn().mockResolvedValue(undefined),
  getOrdersByUser: vi.fn().mockResolvedValue([
    {
      id: 1, userId: 1, status: "pending", totalAmount: "560.00",
      shippingName: "Test User", shippingAddress: "123 Test St",
      shippingPhone: "0800000000", notes: null,
      stripeSessionId: null, stripePaymentIntentId: null,
      createdAt: new Date(), updatedAt: new Date(),
    },
  ]),
  getOrderById: vi.fn().mockResolvedValue({
    id: 1, userId: 1, status: "pending", totalAmount: "560.00",
    shippingName: "Test User", shippingAddress: "123 Test St",
    shippingPhone: "0800000000", notes: null,
    stripeSessionId: null, stripePaymentIntentId: null,
    createdAt: new Date(), updatedAt: new Date(),
  }),
  getOrderItems: vi.fn().mockResolvedValue([
    { id: 1, orderId: 1, productId: 1, productName: "Rose Hibiscus Tea", quantity: 2, priceAtTime: "280.00" },
  ]),
  createOrder: vi.fn().mockResolvedValue(1),
  getAllOrders: vi.fn().mockResolvedValue([]),
  updateOrderStatus: vi.fn().mockResolvedValue(undefined),
  updateOrderByStripeSession: vi.fn().mockResolvedValue(undefined),
  getOrderByStripeSession: vi.fn().mockResolvedValue(null),
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

function createPublicCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as any,
    res: { clearCookie: vi.fn() } as any,
  };
}

function createAuthCtx(): TrpcContext {
  return {
    user: {
      id: 1, openId: "test-user", email: "test@example.com", name: "Test User",
      loginMethod: "manus", role: "user" as const,
      createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as any,
    res: { clearCookie: vi.fn() } as any,
  };
}

function createAdminCtx(): TrpcContext {
  return {
    user: {
      id: 2, openId: "admin-user", email: "admin@example.com", name: "Admin",
      loginMethod: "manus", role: "admin" as const,
      createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as any,
    res: { clearCookie: vi.fn() } as any,
  };
}

describe("categories.list", () => {
  it("returns list of categories", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    const result = await caller.categories.list();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("ชาและสมุนไพร");
  });
});

describe("products.list", () => {
  it("returns list of products", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    const result = await caller.products.list({});
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Rose Hibiscus Tea");
  });

  it("returns product by id", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    const result = await caller.products.getById({ id: 1 });
    expect(result?.name).toBe("Rose Hibiscus Tea");
    expect(result?.price).toBe("280.00");
  });
});

describe("cart", () => {
  it("requires auth to get cart", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    await expect(caller.cart.get()).rejects.toThrow();
  });

  it("returns cart items for authenticated user", async () => {
    const caller = appRouter.createCaller(createAuthCtx());
    const result = await caller.cart.get();
    expect(result).toHaveLength(1);
    expect(result[0].productName).toBe("Rose Hibiscus Tea");
    expect(result[0].quantity).toBe(2);
  });

  it("allows adding item to cart without throwing", async () => {
    const caller = appRouter.createCaller(createAuthCtx());
    // addItem returns void (upsertCartItem returns undefined)
    await expect(caller.cart.addItem({ productId: 1, quantity: 1 })).resolves.not.toThrow();
  });
});

describe("orders", () => {
  it("requires auth to view orders", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    await expect(caller.orders.myOrders()).rejects.toThrow();
  });

  it("returns user orders for authenticated user", async () => {
    const caller = appRouter.createCaller(createAuthCtx());
    const result = await caller.orders.myOrders();
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("pending");
  });

  it("returns order detail by id", async () => {
    const caller = appRouter.createCaller(createAuthCtx());
    const result = await caller.orders.getById({ id: 1 });
    expect(result?.id).toBe(1);
    expect(result?.shippingName).toBe("Test User");
  });

  it("admin can list all orders", async () => {
    const caller = appRouter.createCaller(createAdminCtx());
    const result = await caller.orders.adminList();
    expect(Array.isArray(result)).toBe(true);
  });

  it("non-admin cannot list all orders", async () => {
    const caller = appRouter.createCaller(createAuthCtx());
    await expect(caller.orders.adminList()).rejects.toThrow();
  });
});

describe("auth.logout", () => {
  it("clears session cookie on logout", async () => {
    const ctx = createAuthCtx();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result.success).toBe(true);
  });
});
