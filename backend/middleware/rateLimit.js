const createRateLimiter = ({ windowMs, max, message }) => {
  const hits = new Map();

  return (req, res, next) => {
    const forwardedFor = req.headers["x-forwarded-for"];
    const forwardedIp = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : forwardedFor?.split(",")[0]?.trim();
    const clientKey = req.user?.id || forwardedIp || req.ip || "anonymous";
    const now = Date.now();
    const bucket = hits.get(clientKey);

    if (!bucket || bucket.resetAt <= now) {
      hits.set(clientKey, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (bucket.count >= max) {
      return res.status(429).json({ success: false, message });
    }

    bucket.count += 1;
    next();
  };
};

export const authRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many auth attempts. Please try again in a few minutes.",
});

export const checkoutRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many checkout requests. Please slow down and try again.",
});

