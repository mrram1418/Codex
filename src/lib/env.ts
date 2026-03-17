import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(16),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  STRIPE_SECRET_KEY: z.string().min(1).default("sk_test_placeholder"),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRICE_PRO: z.string().optional(),
  STRIPE_PRICE_TEAM: z.string().optional()
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success && process.env.NODE_ENV === "production") {
  throw new Error(`Invalid environment variables: ${parsed.error.message}`);
}

export const env = parsed.success ? parsed.data : process.env;
