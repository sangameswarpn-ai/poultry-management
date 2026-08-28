'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Sprout, 
  ShieldAlert, 
  HeartPulse, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  ClipboardCheck,
  Building2
} from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

interface SidebarProps {
  role: 'farmer' | 'field_worker' | 'officer' | 'admin';
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();

  const [customName, setCustomName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('sih_farmer_name');
    if (name) setCustomName(name);
  }, []);

  // Define navigation items dynamically with translations
  const menuItems = {
    farmer: [
      { name: t.dashboard, href: '/farmer/dashboard', icon: LayoutDashboard },
      { name: t.myFarm, href: '/farmer/farm', icon: Building2 },
      { name: t.biosecurity, href: '/farmer/biosecurity', icon: ClipboardCheck },
      { name: t.healthLog, href: '/farmer/health', icon: HeartPulse },
      { name: t.visitorsLog, href: '/farmer/visitors', icon: Users },
      { name: t.reportDisease, href: '/farmer/reports', icon: FileText },
      { name: t.riskAlerts, href: '/farmer/alerts', icon: ShieldAlert },
      { name: t.settings, href: '/farmer/settings', icon: Settings },
    ],
    officer: [
      { name: 'Overview Map', href: '/officer/dashboard', icon: LayoutDashboard },
      { name: 'Farms Registry', href: '/officer/farms', icon: Building2 },
      { name: 'Active Alerts', href: '/officer/alerts', icon: ShieldAlert },
      { name: 'Inspections', href: '/officer/inspections', icon: ClipboardCheck },
      { name: 'Health Reports', href: '/officer/reports', icon: FileText },
      { name: 'Settings', href: '/officer/settings', icon: Settings },
    ],
    admin: [
      { name: 'Territorial Board', href: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Farms Database', href: '/admin/farms', icon: Building2 },
      { name: 'District Stats', href: '/admin/districts', icon: ClipboardCheck },
      { name: 'Deep Analytics', href: '/admin/analytics', icon: FileText },
      { name: 'Settings', href: '/admin/settings', icon: Settings },
    ],
    field_worker: [
      { name: 'Field Dashboard', href: '/field-worker/dashboard', icon: LayoutDashboard },
      { name: 'Quick Report', href: '/field-worker/dashboard?report=true', icon: FileText },
      { name: 'Vaccination Log', href: '/field-worker/dashboard?tab=vaccination', icon: ClipboardCheck },
      { name: 'Treatment Log', href: '/field-worker/dashboard?tab=treatment', icon: HeartPulse },
    ]
  };

  const items = menuItems[role] || [];

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <>
      {/* Sidebar Backdrop for Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container with colorful emerald top border on active elements */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-card border-r border-border transition-transform lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-border bg-secondary/20">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <Sprout className="h-6 w-6 text-primary animate-bounce" />
            <span className="font-bold text-lg tracking-tight text-foreground">PoultryLens AI</span>
          </Link>
          <span className="bg-primary/20 text-primary text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
            {role}
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20 translate-x-1' 
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-primary-foreground' : 'text-muted-foreground'} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-border bg-secondary/40">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm uppercase border border-primary/20">
              {role[0]}
            </div>
            <div className="truncate text-xs">
              <p className="font-bold text-foreground truncate">
                {role === 'farmer' ? (customName || 'Ramesh Kumar') : role === 'officer' ? 'Dr. Amit Patel' : 'Director Admin'}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {role === 'farmer' ? (typeof window !== 'undefined' ? localStorage.getItem('sih_farmer_phone') || 'FRM-001' : 'FRM-001') : 'District Officer'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut size={18} />
            {t.exitPortal}
          </button>
        </div>
      </aside>
    </>
  );
}
