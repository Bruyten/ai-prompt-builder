import { Prisma, SessionStatus } from '@prisma/client';
import { prisma } from '../../infrastructure/prisma';
import { AppError } from '../../utils/AppError';
import { generatePrompt } from '../../core/prompt-engine';
import { scorePrompt } from '../../core/scoring';
import { templatesService } from '../templates/templates.service';
import type {
  CompleteSessionInput,
  CreateSessionInput,
  PreviewInput,
  UpdateSessionInput,
} from './sessions.schema';

class SessionsService {
  /** Start a new questionnaire run, optionally pre-filled from a template. */
  async create(userId: string, input: CreateSessionInput) {
    let promptType = input.promptType;
    let answers: Record<string, unknown> = input.answers ?? {};

    if (input.templateId) {
      const tpl = await templatesService.get(userId, input.templateId);
      promptType = tpl.promptType;
      answers = { ...(tpl.answers as Record<string, unknown>), ...answers };
      await templatesService.recordUse(tpl.id);
    }

    if (input.projectId) await assertProject(userId, input.projectId);

    return prisma.promptSession.create({
      data: {
        userId,
        projectId: input.projectId,
        promptType,
        answers: answers as Prisma.InputJsonValue,
      },
    });
  }

  list(userId: string) {
    return prisma.promptSession.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 50,
    });
  }

  async get(userId: string, id: string) {
    const session = await prisma.promptSession.findFirst({ where: { id, userId } });
    if (!session) throw AppError.notFound('Session');
    return session;
  }

  /** Patch answers / step / status. Used as the user advances the wizard. */
  async update(userId: string, id: string, input: UpdateSessionInput) {
    const existing = await this.get(userId, id);
    if (existing.status === SessionStatus.COMPLETED) {
      throw AppError.badRequest('Cannot modify a completed session');
    }
    if (input.projectId) await assertProject(userId, input.projectId);

    const data: Prisma.PromptSessionUpdateInput = {};
    if (input.answers !== undefined) {
      data.answers = input.answers as Prisma.InputJsonValue;
    }
    if (input.currentStep !== undefined) data.currentStep = input.currentStep;
    if (input.status !== undefined) data.status = input.status;
    if (input.projectId !== undefined) {
      data.project = input.projectId
        ? { connect: { id: input.projectId } }
        : { disconnect: true };
    }

    return prisma.promptSession.update({ where: { id }, data });
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.get(userId, id);
    await prisma.promptSession.delete({ where: { id } });
  }

  /**
   * Finalize a session: generate the prompt, create a Prompt + first
   * PromptVersion, link them, mark the session complete.
   */
  async complete(userId: string, id: string, input: CompleteSessionInput) {
    const session = await this.get(userId, id);
    if (session.status === SessionStatus.COMPLETED) {
      throw AppError.badRequest('Session already completed');
    }

    const projectId = input.projectId === undefined ? session.projectId : input.projectId;
    if (projectId) await assertProject(userId, projectId);

    const generated = generatePrompt({
      promptType: session.promptType,
      answers: session.answers as Record<string, unknown>,
    });
    const score = scorePrompt(generated.text);

    return prisma.$transaction(async (tx) => {
      const prompt = await tx.prompt.create({
        data: {
          userId,
          projectId,
          title: input.title,
          promptType: session.promptType,
          currentText: generated.text,
          score: score.total,
          versions: {
            create: {
              version: 1,
              text: generated.text,
              scoreTotal: score.total,
              scoreData: score.breakdown as unknown as Prisma.InputJsonValue,
              answers: session.answers as Prisma.InputJsonValue,
            },
          },
        },
        include: { versions: true },
      });

      await tx.promptSession.update({
        where: { id: session.id },
        data: {
          status: SessionStatus.COMPLETED,
          completedAt: new Date(),
          resultPromptId: prompt.id,
          projectId,
        },
      });

      return { prompt, generated, score };
    });
  }

  /** Stateless preview — no DB writes. Drives live preview in the wizard. */
  preview(input: PreviewInput) {
    const generated = generatePrompt({
      promptType: input.promptType,
      answers: input.answers,
    });
    const score = scorePrompt(generated.text);
    return { text: generated.text, sectionsUsed: generated.sectionsUsed, score };
  }
}

async function assertProject(userId: string, projectId: string): Promise<void> {
  const found = await prisma.project.findFirst({
    where: { id: projectId, userId },
    select: { id: true },
  });
  if (!found) throw AppError.notFound('Project');
}

export const sessionsService = new SessionsService();
