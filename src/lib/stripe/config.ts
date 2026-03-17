import Stripe from "stripe";
import { env } from "@/lib/env";

export const stripe = new Stripe(String(env.STRIPE_SECRET_KEY ?? "sk_test_placeholder"), {
  apiVersion: "2024-06-20"
});

export const PRICE_IDS = {
  PRO: String(env.STRIPE_PRICE_PRO ?? "price_pro_placeholder"),
  TEAM: String(env.STRIPE_PRICE_TEAM ?? "price_team_placeholder")
};
