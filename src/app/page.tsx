'use client';

import Link from 'next/link';
import { Sprout, ShieldAlert, Users, TrendingUp, ChevronRight, Lock } from 'lucide-react';
import { ThemeToggle } from '@/components/layout/theme-toggle';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navbar */}
      <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-2">
          <Sprout className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg tracking-tight">PoultryLens AI</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Lock size={14} />
            Portal Sign-In
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 py-12">
        
        {/* Banner Section */}
        <div className="text-center max-w-3xl mb-12">
          <span className="bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            SIH 2025 Project — SIH25006
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Digital Farm Management & Biosecurity Portal
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            A state-of-the-art diagnostic system mapping disease transmission risks, animal mortalities, and visitor logs across poultry grids. Enabling instant coordination between Farmers, Veterinary Officers, and State Admins.
          </p>
        </div>

        {/* Core Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl mb-12">
          {[
            { value: "15", label: "Registered Farms", icon: Sprout },
            { value: "82.4%", label: "Biosecurity Compliance", icon: TrendingUp },
            { value: "4", label: "Active Risk Alerts", icon: ShieldAlert, alert: true },
            { value: "3 Districts", label: "Territorial Grid", icon: Users }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-card border border-border p-5 rounded-xl flex flex-col justify-between">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
                  <Icon size={16} className={stat.alert ? 'text-risk-high animate-pulse' : 'text-primary'} />
                </div>
                <span className="text-2xl font-bold tracking-tight">{stat.value}</span>
              </div>
            );
          })}
        </div>

        {/* User Role Access Cards */}
        <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl">
          {/* Farmer Portal */}
          <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="bg-green-500/10 text-green-600 dark:text-green-400 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Sprout size={24} />
              </div>
              <h3 className="text-lg font-bold">Farmer Portal</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Submit daily biosecurity checklists, record flock mortality rates, log vehicle disinfection, report suspect symptoms, and receive government advisories.
              </p>
            </div>
            <Link
              href="/farmer/dashboard"
              className="mt-6 flex items-center justify-between text-sm font-bold text-primary hover:underline group"
            >
              Access Farmer Panel
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Officer Portal */}
          <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-lg font-bold">Veterinary Officer</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Monitor regional GIS maps, inspect high-mortality alerts, schedule diagnostic field visits, input inspection notes, and issue quarantine notices.
              </p>
            </div>
            <Link
              href="/officer/dashboard"
              className="mt-6 flex items-center justify-between text-sm font-bold text-primary hover:underline group"
            >
              Access Officer Panel
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Admin Portal */}
          <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="bg-purple-500/10 text-purple-600 dark:text-purple-400 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-lg font-bold">Admin Directory</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Analyze state-wide compliance levels, inspect mortality curves, monitor district response rates, and coordinate epidemic containment measures.
              </p>
            </div>
            <Link
              href="/admin/dashboard"
              className="mt-6 flex items-center justify-between text-sm font-bold text-primary hover:underline group"
            >
              Access Admin Panel
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card text-center py-6 text-xs text-muted-foreground">
        <p>© 2026 PoultryLens AI. Smart India Hackathon Project ID: SIH25006.</p>
        <p className="mt-1">Developed for biosecurity management in pig & poultry farms across Indian districts.</p>
      </footer>
    </div>
  );
}
