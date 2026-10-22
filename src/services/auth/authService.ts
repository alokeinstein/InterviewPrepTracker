import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { sendOtpEmail } from '@/lib/email';
import { normalizeTimezone } from '@/lib/timezone';
import { OtpPurpose } from '@prisma/client';

export const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
export const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,30}$/;

const OTP_EXPIRY_MINUTES = 10;
const OTP_RESEND_COOLDOWN_SEC = 60;
const MAX_VERIFICATION_ATTEMPTS = 5;
const MAX_OTP_PER_HOUR = 5;

function hashValue(val: string): string {
  return crypto.createHash('sha256').update(val).digest('hex');
}

function generateRandomToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

export class AuthService {
  static normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  static normalizeUsername(username: string): string {
    return username.trim().toLowerCase();
  }

  static isValidGmail(email: string): boolean {
    return GMAIL_REGEX.test(email.trim().toLowerCase());
  }

  static isValidUsername(username: string): boolean {
    return USERNAME_REGEX.test(username.trim());
  }

  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Check if an account already exists for this Gmail address.
   */
  static async checkAccountExists(email: string): Promise<{ exists: boolean; hasPassword: boolean }> {
    const normalizedEmail = this.normalizeEmail(email);
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { normalizedEmail }],
      },
      select: { id: true, passwordHash: true },
    });
    return {
      exists: Boolean(user),
      hasPassword: Boolean(user?.passwordHash),
    };
  }

  /**
   * Check if a username is available (case-insensitive uniqueness).
   */
  static async isUsernameAvailable(username: string, excludeUserId?: string): Promise<boolean> {
    if (!this.isValidUsername(username)) return false;
    const normalized = this.normalizeUsername(username);
    const existing = await prisma.user.findFirst({
      where: {
        normalizedUsername: normalized,
        ...(excludeUserId ? { NOT: { id: excludeUserId } } : {}),
      },
      select: { id: true },
    });
    return !existing;
  }

  /**
   * Generates and emails an OTP for new user signup.
   */
  static async sendSignupOtp(email: string) {
    if (!this.isValidGmail(email)) {
      throw new Error('Only valid @gmail.com email addresses are supported.');
    }

    const normalizedEmail = this.normalizeEmail(email);

    // Check if account already exists with password
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { normalizedEmail }],
      },
    });

    if (existing && existing.passwordHash) {
      return {
        alreadyExists: true,
        message: 'An account with this Gmail address already exists. Please login.',
      };
    }

    const now = new Date();

    // Check rate limit: resend cooldown
    const latestOtp = await prisma.otpVerification.findFirst({
      where: {
        normalizedEmail,
        purpose: OtpPurpose.SIGNUP,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (latestOtp) {
      const elapsedSec = Math.floor((now.getTime() - latestOtp.lastSentAt.getTime()) / 1000);
      if (elapsedSec < OTP_RESEND_COOLDOWN_SEC) {
        const remaining = OTP_RESEND_COOLDOWN_SEC - elapsedSec;
        throw new Error(`Please wait ${remaining} seconds before requesting a new code.`);
      }
    }

    // Check hourly volume
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const hourlyCount = await prisma.otpVerification.count({
      where: {
        normalizedEmail,
        createdAt: { gte: oneHourAgo },
      },
    });

    if (hourlyCount >= MAX_OTP_PER_HOUR) {
      throw new Error('Too many OTP requests. Please try again after an hour.');
    }

    // Generate secure 6-digit OTP
    const rawOtp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = hashValue(rawOtp);
    const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Save OTP verification record
    await prisma.otpVerification.create({
      data: {
        email: normalizedEmail,
        normalizedEmail,
        otpHash,
        purpose: OtpPurpose.SIGNUP,
        attempts: 0,
        maxAttempts: MAX_VERIFICATION_ATTEMPTS,
        isUsed: false,
        expiresAt,
        lastSentAt: now,
      },
    });

    // Send via Nodemailer
    await sendOtpEmail({
      toEmail: normalizedEmail,
      otp: rawOtp,
      purpose: 'SIGNUP',
      expiryMinutes: OTP_EXPIRY_MINUTES,
    });

    return {
      alreadyExists: false,
      message: 'A verification code has been sent to your Gmail address.',
      cooldownSec: OTP_RESEND_COOLDOWN_SEC,
    };
  }

  /**
   * Verifies an OTP and returns a single-use verification token for password setup.
   */
  static async verifySignupOtp(email: string, enteredOtp: string) {
    if (!this.isValidGmail(email)) {
      throw new Error('Invalid email address.');
    }
    const normalizedEmail = this.normalizeEmail(email);
    const trimmedOtp = enteredOtp.trim();

    const otpRecord = await prisma.otpVerification.findFirst({
      where: {
        normalizedEmail,
        purpose: OtpPurpose.SIGNUP,
        isUsed: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      throw new Error('No active verification code found. Please request a new code.');
    }

    const now = new Date();
    if (otpRecord.expiresAt < now) {
      throw new Error('Verification code has expired. Please request a new code.');
    }

    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      throw new Error('Maximum verification attempts exceeded. Please request a new code.');
    }

    // Increment attempt count
    await prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { attempts: { increment: 1 } },
    });

    const expectedHash = hashValue(trimmedOtp);
    if (expectedHash !== otpRecord.otpHash) {
      const remainingAttempts = Math.max(0, otpRecord.maxAttempts - (otpRecord.attempts + 1));
      throw new Error(`Incorrect verification code. ${remainingAttempts} attempts remaining.`);
    }

    // Mark OTP used
    await prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { isUsed: true },
    });

    // Generate signup completion token
    const signupToken = generateRandomToken(32);
    // Store in a fast memory or hash check - we can store in user session or encode in signed token
    const secret = process.env.AUTH_SECRET || 'fallback-secret-2026';
    const hmac = crypto
      .createHmac('sha256', secret)
      .update(`${normalizedEmail}:${signupToken}:${otpRecord.id}`)
      .digest('hex');

    return {
      success: true,
      signupToken: `${signupToken}.${hmac}.${otpRecord.id}`,
    };
  }

  /**
   * Completes new account creation after OTP verification.
   */
  static async completeSignup(params: {
    email: string;
    signupToken: string;
    password: string;
    username: string;
    timezone?: string;
  }) {
    const { email, signupToken, password, username, timezone = 'UTC' } = params;

    if (!this.isValidGmail(email)) {
      throw new Error('Invalid email address.');
    }
    const normalizedEmail = this.normalizeEmail(email);

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }

    if (!this.isValidUsername(username)) {
      throw new Error('Username must be 3-30 characters (letters, numbers, underscores, hyphens).');
    }

    const normalizedUsername = this.normalizeUsername(username);

    // Validate signupToken integrity
    const [tokenPart, hmacPart, otpId] = signupToken.split('.');
    if (!tokenPart || !hmacPart || !otpId) {
      throw new Error('Invalid signup verification token.');
    }

    const secret = process.env.AUTH_SECRET || 'fallback-secret-2026';
    const expectedHmac = crypto
      .createHmac('sha256', secret)
      .update(`${normalizedEmail}:${tokenPart}:${otpId}`)
      .digest('hex');

    if (expectedHmac !== hmacPart) {
      throw new Error('Signup verification token has been tampered with or is invalid.');
    }

    // Verify OTP was indeed verified for this email
    const otpRecord = await prisma.otpVerification.findUnique({
      where: { id: otpId },
    });
    if (!otpRecord || otpRecord.normalizedEmail !== normalizedEmail || !otpRecord.isUsed) {
      throw new Error('Invalid verification state. Please verify your email again.');
    }

    // Check username availability
    const available = await this.isUsernameAvailable(username);
    if (!available) {
      throw new Error(`Username "${username}" is already taken. Please choose another.`);
    }

    const passwordHash = await this.hashPassword(password);
    const safeTimezone = normalizeTimezone(timezone);

    // Database transaction creating User, Profile, and AuthSession atomically
    return await prisma.$transaction(async (tx) => {
      // 1. Create User
      const user = await tx.user.create({
        data: {
          email: normalizedEmail,
          normalizedEmail,
          name: username,
          username,
          normalizedUsername,
          passwordHash,
          isEmailVerified: true,
          timezone: safeTimezone,
        },
      });

      // 2. Create Profile
      const profile = await tx.profile.create({
        data: {
          userId: user.id,
          username,
          normalizedUsername,
          displayName: username,
        },
      });

      // 3. Create initial AuthSession
      const sessionToken = generateRandomToken(32);
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      const session = await tx.authSession.create({
        data: {
          sessionToken,
          userId: user.id,
          expiresAt,
        },
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
          timezone: user.timezone,
        },
        profile,
        sessionToken,
      };
    });
  }

  /**
   * Existing user password login.
   */
  static async login(email: string, password: string, userAgent?: string, ipAddress?: string) {
    if (!this.isValidGmail(email)) {
      throw new Error('Invalid email or password.');
    }
    const normalizedEmail = this.normalizeEmail(email);

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { normalizedEmail }],
      },
      include: { profile: true },
    });

    if (!user || !user.passwordHash) {
      throw new Error('Invalid email or password.');
    }

    const isMatch = await this.comparePassword(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    // Create session
    const sessionToken = generateRandomToken(32);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const session = await prisma.authSession.create({
      data: {
        sessionToken,
        userId: user.id,
        expiresAt,
        userAgent: userAgent || null,
        ipAddress: ipAddress || null,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        timezone: user.timezone,
        streak: user.streak,
        role: user.role,
      },
      profile: user.profile,
      sessionToken,
    };
  }

  /**
   * Forgot password: sends OTP. Protects against user enumeration.
   */
  static async sendForgotPasswordOtp(email: string) {
    if (!this.isValidGmail(email)) {
      // Even for invalid formats, maintain timing consistency
      return { success: true, message: 'If an account exists with this email, a verification code has been sent.' };
    }
    const normalizedEmail = this.normalizeEmail(email);

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { normalizedEmail }],
      },
    });

    // If user does not exist, return generic success without revealing existence
    if (!user) {
      return { success: true, message: 'If an account exists with this email, a verification code has been sent.' };
    }

    const now = new Date();

    // Check cooldown
    const latestOtp = await prisma.otpVerification.findFirst({
      where: {
        normalizedEmail,
        purpose: OtpPurpose.PASSWORD_RESET,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (latestOtp) {
      const elapsedSec = Math.floor((now.getTime() - latestOtp.lastSentAt.getTime()) / 1000);
      if (elapsedSec < OTP_RESEND_COOLDOWN_SEC) {
        throw new Error(`Please wait ${OTP_RESEND_COOLDOWN_SEC - elapsedSec} seconds before requesting another code.`);
      }
    }

    const rawOtp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = hashValue(rawOtp);
    const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await prisma.otpVerification.create({
      data: {
        email: normalizedEmail,
        normalizedEmail,
        otpHash,
        purpose: OtpPurpose.PASSWORD_RESET,
        attempts: 0,
        maxAttempts: MAX_VERIFICATION_ATTEMPTS,
        isUsed: false,
        expiresAt,
        lastSentAt: now,
        userId: user.id,
      },
    });

    await sendOtpEmail({
      toEmail: normalizedEmail,
      otp: rawOtp,
      purpose: 'PASSWORD_RESET',
      expiryMinutes: OTP_EXPIRY_MINUTES,
    });

    return {
      success: true,
      message: 'If an account exists with this email, a verification code has been sent.',
      cooldownSec: OTP_RESEND_COOLDOWN_SEC,
    };
  }

  /**
   * Verifies forgot password OTP and returns a password reset token.
   */
  static async verifyForgotPasswordOtp(email: string, enteredOtp: string) {
    const normalizedEmail = this.normalizeEmail(email);
    const trimmedOtp = enteredOtp.trim();

    const otpRecord = await prisma.otpVerification.findFirst({
      where: {
        normalizedEmail,
        purpose: OtpPurpose.PASSWORD_RESET,
        isUsed: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      throw new Error('No active reset code found. Please request a new code.');
    }

    if (otpRecord.expiresAt < new Date()) {
      throw new Error('Reset code has expired. Please request a new code.');
    }

    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      throw new Error('Maximum attempts exceeded. Please request a new code.');
    }

    await prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { attempts: { increment: 1 } },
    });

    const expectedHash = hashValue(trimmedOtp);
    if (expectedHash !== otpRecord.otpHash) {
      const remainingAttempts = Math.max(0, otpRecord.maxAttempts - (otpRecord.attempts + 1));
      throw new Error(`Incorrect code. ${remainingAttempts} attempts remaining.`);
    }

    await prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { isUsed: true },
    });

    const resetToken = generateRandomToken(32);
    const secret = process.env.AUTH_SECRET || 'fallback-secret-2026';
    const hmac = crypto
      .createHmac('sha256', secret)
      .update(`${normalizedEmail}:${resetToken}:${otpRecord.id}`)
      .digest('hex');

    return {
      success: true,
      resetToken: `${resetToken}.${hmac}.${otpRecord.id}`,
    };
  }

  /**
   * Completes password reset with new password and revokes old sessions.
   */
  static async resetPassword(email: string, resetToken: string, newPassword: string) {
    const normalizedEmail = this.normalizeEmail(email);

    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }

    const [tokenPart, hmacPart, otpId] = resetToken.split('.');
    if (!tokenPart || !hmacPart || !otpId) {
      throw new Error('Invalid reset token.');
    }

    const secret = process.env.AUTH_SECRET || 'fallback-secret-2026';
    const expectedHmac = crypto
      .createHmac('sha256', secret)
      .update(`${normalizedEmail}:${tokenPart}:${otpId}`)
      .digest('hex');

    if (expectedHmac !== hmacPart) {
      throw new Error('Reset token has expired or is invalid.');
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { normalizedEmail }],
      },
    });

    if (!user) {
      throw new Error('User not found.');
    }

    const newHash = await this.hashPassword(newPassword);

    return await prisma.$transaction(async (tx) => {
      // 1. Update password
      await tx.user.update({
        where: { id: user.id },
        data: { passwordHash: newHash },
      });

      // 2. Revoke all previous auth sessions
      await tx.authSession.deleteMany({
        where: { userId: user.id },
      });

      // 3. Create fresh auth session
      const sessionToken = generateRandomToken(32);
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      await tx.authSession.create({
        data: {
          sessionToken,
          userId: user.id,
          expiresAt,
        },
      });

      return {
        success: true,
        sessionToken,
      };
    });
  }

  /**
   * Validates a session token and returns the authenticated user context.
   */
  static async validateSession(sessionToken?: string | null) {
    if (!sessionToken) return null;

    const session = await prisma.authSession.findUnique({
      where: { sessionToken },
      include: {
        user: {
          include: { profile: true },
        },
      },
    });

    if (!session) return null;

    if (session.expiresAt < new Date()) {
      // Clean up expired session asynchronously
      prisma.authSession.delete({ where: { id: session.id } }).catch(() => {});
      return null;
    }

    return {
      session,
      user: session.user,
    };
  }

  /**
   * Logs out user by destroying the server-side session.
   */
  static async logout(sessionToken?: string | null) {
    if (!sessionToken) return;
    try {
      await prisma.authSession.delete({
        where: { sessionToken },
      });
    } catch {
      // Ignore if already deleted
    }
  }
}
