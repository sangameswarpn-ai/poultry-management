'use client';

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
  AlertCircle, 
  CalendarRange, 
  Map, 
  BarChart3, 
  Building2, 
  LogOut,
  ClipboardCheck
} from 'lucide-react';

interface SidebarProps {
  role: 'farmer' | 'officer' | 'admin';
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Define navigation items dynamically per role
  const menuItems = {
    farmer: [
      { name: 'Dashboard', href: '/farmer/dashboard', icon: LayoutDashboard },
      { name: 'My Farm', href: '/farmer/farm', icon: Building2 },
      { name: 'Biosecurity', href: '/farmer/biosecurity', icon: ClipboardCheck },
      { name: 'Health Log', href: '/farmer/health', icon: HeartPulse },
      { name: 'Visitors Log', href: '/farmer/visitors', icon: Users },
      { name: 'Report Disease', href: '/farmer/reports', icon: FileText },
      { name: 'Risk Alerts', href: '/farmer/alerts', icon: ShieldAlert },
      { name: 'Settings', href: '/farmer/settings', icon: Settings },
    ],
    officer: [
      { name: 'Overview Map', href: '/officer/dashboard', icon: Map },
      { name: 'Farms Registry', href: '/officer/farms', icon: Building2 },
      { name: 'Active Alerts', href: '/officer/alerts', icon: AlertCircle },
      { name: 'Inspections', href: '/officer/inspections', icon: CalendarRange },
      { name: 'Health Reports', href: '/officer/reports', icon: FileText },
      { name: 'Settings', href: '/officer/settings', icon: Settings },
    ],
    admin: [
      { name: 'Territorial Board', href: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Farms Database', href: '/admin/farms', icon: Building2 },
      { name: 'District Stats', href: '/admin/districts', icon: Map },
      { name: 'Deep Analytics', href: '/admin/analytics', icon: BarChart3 },
      { name: 'Settings', href: '/admin/settings', icon: Settings },
    ]
  };

  const items = menuItems[role] || [];

  const handleLogout = () => {
    // Clear mock session (simulated)
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

      {/* Sidebar Container */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-card border-r border-border transition-transform lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <Sprout className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg tracking-tight">PoultryLens AI</span>
          </Link>
          <span className="bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
            {role}
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-primary-foreground' : 'text-muted-foreground'} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Role Quick-Switch and Logout */}
        <div className="p-4 border-t border-border bg-secondary/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm uppercase">
              {role[0]}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-foreground truncate">
                {role === 'farmer' ? 'Ramesh Kumar' : role === 'officer' ? 'Dr. Amit Patel' : 'Director Admin'}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {role === 'farmer' ? 'FRM-001' : 'District Officer'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/15 transition-colors"
          >
            <LogOut size={18} />
            Exit Portal
          </button>
        </div>
      </aside>
    </>
  );
}
