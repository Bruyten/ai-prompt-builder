import type { Request, Response } from 'express';
import { sessionsService } from './sessions.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { AppError } from '../../utils/AppError';

function uid(req: Request): string {
  if (!req.user) throw AppError.unauthorized();
  return req.user.id;
}

export const sessionsController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const sessions = await sessionsService.list(uid(req));
    res.json({ sessions });
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    const session = await sessionsService.get(uid(req), req.params.id);
    res.json({ session });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const session = await sessionsService.create(uid(req), req.body);
    res.status(201).json({ session });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const session = await sessionsService.update(uid(req), req.params.id, req.body);
    res.json({ session });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await sessionsService.remove(uid(req), req.params.id);
    res.status(204).send();
  }),

  complete: asyncHandler(async (req: Request, res: Response) => {
    const result = await sessionsService.complete(uid(req), req.params.id, req.body);
    res.status(201).json(result);
  }),

  preview: asyncHandler(async (req: Request, res: Response) => {
    const result = sessionsService.preview(req.body);
    res.json(result);
  }),
};
