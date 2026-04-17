import { prisma } from '../../infrastructure/prisma';
import { AppError } from '../../utils/AppError';
import type {
  CreateProjectInput,
  ListProjectsQuery,
  UpdateProjectInput,
} from './projects.schema';

class ProjectsService {
  list(userId: string, query: ListProjectsQuery) {
    return prisma.project.findMany({
      where: {
        userId,
        archived: query.archived,
        ...(query.search
          ? {
              OR: [
                { name: { contains: query.search, mode: 'insensitive' } },
                { description: { contains: query.search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: [{ archived: 'asc' }, { updatedAt: 'desc' }],
      include: {
        _count: { select: { prompts: true, sessions: true } },
      },
    });
  }

  async get(userId: string, id: string) {
    const project = await prisma.project.findFirst({
      where: { id, userId },
      include: {
        _count: { select: { prompts: true, sessions: true } },
      },
    });
    if (!project) throw AppError.notFound('Project');
    return project;
  }

  create(userId: string, input: CreateProjectInput) {
    return prisma.project.create({
      data: {
        userId,
        name: input.name,
        description: input.description,
        color: input.color,
      },
    });
  }

  async update(userId: string, id: string, input: UpdateProjectInput) {
    await this.assertOwnership(userId, id);
    return prisma.project.update({ where: { id }, data: input });
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.assertOwnership(userId, id);
    await prisma.project.delete({ where: { id } });
  }

  private async assertOwnership(userId: string, id: string): Promise<void> {
    const found = await prisma.project.findFirst({
      where: { id, userId },
      select: { id: true },
    });
    if (!found) throw AppError.notFound('Project');
  }
}

export const projectsService = new ProjectsService();
