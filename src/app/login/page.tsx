'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sprout, User, ShieldCheck, Landmark, Mail, Phone, Lock, Eye, EyeOff, FileText } from 'lucide-react';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import Link from 'next/link';

type RoleType = 'farmer' | 'officer' | 'admin';
type FarmType = 'POULTRY' | 'CATTLE' | 'GOAT' | 'PIG';

export default function LoginPage() {
  const router = useRouter();

  // Mode: login or register
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login Form State
  const [role, setRole] = useState<RoleType>('farmer');
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regFarmType, setRegFarmType] = useState<FarmType>('POULTRY');
  const [regDistrict, setRegDistrict] = useState('Namakkal');

  // Shared states
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const districts = ['Namakkal', 'Coimbatore', 'Salem', 'Vellore', 'Erode'];

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!emailOrMobile.trim()) {
      setError('Please enter your email, phone, or name.');
      return;
    }

    if (role !== 'farmer' && !loginPassword.trim()) {
      setError('Please enter your account password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrMobile: emailOrMobile.trim(),
          password: loginPassword,
          role
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      // Save user details to session caching
      localStorage.setItem('sih_farmer_phone', data.user.phone);
      localStorage.setItem('sih_farmer_name', data.user.name);
      localStorage.setItem('sih_farmer_id', data.user.id);
      
      if (data.farmId) {
        localStorage.setItem('sih_custom_farm_id', data.farmId);
        // Save which animal category they registered
        if (role === 'farmer') {
          // Find species details
          const speciesType = data.user.email.includes('@') ? 'POULTRY' : 'POULTRY'; // Fallback
          // We can read it or default it
        }
      }

      if (role === 'farmer') {
        router.push('/farmer/dashboard');
      } else if (role === 'officer') {
        router.push('/officer/dashboard');
      } else {
        router.push('/admin/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!regName.trim()) {
      setError('Please enter your name.');
      return;
    }

    if (!regPhone.trim()) {
      setError('Please enter your mobile phone number.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName.trim(),
          phone: regPhone.trim(),
          email: regEmail.trim() || null,
          farmType: regFarmType,
          district: regDistrict,
          role: 'farmer'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      // Save credentials in session cache
      localStorage.setItem('sih_farmer_phone', data.user.phone);
      localStorage.setItem('sih_farmer_name', data.user.name);
      localStorage.setItem('sih_farmer_id', data.user.id);
      localStorage.setItem('sih_selected_species', regFarmType);
      
      if (data.farmId) {
        localStorage.setItem('sih_custom_farm_id', data.farmId);
      }

      // Auto-login & redirect to farmer dashboard
      router.push('/farmer/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred during registration.');
    } finally {
      setLoading(false);
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
      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-sm">
          <div className="text-center mb-6">
            <Sprout className="h-10 w-10 text-primary mx-auto" />
            <h2 className="text-xl font-bold tracking-tight mt-3">Portal Authentication</h2>
            <p className="text-xs text-muted-foreground mt-1">
              {mode === 'login' 
                ? 'Sign in using your credentials to enter the platform'
                : 'Create your farmer profile to register your farm'}
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3.5 rounded-xl text-xs font-semibold flex items-start gap-2 mb-5">
              <span className="shrink-0 mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {mode === 'login' ? (
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
                          setLoginPassword('');
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

              {/* Identifier Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Username / Email / Mobile</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    {emailOrMobile.includes('@') ? <Mail size={16} /> : <Phone size={16} />}
                  </div>
                  <input
                    type="text"
                    required
                    value={emailOrMobile}
                    onChange={(e) => setEmailOrMobile(e.target.value)}
                    placeholder={role === 'farmer' ? "Enter your mobile or registered name" : "officer@domain.gov.in"}
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
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
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
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError(null);
                  }}
                  className="text-xs font-bold text-primary hover:underline cursor-pointer"
                >
                  Don't have an account? Register as Farmer
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Registration: Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Farmer Name</label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                />
              </div>

              {/* Registration: Mobile Number */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Mobile Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    <Phone size={14} />
                  </div>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full bg-secondary border border-border rounded-xl pl-8 pr-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Registration: Email (Optional) */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Email ID (Optional)</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="e.g. name@domain.com"
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                />
              </div>

              {/* Registration: Farm Category */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Farm Category</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['POULTRY', 'CATTLE', 'GOAT', 'PIG'] as const).map((f) => {
                    const isSel = regFarmType === f;
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
                        onClick={() => setRegFarmType(f)}
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

              {/* Registration: District selection */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">District Grid</label>
                <select
                  value={regDistrict}
                  onChange={(e) => setRegDistrict(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary cursor-pointer"
                >
                  {districts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 cursor-pointer mt-2"
              >
                {loading ? 'Registering Farm Profile...' : 'Register & Enter Portal'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className="text-xs font-bold text-primary hover:underline cursor-pointer"
                >
                  Already have an account? Sign In
                </button>
              </div>
            </form>
          )}

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