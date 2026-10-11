import React from 'react';
import { Cpu, Github, Youtube, Linkedin, Lock, Radio } from 'lucide-react';
import type { WebsiteSettings } from '../types';

interface FooterProps {
  settings?: WebsiteSettings | null;
  onOpenCoordinator: () => void;
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenCoordinator, onNavigate }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#050811] text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              {settings?.siteTitle || 'NEXUS LAB'}
            </span>
          </div>
          <p className="text-sm text-slate-400 max-w-md leading-relaxed">
            {settings?.tagline || 'Autonomous Robotics, Embedded Circuits & AI Systems.'} An open engineering laboratory documenting hardware builds, firmware development, circuit schematics, and autonomous robotics.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>Maker: {settings?.makerName || 'Agam Singh'}</span>
            <span aria-hidden="true">·</span>
            <span>Firmware: ESP-IDF & C++</span>
            <span aria-hidden="true">·</span>
            <span>Status: Active Prototyping</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Navigation</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <button onClick={() => onNavigate('projects')} className="hover:text-cyan-400 transition-colors">
                Project Lab
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('xiaozhi')} className="hover:text-cyan-400 transition-colors">
                Xiaozhi AI Assistant
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('robotics')} className="hover:text-cyan-400 transition-colors">
                Robotics Room
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('workshop')} className="hover:text-cyan-400 transition-colors">
                Electronics Workshop
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('code')} className="hover:text-cyan-400 transition-colors">
                Code Vault
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('journey')} className="hover:text-cyan-400 transition-colors">
                Maker Journey
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Laboratory Access</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <button onClick={() => onNavigate('about')} className="hover:text-cyan-400 transition-colors">
                About & Maker Contact
              </button>
            </li>
            <li>
              <button
                onClick={onOpenCoordinator}
                className="flex items-center gap-1.5 text-cyan-400/90 hover:text-cyan-300 transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Coordinator Dashboard</span>
              </button>
            </li>
            {settings?.githubUrl && (
              <li>
                <a
                  href={settings.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                </a>
              </li>
            )}
            {settings?.youtubeUrl && (
              <li>
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                >
                  <Youtube className="w-3.5 h-3.5" />
                  <span>Demonstration Videos</span>
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <p>© {new Date().getFullYear()} {settings?.siteTitle || 'NEXUS LAB'}. All hardware schematics and code released for open educational research.</p>
        <p className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span>System Operating Nominal</span>
        </p>
      </div>
    </footer>
  );
};
