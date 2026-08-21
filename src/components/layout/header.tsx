'use client';

import { useState } from 'react';
import { Menu, Bell, User, Check, X, ShieldAlert, Languages } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { mockNotifications } from '@/mock-data';
import Link from 'next/link';
import { useLanguage, LanguageCode } from '@/components/language-provider';

interface HeaderProps {
  role: 'farmer' | 'officer' | 'admin';
  onMenuToggle: () => void;
}

export function Header({ role, onMenuToggle }: HeaderProps) {
  const { language, setLanguage } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card px-6">
      
      {/* Left side: Hamburger menu & Section title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="p-1 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground lg:hidden"
          aria-label="Open Sidebar"
        >
          <Menu size={22} />
        </button>
        
        <div>
          <h1 className="text-sm font-semibold tracking-tight capitalize text-muted-foreground">
            SIH-25006 Biosecurity Portal
          </h1>
          <p className="text-xs text-muted-foreground hidden sm:block">
            Digital Farm Management & Epidemic Control Grid
          </p>
        </div>
      </div>

      {/* Right side: Developer Quick Switch, Notifications, Theme Toggle */}
      <div className="flex items-center gap-4">
        
        {/* Developer Sandbox Portal Switcher */}
        <div className="hidden md:flex items-center gap-2 border-r border-border pr-4 mr-2 text-xs">
          <span className="text-muted-foreground font-medium">Evaluate:</span>
          <Link 
            href="/farmer/dashboard"
            className={`px-2 py-1 rounded transition-colors ${role === 'farmer' ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-secondary'}`}
          >
            Farmer
          </Link>
          <Link 
            href="/officer/dashboard"
            className={`px-2 py-1 rounded transition-colors ${role === 'officer' ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-secondary'}`}
          >
            Officer
          </Link>
          <Link 
            href="/admin/dashboard"
            className={`px-2 py-1 rounded transition-colors ${role === 'admin' ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-secondary'}`}
          >
            Admin
          </Link>
        </div>

        {/* Global Language Selector Dropdown */}
        <div className="flex items-center gap-1.5 bg-secondary border border-border px-2.5 py-1.5 rounded-lg shadow-sm">
          <Languages size={14} className="text-primary shrink-0" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            className="bg-transparent border-none text-foreground text-[11px] font-bold focus:outline-none cursor-pointer pr-1"
          >
            <option value="en" className="bg-popover text-popover-foreground">EN</option>
            <option value="ta" className="bg-popover text-popover-foreground">தமிழ்</option>
            <option value="ml" className="bg-popover text-popover-foreground">മലയാളം</option>
            <option value="hi" className="bg-popover text-popover-foreground">हिन्दी</option>
            <option value="mr" className="bg-popover text-popover-foreground">मराठी</option>
            <option value="gu" className="bg-popover text-popover-foreground">ગુજરાતી</option>
          </select>
        </div>

        {/* Theme Switching Trigger */}
        <ThemeToggle />


        {/* Notifications Icon Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground relative transition-colors"
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[8px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Dialog */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-lg border border-border bg-popover text-popover-foreground shadow-lg z-50 p-4">
              <div className="flex items-center justify-between border-b border-border pb-2 mb-3">
                <span className="font-bold text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllRead}
                    className="text-xs text-primary font-semibold hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <p className="text-center text-xs text-muted-foreground py-6">No notifications</p>
              ) : (
                <div className="space-y-3">
                  {notifications.map(n => (
                    <div 
                      key={n.id} 
                      className={`p-2.5 rounded-md border text-xs relative flex gap-2 ${
                        n.read ? 'bg-card border-border/50 text-muted-foreground' : 'bg-primary/5 border-primary/20 text-foreground font-medium'
                      }`}
                    >
                      {n.type === 'RISK_ALERT' && (
                        <ShieldAlert size={14} className="text-destructive shrink-0 mt-0.5" />
                      )}
                      
                      <div className="pr-4">
                        <p className="font-semibold text-foreground">{n.title}</p>
                        <p className="text-[11px] leading-relaxed mt-0.5">{n.message}</p>
                        <span className="text-[9px] text-muted-foreground block mt-1">
                          {new Date(n.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <button 
                        onClick={() => removeNotification(n.id)}
                        className="absolute top-1.5 right-1.5 text-muted-foreground hover:text-foreground"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
