import { PrismaClient } from '@prisma/client';
import { isProd } from '../config/env';

/**
 * Singleton PrismaClient.
 *
 * In development, the dev server (tsx watch) reloads the module on every
 * file change, which would otherwise leak Postgres connections. We stash
 * the client on `globalThis` to survive HMR.
 */
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  global.__prisma ??
  new PrismaClient({
    log: isProd ? ['error'] : ['warn', 'error'],
  });

if (!isProd) {
  global.__prisma = prisma;
}

export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
}
