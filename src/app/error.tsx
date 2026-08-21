'use client';

import { useEffect } from 'react';
import { ShieldAlert, RotateCcw } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center text-foreground">
      <div className="rounded-full bg-destructive/10 p-4 text-destructive mb-4">
        <ShieldAlert size={36} />
      </div>
      <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
        Biosecurity Portal Alert
      </h2>
      <p className="mt-2 text-sm text-muted-foreground max-w-md">
        An unexpected application boundary error has occurred. Details have been logged to the network controller.
      </p>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-colors"
        >
          <RotateCcw size={16} />
          Reload Portal
        </button>
        <Link
          href="/"
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
        >
          Return to Entryway
        </Link>
      </div>
    </div>
  );
}

