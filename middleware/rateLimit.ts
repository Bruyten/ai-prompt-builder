import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

/** Global limiter — applied to all /api routes. */
export const globalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    error: { code: 'RATE_LIMITED', message: 'Too many requests, slow down.' },
  },
});

/** Stricter limiter for auth endpoints (login, register, refresh). */
export const authLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.AUTH_RATE_LIMIT_MAX,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  // Keyed by IP by default; you could combine with email for stronger guarantees.
  message: {
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many authentication attempts. Try again later.',
    },
  },
});
