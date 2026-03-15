import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { stripe, PRICE_IDS } from "@/lib/stripe/config";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { plan } = (await req.json()) as { plan: "PRO" | "TEAM" };
  const price = PRICE_IDS[plan];

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=1`,
    metadata: { userId: session.user.id }
  });

  return NextResponse.json({ url: checkout.url });
}
