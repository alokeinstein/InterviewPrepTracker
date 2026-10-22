import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import crypto from 'crypto';
import { NextRequest } from 'next/server';
import { prisma } from '../src/lib/prisma';
import { AuthService } from '../src/services/auth/authService';
import { GoogleAuthService, GoogleTokenPayload } from '../src/services/auth/googleAuthService';
import { PracticeService } from '../src/services/practice/practiceService';
import { localStore } from '../src/lib/storage/indexedDb';
import { AUTH_COOKIE_NAME } from '../src/lib/auth';

// Import Route Handlers for Direct Endpoint Security Invariant Testing
import { POST as executeCodeHandler } from '../src/app/api/execute-code/route';
import { GET as solutionHandler } from '../src/app/api/dsa/[slug]/solution/route';
import { GET as heatmapHandler } from '../src/app/api/practice/heatmap/route';
import { GET as streakHandler } from '../src/app/api/practice/streak/route';
import { GET as historyHandler } from '../src/app/api/practice/history/route';
import { POST as revisionLogHandler } from '../src/app/api/revision/log-practice/route';
import { POST as importGuestProgressHandler } from '../src/app/api/practice/import-guest-progress/route';

describe('Production Google OAuth, Guest Mode & Protected Access Invariants', () => {
  const timestamp = Date.now();
  const testProblemSlug = 'two-sum';
  let testProblemId: string;

  // Test User Accounts
  const googleUserEmail = `oauth_user_${timestamp}@gmail.com`;
  const googleUserSub = `google-sub-${timestamp}`;
  let googleUserId: string;

  const existingEmail = `existing_dev_${timestamp}@gmail.com`;
  const existingPassword = 'StrongPassword2026!';
  const existingGoogleSub = `google-sub-existing-${timestamp}`;
  let existingUserId: string;
  let existingUserSessionToken: string;

  before(async () => {
    // 1. Fetch an existing problem for testing
    let problem = await prisma.dsaProblem.findFirst({
      where: { OR: [{ slug: testProblemSlug }, { id: testProblemSlug }] },
    });
    if (!problem) {
      problem = await prisma.dsaProblem.findFirst();
    }
    assert.ok(problem, 'At least one DSA problem must exist in database for testing');
    testProblemId = problem.id;

    // 2. Pre-create an existing user with a password to test secure account-linking invariants
    const normalizedExistingEmail = AuthService.normalizeEmail(existingEmail);
    const existingPasswordHash = await AuthService.hashPassword(existingPassword);
    const existingUser = await prisma.user.create({
      data: {
        email: normalizedExistingEmail,
        normalizedEmail: normalizedExistingEmail,
        name: 'Existing Password User',
        username: `pwduser_${timestamp.toString().slice(-6)}`,
        normalizedUsername: `pwduser_${timestamp.toString().slice(-6)}`.toLowerCase(),
        passwordHash: existingPasswordHash,
        isEmailVerified: true,
        timezone: 'UTC',
      },
    });
    existingUserId = existingUser.id;

    const existingProfile = await prisma.profile.create({
      data: {
        userId: existingUserId,
        username: existingUser.username,
        normalizedUsername: existingUser.normalizedUsername,
        displayName: 'Existing Password User',
      },
    });

    const sessionToken = crypto.randomBytes(32).toString('hex');
    await prisma.authSession.create({
      data: {
        sessionToken,
        userId: existingUserId,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
    existingUserSessionToken = sessionToken;
  });

  after(async () => {
    // Clean up all entities created during tests
    if (googleUserId) {
      await prisma.practiceAttempt.deleteMany({ where: { userId: googleUserId } });
      await prisma.practiceSession.deleteMany({ where: { userId: googleUserId } });
      await prisma.account.deleteMany({ where: { userId: googleUserId } });
      await prisma.authSession.deleteMany({ where: { userId: googleUserId } });
      await prisma.profile.deleteMany({ where: { userId: googleUserId } });
      await prisma.user.deleteMany({ where: { id: googleUserId } });
    }

    if (existingUserId) {
      await prisma.practiceAttempt.deleteMany({ where: { userId: existingUserId } });
      await prisma.practiceSession.deleteMany({ where: { userId: existingUserId } });
      await prisma.account.deleteMany({ where: { userId: existingUserId } });
      await prisma.authSession.deleteMany({ where: { userId: existingUserId } });
      await prisma.profile.deleteMany({ where: { userId: existingUserId } });
      await prisma.user.deleteMany({ where: { id: existingUserId } });
    }
  });

  // =========================================================================
  // 1. Google OAuth 2.0 / OpenID Connect Core
  // =========================================================================
  describe('Google OAuth 2.0 / OpenID Connect Protocol Invariants', () => {
    it('generates a valid Google OAuth authorization URL with correct scopes, prompt, and signed state', () => {
      const { url, state } = GoogleAuthService.generateAuthUrl('http://localhost:3000', '/dsa/two-sum');
      assert.ok(url.startsWith('https://accounts.google.com/o/oauth2/v2/auth'));
      assert.ok(url.includes('prompt=select_account'));
      assert.ok(url.includes('scope=openid+email+profile') || url.includes('scope=openid%20email%20profile'));
      assert.ok(url.includes('redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fgoogle%2Fcallback'));

      // State parameter verification
      const stateValidation = GoogleAuthService.validateState(state);
      assert.strictEqual(stateValidation.valid, true);
      assert.strictEqual(stateValidation.returnTo, '/dsa/two-sum');
    });

    it('rejects tampered or forged OAuth state parameters (CSRF protection)', () => {
      const { state } = GoogleAuthService.generateAuthUrl('http://localhost:3000', '/analytics');
      const parts = state.split('.');
      // Tamper with the returnTo payload
      const tamperedState = `${parts[0]}.${parts[1]}.${Buffer.from('/admin-steal').toString('base64url')}`;
      const validation = GoogleAuthService.validateState(tamperedState);
      assert.strictEqual(validation.valid, false);

      // Malformed state
      const malformed = GoogleAuthService.validateState('random-garbage-token');
      assert.strictEqual(malformed.valid, false);
    });

    it('validates identity token claims and rejects missing sub, missing email, or unverified email', async () => {
      // Missing sub
      await assert.rejects(
        async () => {
          await GoogleAuthService.verifyIdTokenOrPayload({
            sub: '',
            email: 'test@gmail.com',
            email_verified: true,
          });
        },
        /missing sub or email/i
      );

      // Missing email
      await assert.rejects(
        async () => {
          await GoogleAuthService.verifyIdTokenOrPayload({
            sub: '12345',
            email: '',
            email_verified: true,
          });
        },
        /missing sub or email/i
      );

      // Unverified email
      await assert.rejects(
        async () => {
          await GoogleAuthService.verifyIdTokenOrPayload({
            sub: '12345',
            email: 'unverified@gmail.com',
            email_verified: false,
          });
        },
        /email is not verified/i
      );
    });

    it('handles first-time Google sign-in: creates User, Profile, Account and issues session', async () => {
      const payload: GoogleTokenPayload = {
        sub: googleUserSub,
        email: googleUserEmail,
        email_verified: true,
        name: 'OAuth Developer',
        picture: 'https://lh3.googleusercontent.com/test-avatar.png',
      };

      const result = await GoogleAuthService.processVerifiedGoogleUser(payload);
      assert.strictEqual(result.status, 'AUTHENTICATED');
      assert.ok(result.user);
      assert.ok(result.sessionToken);
      assert.strictEqual(result.isNewUser, true);

      googleUserId = result.user.id;

      // Verify Account record exists with provider 'google' and stable 'sub'
      const account = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider: 'google',
            providerAccountId: googleUserSub,
          },
        },
      });
      assert.ok(account);
      assert.strictEqual(account.userId, googleUserId);

      // Verify User record email is marked verified
      const user = await prisma.user.findUnique({ where: { id: googleUserId } });
      assert.ok(user);
      assert.strictEqual(user.isEmailVerified, true);

      // Verify Profile record exists with avatar and username
      const profile = await prisma.profile.findUnique({ where: { userId: googleUserId } });
      assert.ok(profile);
      assert.strictEqual(profile.avatarUrl, 'https://lh3.googleusercontent.com/test-avatar.png');

      // Verify AuthSession was created and validates
      const validated = await AuthService.validateSession(result.sessionToken);
      assert.ok(validated);
      assert.strictEqual(validated.user.id, googleUserId);
    });

    it('handles subsequent login for existing Google identity without creating duplicate records', async () => {
      const payload: GoogleTokenPayload = {
        sub: googleUserSub,
        email: googleUserEmail,
        email_verified: true,
        name: 'OAuth Developer',
      };

      const beforeUserCount = await prisma.user.count({ where: { normalizedEmail: AuthService.normalizeEmail(googleUserEmail) } });
      const beforeAccountCount = await prisma.account.count({ where: { provider: 'google', providerAccountId: googleUserSub } });

      const result = await GoogleAuthService.processVerifiedGoogleUser(payload);
      assert.strictEqual(result.status, 'AUTHENTICATED');
      assert.strictEqual(result.user.id, googleUserId);
      assert.ok(result.sessionToken);

      const afterUserCount = await prisma.user.count({ where: { normalizedEmail: AuthService.normalizeEmail(googleUserEmail) } });
      const afterAccountCount = await prisma.account.count({ where: { provider: 'google', providerAccountId: googleUserSub } });

      // Duplicate prevention invariant
      assert.strictEqual(beforeUserCount, 1);
      assert.strictEqual(afterUserCount, 1);
      assert.strictEqual(beforeAccountCount, 1);
      assert.strictEqual(afterAccountCount, 1);
    });
  });

  // =========================================================================
  // 2. Existing Account Linking Security Policy
  // =========================================================================
  describe('Secure Account Linking Policy', () => {
    let linkToken: string;

    it('does NOT automatically link when a Google login attempt matches an existing password-based account', async () => {
      const payload: GoogleTokenPayload = {
        sub: existingGoogleSub,
        email: existingEmail,
        email_verified: true,
        name: 'Attacker Or Existing User',
      };

      // Attempt Google sign-in with the existing user's email
      const result = await GoogleAuthService.processVerifiedGoogleUser(payload);

      // Must require explicit password confirmation!
      assert.strictEqual(result.status, 'REQUIRES_PASSWORD_LINK');
      assert.strictEqual(result.email, AuthService.normalizeEmail(existingEmail));
      assert.strictEqual(result.userId, existingUserId);
      assert.strictEqual(result.providerAccountId, existingGoogleSub);
      assert.ok(result.linkToken);

      linkToken = result.linkToken;

      // Verify that NO Account was created yet
      const account = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider: 'google',
            providerAccountId: existingGoogleSub,
          },
        },
      });
      assert.strictEqual(account, null, 'Account must not be linked without password confirmation');
    });

    it('rejects account linking when supplied password is incorrect', async () => {
      await assert.rejects(
        async () => {
          await GoogleAuthService.linkExistingAccountWithPassword({
            email: existingEmail,
            password: 'WrongPassword999!',
            linkToken,
          });
        },
        /Incorrect password/i
      );

      // Verify Account still does NOT exist
      const account = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider: 'google',
            providerAccountId: existingGoogleSub,
          },
        },
      });
      assert.strictEqual(account, null);
    });

    it('rejects account linking when linkToken is tampered or forged', async () => {
      const parts = linkToken.split('.');
      const tampered = `tampered-random-token.${parts[1]}.${parts[2]}.${parts[3]}`;

      await assert.rejects(
        async () => {
          await GoogleAuthService.linkExistingAccountWithPassword({
            email: existingEmail,
            password: existingPassword,
            linkToken: tampered,
          });
        },
        /expired or is invalid/i
      );
    });

    it('successfully links account when password is verified and issues application session', async () => {
      const result = await GoogleAuthService.linkExistingAccountWithPassword({
        email: existingEmail,
        password: existingPassword,
        linkToken,
      });

      assert.strictEqual(result.success, true);
      assert.strictEqual(result.user.id, existingUserId);
      assert.ok(result.sessionToken);

      // Verify Account record is now persisted
      const account = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider: 'google',
            providerAccountId: existingGoogleSub,
          },
        },
      });
      assert.ok(account);
      assert.strictEqual(account.userId, existingUserId);
      assert.strictEqual(account.providerAccountId, existingGoogleSub);

      // Subsequent Google login now logs in directly without prompting for password
      const nextLogin = await GoogleAuthService.processVerifiedGoogleUser({
        sub: existingGoogleSub,
        email: existingEmail,
        email_verified: true,
      });
      assert.strictEqual(nextLogin.status, 'AUTHENTICATED');
      assert.strictEqual(nextLogin.user.id, existingUserId);
    });
  });

  // =========================================================================
  // 3. Guest Mode: Strict Restrictions for Logged-Out Users (401 Enforced)
  // =========================================================================
  describe('Guest Mode Backend Security & 401 Enforcement', () => {
    it('rejects code execution and test runner for unauthenticated guests (401 Unauthorized)', async () => {
      const req = new NextRequest('http://localhost:3000/api/execute-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: testProblemId,
          code: 'function twoSum() { return [0, 1]; }',
          language: 'javascript',
          isSubmission: true,
        }),
      });

      const res = await executeCodeHandler(req);
      assert.strictEqual(res.status, 401);
      const data = await res.json();
      assert.ok(data.error.includes('Authentication required'));
    });

    it('rejects solution access for unauthenticated guests (401 Unauthorized)', async () => {
      const req = new NextRequest(`http://localhost:3000/api/dsa/${testProblemSlug}/solution`);
      const res = await solutionHandler(req, { params: Promise.resolve({ slug: testProblemSlug }) });
      assert.strictEqual(res.status, 401);
      assert.strictEqual(res.headers.get('Cache-Control'), 'private, no-store, max-age=0');
      const data = await res.json();
      assert.ok(data.error.includes('Authentication required'));
    });

    it('allows authenticated user to retrieve reference solution', async () => {
      const req = new NextRequest(`http://localhost:3000/api/dsa/${testProblemSlug}/solution`, {
        headers: {
          Authorization: `Bearer ${existingUserSessionToken}`,
        },
      });
      const res = await solutionHandler(req, { params: Promise.resolve({ slug: testProblemSlug }) });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.ok(data.optimalSolution !== undefined);
      assert.strictEqual(res.headers.get('Cache-Control'), 'private, no-store, max-age=0');
    });

    it('rejects heatmap analytics for unauthenticated guests (401 Unauthorized)', async () => {
      const req = new NextRequest('http://localhost:3000/api/practice/heatmap');
      const res = await heatmapHandler(req);
      assert.strictEqual(res.status, 401);
      const data = await res.json();
      assert.ok(data.error.includes('Authentication required'));
    });

    it('rejects streak calculation for unauthenticated guests (401 Unauthorized)', async () => {
      const req = new NextRequest('http://localhost:3000/api/practice/streak');
      const res = await streakHandler(req);
      assert.strictEqual(res.status, 401);
    });

    it('rejects practice history for unauthenticated guests (401 Unauthorized)', async () => {
      const req = new NextRequest('http://localhost:3000/api/practice/history');
      const res = await historyHandler(req);
      assert.strictEqual(res.status, 401);
    });

    it('rejects revision logging for unauthenticated guests (401 Unauthorized)', async () => {
      const req = new NextRequest('http://localhost:3000/api/revision/log-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: testProblemId,
          method: 'IDE',
          status: 'SOLVED',
        }),
      });
      const res = await revisionLogHandler(req);
      assert.strictEqual(res.status, 401);
    });

    it('rejects guest progress import for unauthenticated requests (401 Unauthorized)', async () => {
      const req = new NextRequest('http://localhost:3000/api/practice/import-guest-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestRecords: [{ problemId: testProblemId, isSolved: true }],
        }),
      });
      const res = await importGuestProgressHandler(req);
      assert.strictEqual(res.status, 401);
    });
  });

  // =========================================================================
  // 4. Client Storage Partitioning & Data Isolation
  // =========================================================================
  describe('Client Storage Partitioning & Logout Data Isolation', () => {
    it('partitions drafts and solve status under user-specific and guest namespaces', async () => {
      // 1. As Authenticated User A
      localStore.setCurrentUser(existingUserId);
      assert.strictEqual(localStore.getUserNamespace(), `u_${existingUserId}`);
      assert.strictEqual(localStore.isGuest(), false);

      await localStore.saveDraft(testProblemId, 'javascript', '// User A Draft Code');
      await localStore.recordSolve(testProblemId, 120);

      const userADraft = await localStore.loadDraft(testProblemId, 'javascript');
      const userASolve = await localStore.getSolveStatus(testProblemId);
      assert.strictEqual(userADraft, '// User A Draft Code');
      assert.strictEqual(userASolve?.isSolved, true);

      // 2. Switch to Guest Mode
      localStore.setCurrentUser(null);
      assert.strictEqual(localStore.getUserNamespace(), 'guest');
      assert.strictEqual(localStore.isGuest(), true);

      // Guest must NOT see User A's draft or solved status!
      const guestDraft = await localStore.loadDraft(testProblemId, 'javascript');
      const guestSolve = await localStore.getSolveStatus(testProblemId);
      assert.strictEqual(guestDraft, null, "Guest must not see authenticated user's draft");
      assert.strictEqual(guestSolve, null, "Guest must not see authenticated user's solve status");

      // Save Guest progress
      await localStore.saveDraft(testProblemId, 'javascript', '// Guest Draft Code');
      await localStore.recordSolve(testProblemId, 300);

      const guestNewDraft = await localStore.loadDraft(testProblemId, 'javascript');
      const guestNewSolve = await localStore.getSolveStatus(testProblemId);
      assert.strictEqual(guestNewDraft, '// Guest Draft Code');
      assert.strictEqual(guestNewSolve?.isSolved, true);

      // 3. Switch back to User A -> User A still sees User A's data, untouched by guest
      localStore.setCurrentUser(existingUserId);
      assert.strictEqual(await localStore.loadDraft(testProblemId, 'javascript'), '// User A Draft Code');
      assert.strictEqual((await localStore.getSolveStatus(testProblemId))?.lastDurationSec, 120);
    });

    it('clearAuthenticatedData purges all authenticated records while strictly preserving guest records', async () => {
      // Setup both guest and authenticated data
      localStore.setCurrentUser('user_to_be_cleared');
      await localStore.saveDraft('problem_x', 'javascript', '// Auth code');
      await localStore.recordSolve('problem_x', 50);

      localStore.setCurrentUser(null);
      await localStore.saveDraft('problem_guest', 'javascript', '// Preserved Guest Code');
      await localStore.recordSolve('problem_guest', 90);

      // Trigger logout cleanup
      localStore.setCurrentUser('user_to_be_cleared');
      await localStore.clearAuthenticatedData();

      // Verify active user reset to guest
      assert.strictEqual(localStore.getCurrentUser(), null);
      assert.strictEqual(localStore.isGuest(), true);

      // Verify authenticated data is gone
      localStore.setCurrentUser('user_to_be_cleared');
      const clearedDraft = await localStore.loadDraft('problem_x', 'javascript');
      const clearedSolve = await localStore.getSolveStatus('problem_x');
      assert.strictEqual(clearedDraft, null);
      assert.strictEqual(clearedSolve, null);

      // Verify guest data is intact!
      localStore.setCurrentUser(null);
      const guestDraft = await localStore.loadDraft('problem_guest', 'javascript');
      const guestSolve = await localStore.getSolveStatus('problem_guest');
      assert.strictEqual(guestDraft, '// Preserved Guest Code');
      assert.strictEqual(guestSolve?.isSolved, true);

      // Verify getGuestProgress returns guest items
      const guestList = await localStore.getGuestProgress();
      const hasProblemGuest = guestList.some((g) => g.problemId === 'problem_guest' && g.isSolved);
      assert.strictEqual(hasProblemGuest, true);
    });
  });

  // =========================================================================
  // 5. Guest-to-Account Transition & Idempotent Progress Import
  // =========================================================================
  describe('Guest-to-Account Transition & Import Invariants', () => {
    it('imports guest-completed progress into authenticated account idempotently without duplicates', async () => {
      const req1 = new NextRequest('http://localhost:3000/api/practice/import-guest-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${existingUserSessionToken}`,
        },
        body: JSON.stringify({
          guestRecords: [
            {
              problemId: testProblemId,
              isSolved: true,
              durationSec: 150,
              draftCode: '// Imported guest solution',
            },
          ],
        }),
      });

      const res1 = await importGuestProgressHandler(req1);
      assert.strictEqual(res1.status, 200);
      const data1 = await res1.json();
      assert.strictEqual(data1.success, true);
      assert.strictEqual(data1.importedCount, 1);

      // Verify an attempt was recorded under existingUserId
      const attempt = await prisma.practiceAttempt.findFirst({
        where: { userId: existingUserId, problemId: testProblemId },
      });
      assert.ok(attempt);
      assert.strictEqual(attempt.status, 'ACCEPTED');

      // Second import with identical payload must be idempotent (no duplicate solves or attempts)
      const req2 = new NextRequest('http://localhost:3000/api/practice/import-guest-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${existingUserSessionToken}`,
        },
        body: JSON.stringify({
          guestRecords: [
            {
              problemId: testProblemId,
              isSolved: true,
              durationSec: 150,
              draftCode: '// Imported guest solution',
            },
          ],
        }),
      });

      const res2 = await importGuestProgressHandler(req2);
      assert.strictEqual(res2.status, 200);
      const data2 = await res2.json();
      assert.strictEqual(data2.importedCount, 0, 'Second import must be idempotent and not create duplicate solves');
    });
  });

  // =========================================================================
  // 6. Session Logout and Invalidation
  // =========================================================================
  describe('Session Invalidation on Logout', () => {
    it('invalidates authenticated session token on logout', async () => {
      // Validate session is active
      const before = await AuthService.validateSession(existingUserSessionToken);
      assert.ok(before);

      // Perform logout
      await AuthService.logout(existingUserSessionToken);

      // Validate session is destroyed
      const after = await AuthService.validateSession(existingUserSessionToken);
      assert.strictEqual(after, null);

      // Subsequent API request with invalidated token returns 401
      const req = new NextRequest(`http://localhost:3000/api/dsa/${testProblemSlug}/solution`, {
        headers: {
          Authorization: `Bearer ${existingUserSessionToken}`,
        },
      });
      const res = await solutionHandler(req, { params: Promise.resolve({ slug: testProblemSlug }) });
      assert.strictEqual(res.status, 401);
    });
  });
});
