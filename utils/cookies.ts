import type { CookieOptions, Response } from 'express';
import { env, isProd } from '../config/env';
import { ttlToMs } from './jwt';

export const REFRESH_COOKIE_NAME = 'apb_refresh';

function baseCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE || isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/api/auth',
    domain: env.COOKIE_DOMAIN,
  };
}

export function setRefreshCookie(res: Response, token: string): void {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    ...baseCookieOptions(),
    maxAge: ttlToMs(env.JWT_REFRESH_TTL),
  });
}

export function clearRefreshCookie(res: Response): void {
  res.clearCookie(REFRESH_COOKIE_NAME, baseCookieOptions());
}
