/**
 * Tiny logger wrapper. Swap with pino/winston later if needed without
 * touching call sites.
 */
/* eslint-disable no-console */
export const logger = {
  info: (...args: unknown[]) => console.log('[info]', ...args),
  warn: (...args: unknown[]) => console.warn('[warn]', ...args),
  error: (...args: unknown[]) => console.error('[error]', ...args),
  debug: (...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') console.debug('[debug]', ...args);
  },
};
