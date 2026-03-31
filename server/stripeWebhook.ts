import express from "express";
import Stripe from "stripe";
import { updateOrderByStripeSession, getOrderByStripeSession, getOrderItems } from "./db";
import { notifyOwner } from "./_core/notification";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2026-03-25.dahlia" });

export const stripeWebhookRouter = express.Router();

stripeWebhookRouter.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || "");
    } catch (err: any) {
      console.error("[Webhook] Signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle test events
    if (event.id.startsWith("evt_test_")) {
      console.log("[Webhook] Test event detected, returning verification response");
      return res.json({ verified: true });
    }

    console.log(`[Webhook] Event: ${event.type} | ID: ${event.id}`);

    try {
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = parseInt(session.metadata?.order_id || "0");

        await updateOrderByStripeSession(session.id, {
          status: "paid",
          stripePaymentIntentId: session.payment_intent as string,
        });

        // Notify owner about new order
        const order = await getOrderByStripeSession(session.id);
        if (order) {
          const items = await getOrderItems(order.id);
          const itemsList = items.map((i) => `${i.productName} x${i.quantity} (฿${i.priceAtTime})`).join(", ");
          await notifyOwner({
            title: `คำสั่งซื้อใหม่ #${order.id}`,
            content: `ลูกค้า: ${session.metadata?.customer_name || "ไม่ระบุ"}\nอีเมล: ${session.metadata?.customer_email || "ไม่ระบุ"}\nสินค้า: ${itemsList}\nยอดรวม: ฿${order.totalAmount}\nที่อยู่จัดส่ง: ${order.shippingAddress || "ไม่ระบุ"}`,
          });
        }
      } else if (event.type === "checkout.session.expired") {
        const session = event.data.object as Stripe.Checkout.Session;
        await updateOrderByStripeSession(session.id, { status: "cancelled" });
      }
    } catch (err) {
      console.error("[Webhook] Error processing event:", err);
    }

    res.json({ received: true });
  }
);
