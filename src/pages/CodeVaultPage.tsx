import React, { useState, useMemo } from 'react';
import { Terminal, Copy, Check, Search, Tag, ExternalLink, Download, FileCode } from 'lucide-react';
import type { CodeVaultEntry } from '../types';

interface CodeVaultPageProps {
  codeEntries: CodeVaultEntry[];
  onSelectProject?: (slug: string) => void;
}

export const CodeVaultPage: React.FC<CodeVaultPageProps> = ({ codeEntries, onSelectProject }) => {
  const [selectedLang, setSelectedLang] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const languages = ['All', 'Arduino C++', 'ESP32 C++', 'Python', 'JavaScript'];

  const filteredEntries = useMemo(() => {
    return codeEntries.filter((item) => {
      const matchLang = selectedLang === 'All' || item.language === selectedLang;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.filename.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));
      return matchLang && matchSearch;
    });
  }, [codeEntries, selectedLang, searchQuery]);

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (filename: string, code: string) => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'firmware_sketch.cpp';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="space-y-3 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-mono">
          <Terminal className="w-3.5 h-3.5" />
          <span>OPEN FIRMWARE & SKETCH ARCHIVE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Code Vault
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          Open-source firmware, FreeRTOS tasks, direct-register drivers, and communication protocol handlers. Cleanly decoupled, sanitized, and ready for your microcontroller projects.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sketches, drivers, algorithms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0a0f1d] border border-cyan-500/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0a0f1d] border border-slate-800 rounded-xl overflow-x-auto">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLang(lang)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedLang === lang
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Code Entries List */}
      <div className="space-y-8">
        {filteredEntries.map((entry) => (
          <div
            key={entry.id}
            className="bg-[#090e1a] rounded-2xl border border-slate-800 hover:border-cyan-500/30 transition-all overflow-hidden shadow-xl"
          >
            {/* Header info */}
            <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0a0f1d]">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-cyan-400 font-semibold">{entry.language}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">v{entry.version}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-fuchsia-400">{entry.filename}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{entry.title}</h3>
                <p className="text-xs text-slate-400 max-w-2xl">{entry.description}</p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCopyCode(entry.id, entry.code)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-cyan-300 hover:bg-slate-700 transition-colors"
                >
                  {copiedId === entry.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDownload(entry.filename, entry.code)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                  title="Download raw file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Code Body */}
            <pre className="p-6 text-xs text-slate-200 overflow-x-auto font-mono leading-relaxed bg-[#050811] max-h-96">
              <code>{entry.code}</code>
            </pre>

            {/* Footer tags */}
            <div className="px-6 py-3 bg-[#080d18] border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <Tag className="w-3.5 h-3.5 text-slate-500" />
                <div className="flex flex-wrap gap-1">
                  {entry.tags.map((tag) => (
                    <span key={tag} className="text-slate-400 font-mono text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {entry.projectTitle && onSelectProject && entry.projectId && (
                <button
                  onClick={() => onSelectProject(entry.projectId!)}
                  className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                >
                  <span>Project: {entry.projectTitle}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
