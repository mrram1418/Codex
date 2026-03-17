import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/config";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !secret) return NextResponse.json({ error: "Webhook config missing." }, { status: 400 });

  try {
    const event = stripe.webhooks.constructEvent(body, signature, secret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      if (userId) {
        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            plan: "PRO",
            stripeCustomerId: String(session.customer ?? ""),
            stripeSubscriptionId: String(session.subscription ?? "")
          },
          update: {
            plan: "PRO",
            stripeCustomerId: String(session.customer ?? ""),
            stripeSubscriptionId: String(session.subscription ?? "")
          }
        });
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: { plan: "FREE", stripePriceId: null, cancelAtPeriodEnd: true }
      });
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
}
