import { Prisma } from '@prisma/client';
import { prisma } from '../../infrastructure/prisma';
import { AppError } from '../../utils/AppError';
import { scorePrompt } from '../../core/scoring';
import type {
  CreateVersionInput,
  ExportQuery,
  ListPromptsQuery,
  UpdatePromptInput,
} from './prompts.schema';

class PromptsService {
  list(userId: string, query: ListPromptsQuery) {
    return prisma.prompt.findMany({
      where: {
        userId,
        projectId: query.projectId,
        promptType: query.promptType,
        pinned: query.pinned,
        ...(query.search
          ? {
              OR: [
                { title: { contains: query.search, mode: 'insensitive' } },
                { currentText: { contains: query.search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: [{ pinned: 'desc' }, { updatedAt: 'desc' }],
      include: { _count: { select: { versions: true } } },
    });
  }

  async get(userId: string, id: string) {
    const prompt = await prisma.prompt.findFirst({
      where: { id, userId },
      include: {
        versions: { orderBy: { version: 'desc' } },
        project: { select: { id: true, name: true, color: true } },
      },
    });
    if (!prompt) throw AppError.notFound('Prompt');
    return prompt;
  }

  async update(userId: string, id: string, input: UpdatePromptInput) {
    await this.assertOwnership(userId, id);

    const data: Prisma.PromptUpdateInput = {};
    if (input.title !== undefined) data.title = input.title;
    if (input.pinned !== undefined) data.pinned = input.pinned;

    if (input.projectId !== undefined) {
      if (input.projectId === null) {
        data.project = { disconnect: true };
      } else {
        const project = await prisma.project.findFirst({
          where: { id: input.projectId, userId },
          select: { id: true },
        });
        if (!project) throw AppError.notFound('Project');
        data.project = { connect: { id: input.projectId } };
      }
    }

    return prisma.prompt.update({ where: { id }, data });
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.assertOwnership(userId, id);
    await prisma.prompt.delete({ where: { id } });
  }

  /**
   * Create a new immutable version. Becomes the active version, updating
   * the prompt's denormalized currentText + score.
   */
  async createVersion(userId: string, promptId: string, input: CreateVersionInput) {
    const prompt = await this.get(userId, promptId);
    const nextVersion = (prompt.versions[0]?.version ?? 0) + 1;
    const score = scorePrompt(input.text);

    return prisma.$transaction(async (tx) => {
      const version = await tx.promptVersion.create({
        data: {
          promptId,
          version: nextVersion,
          text: input.text,
          scoreTotal: score.total,
          scoreData: score.breakdown as unknown as Prisma.InputJsonValue,
          notes: input.notes,
        },
      });

      const updated = await tx.prompt.update({
        where: { id: promptId },
        data: {
          currentText: input.text,
          score: score.total,
        },
      });

      return { prompt: updated, version, score };
    });
  }

  async listVersions(userId: string, promptId: string) {
    await this.assertOwnership(userId, promptId);
    return prisma.promptVersion.findMany({
      where: { promptId },
      orderBy: { version: 'desc' },
    });
  }

  async getVersion(userId: string, promptId: string, versionId: string) {
    await this.assertOwnership(userId, promptId);
    const version = await prisma.promptVersion.findFirst({
      where: { id: versionId, promptId },
    });
    if (!version) throw AppError.notFound('Version');
    return version;
  }

  /**
   * Build an export payload (string + content-type + suggested filename).
   * The route layer is responsible for setting headers and sending it.
   */
  async export(userId: string, promptId: string, query: ExportQuery) {
    const prompt = await this.get(userId, promptId);
    const target = query.versionId
      ? prompt.versions.find((v) => v.id === query.versionId)
      : prompt.versions[0];
    if (!target) throw AppError.notFound('Version');

    const safeName = prompt.title.replace(/[^a-z0-9-_]+/gi, '_').slice(0, 60) || 'prompt';

    switch (query.format) {
      case 'txt':
        return {
          contentType: 'text/plain; charset=utf-8',
          filename: `${safeName}.txt`,
          body: target.text,
        };
      case 'md':
        return {
          contentType: 'text/markdown; charset=utf-8',
          filename: `${safeName}.md`,
          body: buildMarkdownExport(prompt, target),
        };
      case 'json':
        return {
          contentType: 'application/json; charset=utf-8',
          filename: `${safeName}.json`,
          body: JSON.stringify(
            {
              id: prompt.id,
              title: prompt.title,
              promptType: prompt.promptType,
              version: target.version,
              text: target.text,
              score: target.scoreTotal,
              scoreBreakdown: target.scoreData,
              createdAt: target.createdAt,
            },
            null,
            2,
          ),
        };
    }
  }

  private async assertOwnership(userId: string, id: string): Promise<void> {
    const found = await prisma.prompt.findFirst({
      where: { id, userId },
      select: { id: true },
    });
    if (!found) throw AppError.notFound('Prompt');
  }
}

function buildMarkdownExport(
  prompt: { title: string; promptType: string },
  version: { version: number; text: string; scoreTotal: number; createdAt: Date },
): string {
  return [
    `# ${prompt.title}`,
    '',
    `> Type: **${prompt.promptType}** · Version: **v${version.version}** · ` +
      `Score: **${version.scoreTotal}/100** · ${version.createdAt.toISOString()}`,
    '',
    '---',
    '',
    version.text,
    '',
  ].join('\n');
}

export const promptsService = new PromptsService();
