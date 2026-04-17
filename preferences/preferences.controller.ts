import type { Request, Response } from 'express';
import { preferencesService } from './preferences.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { AppError } from '../../utils/AppError';

function uid(req: Request): string {
  if (!req.user) throw AppError.unauthorized();
  return req.user.id;
}

export const preferencesController = {
  get: asyncHandler(async (req: Request, res: Response) => {
    const preferences = await preferencesService.get(uid(req));
    res.json({ preferences });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const preferences = await preferencesService.update(uid(req), req.body);
    res.json({ preferences });
  }),
};
