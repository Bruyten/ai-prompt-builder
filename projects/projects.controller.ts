import type { Request, Response } from 'express';
import { projectsService } from './projects.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { AppError } from '../../utils/AppError';

function uid(req: Request): string {
  if (!req.user) throw AppError.unauthorized();
  return req.user.id;
}

export const projectsController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const projects = await projectsService.list(uid(req), req.query as never);
    res.json({ projects });
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    const project = await projectsService.get(uid(req), req.params.id);
    res.json({ project });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const project = await projectsService.create(uid(req), req.body);
    res.status(201).json({ project });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const project = await projectsService.update(uid(req), req.params.id, req.body);
    res.json({ project });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await projectsService.remove(uid(req), req.params.id);
    res.status(204).send();
  }),
};
