'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthModal, GoogleIcon } from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Shield, LogIn, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleGoogleSignIn = () => {
    window.location.href = '/api/auth/google?returnTo=/analytics';
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-8 text-center space-y-6 bg-card/60 backdrop-blur-md border-border/80 shadow-2xl">
        <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
          <Shield className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Sign In to Interview OS
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Access your practice history, evidence-based metrics, SM-2 spaced repetition queue, and coding readiness telemetry.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full h-11 gap-3 font-semibold text-xs border-border hover:bg-muted/70 transition-all bg-card/70 shadow-sm"
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </Button>

          <div className="flex items-center gap-3 my-2">
            <div className="h-px flex-1 bg-border/60" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">or</span>
            <div className="h-px flex-1 bg-border/60" />
          </div>

          <Button
            onClick={() => setShowModal(true)}
            variant="default"
            className="w-full h-10 gap-2 font-semibold text-xs"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In with Password / Gmail OTP</span>
          </Button>
        </div>
      </Card>

      <AuthModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAuthSuccess={() => router.push('/analytics')}
      />
    </div>
  );
}
