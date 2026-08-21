import Link from 'next/link';
import { EyeOff } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center text-foreground">
      <div className="rounded-full bg-muted p-4 text-muted-foreground mb-4">
        <EyeOff size={36} />
      </div>
      <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
        Portal Path Not Found
      </h2>
      <p className="mt-2 text-sm text-muted-foreground max-w-md">
        The requested module or farm registry record does not exist on this server.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
}
