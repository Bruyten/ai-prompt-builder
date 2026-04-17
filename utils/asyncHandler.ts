import type { NextFunction, Request, Response } from 'express';

/**
 * Wraps an async route handler so thrown/rejected errors flow into the
 * Express error middleware instead of crashing the process.
 */
export type AsyncHandler<Req extends Request = Request> = (
  req: Req,
  res: Response,
  next: NextFunction,
) => Promise<unknown> | unknown;

export const asyncHandler =
  <Req extends Request = Request>(fn: AsyncHandler<Req>) =>
  (req: Req, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
