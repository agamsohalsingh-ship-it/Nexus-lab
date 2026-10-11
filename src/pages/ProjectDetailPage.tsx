import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Layers,
  Copy,
  Check,
  Download,
  AlertTriangle,
  Lightbulb,
  Cpu,
  Zap,
  Tag,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import type { Project } from '../types';
import { CircuitVisualizer } from '../components/CircuitVisualizer';

interface ProjectDetailPageProps {
  project: Project;
  allProjects: Project[];
  onBack: () => void;
  onSelectProject: (slug: string) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  project,
  allProjects,
  onBack,
  onSelectProject
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeGalleryImage, setActiveGalleryImage] = useState<string>(project.coverImage);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(project.codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'Completed':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40';
      case 'In Progress':
        return 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40';
      case 'Planned':
        return 'text-amber-400 border-amber-500/30 bg-amber-950/40';
      default:
        return 'text-slate-400 border-slate-700 bg-slate-900';
    }
  };

  const relatedProjects = allProjects
    .filter((p) => p.id !== project.id && p.category === project.category)
    .slice(0, 2);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Project Lab</span>
        </button>
      </div>

      {/* Main Header & Cover Section */}
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-mono text-cyan-400 font-semibold uppercase tracking-wider">
              {project.category}
            </span>
            <span className="text-slate-600">/</span>
            <span className={`px-2.5 py-0.5 rounded border font-semibold ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-4xl">
            {project.summary}
          </p>
        </div>

        {/* Featured Image and Gallery */}
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-cyan-500/20 bg-slate-950 aspect-[16/9] max-h-[520px] shadow-2xl">
            <img
              src={activeGalleryImage}
              alt={project.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b14]/80 via-transparent to-transparent pointer-events-none" />
          </div>

          {project.galleryImages && project.galleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {project.galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveGalleryImage(img)}
                  className={`relative rounded-xl overflow-hidden border-2 w-24 h-16 shrink-0 transition-all ${
                    activeGalleryImage === img
                      ? 'border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Two Column Technical Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Details & Circuit & Code */}
        <div className="lg:col-span-2 space-y-10">
          {/* Problem & How It Works */}
          <div className="bg-[#090e1a] rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-cyan-400" />
                <span>Problem Solved</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {project.problemSolved}
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800/80">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-fuchsia-400" />
                <span>How It Works & System Architecture</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {project.howItWorks || project.description}
              </p>
            </div>
          </div>

          {/* Attached Firmware Binary / Sketch (.bin or .ino) Card */}
          {project.firmwareFile && (
            <div className="bg-gradient-to-r from-[#0d1428] to-[#120f26] border-2 border-fuchsia-500/40 rounded-2xl p-6 sm:p-7 space-y-4 shadow-[0_0_25px_rgba(255,0,127,0.15)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-fuchsia-950/80 border border-fuchsia-400/50 flex items-center justify-center text-fuchsia-400 font-mono font-bold text-base shadow-[0_0_15px_rgba(255,0,127,0.3)]">
                    .{project.firmwareFile.fileType || 'bin'}
                  </div>
                  <div>
                    <div className="text-xs font-mono text-fuchsia-300 uppercase tracking-wider font-semibold">
                      ATTACHED FIRMWARE FILE ({project.firmwareFile.fileType?.toUpperCase() || 'BIN'})
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {project.firmwareFile.name}
                    </h3>
                    <div className="text-xs text-slate-400 font-mono">
                      File Size: {project.firmwareFile.fileSize || 'Direct Flashable'} · Ready for Microcontroller
                    </div>
                  </div>
                </div>

                <a
                  href={project.firmwareFile.url}
                  download={project.firmwareFile.name}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,0,127,0.3)] shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .{project.firmwareFile.fileType?.toUpperCase() || 'BIN'} File</span>
                </a>
              </div>

              <div className="p-3 bg-black/40 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono">
                <span className="text-cyan-400 font-semibold">Flashing Command:</span>{' '}
                {project.firmwareFile.fileType === 'bin' ? (
                  <code>esptool.py --chip esp32 write_flash 0x0 {project.firmwareFile.name}</code>
                ) : (
                  <code>Open {project.firmwareFile.name} in Arduino IDE &gt; Select COM Port &gt; Click Upload</code>
                )}
              </div>
            </div>
          )}

          {/* Circuit Diagram & Schematics Picture */}
          {project.circuitDiagramImage && (
            <div className="bg-[#090e1a] rounded-2xl border border-cyan-500/20 overflow-hidden space-y-3 p-6 sm:p-7">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Circuit Diagram & Physical Schematic</span>
                </h2>
                <span className="text-xs font-mono text-slate-400">High Resolution</span>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#060a14] max-h-[460px] group">
                <img
                  src={project.circuitDiagramImage}
                  alt={`Circuit Diagram for ${project.title}`}
                  className="w-full h-auto object-contain max-h-[450px] mx-auto group-hover:scale-101 transition-transform"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hardware interconnect schematic showing direct component pinouts, ground plane isolation, and power distribution rails.
              </p>
            </div>
          )}

          {/* How To Make Process (Step-by-Step Assembly Guide) */}
          {project.howToMakeProcess && (
            <div className="bg-[#090e1a] rounded-2xl border border-cyan-500/20 p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-fuchsia-400" />
                  <span>How To Make Process (Step-by-Step Guide)</span>
                </h2>
                <span className="text-xs font-mono text-cyan-400 font-semibold">Assembly Instructions</span>
              </div>
              <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-3 font-sans">
                {project.howToMakeProcess}
              </div>
            </div>
          )}
          {/* Circuit Visualizer & Pin Mapping Table */}
          {project.pinConnections && project.pinConnections.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Circuit Schematics & Pin Interconnects</span>
              </h2>
              <CircuitVisualizer
                pinConnections={project.pinConnections}
                mcuName={project.category.includes('Arduino') ? 'Arduino ATmega328P' : 'ESP32 Dual-Core'}
              />
            </div>
          )}

          {/* Wiring Instructions */}
          {project.wiringInstructions && (
            <div className="bg-[#090e1a] rounded-2xl border border-cyan-500/20 p-6 space-y-3">
              <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider font-mono">
                Wiring Guide & Assembly Notes
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                {project.wiringInstructions}
              </p>
            </div>
          )}

          {/* Code Snippet Box */}
          {project.codeSnippet && (
            <div className="bg-[#060a14] rounded-2xl border border-slate-800 overflow-hidden shadow-xl space-y-0">
              <div className="px-5 py-3.5 bg-[#090e1a] border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                  <span className="text-xs font-mono text-slate-400 ml-2">
                    {project.codeSnippetLanguage || 'C++ Firmware'}
                  </span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300 bg-slate-800/80 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-5 text-xs text-slate-200 overflow-x-auto font-mono leading-relaxed bg-[#05070e]">
                <code>{project.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* Build Log & Lab Notebook */}
          {project.buildLogs && project.buildLogs.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Lab Build Notebook & Updates</h2>
              <div className="space-y-4">
                {project.buildLogs.map((log) => (
                  <div
                    key={log.id}
                    className="bg-[#090e1a] border border-slate-800 rounded-xl p-5 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-cyan-400 font-semibold">{log.date}</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase bg-slate-800 text-slate-300">
                        {log.type}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white">{log.title}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{log.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Challenges & Improvements */}
          {project.challengesAndImprovements && (
            <div className="bg-[#090e1a] rounded-2xl border border-slate-800 p-6 space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Challenges Encountered & Engineering Fixes</span>
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {project.challengesAndImprovements}
              </p>
            </div>
          )}
        </div>

        {/* Right Col: Bill of Materials, Specs, Downloads, Future */}
        <div className="space-y-8">
          {/* Bill of Materials / Components */}
          <div className="bg-[#090e1a] rounded-2xl border border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Components & Modules ({project.components.length})</span>
            </h3>

            <div className="space-y-3 divide-y divide-slate-800/60">
              {project.components.map((c) => (
                <div key={c.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <div className="font-semibold text-slate-200">{c.name}</div>
                    <div className="text-slate-400 text-[11px]">{c.specs}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono font-semibold shrink-0">
                    x{c.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Hardware Specifications */}
          {project.specifications && Object.keys(project.specifications).length > 0 && (
            <div className="bg-[#090e1a] rounded-2xl border border-slate-800 p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Cpu className="w-4 h-4 text-fuchsia-400" />
                <span>Technical Specifications</span>
              </h3>

              <div className="space-y-2.5 text-xs font-mono">
                {Object.entries(project.specifications).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-start gap-2">
                    <span className="text-slate-400">{key}:</span>
                    <span className="text-slate-200 text-right font-medium">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Downloadable Source & Schematics */}
          {project.downloadableFiles && project.downloadableFiles.length > 0 && (
            <div className="bg-[#090e1a] rounded-2xl border border-cyan-500/20 p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Firmware & Files</span>
              </h3>

              <div className="space-y-2">
                {project.downloadableFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white truncate max-w-[170px]">
                        {file.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {file.fileType} · {file.fileSize}
                      </div>
                    </div>
                    <a
                      href={file.url}
                      download={file.name}
                      className="p-1.5 rounded-lg bg-cyan-950/60 text-cyan-400 hover:bg-cyan-900/60 transition-colors"
                      title={`Download ${file.name}`}
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Future Upgrades */}
          {project.futureUpgrades && project.futureUpgrades.length > 0 && (
            <div className="bg-[#090e1a] rounded-2xl border border-slate-800 p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Future Upgrades & Next Iteration</span>
              </h3>

              <ul className="space-y-2 text-xs text-slate-300">
                {project.futureUpgrades.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="p-4 bg-[#090e1a] rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
                <Tag className="w-3.5 h-3.5 text-cyan-400" />
                <span>PROJECT TAGS</span>
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <div className="pt-8 border-t border-slate-800 space-y-6">
          <h3 className="text-xl font-bold text-white">Related Laboratory Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedProjects.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectProject(rel.slug)}
                className="cursor-pointer bg-[#090e1a] border border-slate-800 hover:border-cyan-500/40 rounded-xl p-5 transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="text-xs font-mono text-cyan-400">{rel.category}</span>
                  <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-1">{rel.summary}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all shrink-0 ml-4" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
