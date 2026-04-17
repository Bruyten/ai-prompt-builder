import type { RequestHandler } from 'express';
import { ZodError, type ZodTypeAny, z } from 'zod';

type Source = 'body' | 'query' | 'params';

/**
 * Validate one part of the request against a Zod schema.
 * Replaces `req[source]` with the parsed (typed, defaulted) value.
 */
export const validate =
  (schema: ZodTypeAny, source: Source = 'body'): RequestHandler =>
  (req, _res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      // Express's Request type marks query/params as readonly; cast intentionally.
      (req as unknown as Record<string, unknown>)[source] = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) return next(err);
      next(err);
    }
  };

/** Convenience helpers when you want to validate multiple sources at once. */
export const validateAll =
  (schemas: { body?: ZodTypeAny; query?: ZodTypeAny; params?: ZodTypeAny }): RequestHandler =>
  (req, _res, next) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.query)
        (req as unknown as Record<string, unknown>).query = schemas.query.parse(req.query);
      if (schemas.params)
        (req as unknown as Record<string, unknown>).params = schemas.params.parse(req.params);
      next();
    } catch (err) {
      next(err);
    }
  };

export const idParamSchema = z.object({ id: z.string().min(1) });
