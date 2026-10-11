import React, { useState } from 'react';
import { History, Award, AlertOctagon, Wrench, Sparkles, Compass, Lightbulb, ChevronRight } from 'lucide-react';
import type { TimelineEntry } from '../types';

interface JourneyPageProps {
  timeline: TimelineEntry[];
}

export const JourneyPage: React.FC<JourneyPageProps> = ({ timeline }) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories = ['All', 'Milestone', 'Build', 'Failure & Fix', 'Hardware Upgrade', 'Future Vision'];

  const filtered = timeline.filter((item) => {
    if (filterCategory === 'All') return true;
    return item.category === filterCategory;
  });

  const getCategoryIcon = (cat: TimelineEntry['category']) => {
    switch (cat) {
      case 'Milestone': return <Award className="w-4 h-4 text-amber-400" />;
      case 'Failure & Fix': return <AlertOctagon className="w-4 h-4 text-rose-400" />;
      case 'Hardware Upgrade': return <Wrench className="w-4 h-4 text-cyan-400" />;
      case 'Future Vision': return <Compass className="w-4 h-4 text-fuchsia-400" />;
      default: return <Sparkles className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getCategoryBadge = (cat: TimelineEntry['category']) => {
    switch (cat) {
      case 'Milestone': return 'text-amber-400 bg-amber-950/40 border-amber-500/30';
      case 'Failure & Fix': return 'text-rose-400 bg-rose-950/40 border-rose-500/30';
      case 'Hardware Upgrade': return 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30';
      case 'Future Vision': return 'text-fuchsia-400 bg-fuchsia-950/40 border-fuchsia-500/30';
      default: return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="space-y-3 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-mono">
          <History className="w-3.5 h-3.5" />
          <span>DIGITAL LAB NOTEBOOK & CHRONOLOGY</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Experiments & Maker Journey
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          An honest, unvarnished engineering record. Documenting breakthroughs, fried components, solder burns, debugging marathons, and technological leaps from the first blinking LED to autonomous robotics.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all whitespace-nowrap ${
              filterCategory === cat
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-400/60 shadow-[0_0_10px_rgba(0,240,255,0.15)]'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {cat === 'All' ? 'All Entries' : cat}
          </button>
        ))}
      </div>

      {/* Timeline Stream */}
      <div className="relative border-l-2 border-cyan-500/30 pl-6 sm:pl-8 space-y-12 ml-4 sm:ml-6">
        {filtered.map((item) => (
          <div key={item.id} className="relative group">
            {/* Timeline node icon */}
            <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-6 h-6 rounded-full bg-[#070b14] border-2 border-cyan-400 flex items-center justify-center group-hover:scale-125 transition-transform shadow-[0_0_10px_rgba(0,240,255,0.3)]">
              <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
            </div>

            {/* Content Card */}
            <div className="bg-[#090e1a] rounded-2xl border border-slate-800 hover:border-cyan-500/30 transition-all p-6 sm:p-7 space-y-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-cyan-400 font-bold bg-cyan-950/50 px-2.5 py-1 rounded border border-cyan-500/30">
                    {item.yearMonth}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border ${getCategoryBadge(item.category)}`}>
                    {getCategoryIcon(item.category)}
                    <span>{item.category}</span>
                  </span>
                </div>

                {item.isHighlight && (
                  <span className="text-[11px] font-mono font-semibold text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded">
                    ★ Keystone Milestone
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                {item.title}
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                {item.description}
              </p>

              {item.lessonsLearned && (
                <div className="pt-3 border-t border-slate-800/80">
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
                    <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-cyan-300 font-mono">Engineering Lesson:</strong>{' '}
                      <span className="leading-relaxed">{item.lessonsLearned}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
