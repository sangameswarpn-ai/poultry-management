'use client';

import { useRouter } from 'next/navigation';
import { Sprout, User, ShieldCheck, Landmark } from 'lucide-react';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();

  const handleMockLogin = (role: 'farmer' | 'officer' | 'admin') => {
    // Mock login redirect
    if (role === 'farmer') {
      router.push('/farmer/dashboard');
    } else if (role === 'officer') {
      router.push('/officer/dashboard');
    } else {
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Header */}
      <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Sprout className="h-6 w-6 text-primary" />
          <span className="font-bold text-base tracking-tight">PoultryLens AI</span>
        </Link>
        <ThemeToggle />
      </header>


      {/* Main Form container */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-sm">
          <div className="text-center mb-8">
            <Sprout className="h-10 w-10 text-primary mx-auto" />
            <h2 className="text-xl font-bold tracking-tight mt-3">Portal Authentication</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Select a mock profile to sign in immediately for evaluation
            </p>
          </div>

          <div className="space-y-4">
            {/* Farmer Mock Profile */}
            <button
              onClick={() => handleMockLogin('farmer')}
              className="flex w-full items-center gap-4 border border-border p-4 rounded-xl hover:bg-secondary/50 text-left transition-colors group"
            >
              <div className="bg-green-500/10 text-green-600 dark:text-green-400 p-2.5 rounded-lg">
                <User size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">Farmer Profile</p>
                <p className="text-xs text-muted-foreground">Ramesh Kumar — Sri Murugan Farm</p>
              </div>
              <span className="text-xs text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Enter →
              </span>
            </button>

            {/* Officer Mock Profile */}
            <button
              onClick={() => handleMockLogin('officer')}
              className="flex w-full items-center gap-4 border border-border p-4 rounded-xl hover:bg-secondary/50 text-left transition-colors group"
            >
              <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 p-2.5 rounded-lg">
                <ShieldCheck size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">Veterinary Officer</p>
                <p className="text-xs text-muted-foreground">Dr. Amit Patel — District Health Officer</p>
              </div>
              <span className="text-xs text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Enter →
              </span>
            </button>

            {/* Admin Mock Profile */}
            <button
              onClick={() => handleMockLogin('admin')}
              className="flex w-full items-center gap-4 border border-border p-4 rounded-xl hover:bg-secondary/50 text-left transition-colors group"
            >
              <div className="bg-purple-500/10 text-purple-600 dark:text-purple-400 p-2.5 rounded-lg">
                <Landmark size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">State Director Office</p>
                <p className="text-xs text-muted-foreground">State Administrator — Tamil Nadu Grid</p>
              </div>
              <span className="text-xs text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Enter →
              </span>
            </button>
          </div>

          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink mx-4 text-muted-foreground text-[10px] uppercase font-bold tracking-widest">
              Security Notice
            </span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <p className="text-[10px] text-center text-muted-foreground leading-relaxed">
            This deployment is running in **SIH Demo Mode**. Role authentication uses pre-loaded session telemetry. Production deployment links will connect to AWS Aurora PostgreSQL and NextAuth keychains.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-[10px] text-muted-foreground border-t border-border bg-card">
        SIH25006 Project Authentication Grid
      </footer>
    </div>
  );
}
