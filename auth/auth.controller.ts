import type { Request, Response } from 'express';
import { authService } from './auth.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { AppError } from '../../utils/AppError';
import { REFRESH_COOKIE_NAME, clearRefreshCookie, setRefreshCookie } from '../../utils/cookies';

function ctxFromReq(req: Request) {
  return {
    userAgent: req.headers['user-agent'],
    ip: req.ip,
  };
}

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const { user, tokens } = await authService.register(req.body, ctxFromReq(req));
    setRefreshCookie(res, tokens.refreshToken);
    res.status(201).json({ user, accessToken: tokens.accessToken });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { user, tokens } = await authService.login(req.body, ctxFromReq(req));
    setRefreshCookie(res, tokens.refreshToken);
    res.json({ user, accessToken: tokens.accessToken });
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const raw = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
    if (!raw) throw AppError.unauthorized('No refresh token provided');
    const { user, tokens } = await authService.refresh(raw, ctxFromReq(req));
    setRefreshCookie(res, tokens.refreshToken);
    res.json({ user, accessToken: tokens.accessToken });
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    const raw = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
    await authService.logout(raw);
    clearRefreshCookie(res);
    res.status(204).send();
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    const user = await authService.me(req.user.id);
    res.json({ user });
  }),
};
