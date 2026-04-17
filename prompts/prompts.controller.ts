import type { Request, Response } from 'express';
import { promptsService } from './prompts.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { AppError } from '../../utils/AppError';

function uid(req: Request): string {
  if (!req.user) throw AppError.unauthorized();
  return req.user.id;
}

export const promptsController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const prompts = await promptsService.list(uid(req), req.query as never);
    res.json({ prompts });
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    const prompt = await promptsService.get(uid(req), req.params.id);
    res.json({ prompt });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const prompt = await promptsService.update(uid(req), req.params.id, req.body);
    res.json({ prompt });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await promptsService.remove(uid(req), req.params.id);
    res.status(204).send();
  }),

  listVersions: asyncHandler(async (req: Request, res: Response) => {
    const versions = await promptsService.listVersions(uid(req), req.params.id);
    res.json({ versions });
  }),

  getVersion: asyncHandler(async (req: Request, res: Response) => {
    const version = await promptsService.getVersion(
      uid(req),
      req.params.id,
      req.params.versionId,
    );
    res.json({ version });
  }),

  createVersion: asyncHandler(async (req: Request, res: Response) => {
    const result = await promptsService.createVersion(uid(req), req.params.id, req.body);
    res.status(201).json(result);
  }),

  export: asyncHandler(async (req: Request, res: Response) => {
    const out = await promptsService.export(uid(req), req.params.id, req.query as never);
    if (!out) throw AppError.badRequest('Unsupported export format');
    res.setHeader('Content-Type', out.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${out.filename}"`);
    res.send(out.body);
  }),
};
