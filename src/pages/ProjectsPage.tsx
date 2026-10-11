import React, { useState, useMemo } from 'react';
import { Search, Filter, Cpu, Layers, ChevronRight, X } from 'lucide-react';
import type { Project, Category } from '../types';

interface ProjectsPageProps {
  projects: Project[];
  categories: Category[];
  onSelectProject: (slug: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects,
  categories,
  onSelectProject
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const statuses = ['All', 'In Progress', 'Completed', 'Planned', 'Archived'];

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchCat =
        selectedCategory === 'All' ||
        project.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchStatus =
        selectedStatus === 'All' ||
        project.status.toLowerCase() === selectedStatus.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.summary.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.tags.some((t) => t.toLowerCase().includes(q)) ||
        project.components.some((c) => c.name.toLowerCase().includes(q));

      return matchCat && matchStatus && matchSearch;
    });
  }, [projects, selectedCategory, selectedStatus, searchQuery]);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="text-xs font-mono text-cyan-400 tracking-wider uppercase">
          HARDWARE & ROBOTICS ARCHIVE
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Project Lab
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Searchable repository of microcontrollers, IoT wearables, embedded games, and autonomous robotics prototypes. Inspect circuit connections, pinouts, and source code.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search components, code, tags (e.g. ESP32, GPS, OLED)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a0f1d] border border-cyan-500/20 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Filter Segmented Controls */}
          <div className="flex items-center gap-1.5 p-1 bg-[#0a0f1d] border border-slate-800 rounded-xl overflow-x-auto">
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  selectedStatus === st
                    ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-400/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Tab Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
              selectedCategory === 'All'
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-400/60 shadow-[0_0_10px_rgba(0,240,255,0.15)]'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            All Categories ({projects.length})
          </button>

          {categories.map((cat) => {
            const count = projects.filter((p) => p.category === cat.name).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
                  selectedCategory === cat.name
                    ? 'bg-cyan-950/80 text-cyan-300 border-cyan-400/60 shadow-[0_0_10px_rgba(0,240,255,0.15)]'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 bg-[#090e1a] rounded-2xl border border-slate-800 space-y-3">
          <Cpu className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No projects found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search criteria or selecting a different category filter.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedStatus('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-cyan-300 hover:bg-slate-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project.slug)}
              className="group cursor-pointer bg-[#090e1a] rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all overflow-hidden flex flex-col shadow-lg hover:shadow-[0_0_20px_rgba(0,240,255,0.1)]"
            >
              {/* Cover Image */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090e1a] via-[#090e1a]/20 to-transparent" />

                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2.5 py-0.5 text-xs font-semibold rounded-md border ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {project.status}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[11px] font-mono text-cyan-400 truncate block">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mb-2 line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {project.summary}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-800/80">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
                      >
                        #{tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="text-[10px] font-mono text-slate-400 py-0.5">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>{project.components.length} Components</span>
                    <span className="text-cyan-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      View Details <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
