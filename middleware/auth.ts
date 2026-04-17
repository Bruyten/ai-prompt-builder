import type { Request, RequestHandler } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';

export interface AuthUser {
  id: string;
  email: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

/**
 * Require a valid access token in the `Authorization: Bearer <token>` header.
 * Populates `req.user`.
 */
export const requireAuth: RequestHandler = (req, _res, next) => {
  const token = extractBearer(req);
  if (!token) return next(AppError.unauthorized('Missing access token'));
  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch (err) {
    next(err);
  }
};

/** Like requireAuth but never throws — useful for routes that branch on auth. */
export const optionalAuth: RequestHandler = (req, _res, next) => {
  const token = extractBearer(req);
  if (!token) return next();
  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, email: payload.email };
  } catch {
    /* ignore — treat as anonymous */
  }
  next();
};

function extractBearer(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header) return null;
  const [scheme, token] = header.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null;
  return token;
}
