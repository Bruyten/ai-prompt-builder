import { createApp } from './app';
import { env } from './config/env';
import { disconnectPrisma, prisma } from './infrastructure/prisma';
import { logger } from './utils/logger';

async function main(): Promise<void> {
  // Fail fast if the DB is unreachable.
  await prisma.$connect();
  logger.info('✔ Connected to PostgreSQL');

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    logger.info(`✔ API listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`\n${signal} received — shutting down`);
    server.close(async () => {
      await disconnectPrisma();
      logger.info('✔ Clean shutdown');
      process.exit(0);
    });
    // Hard timeout — never hang forever.
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled rejection:', reason);
  });
  process.on('uncaughtException', (err) => {
    logger.error('Uncaught exception:', err);
    process.exit(1);
  });
}

main().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
