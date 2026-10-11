import React, { useState } from 'react';
import { Bot, Terminal, Menu, X, Shield, Lock, Cpu } from 'lucide-react';
import type { WebsiteSettings } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  settings?: WebsiteSettings | null;
  onOpenCoordinator: () => void;
  isCoordinatorLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  settings,
  onOpenCoordinator,
  isCoordinatorLoggedIn
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'projects', label: 'Projects' },
    { id: 'xiaozhi', label: 'Xiaozhi AI' },
    { id: 'robotics', label: 'Robotics' },
    { id: 'workshop', label: 'Workshop' },
    { id: 'code', label: 'Code Vault' },
    { id: 'journey', label: 'Journey' },
    { id: 'about', label: 'About & Contact' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#070b14]/90 backdrop-blur-md border-b border-cyan-500/20 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group shrink-0 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-300 transition-colors shadow-[0_0_12px_rgba(0,240,255,0.2)]">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors whitespace-nowrap">
                {settings?.siteTitle || 'NEXUS LAB'}
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`transition-colors whitespace-nowrap py-1 relative ${
                  activeTab === link.id
                    ? 'text-cyan-400 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.label}
                {activeTab === link.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary Action / Coordinator Portal */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenCoordinator}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all whitespace-nowrap bg-cyan-950/60 text-cyan-300 border-cyan-500/50 hover:bg-cyan-900/60 shadow-[0_0_12px_rgba(0,240,255,0.25)]"
              title="Coordinator Dashboard"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Coordinator Panel</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenCoordinator}
              className="p-2 text-cyan-400 hover:text-cyan-300 focus:outline-none"
              title="Coordinator"
            >
              <Lock className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-cyan-500/20 bg-[#090e1a]/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === link.id
                  ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCoordinator();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg bg-cyan-950/80 text-cyan-300 border border-cyan-400/50"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Open Coordinator Panel</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
