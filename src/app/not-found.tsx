import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
      <h2 className="text-3xl font-extrabold text-foreground">404 - Not Found</h2>
      <p className="text-sm text-muted-foreground max-w-md">
        The requested resource, concept, or interview session could not be found.
      </p>
      <Link href="/">
        <Button size="sm">Return to Command Center</Button>
      </Link>
    </div>
  );
}
