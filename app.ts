import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env, isProd, isTest } from './config/env';
import apiRouter from './routes';
import { errorHandler, notFoundHandler } from './middleware/error';
import { globalLimiter } from './middleware/rateLimit';

export function createApp(): Express {
  const app = express();

  // Behind Render's load balancer — required for correct req.ip + secure cookies.
  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        // Allow same-origin / curl / server-to-server requests with no Origin header.
        if (!origin) return callback(null, true);
        if (env.CORS_ORIGINS.includes(origin)) return callback(null, true);
        return callback(new Error(`Origin ${origin} not allowed by CORS`));
      },
      credentials: true,
    }),
  );

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cookieParser());

  if (!isTest) {
    app.use(morgan(isProd ? 'combined' : 'dev'));
  }

  app.get('/', (_req, res) => {
    res.json({
      name: 'AI Prompt Builder API',
      version: '1.0.0',
      docs: '/api/health',
    });
  });

  app.use('/api', globalLimiter, apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
