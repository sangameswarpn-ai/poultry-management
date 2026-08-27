'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sprout, User, ShieldCheck, Landmark, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import Link from 'next/link';

type RoleType = 'farmer' | 'officer' | 'admin';
type FarmType = 'POULTRY' | 'CATTLE' | 'GOAT' | 'PIG';

export default function LoginPage() {
  const router = useRouter();

  // Form State
  const [role, setRole] = useState<RoleType>('farmer');
  const [farmType, setFarmType] = useState<FarmType>('POULTRY');
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!emailOrMobile.trim()) {
      setError('Please enter a valid email address or mobile number.');
      return;
    }

    if (role !== 'farmer' && !password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    // Save farmer contact info and redirect based on role and species selection
    localStorage.setItem('sih_farmer_phone', emailOrMobile.trim());
    if (role === 'farmer') {
      localStorage.setItem('sih_selected_species', farmType);
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
          <div className="text-center mb-6">
            <Sprout className="h-10 w-10 text-primary mx-auto" />
            <h2 className="text-xl font-bold tracking-tight mt-3">Portal Authentication</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Sign in using your credentials to enter the platform
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3.5 rounded-xl text-xs font-semibold flex items-start gap-2 mb-5">
              <span className="shrink-0 mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            {/* Role Selection */}
            <div>
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">Select Your Role</label>
              <div className="grid grid-cols-3 gap-2">
                {(['farmer', 'officer', 'admin'] as const).map((r) => {
                  const isSel = role === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setRole(r);
                        setPassword('');
                        setError(null);
                      }}
                      className={`py-2 px-1.5 rounded-lg border text-xs font-bold text-center flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                        isSel 
                          ? 'border-primary bg-primary/5 text-primary' 
                          : 'border-border text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                      }`}
                    >
                      {r === 'farmer' ? <User size={16} /> : r === 'officer' ? <ShieldCheck size={16} /> : <Landmark size={16} />}
                      <span className="capitalize">{r}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {role === 'farmer' && (
              <div className="border border-border p-4 rounded-xl bg-secondary/20">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">Select Farm Category</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['POULTRY', 'CATTLE', 'GOAT', 'PIG'] as const).map((f) => {
                    const isSel = farmType === f;
                    const getIcon = (ft: FarmType) => {
                      switch (ft) {
                        case 'CATTLE': return '🐄';
                        case 'GOAT': return '🐐';
                        case 'PIG': return '🐖';
                        default: return '🐓';
                      }
                    };
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFarmType(f)}
                        className={`py-2 rounded-lg border text-center flex flex-col items-center gap-1 cursor-pointer transition-all ${
                          isSel 
                            ? 'border-primary bg-primary/10 text-primary font-bold' 
                            : 'border-border text-muted-foreground hover:text-foreground bg-card'
                        }`}
                      >
                        <span className="text-sm">{getIcon(f)}</span>
                        <span className="text-[9px] font-semibold">{f === 'POULTRY' ? 'Birds' : f === 'CATTLE' ? 'Cows' : f === 'GOAT' ? 'Goats' : 'Pigs'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Identifier Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Email or Mobile Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  {emailOrMobile.includes('@') ? <Mail size={16} /> : <Phone size={16} />}
                </div>
                <input
                  type="text"
                  required
                  value={emailOrMobile}
                  onChange={(e) => setEmailOrMobile(e.target.value)}
                  placeholder={role === 'farmer' ? "example@mail.com or 9876543210" : "officer@domain.gov.in"}
                  className="w-full bg-secondary border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Password Input (Only for Officers/Admins) */}
            {role !== 'farmer' && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Account Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    maxLength={30}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-secondary border border-border rounded-xl pl-10 pr-10 py-2.5 text-xs font-semibold focus:outline-none focus:border-primary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground italic leading-tight mt-1">
                  🔒 Admin access: Enter standard credentials (e.g. admin123) to continue.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Authenticating...' : 'Verify & Enter Portal'}
            </button>
          </form>

          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink mx-4 text-muted-foreground text-[10px] uppercase font-bold tracking-widest">
              Live Authentication
            </span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <p className="text-[10px] text-center text-muted-foreground leading-relaxed">
            Authentication is secured via end-to-end sandbox sessions. Local storage caches your settings preferences.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-[10px] text-muted-foreground border-t border-border bg-card">
        PoultryLens AI Project Authentication Grid
      </footer>
    </div>
  );
}