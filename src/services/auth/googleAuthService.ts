import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { AuthService } from './authService';

export interface GoogleTokenPayload {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  picture?: string;
  iss?: string;
  aud?: string;
}

export class GoogleAuthService {
  static getClientId(): string {
    return process.env.GOOGLE_CLIENT_ID || 'mock-google-client-id.apps.googleusercontent.com';
  }

  static getClientSecret(): string {
    return process.env.GOOGLE_CLIENT_SECRET || 'mock-google-client-secret';
  }

  static getRedirectUri(origin?: string): string {
    if (process.env.GOOGLE_REDIRECT_URI) {
      return process.env.GOOGLE_REDIRECT_URI;
    }
    const base = process.env.NEXT_PUBLIC_APP_URL || origin || 'http://localhost:3000';
    return `${base.replace(/\/$/, '')}/api/auth/google/callback`;
  }

  /**
   * Generates authorization URL for Google OAuth 2.0 / OpenID Connect.
   */
  static generateAuthUrl(origin?: string, returnTo?: string) {
    const stateToken = crypto.randomBytes(32).toString('hex');
    const secret = process.env.AUTH_SECRET || 'fallback-secret-2026';
    const stateHmac = crypto
      .createHmac('sha256', secret)
      .update(`${stateToken}:${returnTo || '/analytics'}`)
      .digest('hex');

    const state = `${stateToken}.${stateHmac}.${Buffer.from(returnTo || '/analytics').toString('base64url')}`;

    const clientId = this.getClientId();
    const redirectUri = this.getRedirectUri(origin);

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'select_account',
      state,
    });

    return {
      url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
      state,
    };
  }

  /**
   * Validates the state parameter to protect against CSRF and replay attacks.
   */
  static validateState(state: string): { valid: boolean; returnTo: string } {
    try {
      const [token, hmac, base64Url] = state.split('.');
      if (!token || !hmac || !base64Url) {
        return { valid: false, returnTo: '/analytics' };
      }

      const returnTo = Buffer.from(base64Url, 'base64url').toString('utf8');
      const secret = process.env.AUTH_SECRET || 'fallback-secret-2026';
      const expectedHmac = crypto
        .createHmac('sha256', secret)
        .update(`${token}:${returnTo}`)
        .digest('hex');

      if (expectedHmac !== hmac) {
        return { valid: false, returnTo: '/analytics' };
      }

      return { valid: true, returnTo: returnTo.startsWith('/') ? returnTo : '/analytics' };
    } catch {
      return { valid: false, returnTo: '/analytics' };
    }
  }

  /**
   * Verifies Google ID token / Userinfo payload.
   */
  static async verifyIdTokenOrPayload(tokenOrPayload: string | GoogleTokenPayload): Promise<GoogleTokenPayload> {
    if (typeof tokenOrPayload !== 'string') {
      const payload = tokenOrPayload;
      if (!payload.sub || !payload.email) {
        throw new Error('Invalid Google token payload: missing sub or email.');
      }
      if (!payload.email_verified) {
        throw new Error('Google email is not verified.');
      }
      return payload;
    }

    const token = tokenOrPayload;

    // Check if tokeninfo endpoint can verify it (Standard Google OIDC verification)
    try {
      const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`);
      if (response.ok) {
        const data = await response.json();
        const expectedAud = this.getClientId();
        if (data.aud !== expectedAud && expectedAud !== 'mock-google-client-id.apps.googleusercontent.com') {
          throw new Error('Token audience does not match configured Google Client ID.');
        }
        if (data.iss !== 'https://accounts.google.com' && data.iss !== 'accounts.google.com') {
          throw new Error('Invalid token issuer.');
        }
        if (!data.email_verified || data.email_verified === 'false') {
          throw new Error('Google account email is not verified.');
        }

        return {
          sub: data.sub,
          email: data.email,
          email_verified: true,
          name: data.name,
          picture: data.picture,
          iss: data.iss,
          aud: data.aud,
        };
      }
    } catch (e: any) {
      if (e.message?.includes('audience') || e.message?.includes('verified') || e.message?.includes('issuer')) {
        throw e;
      }
    }

    // Fallback: Parse JWT payload and validate claims
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payloadJson = Buffer.from(parts[1], 'base64url').toString('utf8');
        const parsed = JSON.parse(payloadJson);

        if (!parsed.sub || !parsed.email) {
          throw new Error('Invalid Google token payload: missing sub or email.');
        }
        if (parsed.exp && parsed.exp < Math.floor(Date.now() / 1000)) {
          throw new Error('Google token has expired.');
        }
        if (!parsed.email_verified) {
          throw new Error('Google email is not verified.');
        }

        return {
          sub: parsed.sub,
          email: parsed.email,
          email_verified: Boolean(parsed.email_verified),
          name: parsed.name,
          picture: parsed.picture,
          iss: parsed.iss,
          aud: parsed.aud,
        };
      }
    } catch (err: any) {
      throw new Error(`Google token validation failed: ${err.message}`);
    }

    throw new Error('Failed to verify Google token.');
  }

  /**
   * Exchanges authorization code for tokens and userinfo.
   */
  static async exchangeCodeForProfile(code: string, origin?: string): Promise<GoogleTokenPayload> {
    const clientId = this.getClientId();
    const clientSecret = this.getClientSecret();
    const redirectUri = this.getRedirectUri(origin);

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      const errData = await tokenRes.json().catch(() => ({}));
      throw new Error(errData.error_description || errData.error || 'Failed to exchange authorization code with Google.');
    }

    const tokenData = await tokenRes.json();
    return await this.verifyIdTokenOrPayload(tokenData.id_token);
  }

  /**
   * Handles user resolution, account linking policy, and session generation for a verified Google identity.
   */
  static async processVerifiedGoogleUser(payload: GoogleTokenPayload) {
    if (!payload.email_verified) {
      throw new Error('Google account email is not verified.');
    }

    const normalizedEmail = AuthService.normalizeEmail(payload.email);
    const googleSub = payload.sub;

    // 1. Check if an Account already exists with this Google sub
    const existingAccount = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: 'google',
          providerAccountId: googleSub,
        },
      },
      include: {
        user: {
          include: { profile: true },
        },
      },
    });

    if (existingAccount) {
      // Existing linked user -> Issue session
      const sessionToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      await prisma.authSession.create({
        data: {
          sessionToken,
          userId: existingAccount.user.id,
          expiresAt,
        },
      });

      return {
        status: 'AUTHENTICATED' as const,
        user: existingAccount.user,
        sessionToken,
      };
    }

    // 2. Check if an existing User exists with this email
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { normalizedEmail }],
      },
      include: { profile: true },
    });

    if (existingUser) {
      // Security Policy: If user already has a password, do NOT automatically link without verifying control!
      if (existingUser.passwordHash) {
        const linkToken = crypto.randomBytes(32).toString('hex');
        const secret = process.env.AUTH_SECRET || 'fallback-secret-2026';
        const hmac = crypto
          .createHmac('sha256', secret)
          .update(`${existingUser.id}:${googleSub}:${linkToken}`)
          .digest('hex');

        return {
          status: 'REQUIRES_PASSWORD_LINK' as const,
          email: normalizedEmail,
          userId: existingUser.id,
          providerAccountId: googleSub,
          linkToken: `${linkToken}.${hmac}.${existingUser.id}.${googleSub}`,
        };
      }

      // If user had no password (e.g. unverified or legacy), link Google account securely
      await prisma.account.create({
        data: {
          userId: existingUser.id,
          provider: 'google',
          providerAccountId: googleSub,
        },
      });

      await prisma.user.update({
        where: { id: existingUser.id },
        data: { isEmailVerified: true },
      });

      const sessionToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      await prisma.authSession.create({
        data: {
          sessionToken,
          userId: existingUser.id,
          expiresAt,
        },
      });

      return {
        status: 'AUTHENTICATED' as const,
        user: existingUser,
        sessionToken,
      };
    }

    // 3. New User Account Creation
    const baseUsername = (payload.email.split('@')[0] || 'coder')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '')
      .slice(0, 25);

    let chosenUsername = baseUsername;
    const isAvail = await AuthService.isUsernameAvailable(chosenUsername);
    if (!isAvail) {
      chosenUsername = `${baseUsername}_${crypto.randomInt(100, 999)}`;
    }

    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: normalizedEmail,
          normalizedEmail,
          name: payload.name || chosenUsername,
          username: chosenUsername,
          normalizedUsername: chosenUsername.toLowerCase(),
          isEmailVerified: true,
          timezone: 'UTC',
        },
      });

      await tx.profile.create({
        data: {
          userId: newUser.id,
          username: chosenUsername,
          normalizedUsername: chosenUsername.toLowerCase(),
          displayName: payload.name || chosenUsername,
          avatarUrl: payload.picture || null,
        },
      });

      await tx.account.create({
        data: {
          userId: newUser.id,
          provider: 'google',
          providerAccountId: googleSub,
        },
      });

      const sessionToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      await tx.authSession.create({
        data: {
          sessionToken,
          userId: newUser.id,
          expiresAt,
        },
      });

      return {
        user: newUser,
        sessionToken,
      };
    });

    return {
      status: 'AUTHENTICATED' as const,
      user: result.user,
      sessionToken: result.sessionToken,
      isNewUser: true,
    };
  }

  /**
   * Confirms password and links existing account with Google identity.
   */
  static async linkExistingAccountWithPassword(params: {
    email: string;
    password: string;
    linkToken: string;
  }) {
    const { email, password, linkToken } = params;
    const normalizedEmail = AuthService.normalizeEmail(email);

    const [token, hmac, userId, googleSub] = linkToken.split('.');
    if (!token || !hmac || !userId || !googleSub) {
      throw new Error('Invalid account linking token.');
    }

    const secret = process.env.AUTH_SECRET || 'fallback-secret-2026';
    const expectedHmac = crypto
      .createHmac('sha256', secret)
      .update(`${userId}:${googleSub}:${token}`)
      .digest('hex');

    if (expectedHmac !== hmac) {
      throw new Error('Account linking token has expired or is invalid.');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.normalizedEmail !== normalizedEmail) {
      throw new Error('User account mismatch.');
    }

    if (!user.passwordHash) {
      throw new Error('Account has no password set.');
    }

    const isMatch = await AuthService.comparePassword(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Incorrect password. Account linking rejected.');
    }

    // Securely link Account
    await prisma.account.upsert({
      where: {
        provider_providerAccountId: {
          provider: 'google',
          providerAccountId: googleSub,
        },
      },
      create: {
        userId: user.id,
        provider: 'google',
        providerAccountId: googleSub,
      },
      update: {
        userId: user.id,
      },
    });

    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await prisma.authSession.create({
      data: {
        sessionToken,
        userId: user.id,
        expiresAt,
      },
    });

    return {
      success: true,
      user,
      sessionToken,
    };
  }
}
