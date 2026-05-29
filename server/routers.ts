import Stripe from "stripe";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { notifyOwner } from "./_core/notification";
import { sendOrderConfirmationEmail } from "./email";
import {
  getCategories, createCategory, updateCategory, deleteCategory,
  getProducts, getProductById, createProduct, updateProduct, deleteProduct,
  getCartItems, upsertCartItem, updateCartItemQuantity, removeCartItem, clearCart,
  createOrder, getOrdersByUser, getAllOrders, getOrderById, getOrderItems, updateOrderStatus,
  updateOrderByStripeSession, getOrderByStripeSession, getDb,
  getPublishedArticles, getAllArticles, getArticleBySlug, getArticleById,
  createArticle, updateArticle, deleteArticle,
  getApprovedStories, getAllStories, createStory, approveStory, featureStory, deleteStory,
} from "./db";
import { orders as ordersTable, inquiries } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2026-03-25.dahlia" });

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  categories: router({
    list: publicProcedure.query(() => getCategories()),
    create: adminProcedure
      .input(z.object({ name: z.string().min(1), slug: z.string().min(1), description: z.string().optional() }))
      .mutation(({ input }) => createCategory(input)),
    update: adminProcedure
      .input(z.object({ id: z.number(), name: z.string().optional(), slug: z.string().optional(), description: z.string().optional() }))
      .mutation(({ input }) => { const { id, ...data } = input; return updateCategory(id, data); }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteCategory(input.id)),
  }),

  products: router({
    list: publicProcedure
      .input(z.object({ categoryId: z.number().optional(), search: z.string().optional(), featuredOnly: z.boolean().optional(), adminView: z.boolean().optional() }).optional())
      .query(({ input, ctx }) => {
        const isAdmin = ctx.user?.role === "admin";
        return getProducts({
          categoryId: input?.categoryId,
          search: input?.search,
          featuredOnly: input?.featuredOnly,
          activeOnly: (input?.adminView && isAdmin) ? false : true,
        });
      }),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(({ input }) => getProductById(input.id)),
    create: adminProcedure
      .input(z.object({
        name: z.string().min(1), description: z.string().optional(), price: z.string(),
        categoryId: z.number().optional(), imageUrl: z.string().optional(),
        stock: z.number().default(0), isActive: z.boolean().default(true), isFeatured: z.boolean().default(false),
      }))
      .mutation(({ input }) => createProduct(input)),
    update: adminProcedure
      .input(z.object({
        id: z.number(), name: z.string().optional(), description: z.string().optional(),
        price: z.string().optional(), categoryId: z.number().optional().nullable(),
        imageUrl: z.string().optional().nullable(), stock: z.number().optional(),
        isActive: z.boolean().optional(), isFeatured: z.boolean().optional(),
      }))
      .mutation(({ input }) => { const { id, ...data } = input; return updateProduct(id, data as any); }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => deleteProduct(input.id)),
  }),

  cart: router({
    get: protectedProcedure.query(({ ctx }) => getCartItems(ctx.user.id)),
    addItem: protectedProcedure
      .input(z.object({ productId: z.number(), quantity: z.number().min(1).default(1) }))
      .mutation(({ input, ctx }) => upsertCartItem({ userId: ctx.user.id, productId: input.productId, quantity: input.quantity })),
    updateItem: protectedProcedure
      .input(z.object({ id: z.number(), quantity: z.number().min(0) }))
      .mutation(({ input }) => {
        if (input.quantity === 0) return removeCartItem(input.id);
        return updateCartItemQuantity(input.id, input.quantity);
      }),
    removeItem: protectedProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => removeCartItem(input.id)),
    clear: protectedProcedure.mutation(({ ctx }) => clearCart(ctx.user.id)),
  }),

  orders: router({
    myOrders: protectedProcedure.query(({ ctx }) => getOrdersByUser(ctx.user.id)),
    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input, ctx }) => {
      const order = await getOrderById(input.id);
      if (!order) throw new TRPCError({ code: "NOT_FOUND" });
      if (order.userId !== ctx.user.id && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const items = await getOrderItems(input.id);
      return { ...order, items };
    }),
    adminList: adminProcedure.query(() => getAllOrders()),
    adminGetItems: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getOrderItems(input.id)),
    updateStatus: adminProcedure
      .input(z.object({ id: z.number(), status: z.enum(["pending", "paid", "processing", "shipped", "delivered", "cancelled"]) }))
      .mutation(({ input }) => updateOrderStatus(input.id, input.status)),
  }),

  inquiry: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1, "กรุณากรอกชื่อ"),
        company: z.string().optional(),
        email: z.string().email("อีเมลไม่ถูกต้อง"),
        phone: z.string().optional(),
        productType: z.string().optional(),
        moq: z.string().optional(),
        message: z.string().min(10, "กรุณาอธิบายรายละเอียดอย่างน้อย 10 ตัวอักษร"),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        await db.insert(inquiries).values({
          name: input.name,
          company: input.company,
          email: input.email,
          phone: input.phone,
          productType: input.productType,
          moq: input.moq,
          message: input.message,
          status: "new",
        });
        await notifyOwner({
          title: `📋 ใบสอบถามการผลิตใหม่ จาก ${input.name}`,
          content: `บริษัท: ${input.company || "ไม่ระบุ"}\nอีเมล: ${input.email}\nโทร: ${input.phone || "ไม่ระบุ"}\nประเภทสินค้า: ${input.productType || "ไม่ระบุ"}\nปริมาณขั้นต่ำ: ${input.moq || "ไม่ระบุ"}\nรายละเอียด: ${input.message}`,
        }).catch(() => {});
        return { success: true };
      }),
    adminList: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(inquiries).orderBy(inquiries.createdAt);
    }),
  }),

  articles: router({
    list: publicProcedure.query(() => getPublishedArticles()),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(({ input }) => getArticleBySlug(input.slug)),
    adminList: adminProcedure.query(() => getAllArticles()),
    create: adminProcedure
      .input(z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        excerpt: z.string().optional(),
        content: z.string().min(1),
        coverImage: z.string().optional(),
        authorName: z.string().optional(),
        isPublished: z.boolean().default(false),
      }))
      .mutation(({ input }) => createArticle({
        ...input,
        publishedAt: input.isPublished ? new Date() : null,
      })),
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        slug: z.string().optional(),
        excerpt: z.string().optional(),
        content: z.string().optional(),
        coverImage: z.string().optional().nullable(),
        authorName: z.string().optional(),
        isPublished: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        const updateData: any = { ...data };
        if (data.isPublished === true) {
          const existing = await getArticleById(id);
          if (!existing?.publishedAt) updateData.publishedAt = new Date();
        }
        return updateArticle(id, updateData);
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteArticle(input.id)),
  }),

  stripe: router({
    createCheckoutSession: protectedProcedure
      .input(z.object({
        items: z.array(z.object({
          productId: z.number(), quantity: z.number(),
          name: z.string(), price: z.string(), imageUrl: z.string().optional().nullable(),
        })),
        shippingName: z.string().min(1),
        shippingAddress: z.string().min(1),
        shippingPhone: z.string().optional(),
        notes: z.string().optional(),
        origin: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        // ค่าขนส่ง: คิด 50 บาทถ้ามีสินค้า Gummy ในออเดอร์
        const hasGummy = input.items.some((item) =>
          item.name.toLowerCase().includes("gummy")
        );
        const shippingFee = hasGummy ? 50 : 0;
        const itemsTotal = input.items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
        const totalAmount = itemsTotal + shippingFee;

        const orderId = await createOrder(
          {
            userId: ctx.user.id,
            status: "pending",
            totalAmount: totalAmount.toFixed(2),
            shippingName: input.shippingName,
            shippingAddress: input.shippingAddress,
            shippingPhone: input.shippingPhone,
            notes: input.notes,
          },
          input.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtTime: item.price,
            productName: item.name,
          }))
        );

        const lineItems = input.items.map((item) => ({
          price_data: {
            currency: "thb",
            product_data: {
              name: item.name,
              images: item.imageUrl ? [item.imageUrl] : [],
            },
            unit_amount: Math.round(parseFloat(item.price) * 100),
          },
          quantity: item.quantity,
        }));

        // เพิ่มรายการค่าขนส่งถ้ามี Gummy
        if (shippingFee > 0) {
          lineItems.push({
            price_data: {
              currency: "thb",
              product_data: {
                name: "ค่าจัดส่ง",
                images: [],
              },
              unit_amount: shippingFee * 100,
            },
            quantity: 1,
          });
        }

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card", "promptpay"],
          line_items: lineItems,
          mode: "payment",
          customer_email: ctx.user.email || undefined,
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            user_id: ctx.user.id.toString(),
            order_id: orderId.toString(),
            customer_email: ctx.user.email || "",
            customer_name: ctx.user.name || "",
          },
          success_url: `${input.origin}/orders/${orderId}?success=true`,
          cancel_url: `${input.origin}/cart?cancelled=true`,
          allow_promotion_codes: true,
          phone_number_collection: { enabled: false },
        });

        const db = await getDb();
        if (db) {
          await db.update(ordersTable).set({ stripeSessionId: session.id }).where(eq(ordersTable.id, orderId));
        }

        return { url: session.url, orderId };
      }),
    verifyPayment: protectedProcedure
      .input(z.object({ orderId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const order = await getOrderById(input.orderId);
        if (!order) throw new TRPCError({ code: "NOT_FOUND" });
        if (order.userId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN" });
        // Already paid or beyond pending, no need to verify again
        if (order.status !== "pending") return { status: order.status };
        // Verify with Stripe if we have a session ID
        if (!order.stripeSessionId) return { status: order.status };
        try {
          const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId);
          if (session.payment_status === "paid") {
            await updateOrderByStripeSession(order.stripeSessionId, {
              status: "paid",
              stripePaymentIntentId: session.payment_intent as string,
            });
            // Notify owner
            const items = await getOrderItems(order.id);
            const itemsList = items.map((i) => `${i.productName} x${i.quantity} (\u0e3f${i.priceAtTime})`).join(", ");
            await notifyOwner({
              title: `\u0e04\u0e33\u0e2a\u0e31\u0e48\u0e07\u0e0b\u0e37\u0e49\u0e2d\u0e43\u0e2b\u0e21\u0e48 #${order.id}`,
              content: `\u0e25\u0e39\u0e01\u0e04\u0e49\u0e32: ${session.metadata?.customer_name || "\u0e44\u0e21\u0e48\u0e23\u0e30\u0e1a\u0e38"}\n\u0e2d\u0e35\u0e40\u0e21\u0e25: ${session.metadata?.customer_email || "\u0e44\u0e21\u0e48\u0e23\u0e30\u0e1a\u0e38"}\n\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32: ${itemsList}\n\u0e22\u0e2d\u0e14\u0e23\u0e27\u0e21: \u0e3f${order.totalAmount}\n\u0e17\u0e35\u0e48\u0e2d\u0e22\u0e39\u0e48\u0e08\u0e31\u0e14\u0e2a\u0e48\u0e07: ${order.shippingAddress || "\u0e44\u0e21\u0e48\u0e23\u0e30\u0e1a\u0e38"}`,
            }).catch(() => {});
            // Send order confirmation email to customer
            const customerEmail = session.metadata?.customer_email || session.customer_email || ctx.user.email;
            if (customerEmail) {
              await sendOrderConfirmationEmail({
                to: customerEmail,
                customerName: session.metadata?.customer_name || ctx.user.name || "\u0e25\u0e39\u0e01\u0e04\u0e49\u0e32",
                orderId: order.id,
                orderDate: new Date(order.createdAt),
                items,
                totalAmount: order.totalAmount,
                shippingName: order.shippingName || "\u0e44\u0e21\u0e48\u0e23\u0e30\u0e1a\u0e38",
                shippingAddress: order.shippingAddress || "\u0e44\u0e21\u0e48\u0e23\u0e30\u0e1a\u0e38",
                shippingPhone: order.shippingPhone || undefined,
              }).catch((err) => console.error("[Email] Failed:", err));
            }
            return { status: "paid" };
          }
        } catch (err) {
          console.error("[verifyPayment] Stripe error:", err);
        }
        return { status: order.status };
      }),
  }),

  stories: router({
    // Public: list approved stories
    list: publicProcedure.query(() => getApprovedStories()),

    // Public: submit a story (anyone can submit, admin must approve)
    submit: publicProcedure
      .input(z.object({
        authorName: z.string().min(1, "กรุณาระบุชื่อ"),
        authorTitle: z.string().optional(),
        content: z.string().min(20, "เรื่องเล่าต้องมีอย่างน้อย 20 ตัวอักษร"),
        imageUrl: z.string().url().optional().or(z.literal("")),
      }))
      .mutation(async ({ input }) => {
        const id = await createStory({
          authorName: input.authorName,
          authorTitle: input.authorTitle || null,
          content: input.content,
          imageUrl: input.imageUrl || null,
          isApproved: false,
          isFeatured: false,
        });
        await notifyOwner({
          title: "มีเรื่องเล่าใหม่รออนุมัติ",
          content: `จาก: ${input.authorName}${input.authorTitle ? ` (${input.authorTitle})` : ""}
เนื้อหา: ${input.content.slice(0, 200)}${input.content.length > 200 ? "..." : ""}`,
        }).catch(() => {});
        return { id };
      }),

    // Admin: list all stories (including unapproved)
    adminList: adminProcedure.query(() => getAllStories()),

    // Admin: approve/reject
    approve: adminProcedure
      .input(z.object({ id: z.number(), isApproved: z.boolean() }))
      .mutation(({ input }) => approveStory(input.id, input.isApproved)),

    // Admin: feature/unfeature
    feature: adminProcedure
      .input(z.object({ id: z.number(), isFeatured: z.boolean() }))
      .mutation(({ input }) => featureStory(input.id, input.isFeatured)),

    // Admin: delete
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteStory(input.id)),
  }),
});

export type AppRouter = typeof appRouter;
