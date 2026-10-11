import React from 'react';
import { ArrowRight, Bot, Cpu, ShieldAlert, Gamepad2, Zap, Radio, ChevronRight, Terminal, Layers } from 'lucide-react';
import type { Project, DatabaseStats, WebsiteSettings, TimelineEntry } from '../types';

interface HomePageProps {
  settings?: WebsiteSettings | null;
  stats?: DatabaseStats | null;
  featuredProjects: Project[];
  timeline: TimelineEntry[];
  onNavigate: (tab: string, slug?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  settings,
  stats,
  featuredProjects,
  timeline,
  onNavigate
}) => {
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'Completed': return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30';
      case 'In Progress': return 'text-cyan-400 border-cyan-500/30 bg-cyan-950/30';
      case 'Planned': return 'text-amber-400 border-amber-500/30 bg-amber-950/30';
      default: return 'text-slate-400 border-slate-700 bg-slate-900';
    }
  };

  const domainHubs = [
    {
      id: 'ai',
      title: 'AI Assistants & Voice Streams',
      desc: 'Physical conversational agents, I2S MEMS audio pipelines, and animated OLED faces.',
      icon: Cpu,
      color: 'border-cyan-500/30 hover:border-cyan-400 group-hover:text-cyan-300',
      action: () => onNavigate('xiaozhi')
    },
    {
      id: 'robotics',
      title: 'Robotics & Inverse Kinematics',
      desc: '4-DOF arm manipulators, PCA9685 PWM drivers, and analytic geometric kinematics.',
      icon: Bot,
      color: 'border-fuchsia-500/30 hover:border-fuchsia-400 group-hover:text-fuchsia-300',
      action: () => onNavigate('robotics')
    },
    {
      id: 'safety',
      title: 'Wearable Emergency Devices',
      desc: 'GPS telemetry, 110dB sirens, and router-free ESP-NOW mesh broadcasts.',
      icon: ShieldAlert,
      color: 'border-amber-500/30 hover:border-amber-400 group-hover:text-amber-300',
      action: () => onNavigate('projects')
    },
    {
      id: 'gaming',
      title: 'Retro Gaming & Custom Consoles',
      desc: 'High-speed 400kHz OLED graphics engines, tactile controls, and 8-bit sound synth.',
      icon: Gamepad2,
      color: 'border-blue-500/30 hover:border-blue-400 group-hover:text-blue-300',
      action: () => onNavigate('projects')
    }
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Cinematic Hero Section */}
      <section className="relative min-h-[580px] lg:min-h-[660px] flex items-center justify-center overflow-hidden border-b border-cyan-500/20 bg-[#060a14]">
        {/* Hero Background Image with Contrast Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/lab_hero_workspace_1791611566803.jpg"
            alt="Futuristic Robotics Lab"
            className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-[#070b14]/75 to-[#070b14]/90" />
          <div className="absolute inset-0 circuit-grid opacity-60" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 pb-14 space-y-8">
          {/* Eyebrow marker */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-mono tracking-wide shadow-[0_0_15px_rgba(0,240,255,0.15)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>AUTONOMOUS HARDWARE & ROBOTICS LAB</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Building Tomorrow,{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-fuchsia-400 bg-clip-text text-transparent">
              One Circuit
            </span>{' '}
            at a Time.
          </h1>

          {/* Subheadline */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed">
            {settings?.heroSubheadline ||
              'Explore open hardware prototypes, low-latency ESP32 wireless networks, real-time AI voice assistants, and custom robotics architectures.'}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('projects')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm hover:from-cyan-400 hover:to-blue-500 transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center gap-2 group"
            >
              <span>Explore My Projects</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('xiaozhi')}
              className="px-6 py-3 rounded-xl bg-[#091122] text-cyan-300 border border-cyan-500/40 font-semibold text-sm hover:bg-cyan-950/40 hover:border-cyan-300 transition-all shadow-[0_0_15px_rgba(0,240,255,0.1)] flex items-center gap-2"
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Meet My AI Assistant</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('featured-inventions');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-xl bg-slate-900/80 text-slate-300 border border-slate-700 font-semibold text-sm hover:bg-slate-800 hover:text-white transition-all"
            >
              Enter the Lab
            </button>
          </div>
        </div>
      </section>

      {/* Real Statistics Section (Calculated directly from DB) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-[#0b101e]/90 border border-cyan-500/20 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1 border-r border-slate-800/80 last:border-0 pr-4">
            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Total Projects</span>
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums">
              {stats?.totalProjects ?? 12}
            </div>
            <div className="text-xs text-slate-400">
              {stats?.completedProjects ?? 4} Completed · {stats?.inProgressProjects ?? 5} In Progress
            </div>
          </div>

          <div className="space-y-1 border-r border-slate-800/80 last:border-0 pr-4">
            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Workshop Guides</span>
            <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-mono tabular-nums">
              {stats?.totalArticles ?? 3}
            </div>
            <div className="text-xs text-slate-400">Hardware & Firmware Docs</div>
          </div>

          <div className="space-y-1 border-r border-slate-800/80 last:border-0 pr-4">
            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Code Vault Files</span>
            <div className="text-3xl sm:text-4xl font-extrabold text-fuchsia-400 font-mono tabular-nums">
              {stats?.totalCodeSnippets ?? 3}
            </div>
            <div className="text-xs text-slate-400">Arduino & ESP32 C++</div>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Lab Milestones</span>
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono tabular-nums">
              {stats?.totalTimelineEntries ?? 7}
            </div>
            <div className="text-xs text-slate-400">Documented Maker Logs</div>
          </div>
        </div>
      </section>

      {/* Domain Quick Access Hubs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Core Research Disciplines</h2>
            <p className="text-sm text-slate-400">Direct gateways into active domains and prototyping tracks.</p>
          </div>
          <button
            onClick={() => onNavigate('projects')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {domainHubs.map((hub) => {
            const Icon = hub.icon;
            return (
              <div
                key={hub.id}
                onClick={hub.action}
                className={`group cursor-pointer bg-[#090e1a] rounded-xl p-5 border transition-all hover:-translate-y-1 hover:shadow-lg ${hub.color}`}
              >
                <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 transition-colors">
                  <Icon className="w-5 h-5 text-slate-300" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2 transition-colors">
                  {hub.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {hub.desc}
                </p>
                <div className="flex items-center text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
                  <span>Enter Track</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Inventions Showcase */}
      <section id="featured-inventions" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-cyan-400 tracking-wider uppercase mb-1">PROTOTYPES & BUILDS</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Featured Inventions</h2>
          </div>
          <button
            onClick={() => onNavigate('projects')}
            className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Open Complete Project Lab ({stats?.totalProjects ?? 12})</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredProjects.slice(0, 4).map((project) => (
            <div
              key={project.id}
              onClick={() => onNavigate('projects', project.slug)}
              className="group cursor-pointer bg-[#090e1a] rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all overflow-hidden flex flex-col shadow-lg hover:shadow-[0_0_25px_rgba(0,240,255,0.1)]"
            >
              {/* Card Cover Image */}
              <div className="relative h-60 w-full overflow-hidden bg-slate-900">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090e1a] via-[#090e1a]/30 to-transparent" />

                {/* Status indicator on image */}
                <div className="absolute top-4 right-4">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-xs font-mono text-cyan-400">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed mb-3">
                    {project.summary}
                  </p>

                  {/* Highlights Badges for Firmware, Schematics & How to Make */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {project.firmwareFile && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-fuchsia-950/60 border border-fuchsia-500/40 text-fuchsia-300 text-[11px] font-mono font-semibold">
                        <Zap className="w-3 h-3 text-fuchsia-400" />
                        <span>.{project.firmwareFile.fileType?.toUpperCase() || 'BIN'} Firmware Attached</span>
                      </span>
                    )}
                    {project.circuitDiagramImage && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono">
                        <span>📐 Circuit Schematic Picture</span>
                      </span>
                    )}
                    {project.howToMakeProcess && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-slate-300 text-[11px] font-mono">
                        <span>🛠️ Step-by-Step Build Guide</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-3">
                    <span>{project.components.length} Components</span>
                    <span aria-hidden="true">·</span>
                    <span>{project.pinConnections.length} Pin Mappings</span>
                  </div>
                  <span className="text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Inspect Schematics &amp; Code <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Maker Pipeline: How To Make & Firmware Flashing Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-gradient-to-r from-[#070e1c] via-[#091326] to-[#0c0d1e] border-2 border-cyan-500/30 rounded-3xl p-8 sm:p-12 space-y-8 shadow-[0_0_35px_rgba(0,240,255,0.15)]">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-fuchsia-500/30 bg-fuchsia-950/40 text-fuchsia-300 text-xs font-mono">
              <Zap className="w-3.5 h-3.5 text-fuchsia-400" />
              <span>LABORATORY BUILD PROTOCOL</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Complete How-To-Make Process &amp; Direct Firmware Downloads
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Every project inside NEXUS LAB is thoroughly documented for fabrication: inspect physical circuit diagram pictures, follow step-by-step assembly guides, and download flashable <span className="text-cyan-300 font-mono font-bold">.bin</span> / <span className="text-fuchsia-300 font-mono font-bold">.ino</span> code files ready for your microcontrollers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-[#050914] border border-slate-800 space-y-2">
              <div className="text-xs font-mono text-cyan-400 font-bold">01 // BREADBOARD STAGE</div>
              <h3 className="text-base font-bold text-white">Component Sourcing &amp; Pinouts</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Check the bill of materials, voltage levels (3.3V vs 5V), and pin mappings for ESP32 and Arduino boards.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#050914] border border-cyan-500/30 space-y-2">
              <div className="text-xs font-mono text-cyan-400 font-bold">02 // CIRCUIT SCHEMATIC</div>
              <h3 className="text-base font-bold text-white">Schematic Diagrams &amp; Decoupling</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Inspect physical circuit pictures and wiring connection diagrams to ensure ground plane integrity.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#050914] border border-fuchsia-500/40 space-y-2">
              <div className="text-xs font-mono text-fuchsia-400 font-bold">03 // FLASH FIRMWARE</div>
              <h3 className="text-base font-bold text-white">Direct .BIN / .INO Downloads</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Download compiled binary files (.bin) or Arduino sketches (.ino) and flash via esptool.py or Arduino IDE.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#050914] border border-slate-800 space-y-2">
              <div className="text-xs font-mono text-emerald-400 font-bold">04 // LAB VERIFICATION</div>
              <h3 className="text-base font-bold text-white">Testing &amp; Telemetry</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Execute serial monitor diagnostics, test I2S audio or ESP-NOW wireless mesh, and verify sensors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Maker Journey Timeline Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-cyan-400 tracking-wider uppercase mb-1">CHRONOLOGY</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Maker Evolution & Milestones</h2>
          </div>
          <button
            onClick={() => onNavigate('journey')}
            className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>Read Complete Digital Lab Notebook</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        <div className="bg-[#090e1a] border border-cyan-500/20 rounded-2xl p-6 sm:p-8">
          <div className="relative border-l-2 border-cyan-500/30 pl-6 space-y-8 ml-3">
            {timeline.slice(0, 4).map((item) => (
              <div key={item.id} className="relative group">
                {/* Timeline node icon */}
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#070b14] border-2 border-cyan-400 group-hover:scale-125 transition-transform" />

                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1">
                  <span className="font-mono text-xs text-cyan-400 font-bold">
                    {item.yearMonth}
                  </span>
                  <span className="text-xs text-slate-400">· {item.category}</span>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                  {item.description}
                </p>

                {item.lessonsLearned && (
                  <div className="mt-2 text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="font-mono text-cyan-400 font-semibold">Lesson Learned:</span>{' '}
                    {item.lessonsLearned}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
