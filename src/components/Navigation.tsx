import React, { useEffect } from 'react';
import { Shield, Home, Search, History, ShieldCheck, Settings, Lock, EyeOff } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export type ActiveTab = 'home' | 'phantom' | 'scan' | 'protection' | 'history' | 'settings';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onStartScan: (type: 'message' | 'url') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const { theme } = useSettings();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.setAttribute('data-theme', 'dark');
        root.classList.add('dark');
      } else {
        root.setAttribute('data-theme', 'light');
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'phantom', label: 'Phantom', icon: EyeOff },
    { id: 'scan', label: 'Scan', icon: Search },
    { id: 'protection', label: 'Protection', icon: ShieldCheck },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {/* Top Header */}
      <header
        className="sticky top-0 z-40 backdrop-blur-md px-4 lg:px-8 py-3 flex items-center justify-between transition-colors shadow-xs"
        style={{
          backgroundColor: 'var(--surface-primary)',
          borderBottom: '1px solid var(--border-color)',
          color: 'var(--text-primary)'
        }}
      >
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
              PandoraShield
            </h1>
            <p className="text-[10px] font-medium tracking-wide" style={{ color: 'var(--text-muted)' }}>Local-First Scam Protection</p>
          </div>
        </div>

        {/* Privacy Indicator Badge */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
          style={{
            backgroundColor: 'var(--surface-secondary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)'
          }}
        >
          <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden sm:inline">Protected locally</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </header>

      {/* Desktop Sidebar / Navigation Rail */}
      <aside
        className="hidden lg:flex flex-col w-64 fixed left-0 top-15 bottom-0 p-4 z-30 transition-colors"
        style={{
          backgroundColor: 'var(--surface-primary)',
          borderRight: '1px solid var(--border-color)'
        }}
      >
        <div className="space-y-1.5 flex-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as ActiveTab)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer"
                style={{
                  backgroundColor: isActive ? 'var(--surface-secondary)' : 'transparent',
                  color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--border-color)' : '1px solid transparent'
                }}
              >
                <Icon className="w-5 h-5" style={{ color: isActive ? 'var(--brand-primary)' : 'var(--text-muted)' }} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Desktop Footer Privacy Card */}
        <div
          className="p-3.5 rounded-xl text-xs space-y-1.5"
          style={{
            backgroundColor: 'var(--surface-secondary)',
            border: '1px solid var(--border-color)'
          }}
        >
          <div className="flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400">
            <Lock className="w-4 h-4" /> Local-First Engine
          </div>
          <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            On-device analysis. Your data stays under your control.
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 backdrop-blur-lg px-2 py-2 z-50 flex items-center justify-around shadow-lg transition-colors"
        style={{
          backgroundColor: 'var(--nav-bg)',
          borderTop: '1px solid var(--nav-border)'
        }}
      >
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as ActiveTab)}
              className="flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all cursor-pointer"
              style={{
                color: isActive ? 'var(--nav-active)' : 'var(--nav-inactive)'
              }}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
