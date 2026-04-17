import type { Request, Response } from 'express';
import { templatesService } from './templates.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { AppError } from '../../utils/AppError';

function uid(req: Request): string {
  if (!req.user) throw AppError.unauthorized();
  return req.user.id;
}

export const templatesController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const templates = await templatesService.list(uid(req), req.query as never);
    res.json({ templates });
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    const template = await templatesService.get(uid(req), req.params.id);
    res.json({ template });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const template = await templatesService.create(uid(req), req.body);
    res.status(201).json({ template });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const template = await templatesService.update(uid(req), req.params.id, req.body);
    res.json({ template });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await templatesService.remove(uid(req), req.params.id);
    res.status(204).send();
  }),
};
