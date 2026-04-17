import type { ErrorRequestHandler, RequestHandler } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';
import { isProd } from '../config/env';
import { logger } from '../utils/logger';

/** 404 fallthrough — must be registered after all routes. */
export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.originalUrl} not found`,
    },
  });
};

/**
 * Centralized error handler. Maps known error types into a consistent
 * `{ error: { code, message, details? } }` envelope.
 */
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: { code: err.code, message: err.message, details: err.details },
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request payload',
        details: err.flatten(),
      },
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002 unique constraint, P2025 record not found
    if (err.code === 'P2002') {
      res.status(409).json({
        error: {
          code: 'CONFLICT',
          message: 'A record with these values already exists',
          details: { target: err.meta?.target },
        },
      });
      return;
    }
    if (err.code === 'P2025') {
      res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Record not found' },
      });
      return;
    }
    res.status(400).json({
      error: { code: `PRISMA_${err.code}`, message: err.message },
    });
    return;
  }

  // Unknown/unexpected error — never leak details in production.
  logger.error('Unhandled error:', err);
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: isProd ? 'Internal server error' : (err as Error)?.message ?? 'Unknown error',
      ...(isProd ? {} : { stack: (err as Error)?.stack }),
    },
  });
};
