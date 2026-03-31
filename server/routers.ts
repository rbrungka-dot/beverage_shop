import Stripe from "stripe";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { notifyOwner } from "./_core/notification";
import {
  getCategories, createCategory, updateCategory, deleteCategory,
  getProducts, getProductById, createProduct, updateProduct, deleteProduct,
  getCartItems, upsertCartItem, updateCartItemQuantity, removeCartItem, clearCart,
  createOrder, getOrdersByUser, getAllOrders, getOrderById, getOrderItems, updateOrderStatus,
  updateOrderByStripeSession, getOrderByStripeSession, getDb,
} from "./db";
import { orders as ordersTable } from "../drizzle/schema";
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
    updateStatus: adminProcedure
      .input(z.object({ id: z.number(), status: z.enum(["pending", "paid", "processing", "shipped", "delivered", "cancelled"]) }))
      .mutation(({ input }) => updateOrderStatus(input.id, input.status)),
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
        const totalAmount = input.items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);

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

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: input.items.map((item) => ({
            price_data: {
              currency: "thb",
              product_data: {
                name: item.name,
                images: item.imageUrl ? [item.imageUrl] : [],
              },
              unit_amount: Math.round(parseFloat(item.price) * 100),
            },
            quantity: item.quantity,
          })),
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
  }),
});

export type AppRouter = typeof appRouter;
