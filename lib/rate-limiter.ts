interface RateLimitRecord {
  timestamps: number[]
}

const cache = new Map<string, RateLimitRecord>()

// Clean up old entries every 5 minutes to prevent memory leaks
if (typeof globalThis !== 'undefined') {
  const g = globalThis as any
  if (!g.rateLimitInterval) {
    g.rateLimitInterval = setInterval(() => {
      const now = Date.now()
      for (const [key, record] of cache.entries()) {
        record.timestamps = record.timestamps.filter(t => now - t < 30 * 60 * 1000)
        if (record.timestamps.length === 0) {
          cache.delete(key)
        }
      }
    }, 5 * 60 * 1000)
    
    if (g.rateLimitInterval.unref) {
      g.rateLimitInterval.unref()
    }
  }
}

export function isRateLimited(options: {
  key: string
  limit: number
  windowMs: number
}): { limited: boolean; remaining: number; resetMs: number } {
  const now = Date.now()
  const { key, limit, windowMs } = options

  let record = cache.get(key)
  if (!record) {
    record = { timestamps: [] }
    cache.set(key, record)
  }

  // Keep only timestamps within the sliding window
  record.timestamps = record.timestamps.filter(t => now - t < windowMs)

  if (record.timestamps.length >= limit) {
    const oldestInWindow = record.timestamps[0]
    const resetMs = oldestInWindow + windowMs - now
    return {
      limited: true,
      remaining: 0,
      resetMs: Math.max(0, resetMs)
    }
  }

  record.timestamps.push(now)
  
  return {
    limited: false,
    remaining: limit - record.timestamps.length,
    resetMs: windowMs
  }
}

export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for")
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim()
  }
  const realIp = req.headers.get("x-real-ip")
  if (realIp) return realIp
  return "127.0.0.1"
}
