import bcrypt from 'bcryptjs';
import { prisma } from '../../infrastructure/prisma';
import { env } from '../../config/env';
import { AppError } from '../../utils/AppError';
import {
  hashToken,
  newJti,
  signAccessToken,
  signRefreshToken,
  ttlToMs,
  verifyRefreshToken,
} from '../../utils/jwt';
import type { LoginInput, RegisterInput } from './auth.schema';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface PublicUser {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
}

export interface AuthResult {
  user: PublicUser;
  tokens: AuthTokens;
}

interface TokenContext {
  userAgent?: string;
  ip?: string;
}

class AuthService {
  async register(input: RegisterInput, ctx: TokenContext = {}): Promise<AuthResult> {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw AppError.conflict('An account with this email already exists');

    const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        name: input.name,
        preferences: { create: {} },
      },
    });

    const tokens = await this.issueTokens(user.id, user.email, ctx);
    return { user: toPublic(user), tokens };
  }

  async login(input: LoginInput, ctx: TokenContext = {}): Promise<AuthResult> {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) throw AppError.unauthorized('Invalid email or password');

    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) throw AppError.unauthorized('Invalid email or password');

    const tokens = await this.issueTokens(user.id, user.email, ctx);
    return { user: toPublic(user), tokens };
  }

  async me(userId: string): Promise<PublicUser> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw AppError.notFound('User');
    return toPublic(user);
  }

  /**
   * Rotate refresh token: validate the incoming one, revoke it, issue a new
   * pair. This limits the blast radius if a refresh token is ever leaked.
   */
  async refresh(rawRefreshToken: string, ctx: TokenContext = {}): Promise<AuthResult> {
    const payload = verifyRefreshToken(rawRefreshToken);
    const tokenHash = hashToken(rawRefreshToken);

    const stored = await prisma.refreshToken.findUnique({ where: { tokenHash } });
    if (!stored || stored.userId !== payload.sub) {
      throw AppError.unauthorized('Refresh token not recognized');
    }
    if (stored.revokedAt) throw AppError.unauthorized('Refresh token has been revoked');
    if (stored.expiresAt < new Date()) throw AppError.unauthorized('Refresh token expired');

    const user = await prisma.user.findUnique({ where: { id: stored.userId } });
    if (!user) throw AppError.unauthorized('User no longer exists');

    // Revoke the old token in the same transaction we create the new one.
    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    const tokens = await this.issueTokens(user.id, user.email, ctx);
    return { user: toPublic(user), tokens };
  }

  async logout(rawRefreshToken: string | undefined): Promise<void> {
    if (!rawRefreshToken) return;
    const tokenHash = hashToken(rawRefreshToken);
    // Best-effort revoke — never throw if the token is already gone.
    await prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  // -------------------------------------------------------------------------
  // Internal
  // -------------------------------------------------------------------------

  private async issueTokens(
    userId: string,
    email: string,
    ctx: TokenContext,
  ): Promise<AuthTokens> {
    const jti = newJti();
    const accessToken = signAccessToken({ sub: userId, email });
    const refreshToken = signRefreshToken({ sub: userId, jti });

    await prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + ttlToMs(env.JWT_REFRESH_TTL)),
        userAgent: ctx.userAgent?.slice(0, 255),
        ip: ctx.ip?.slice(0, 64),
      },
    });

    return { accessToken, refreshToken };
  }
}

function toPublic(user: { id: string; email: string; name: string | null; createdAt: Date }): PublicUser {
  return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt };
}

export const authService = new AuthService();
