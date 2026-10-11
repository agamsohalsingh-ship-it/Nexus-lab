import React, { useState } from 'react';
import { BookOpen, Clock, ChevronRight, X, Copy, Check, Zap, Cpu, Sparkles } from 'lucide-react';
import type { WorkshopArticle } from '../types';
import { CircuitVisualizer } from '../components/CircuitVisualizer';

interface WorkshopPageProps {
  articles: WorkshopArticle[];
}

export const WorkshopPage: React.FC<WorkshopPageProps> = ({ articles }) => {
  const [selectedArticle, setSelectedArticle] = useState<WorkshopArticle | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [copiedCode, setCopiedCode] = useState(false);

  const filteredArticles = articles.filter((art) => {
    if (difficultyFilter === 'All') return true;
    return art.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
  });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getDifficultyColor = (diff: WorkshopArticle['difficulty']) => {
    switch (diff) {
      case 'Beginner': return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30';
      case 'Intermediate': return 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30';
      case 'Advanced': return 'text-fuchsia-400 bg-fuchsia-950/40 border-fuchsia-500/30';
      default: return 'text-slate-400 bg-slate-900 border-slate-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="space-y-3 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-mono">
          <BookOpen className="w-3.5 h-3.5" />
          <span>KNOWLEDGE BASE & HARDWARE BENCH</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Electronics Workshop
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          Deep-dive technical guides on microcontrollers, bus protocols, digital I2S audio, power regulation, sensor calibration, and RF communication.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['All', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
          <button
            key={level}
            onClick={() => setDifficultyFilter(level)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              difficultyFilter === level
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-400/60 shadow-[0_0_10px_rgba(0,240,255,0.15)]'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {level === 'All' ? 'All Guides' : level}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className="cursor-pointer bg-[#090e1a] rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all overflow-hidden flex flex-col group shadow-lg hover:shadow-[0_0_20px_rgba(0,240,255,0.1)]"
          >
            <div className="relative h-48 w-full overflow-hidden bg-slate-900">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090e1a] via-[#090e1a]/20 to-transparent" />

              <div className="absolute top-3 right-3">
                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-md border ${getDifficultyColor(article.difficulty)}`}>
                  {article.difficulty}
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{article.readTimeMinutes} min read</span>
                  <span>·</span>
                  <span className="text-cyan-400">{article.category}</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                  {article.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {article.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>{article.pinoutTable?.length || 0} Pin Mappings</span>
                <span className="text-cyan-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Guide <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reader Modal / Full Guide Viewer */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-[#090e1a] border border-cyan-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 space-y-8 shadow-2xl relative">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs">
                <span className={`px-2.5 py-0.5 rounded border font-semibold ${getDifficultyColor(selectedArticle.difficulty)}`}>
                  {selectedArticle.difficulty}
                </span>
                <span className="text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{selectedArticle.readTimeMinutes} min read</span>
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-cyan-400 font-mono">{selectedArticle.category}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {selectedArticle.title}
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                {selectedArticle.summary}
              </p>
            </div>

            {/* Guide Content formatted */}
            <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4 whitespace-pre-line border-t border-slate-800 pt-6">
              {selectedArticle.contentMarkdown}
            </div>

            {/* Pinout Table if present */}
            {selectedArticle.pinoutTable && selectedArticle.pinoutTable.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Interconnect & Pinout Table</span>
                </h3>
                <CircuitVisualizer pinConnections={selectedArticle.pinoutTable} />
              </div>
            )}

            {/* Code Snippet if present */}
            {selectedArticle.codeSnippet && (
              <div className="space-y-2 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                    Firmware Example ({selectedArticle.codeSnippetLanguage})
                  </h3>
                  <button
                    onClick={() => handleCopy(selectedArticle.codeSnippet)}
                    className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 bg-slate-800 px-3 py-1 rounded"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-[#060a12] border border-slate-800 text-xs font-mono text-cyan-200 overflow-x-auto">
                  <code>{selectedArticle.codeSnippet}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
