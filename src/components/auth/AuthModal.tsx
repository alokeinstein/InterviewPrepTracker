'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Mail,
  Lock,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  X,
  RefreshCw,
  Globe,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: (user: any) => void;
  initialMode?: 'LOGIN' | 'SIGNUP';
}

type AuthStep =
  | 'EMAIL'
  | 'PASSWORD_LOGIN'
  | 'SIGNUP_OTP'
  | 'SIGNUP_DETAILS'
  | 'FORGOT_OTP'
  | 'FORGOT_NEW_PASSWORD'
  | 'ACCOUNT_LINK'
  | 'SUCCESS';

export const GoogleIcon = () => (
  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

export function AuthModal({ isOpen, onClose, onAuthSuccess, initialMode = 'LOGIN' }: AuthModalProps) {
  const [step, setStep] = useState<AuthStep>('EMAIL');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [username, setUsername] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [signupToken, setSignupToken] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [linkToken, setLinkToken] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // Username validation state
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  // Check URL query parameters for required account linking from Google callback
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('requiresLink') === 'true' && params.get('linkToken')) {
        setEmail(params.get('email') || '');
        setLinkToken(params.get('linkToken') || '');
        setStep('ACCOUNT_LINK');
      }
    }
  }, []);

  // Initialize timezone from browser
  useEffect(() => {
    try {
      const clientTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (clientTz) setTimezone(clientTz);
    } catch {}
  }, []);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // Username debounced live availability check
  useEffect(() => {
    if (!username.trim() || username.length < 3) {
      setUsernameAvailable(null);
      setUsernameError(null);
      return;
    }

    if (!/^[a-zA-Z0-9_-]{3,30}$/.test(username)) {
      setUsernameAvailable(false);
      setUsernameError('3-30 letters, numbers, hyphens or underscores');
      return;
    }

    const timer = setTimeout(async () => {
      setUsernameChecking(true);
      try {
        const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(username.trim())}`);
        const data = await res.json();
        if (data.available) {
          setUsernameAvailable(true);
          setUsernameError(null);
        } else {
          setUsernameAvailable(false);
          setUsernameError(data.reason || 'Username is already taken');
        }
      } catch {
        setUsernameAvailable(null);
      } finally {
        setUsernameChecking(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [username]);

  if (!isOpen) return null;

  const resetAll = () => {
    setStep('EMAIL');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setOtp('');
    setUsername('');
    setSignupToken('');
    setResetToken('');
    setLinkToken('');
    setError(null);
    setLoading(false);
  };

  const handleClose = () => {
    resetAll();
    onClose();
  };

  const handleContinueWithGoogle = () => {
    const returnTo = typeof window !== 'undefined' ? window.location.pathname : '/analytics';
    window.location.href = `/api/auth/google?returnTo=${encodeURIComponent(returnTo)}`;
  };

  const handleLinkAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/google/link-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password, linkToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to link account.');
      }
      onAuthSuccess?.(data.user);
      setStep('SUCCESS');
      setTimeout(() => {
        handleClose();
        window.location.href = '/analytics';
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Account linking failed.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Check Email
  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.endsWith('@gmail.com') || !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(cleanEmail)) {
      setError('Please enter a valid Gmail address (@gmail.com).');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to verify email');
      }

      if (data.exists && data.hasPassword) {
        // Existing user -> Password login
        setStep('PASSWORD_LOGIN');
      } else {
        // New user -> Send OTP
        await handleSendSignupOtp(cleanEmail);
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Send Signup OTP
  const handleSendSignupOtp = async (targetEmail: string) => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, purpose: 'SIGNUP' }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send OTP code');
      }

      setCooldown(data.cooldownSec || 60);
      setStep('SIGNUP_OTP');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP code');
    } finally {
      setLoading(false);
    }
  };

  // Step 2A: Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      onAuthSuccess?.(data.user);
      setStep('SUCCESS');
      setTimeout(() => {
        handleClose();
        window.location.reload();
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Step 2B: Verify Signup OTP
  const handleVerifySignupOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
          purpose: 'SIGNUP',
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid verification code');
      }

      setSignupToken(data.signupToken);
      // Pre-fill default username from email
      const defaultName = email.split('@')[0].replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 20);
      setUsername(defaultName);
      setStep('SIGNUP_DETAILS');
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Step 2C: Complete Signup (Password + Username)
  const handleCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!usernameAvailable) {
      setError('Please choose an available username.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/complete-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          signupToken,
          password,
          username: username.trim(),
          timezone,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete registration');
      }

      onAuthSuccess?.(data.user);
      setStep('SUCCESS');
      setTimeout(() => {
        handleClose();
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Step 3A: Trigger Forgot Password OTP
  const handleTriggerForgotPassword = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), purpose: 'PASSWORD_RESET' }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send reset code');
      }

      setCooldown(data.cooldownSec || 60);
      setStep('FORGOT_OTP');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  // Step 3B: Verify Forgot Password OTP
  const handleVerifyForgotOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
          purpose: 'PASSWORD_RESET',
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid reset code');
      }

      setResetToken(data.resetToken);
      setPassword('');
      setConfirmPassword('');
      setStep('FORGOT_NEW_PASSWORD');
    } catch (err: any) {
      setError(err.message || 'Code verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Step 3C: Set New Password
  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          resetToken,
          newPassword: password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setStep('SUCCESS');
      setTimeout(() => {
        handleClose();
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-border/80 bg-card p-6 shadow-2xl space-y-5">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <Badge variant="outline" className="text-[10px] font-mono tracking-wider">
              OFFICIAL AUTHENTICATION
            </Badge>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            {step === 'EMAIL' && 'Sign in to Interview Prep OS'}
            {step === 'PASSWORD_LOGIN' && 'Enter your password'}
            {step === 'SIGNUP_OTP' && 'Verify your Gmail'}
            {step === 'SIGNUP_DETAILS' && 'Set up your profile'}
            {step === 'FORGOT_OTP' && 'Reset your password'}
            {step === 'FORGOT_NEW_PASSWORD' && 'Create a new password'}
            {step === 'ACCOUNT_LINK' && 'Link Google Account'}
            {step === 'SUCCESS' && 'Authentication successful'}
          </h2>
          <p className="text-xs text-muted-foreground">
            {step === 'EMAIL' && 'Choose your preferred sign-in method to access your practice tracking.'}
            {step === 'PASSWORD_LOGIN' && `Welcome back! Signing in as ${email}`}
            {step === 'SIGNUP_OTP' && `We've sent a 6-digit code to ${email}`}
            {step === 'SIGNUP_DETAILS' && 'Choose your password and unique public username.'}
            {step === 'FORGOT_OTP' && `Enter the 6-digit reset code sent to ${email}`}
            {step === 'FORGOT_NEW_PASSWORD' && 'Enter your new password below.'}
            {step === 'ACCOUNT_LINK' && `Confirm your password to link ${email} with your Google identity.`}
            {step === 'SUCCESS' && 'Redirecting to your dashboard...'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-lg border border-destructive/40 bg-destructive/10 text-xs text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Email Form */}
        {step === 'EMAIL' && (
          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleContinueWithGoogle}
              className="w-full h-10 text-xs font-semibold gap-2.5 border-border hover:bg-muted/70 transition-all bg-card/60 shadow-sm"
            >
              <GoogleIcon />
              <span>Continue with Google</span>
            </Button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border/60" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">
                or sign in with password
              </span>
              <div className="h-px flex-1 bg-border/60" />
            </div>

            <form onSubmit={handleCheckEmail} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Gmail Address</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  autoFocus
                />
                <p className="text-[11px] text-muted-foreground">
                  Only valid <strong className="text-foreground">@gmail.com</strong> accounts are supported.
                </p>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-9 text-xs font-semibold gap-1.5">
                {loading ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <>
                    <span>Continue with Gmail</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </form>
          </div>
        )}

        {/* STEP: Account Linking (Existing Password Account) */}
        {step === 'ACCOUNT_LINK' && (
          <form onSubmit={handleLinkAccount} className="space-y-4">
            <div className="p-3.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-xs text-amber-300 space-y-1">
              <p className="font-semibold flex items-center gap-1.5 text-amber-400">
                <Lock className="h-3.5 w-3.5" />
                Security Verification Required
              </p>
              <p className="text-[11px] text-amber-200/90 leading-relaxed">
                An account with email <strong>{email}</strong> already exists with a password. Please confirm your password below to securely link your Google account.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Existing Account Password</span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                autoFocus
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full h-9 text-xs font-semibold">
              {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : 'Confirm Password & Link Account'}
            </Button>
          </form>
        )}

        {/* STEP 2A: Password Login */}
        {step === 'PASSWORD_LOGIN' && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Password</span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setStep('EMAIL');
                }}
                className="text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>Switch account</span>
              </button>

              <button
                type="button"
                onClick={handleTriggerForgotPassword}
                className="text-primary hover:underline font-medium"
              >
                Forgot password?
              </button>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-9 text-xs font-semibold">
              {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : 'Sign In'}
            </Button>
          </form>
        )}

        {/* STEP 2B: Signup OTP Verification */}
        {step === 'SIGNUP_OTP' && (
          <form onSubmit={handleVerifySignupOtp} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>6-Digit Verification Code</span>
              </label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center tracking-[8px] font-mono font-bold text-lg px-3.5 py-2 rounded-lg bg-muted/50 border border-border text-foreground placeholder:tracking-normal placeholder:font-sans placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Code expires in 10 minutes</span>
              {cooldown > 0 ? (
                <span className="flex items-center gap-1 text-[11px] font-mono">
                  <Clock className="h-3 w-3" />
                  <span>Resend in {cooldown}s</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSendSignupOtp(email)}
                  disabled={loading}
                  className="text-primary hover:underline font-medium"
                >
                  Resend code
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('EMAIL')}
                className="w-1/3 h-9 text-xs"
              >
                Back
              </Button>
              <Button type="submit" disabled={loading || otp.length !== 6} className="w-2/3 h-9 text-xs font-semibold">
                {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : 'Verify Code'}
              </Button>
            </div>
          </form>
        )}

        {/* STEP 2C: Signup Details (Password & Username) */}
        {step === 'SIGNUP_DETAILS' && (
          <form onSubmit={handleCompleteSignup} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Unique Username</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="cool_coder"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-1.5 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary pr-20"
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-medium">
                  {usernameChecking && <RefreshCw className="h-3 w-3 animate-spin text-muted-foreground" />}
                  {!usernameChecking && usernameAvailable === true && (
                    <span className="text-emerald-400 flex items-center gap-0.5">
                      <CheckCircle2 className="h-3 w-3" /> Available
                    </span>
                  )}
                  {!usernameChecking && usernameAvailable === false && (
                    <span className="text-rose-400 flex items-center gap-0.5">
                      <AlertCircle className="h-3 w-3" /> Taken
                    </span>
                  )}
                </div>
              </div>
              {usernameError && <p className="text-[10px] text-destructive">{usernameError}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Create Password</span>
              </label>
              <input
                type="password"
                required
                minLength={8}
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-1.5 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Confirm Password</span>
              </label>
              <input
                type="password"
                required
                minLength={8}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-1.5 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Timezone (for accurate midnight calendar streaks)</span>
              </label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3.5 py-1.5 rounded-lg bg-muted/50 border border-border text-xs text-foreground font-mono focus:outline-none"
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !usernameAvailable}
              className="w-full h-9 text-xs font-semibold mt-2"
            >
              {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : 'Create Account & Start Practicing'}
            </Button>
          </form>
        )}

        {/* STEP 3A: Forgot Password OTP */}
        {step === 'FORGOT_OTP' && (
          <form onSubmit={handleVerifyForgotOtp} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                <span>6-Digit Password Reset Code</span>
              </label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center tracking-[8px] font-mono font-bold text-lg px-3.5 py-2 rounded-lg bg-muted/50 border border-border text-foreground placeholder:tracking-normal placeholder:font-sans placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Code expires in 10 minutes</span>
              {cooldown > 0 ? (
                <span className="flex items-center gap-1 text-[11px] font-mono">
                  <Clock className="h-3 w-3" />
                  <span>Resend in {cooldown}s</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleTriggerForgotPassword}
                  disabled={loading}
                  className="text-primary hover:underline font-medium"
                >
                  Resend code
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('PASSWORD_LOGIN')}
                className="w-1/3 h-9 text-xs"
              >
                Back
              </Button>
              <Button type="submit" disabled={loading || otp.length !== 6} className="w-2/3 h-9 text-xs font-semibold">
                {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : 'Verify Code'}
              </Button>
            </div>
          </form>
        )}

        {/* STEP 3B: Set New Password */}
        {step === 'FORGOT_NEW_PASSWORD' && (
          <form onSubmit={handleSetNewPassword} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                <span>New Password</span>
              </label>
              <input
                type="password"
                required
                minLength={8}
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-1.5 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                autoFocus
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Confirm New Password</span>
              </label>
              <input
                type="password"
                required
                minLength={8}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-1.5 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full h-9 text-xs font-semibold mt-2">
              {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : 'Update Password & Sign In'}
            </Button>
          </form>
        )}

        {/* SUCCESS State */}
        {step === 'SUCCESS' && (
          <div className="py-6 text-center space-y-2">
            <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-base text-foreground">Welcome to Interview Prep OS</h3>
            <p className="text-xs text-muted-foreground">Session active. Loading your analytics...</p>
          </div>
        )}
      </div>
    </div>
  );
}
