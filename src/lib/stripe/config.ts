import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder", {
  apiVersion: "2024-06-20"
});

export const PRICE_IDS = {
  PRO: process.env.STRIPE_PRICE_PRO ?? "price_pro_placeholder",
  TEAM: process.env.STRIPE_PRICE_TEAM ?? "price_team_placeholder"
};
