import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { XiaozhiShowcasePage } from './pages/XiaozhiShowcasePage';
import { RoboticsRoomPage } from './pages/RoboticsRoomPage';
import { WorkshopPage } from './pages/WorkshopPage';
import { CodeVaultPage } from './pages/CodeVaultPage';
import { JourneyPage } from './pages/JourneyPage';
import { AboutContactPage } from './pages/AboutContactPage';
import { CoordinatorDashboard } from './pages/coordinator/CoordinatorDashboard';
import { api } from './services/api';
import type {
  Project,
  Category,
  WorkshopArticle,
  CodeVaultEntry,
  TimelineEntry,
  WebsiteSettings,
  DatabaseStats
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(null);

  // Coordinator Dashboard modal/view
  const [isCoordinatorOpen, setIsCoordinatorOpen] = useState(false);
  const [isCoordinatorLoggedIn, setIsCoordinatorLoggedIn] = useState(false);

  // App Data State
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<WorkshopArticle[]>([]);
  const [codeEntries, setCodeEntries] = useState<CodeVaultEntry[]>([]);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch all initial public data
  const fetchData = async () => {
    try {
      const [projList, catList, artList, codeList, timeList, statsData, settingsData] =
        await Promise.all([
          api.getProjects(),
          api.getCategories(),
          api.getArticles(),
          api.getCode(),
          api.getTimeline(),
          api.getStats(),
          api.getSettings()
        ]);

      setProjects(projList);
      setCategories(catList);
      setArticles(artList);
      setCodeEntries(codeList);
      setTimeline(timeList);
      setStats(statsData);
      setSettings(settingsData);
    } catch (err) {
      console.error('Failed to load laboratory data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Check if user is already logged in as coordinator
    api.checkAuth().then((res) => {
      if (res?.user) {
        setIsCoordinatorLoggedIn(true);
      }
    });

    // Handle deep-link or path check
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/coordinator')) {
      setIsCoordinatorOpen(true);
    }
  }, []);

  const handleNavigate = (tab: string, slug?: string) => {
    if (slug) {
      setSelectedProjectSlug(slug);
      setActiveTab('project-detail');
    } else {
      setActiveTab(tab);
      setSelectedProjectSlug(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProject = (slug: string) => {
    setSelectedProjectSlug(slug);
    setActiveTab('project-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeProject = selectedProjectSlug
    ? projects.find((p) => p.slug === selectedProjectSlug || p.id === selectedProjectSlug) || null
    : null;

  const xiaozhiProject = projects.find((p) => p.id === 'proj-xiaozhi-ai' || p.slug.includes('xiaozhi')) || null;

  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab === 'project-detail' ? 'projects' : activeTab}
        setActiveTab={handleNavigate}
        settings={settings}
        onOpenCoordinator={() => setIsCoordinatorOpen(true)}
        isCoordinatorLoggedIn={isCoordinatorLoggedIn}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {loading ? (
          <div className="min-h-[60vh] flex items-center justify-center text-cyan-400 font-mono text-sm">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></span>
              <span>Initializing Autonomous Hardware Lab...</span>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'home' && (
              <HomePage
                settings={settings}
                stats={stats}
                featuredProjects={projects.filter((p) => p.isFeatured)}
                timeline={timeline}
                onNavigate={handleNavigate}
              />
            )}

            {activeTab === 'projects' && (
              <ProjectsPage
                projects={projects}
                categories={categories}
                onSelectProject={handleOpenProject}
              />
            )}

            {activeTab === 'project-detail' && activeProject && (
              <ProjectDetailPage
                project={activeProject}
                allProjects={projects}
                onBack={() => handleNavigate('projects')}
                onSelectProject={handleOpenProject}
              />
            )}

            {activeTab === 'xiaozhi' && (
              <XiaozhiShowcasePage
                xiaozhiProject={xiaozhiProject}
                onNavigateToProject={handleOpenProject}
              />
            )}

            {activeTab === 'robotics' && (
              <RoboticsRoomPage
                projects={projects}
                onSelectProject={handleOpenProject}
              />
            )}

            {activeTab === 'workshop' && (
              <WorkshopPage articles={articles} />
            )}

            {activeTab === 'code' && (
              <CodeVaultPage
                codeEntries={codeEntries}
                onSelectProject={handleOpenProject}
              />
            )}

            {activeTab === 'journey' && (
              <JourneyPage timeline={timeline} />
            )}

            {activeTab === 'about' && (
              <AboutContactPage settings={settings} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenCoordinator={() => setIsCoordinatorOpen(true)}
        onNavigate={handleNavigate}
      />

      {/* Private Coordinator Dashboard Modal */}
      {isCoordinatorOpen && (
        <CoordinatorDashboard
          onClose={() => setIsCoordinatorOpen(false)}
          onRefreshData={fetchData}
          settings={settings}
        />
      )}
    </div>
  );
}
