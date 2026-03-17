const bucket = new Map<string, { count: number; resetAt: number }>();

export function sanitizeText(input: string) {
  return input.replace(/[<>]/g, "").trim();
}

export function enforceRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const entry = bucket.get(key);

  if (!entry || entry.resetAt < now) {
    bucket.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, retryAfterMs: entry.resetAt - now };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count };
}
