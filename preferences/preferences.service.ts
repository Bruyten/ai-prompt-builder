import { prisma } from '../../infrastructure/prisma';
import type { UpdatePreferencesInput } from './preferences.schema';

class PreferencesService {
  async get(userId: string) {
    return prisma.userPreferences.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
  }

  async update(userId: string, input: UpdatePreferencesInput) {
    return prisma.userPreferences.upsert({
      where: { userId },
      update: input,
      create: { userId, ...input },
    });
  }
}

export const preferencesService = new PreferencesService();
