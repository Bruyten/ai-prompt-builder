import { Prisma, TemplateVisibility } from '@prisma/client';
import { prisma } from '../../infrastructure/prisma';
import { AppError } from '../../utils/AppError';
import type {
  CreateTemplateInput,
  ListTemplatesQuery,
  UpdateTemplateInput,
} from './templates.schema';

class TemplatesService {
  list(userId: string, query: ListTemplatesQuery) {
    const filters: Prisma.TemplateWhereInput[] = [];

    switch (query.scope) {
      case 'mine':
        filters.push({ userId });
        break;
      case 'public':
        filters.push({ visibility: TemplateVisibility.PUBLIC });
        break;
      case 'all':
      default:
        filters.push({
          OR: [{ userId }, { visibility: TemplateVisibility.PUBLIC }],
        });
    }

    if (query.promptType) filters.push({ promptType: query.promptType });
    if (query.tag) filters.push({ tags: { has: query.tag } });
    if (query.search) {
      filters.push({
        OR: [
          { name: { contains: query.search, mode: 'insensitive' } },
          { description: { contains: query.search, mode: 'insensitive' } },
        ],
      });
    }

    return prisma.template.findMany({
      where: { AND: filters },
      orderBy: [{ usageCount: 'desc' }, { updatedAt: 'desc' }],
    });
  }

  async get(userId: string, id: string) {
    const tpl = await prisma.template.findUnique({ where: { id } });
    if (!tpl) throw AppError.notFound('Template');
    if (tpl.visibility === TemplateVisibility.PRIVATE && tpl.userId !== userId) {
      throw AppError.forbidden('You cannot view this template');
    }
    return tpl;
  }

  create(userId: string, input: CreateTemplateInput) {
    return prisma.template.create({
      data: {
        userId,
        name: input.name,
        description: input.description,
        promptType: input.promptType,
        answers: input.answers as Prisma.InputJsonValue,
        exampleText: input.exampleText,
        tags: input.tags,
        visibility: input.visibility,
      },
    });
  }

  async update(userId: string, id: string, input: UpdateTemplateInput) {
    await this.assertOwnership(userId, id);
    const data: Prisma.TemplateUpdateInput = {
      name: input.name,
      description: input.description,
      promptType: input.promptType,
      exampleText: input.exampleText,
      tags: input.tags,
      visibility: input.visibility,
    };
    if (input.answers !== undefined) {
      data.answers = input.answers as Prisma.InputJsonValue;
    }
    return prisma.template.update({ where: { id }, data });
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.assertOwnership(userId, id);
    await prisma.template.delete({ where: { id } });
  }

  /** Increment usage counter when a user instantiates a template. */
  async recordUse(id: string): Promise<void> {
    await prisma.template.update({
      where: { id },
      data: { usageCount: { increment: 1 } },
    });
  }

  private async assertOwnership(userId: string, id: string): Promise<void> {
    const tpl = await prisma.template.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (!tpl) throw AppError.notFound('Template');
    if (tpl.userId !== userId) {
      throw AppError.forbidden('You cannot modify this template');
    }
  }
}

export const templatesService = new TemplatesService();
