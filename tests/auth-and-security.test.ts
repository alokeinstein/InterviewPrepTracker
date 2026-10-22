import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { prisma } from '../src/lib/prisma';
import { AuthService } from '../src/services/auth/authService';
import { PracticeService } from '../src/services/practice/practiceService';

describe('Production Authentication, Authorization & Security Invariants', () => {
  const timestamp = Date.now();
  const userAEmail = `testuser_a_${timestamp}@gmail.com`;
  const userBEmail = `testuser_b_${timestamp}@gmail.com`;
  const usernameA = `usera_${timestamp.toString().slice(-6)}`;
  const usernameB = `userb_${timestamp.toString().slice(-6)}`;

  let userAId: string;
  let userBId: string;
  let sessionTokenA: string;
  let sessionTokenB: string;

  before(async () => {
    // Clean up any stale records
    await prisma.otpVerification.deleteMany({
      where: {
        OR: [
          { normalizedEmail: userAEmail },
          { normalizedEmail: userBEmail },
        ],
      },
    });
  });

  after(async () => {
    // Clean up created test entities
    if (userAId) {
      await prisma.practiceAttempt.deleteMany({ where: { userId: userAId } });
      await prisma.practiceSession.deleteMany({ where: { userId: userAId } });
      await prisma.authSession.deleteMany({ where: { userId: userAId } });
      await prisma.profile.deleteMany({ where: { userId: userAId } });
      await prisma.user.deleteMany({ where: { id: userAId } });
    }
    if (userBId) {
      await prisma.practiceAttempt.deleteMany({ where: { userId: userBId } });
      await prisma.practiceSession.deleteMany({ where: { userId: userBId } });
      await prisma.authSession.deleteMany({ where: { userId: userBId } });
      await prisma.profile.deleteMany({ where: { userId: userBId } });
      await prisma.user.deleteMany({ where: { id: userBId } });
    }
    await prisma.otpVerification.deleteMany({
      where: {
        OR: [
          { normalizedEmail: userAEmail },
          { normalizedEmail: userBEmail },
        ],
      },
    });
  });

  // 1. Email format validation
  it('validates and accepts only valid @gmail.com addresses', () => {
    assert.strictEqual(AuthService.isValidGmail('alok@gmail.com'), true);
    assert.strictEqual(AuthService.isValidGmail('Alok.Dev+test@gmail.com'), true);
    assert.strictEqual(AuthService.isValidGmail('user@yahoo.com'), false);
    assert.strictEqual(AuthService.isValidGmail('user@hotmail.com'), false);
    assert.strictEqual(AuthService.isValidGmail('user@company.internal'), false);
    assert.strictEqual(AuthService.isValidGmail('invalid-email'), false);
    assert.strictEqual(AuthService.isValidGmail(''), false);
  });

  // 2. OTP generation and sending
  it('generates secure 6-digit OTP and enforces 60s resend cooldown', async () => {
    const res = await AuthService.sendSignupOtp(userAEmail);
    assert.strictEqual(res.alreadyExists, false);
    assert.strictEqual(res.cooldownSec, 60);

    const otpRecord = await prisma.otpVerification.findFirst({
      where: { normalizedEmail: userAEmail, purpose: 'SIGNUP' },
      orderBy: { createdAt: 'desc' },
    });
    assert.ok(otpRecord);
    assert.strictEqual(otpRecord.attempts, 0);
    assert.strictEqual(otpRecord.isUsed, false);
    assert.strictEqual(otpRecord.otpHash.length, 64); // SHA-256 hash length

    // Immediate second attempt MUST throw cooldown error
    await assert.rejects(
      async () => {
        await AuthService.sendSignupOtp(userAEmail);
      },
      (err: any) => {
        return err.message.includes('Please wait') && err.message.includes('seconds');
      }
    );
  });

  // 3. OTP verification & attempt limit
  it('rejects incorrect OTP, increments attempt counter, and locks after max attempts', async () => {
    const wrongOtp = '000000';

    // Wrong attempt 1
    await assert.rejects(async () => {
      await AuthService.verifySignupOtp(userAEmail, wrongOtp);
    });

    const recordAfter1 = await prisma.otpVerification.findFirst({
      where: { normalizedEmail: userAEmail, purpose: 'SIGNUP' },
      orderBy: { createdAt: 'desc' },
    });
    assert.strictEqual(recordAfter1?.attempts, 1);

    // Max out attempts to 5
    await prisma.otpVerification.update({
      where: { id: recordAfter1!.id },
      data: { attempts: 5 },
    });

    // Should now reject with max attempts exceeded
    await assert.rejects(
      async () => {
        await AuthService.verifySignupOtp(userAEmail, wrongOtp);
      },
      (err: any) => err.message.includes('Maximum verification attempts exceeded')
    );
  });

  // 4. Successful signup flow with password & username
  it('completes signup with password hashing, profile creation, and session token', async () => {
    // Reset OTP record to clean valid state
    const crypto = await import('crypto');
    const validRawOtp = '849201';
    const otpHash = crypto.createHash('sha256').update(validRawOtp).digest('hex');

    const validRecord = await prisma.otpVerification.create({
      data: {
        email: userAEmail,
        normalizedEmail: userAEmail,
        otpHash,
        purpose: 'SIGNUP',
        attempts: 0,
        maxAttempts: 5,
        isUsed: false,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    const verifyRes = await AuthService.verifySignupOtp(userAEmail, validRawOtp);
    assert.ok(verifyRes.success);
    assert.ok(verifyRes.signupToken);

    // Complete signup
    const signupRes = await AuthService.completeSignup({
      email: userAEmail,
      signupToken: verifyRes.signupToken,
      password: 'SuperSecretPassword123!',
      username: usernameA,
      timezone: 'Asia/Kolkata',
    });

    assert.ok(signupRes.user);
    assert.ok(signupRes.profile);
    assert.ok(signupRes.sessionToken);
    userAId = signupRes.user.id;
    sessionTokenA = signupRes.sessionToken;

    // Verify database record
    const userInDb = await prisma.user.findUnique({
      where: { id: userAId },
      include: { profile: true },
    });

    assert.ok(userInDb);
    assert.strictEqual(userInDb.normalizedEmail, userAEmail);
    assert.strictEqual(userInDb.normalizedUsername, usernameA.toLowerCase());
    assert.strictEqual(userInDb.timezone, 'Asia/Kolkata');
    assert.strictEqual(userInDb.isEmailVerified, true);
    assert.notStrictEqual(userInDb.passwordHash, 'SuperSecretPassword123!'); // Bcrypt hashed!
  });

  // 5. Username case-insensitive collision rejection
  it('enforces case-insensitive username uniqueness at the database/service layer', async () => {
    // Try checking availability of usernameA in UPPERCASE
    const isAvailUpper = await AuthService.isUsernameAvailable(usernameA.toUpperCase());
    assert.strictEqual(isAvailUpper, false);

    const isAvailMixed = await AuthService.isUsernameAvailable(usernameA.toLowerCase());
    assert.strictEqual(isAvailMixed, false);

    // Brand new username is available
    assert.strictEqual(await AuthService.isUsernameAvailable(`brandnew_${Date.now().toString().slice(-5)}`), true);
  });

  // 6. Existing user login
  it('authenticates existing user with valid password and rejects incorrect password', async () => {
    // Valid login
    const loginSuccess = await AuthService.login(userAEmail, 'SuperSecretPassword123!');
    assert.ok(loginSuccess.user);
    assert.ok(loginSuccess.sessionToken);

    // Invalid password login
    await assert.rejects(
      async () => {
        await AuthService.login(userAEmail, 'WrongPassword999!');
      },
      (err: any) => err.message.includes('Invalid email or password')
    );

    // Non-existent email login
    await assert.rejects(
      async () => {
        await AuthService.login('nonexistent_user_999@gmail.com', 'SomePassword123!');
      },
      (err: any) => err.message.includes('Invalid email or password')
    );
  });

  // 7. Forgot password flow
  it('resets password securely using OTP and revokes previous sessions', async () => {
    const crypto = await import('crypto');
    const resetRawOtp = '551122';
    const otpHash = crypto.createHash('sha256').update(resetRawOtp).digest('hex');

    await prisma.otpVerification.create({
      data: {
        email: userAEmail,
        normalizedEmail: userAEmail,
        otpHash,
        purpose: 'PASSWORD_RESET',
        attempts: 0,
        maxAttempts: 5,
        isUsed: false,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        userId: userAId,
      },
    });

    const verifyReset = await AuthService.verifyForgotPasswordOtp(userAEmail, resetRawOtp);
    assert.ok(verifyReset.success);
    assert.ok(verifyReset.resetToken);

    const resetRes = await AuthService.resetPassword(
      userAEmail,
      verifyReset.resetToken,
      'BrandNewPassword456!'
    );
    assert.ok(resetRes.success);
    assert.ok(resetRes.sessionToken);

    // Old sessionTokenA MUST be revoked
    const oldSession = await AuthService.validateSession(sessionTokenA);
    assert.strictEqual(oldSession, null);

    // Login with new password MUST succeed
    const newLogin = await AuthService.login(userAEmail, 'BrandNewPassword456!');
    assert.ok(newLogin.user);
  });

  // 8. Session validation and logout
  it('validates active session and destroys session on logout', async () => {
    const login = await AuthService.login(userAEmail, 'BrandNewPassword456!');
    const activeToken = login.sessionToken;

    const validated = await AuthService.validateSession(activeToken);
    assert.ok(validated);
    assert.strictEqual(validated.user.id, userAId);

    // Logout
    await AuthService.logout(activeToken);

    const afterLogout = await AuthService.validateSession(activeToken);
    assert.strictEqual(afterLogout, null);
  });

  // 9. Authorization & Data Isolation: User A cannot access User B's practice data
  it('strictly isolates practice history and prevents User A from accessing User B data', async () => {
    // Create User B directly
    const userB = await prisma.user.create({
      data: {
        email: userBEmail,
        normalizedEmail: userBEmail,
        name: 'User B',
        username: usernameB,
        normalizedUsername: usernameB.toLowerCase(),
        passwordHash: 'hashed',
        timezone: 'UTC',
      },
    });
    userBId = userB.id;

    // Fetch problem
    const problem = await prisma.dsaProblem.findFirst();
    assert.ok(problem);

    // User B records practice
    await PracticeService.recordAttempt({
      userId: userBId,
      problemId: problem.id,
      timestamp: new Date('2026-10-22T10:00:00Z'),
      status: 'ACCEPTED',
      notes: 'Confidential notes of User B',
    });

    // User A queries their own history
    const userAHistory = await PracticeService.getLatestActivityHistory({
      userId: userAId,
      page: 1,
      pageSize: 20,
    });

    // User B queries their own history
    const userBHistory = await PracticeService.getLatestActivityHistory({
      userId: userBId,
      page: 1,
      pageSize: 20,
    });

    // User A history does NOT contain User B problem practice!
    assert.strictEqual(userAHistory.total, 0);
    assert.strictEqual(userBHistory.total, 1);
    assert.strictEqual(userBHistory.items[0].problemId, problem.id);
  });
});
