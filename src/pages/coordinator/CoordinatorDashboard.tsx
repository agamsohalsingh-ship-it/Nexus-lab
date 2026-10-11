import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Eye,
  CheckCircle,
  AlertTriangle,
  Download,
  Upload,
  Layers,
  FileCode,
  BookOpen,
  Settings,
  History,
  Key,
  Database,
  Mail,
  RefreshCw,
  X,
  Save,
  Check,
  Zap,
  Cpu
} from 'lucide-react';
import type {
  Project,
  Category,
  WorkshopArticle,
  CodeVaultEntry,
  TimelineEntry,
  WebsiteSettings,
  DatabaseStats,
  AuditLog,
  ContactMessage,
  PinConnection,
  ProjectComponent
} from '../../types';
import { api, clearAuthToken } from '../../services/api';

interface CoordinatorDashboardProps {
  onClose: () => void;
  onRefreshData: () => Promise<void>;
  settings?: WebsiteSettings | null;
}

export const CoordinatorDashboard: React.FC<CoordinatorDashboardProps> = ({
  onClose,
  onRefreshData,
  settings: initialSettings
}) => {
  // Authentication state - requires login credentials
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string; email: string; role: string } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Active admin tab
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'articles' | 'code' | 'timeline' | 'customization' | 'security' | 'backup' | 'messages'>('overview');

  // Loaded database items
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [articles, setArticles] = useState<WorkshopArticle[]>([]);
  const [codeEntries, setCodeEntries] = useState<CodeVaultEntry[]>([]);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [localSettings, setLocalSettings] = useState<WebsiteSettings | null>(initialSettings || null);

  // Editor modal state
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [editingArticle, setEditingArticle] = useState<Partial<WorkshopArticle> | null>(null);
  const [editingCode, setEditingCode] = useState<Partial<CodeVaultEntry> | null>(null);
  const [editingTimeline, setEditingTimeline] = useState<Partial<TimelineEntry> | null>(null);

  // Confirmation dialog state
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ type: string; id: string; title: string } | null>(null);

  // Password change state
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [pwdStatus, setPwdStatus] = useState<string>('');

  // Backup & restore state
  const [restorePayload, setRestorePayload] = useState('');
  const [restoreStatus, setRestoreStatus] = useState('');

  // Upload state
  const [uploadLoading, setUploadLoading] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Automatically load coordinator data on mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    setAuthLoading(true);
    try {
      const auth = await api.checkAuth();
      if (auth && auth.user) {
        setCurrentUser(auth.user);
        await loadAllDashboardData();
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const loadAllDashboardData = async () => {
    try {
      const [s, p, a, c, t, logs, msgs, sets] = await Promise.all([
        api.getStats(),
        api.getCoordinatorProjects(),
        api.getCoordinatorArticles(),
        api.getCoordinatorCode(),
        api.getTimeline(),
        api.getAuditLogs(),
        api.getMessages(),
        api.getSettings()
      ]);
      setStats(s);
      setProjects(p);
      setArticles(a);
      setCodeEntries(c);
      setTimeline(t);
      setAuditLogs(logs);
      setMessages(msgs);
      setLocalSettings(sets);
    } catch (err) {
      console.error('Error loading coordinator data:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSubmitting(true);
    try {
      const res = await api.login(loginIdentifier, loginPassword);
      setCurrentUser(res.user);
      await loadAllDashboardData();
      await onRefreshData();
    } catch (err: any) {
      setLoginError(err.message || 'Invalid credentials');
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    clearAuthToken();
  };

  // Upload handler for files / images / firmware
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    targetField: 'coverImage' | 'makerAvatar' | 'circuitDiagramImage' | 'firmwareFile'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    try {
      const uploaded = await api.uploadFile(file);
      if (targetField === 'coverImage' && editingProject) {
        setEditingProject({ ...editingProject, coverImage: uploaded.url });
      } else if (targetField === 'circuitDiagramImage' && editingProject) {
        setEditingProject({ ...editingProject, circuitDiagramImage: uploaded.url });
      } else if (targetField === 'firmwareFile' && editingProject) {
        const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
        const sizeFormatted =
          file.size / 1024 > 1024
            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
            : `${(file.size / 1024).toFixed(0)} KB`;

        setEditingProject({
          ...editingProject,
          firmwareFile: {
            name: file.name,
            url: uploaded.url,
            fileSize: sizeFormatted,
            fileType: ext
          }
        });
      } else if (targetField === 'makerAvatar' && localSettings) {
        setLocalSettings({ ...localSettings, makerAvatar: uploaded.url });
      }
    } catch (err: any) {
      showToast(`Upload failed: ${err.message}`, 'error');
    } finally {
      setUploadLoading(false);
    }
  };

  // Project CRUD
  const handleSaveProject = async () => {
    if (!editingProject || !editingProject.title) {
      showToast('Please enter a project title', 'error');
      return;
    }

    try {
      if (editingProject.id) {
        await api.updateProject(editingProject.id, editingProject);
        showToast('Project updated successfully', 'success');
      } else {
        await api.createProject(editingProject);
        showToast('Project created successfully', 'success');
      }
      setEditingProject(null);
      await loadAllDashboardData();
      await onRefreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save project', 'error');
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await api.deleteProject(id);
      setDeleteConfirmation(null);
      showToast('Project deleted successfully', 'success');
      await loadAllDashboardData();
      await onRefreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete', 'error');
    }
  };

  const handleDuplicateProject = async (id: string) => {
    try {
      await api.duplicateProject(id);
      showToast('Project duplicated successfully', 'success');
      await loadAllDashboardData();
      await onRefreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to duplicate project', 'error');
    }
  };

  // Articles CRUD
  const handleSaveArticle = async () => {
    if (!editingArticle || !editingArticle.title) {
      showToast('Please enter an article title', 'error');
      return;
    }
    try {
      await api.saveArticle(editingArticle);
      setEditingArticle(null);
      showToast('Article saved successfully', 'success');
      await loadAllDashboardData();
      await onRefreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save article', 'error');
    }
  };

  const handleDeleteArticle = async (id: string) => {
    try {
      await api.deleteArticle(id);
      setDeleteConfirmation(null);
      showToast('Article deleted successfully', 'success');
      await loadAllDashboardData();
      await onRefreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete article', 'error');
    }
  };

  // Code Vault CRUD
  const handleSaveCode = async () => {
    if (!editingCode || !editingCode.title) {
      showToast('Please enter a code title', 'error');
      return;
    }
    try {
      await api.saveCode(editingCode);
      setEditingCode(null);
      showToast('Code entry saved successfully', 'success');
      await loadAllDashboardData();
      await onRefreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save code', 'error');
    }
  };

  const handleDeleteCode = async (id: string) => {
    try {
      await api.deleteCode(id);
      setDeleteConfirmation(null);
      showToast('Code entry deleted successfully', 'success');
      await loadAllDashboardData();
      await onRefreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete code', 'error');
    }
  };

  // Timeline CRUD
  const handleSaveTimeline = async () => {
    if (!editingTimeline || !editingTimeline.title) {
      showToast('Please enter a milestone title', 'error');
      return;
    }
    try {
      await api.saveTimelineEntry(editingTimeline);
      setEditingTimeline(null);
      showToast('Milestone saved successfully', 'success');
      await loadAllDashboardData();
      await onRefreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save milestone', 'error');
    }
  };

  const handleDeleteTimeline = async (id: string) => {
    try {
      await api.deleteTimelineEntry(id);
      setDeleteConfirmation(null);
      showToast('Milestone deleted successfully', 'success');
      await loadAllDashboardData();
      await onRefreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete milestone', 'error');
    }
  };

  // Settings Save
  const handleSaveSettings = async () => {
    if (!localSettings) return;
    try {
      await api.updateSettings(localSettings);
      showToast('Website customization saved successfully.', 'success');
      await onRefreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings', 'error');
    }
  };

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdStatus('');
    try {
      await api.changePassword(currentPwd, newPwd);
      setPwdStatus('Password updated successfully.');
      showToast('Password updated successfully.', 'success');
      setCurrentPwd('');
      setNewPwd('');
    } catch (err: any) {
      setPwdStatus(`Error: ${err.message}`);
      showToast(`Error: ${err.message}`, 'error');
    }
  };

  // Export database
  const handleExportDatabase = async () => {
    try {
      const blob = await api.exportDatabase();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nexus_database_backup_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Database snapshot exported successfully', 'success');
    } catch (err: any) {
      showToast(`Export failed: ${err.message}`, 'error');
    }
  };

  // Restore database
  const handleRestoreDatabase = async () => {
    if (!restorePayload.trim()) {
      showToast('Please paste valid JSON data to restore', 'error');
      return;
    }
    try {
      const parsed = JSON.parse(restorePayload);
      await api.restoreDatabase(parsed);
      setRestoreStatus('Database successfully restored!');
      showToast('Database successfully restored!', 'success');
      await loadAllDashboardData();
      await onRefreshData();
    } catch (err: any) {
      setRestoreStatus(`Restore error: ${err.message}`);
    }
  };

  // If loading auth state
  if (authLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-[#070b14] flex items-center justify-center text-cyan-400 font-mono">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Verifying Coordinator Access...</span>
        </div>
      </div>
    );
  }

  // If not logged in, render the Secure Coordinator Login screen
  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 bg-[#070b14]/95 backdrop-blur-xl flex items-center justify-center p-4">
        <div className="bg-[#090e1a] border border-cyan-500/30 rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl space-y-6 relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-400/50 text-cyan-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(0,240,255,0.2)]">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Coordinator Portal
            </h2>
            <p className="text-xs text-slate-400">
              Private administrative gateway. Restricted to authenticated laboratory owners.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
                Username or Email
              </label>
              <input
                type="text"
                required
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="coordinator"
                className="w-full bg-[#060a12] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#060a12] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm hover:from-cyan-400 hover:to-blue-500 transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{loginSubmitting ? 'Authenticating...' : 'Enter Coordinator Center'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated Coordinator Control Room
  return (
    <div className="fixed inset-0 z-50 bg-[#070b14] overflow-hidden flex flex-col">
      {/* Top Admin Header */}
      <header className="h-16 bg-[#090e1a] border-b border-cyan-500/20 px-4 sm:px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-400/40 text-cyan-400 flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white tracking-tight">
              COORDINATOR CONTROL ROOM
            </span>
            <span className="text-[11px] font-mono text-cyan-400">
              Logged in as {currentUser.username} ({currentUser.role})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              loadAllDashboardData();
              onRefreshData();
            }}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
            title="Refresh database state"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-950/40 text-rose-300 border border-rose-500/40 hover:bg-rose-900/60 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Close Coordinator View"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Toast Notification Banner */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 backdrop-blur-md transition-all ${
          toast.type === 'success'
            ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200 shadow-emerald-900/30'
            : 'bg-rose-950/90 border-rose-500/50 text-rose-200 shadow-rose-900/30'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
          <span className="text-xs font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="p-1 hover:text-white transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-56 sm:w-64 bg-[#090e1a] border-r border-slate-800/80 p-4 space-y-1 overflow-y-auto shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'overview'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-400/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Overview & Activity</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'projects'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-400/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4" />
              <span>Project Manager</span>
            </div>
            <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
              {projects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'articles'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-400/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4" />
              <span>Workshop Guides</span>
            </div>
            <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
              {articles.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'code'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-400/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileCode className="w-4 h-4" />
              <span>Code Vault</span>
            </div>
            <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
              {codeEntries.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'timeline'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-400/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <History className="w-4 h-4" />
              <span>Maker Timeline</span>
            </div>
            <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
              {timeline.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'messages'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-400/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4" />
              <span>Messages Inbox</span>
            </div>
            {messages.filter(m => !m.isRead).length > 0 && (
              <span className="text-[10px] font-mono bg-cyan-500 text-slate-950 font-bold px-1.5 py-0.5 rounded">
                {messages.filter(m => !m.isRead).length}
              </span>
            )}
          </button>

          <div className="pt-4 border-t border-slate-800/80 space-y-1">
            <button
              onClick={() => setActiveTab('customization')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'customization'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Website Customization</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'security'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Key className="w-4 h-4" />
              <span>Security & Audit Logs</span>
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'backup'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Backup & Restore</span>
            </button>
          </div>
        </aside>

        {/* Dynamic Center Work Area */}
        <main className="flex-1 bg-[#060a14] overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* TAB A: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 max-w-6xl">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Overview & Quick Actions</h2>
                <p className="text-xs text-slate-400">Real database metrics and recent administrator activity.</p>
              </div>

              {/* Real Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#090e1a] border border-slate-800 p-5 rounded-2xl space-y-1">
                  <span className="text-xs text-slate-400 font-mono">TOTAL PROJECTS</span>
                  <div className="text-3xl font-extrabold text-white font-mono">{stats?.totalProjects ?? 0}</div>
                  <div className="text-[11px] text-slate-400">{stats?.publishedProjects ?? 0} published</div>
                </div>

                <div className="bg-[#090e1a] border border-slate-800 p-5 rounded-2xl space-y-1">
                  <span className="text-xs text-slate-400 font-mono">WORKSHOP GUIDES</span>
                  <div className="text-3xl font-extrabold text-cyan-400 font-mono">{stats?.totalArticles ?? 0}</div>
                  <div className="text-[11px] text-slate-400">Tutorials & Schematics</div>
                </div>

                <div className="bg-[#090e1a] border border-slate-800 p-5 rounded-2xl space-y-1">
                  <span className="text-xs text-slate-400 font-mono">CODE VAULT</span>
                  <div className="text-3xl font-extrabold text-fuchsia-400 font-mono">{stats?.totalCodeSnippets ?? 0}</div>
                  <div className="text-[11px] text-slate-400">Firmware sketches</div>
                </div>

                <div className="bg-[#090e1a] border border-slate-800 p-5 rounded-2xl space-y-1">
                  <span className="text-xs text-slate-400 font-mono">INBOX MESSAGES</span>
                  <div className="text-3xl font-extrabold text-amber-400 font-mono">{messages.length}</div>
                  <div className="text-[11px] text-slate-400">{stats?.unreadMessages ?? 0} unread</div>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="bg-[#090e1a] border border-cyan-500/20 p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Quick Laboratory Actions
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      setEditingProject({
                        title: '',
                        category: 'Arduino Projects',
                        status: 'In Progress',
                        summary: '',
                        description: '',
                        problemSolved: '',
                        howItWorks: '',
                        coverImage: '/src/assets/images/lab_hero_workspace_1791611566803.jpg',
                        galleryImages: [],
                        components: [],
                        pinConnections: [],
                        wiringInstructions: '',
                        codeSnippet: '',
                        codeSnippetLanguage: 'Arduino C++',
                        features: [],
                        futureUpgrades: [],
                        tags: [],
                        isFeatured: false,
                        isPublished: true
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-950/80 text-cyan-300 border border-cyan-400/40 text-xs font-semibold hover:bg-cyan-900/60 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Project</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingArticle({
                        title: '',
                        category: 'ESP32 and ESP8266 Projects',
                        summary: '',
                        contentMarkdown: '',
                        difficulty: 'Intermediate',
                        readTimeMinutes: 5,
                        coverImage: '/src/assets/images/lab_hero_workspace_1791611566803.jpg',
                        pinoutTable: [],
                        codeSnippet: '',
                        codeSnippetLanguage: 'ESP32 C++',
                        isPublished: true
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 text-xs font-semibold hover:bg-slate-800 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Workshop Article</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingCode({
                        title: '',
                        language: 'ESP32 C++',
                        description: '',
                        code: '',
                        version: '1.0.0',
                        filename: 'main.cpp',
                        tags: [],
                        isPublished: true
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 text-xs font-semibold hover:bg-slate-800 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Code Vault Snippet</span>
                  </button>

                  <button
                    onClick={handleExportDatabase}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-amber-300 border border-amber-500/30 text-xs font-semibold hover:bg-slate-800 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download JSON Backup</span>
                  </button>
                </div>
              </div>

              {/* Recent Audit Trail */}
              <div className="bg-[#090e1a] border border-slate-800 p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Recent Administrator Audit Trail
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">Last 10 Actions</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500">
                        <th className="pb-2">Action</th>
                        <th className="pb-2">Entity</th>
                        <th className="pb-2">Details</th>
                        <th className="pb-2">User</th>
                        <th className="pb-2">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {auditLogs.slice(0, 10).map((log) => (
                        <tr key={log.id} className="text-slate-300">
                          <td className="py-2.5 text-cyan-400 font-semibold">{log.action}</td>
                          <td className="py-2.5 text-slate-400">{log.entityType}</td>
                          <td className="py-2.5 font-sans max-w-xs truncate">{log.details}</td>
                          <td className="py-2.5 text-slate-400">{log.username}</td>
                          <td className="py-2.5 text-slate-500 text-[11px]">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB B: PROJECT MANAGER */}
          {activeTab === 'projects' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Project Manager</h2>
                  <p className="text-xs text-slate-400">Create, edit, duplicate, unpublish, and delete laboratory builds.</p>
                </div>

                <button
                  onClick={() => {
                    setEditingProject({
                      title: '',
                      category: 'Arduino Projects',
                      status: 'In Progress',
                      summary: '',
                      description: '',
                      problemSolved: '',
                      howItWorks: '',
                      coverImage: '/src/assets/images/lab_hero_workspace_1791611566803.jpg',
                      galleryImages: [],
                      components: [],
                      pinConnections: [],
                      wiringInstructions: '',
                      codeSnippet: '',
                      codeSnippetLanguage: 'Arduino C++',
                      features: [],
                      futureUpgrades: [],
                      tags: [],
                      isFeatured: false,
                      isPublished: true
                    });
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Project</span>
                </button>
              </div>

              {/* Projects Table */}
              <div className="bg-[#090e1a] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 bg-[#0a0f1d] text-slate-400 font-mono uppercase tracking-wider">
                        <th className="py-3 px-4">Project Title</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Components</th>
                        <th className="py-3 px-4">Published</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {projects.map((proj) => (
                        <tr key={proj.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-white">
                            <div>{proj.title}</div>
                            <div className="text-[11px] font-mono text-slate-500">{proj.slug}</div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-300 font-mono">{proj.category}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded text-[11px] font-mono border border-slate-700 bg-slate-900 text-cyan-300">
                              {proj.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-400">
                            {proj.components.length} parts
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                              proj.isPublished
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                            }`}>
                              {proj.isPublished ? 'Public' : 'Draft'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setEditingProject(JSON.parse(JSON.stringify(proj)))}
                                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
                                title="Edit project"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDuplicateProject(proj.id)}
                                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-fuchsia-400 transition-colors"
                                title="Duplicate project"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => setDeleteConfirmation({ type: 'project', id: proj.id, title: proj.title })}
                                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                                title="Delete project"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB C: WORKSHOP ARTICLES */}
          {activeTab === 'articles' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Workshop Articles & Guides</h2>
                  <p className="text-xs text-slate-400">Manage hardware tutorials, pinout tables, and guides.</p>
                </div>

                <button
                  onClick={() => {
                    setEditingArticle({
                      title: '',
                      category: 'ESP32 and ESP8266 Projects',
                      summary: '',
                      contentMarkdown: '',
                      difficulty: 'Intermediate',
                      readTimeMinutes: 5,
                      coverImage: '/src/assets/images/lab_hero_workspace_1791611566803.jpg',
                      pinoutTable: [],
                      codeSnippet: '',
                      codeSnippetLanguage: 'ESP32 C++',
                      isPublished: true
                    });
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Guide</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {articles.map((art) => (
                  <div key={art.id} className="bg-[#090e1a] border border-slate-800 rounded-xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-cyan-400">{art.difficulty}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingArticle(JSON.parse(JSON.stringify(art)))}
                          className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-cyan-400"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmation({ type: 'article', id: art.id, title: art.title })}
                          className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-white">{art.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{art.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB D: CODE VAULT */}
          {activeTab === 'code' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Code Vault Manager</h2>
                  <p className="text-xs text-slate-400">Publish, version, and manage firmware sketches.</p>
                </div>

                <button
                  onClick={() => {
                    setEditingCode({
                      title: '',
                      language: 'ESP32 C++',
                      description: '',
                      code: '',
                      version: '1.0.0',
                      filename: 'firmware.cpp',
                      tags: [],
                      isPublished: true
                    });
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Code Snippet</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {codeEntries.map((code) => (
                  <div key={code.id} className="bg-[#090e1a] border border-slate-800 rounded-xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-cyan-400">{code.language} · v{code.version}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingCode(JSON.parse(JSON.stringify(code)))}
                          className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-cyan-400"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmation({ type: 'code', id: code.id, title: code.title })}
                          className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-white">{code.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{code.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB E: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Maker Timeline Manager</h2>
                  <p className="text-xs text-slate-400">Document milestones, hardware upgrades, and lessons learned.</p>
                </div>

                <button
                  onClick={() => {
                    setEditingTimeline({
                      yearMonth: '2026-10',
                      title: '',
                      description: '',
                      category: 'Build',
                      isHighlight: false,
                      lessonsLearned: ''
                    });
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Milestone</span>
                </button>
              </div>

              <div className="space-y-3">
                {timeline.map((item) => (
                  <div key={item.id} className="bg-[#090e1a] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-cyan-400">{item.yearMonth}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-slate-400">{item.category}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{item.description}</p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-4">
                      <button
                        onClick={() => setEditingTimeline(JSON.parse(JSON.stringify(item)))}
                        className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-cyan-400"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmation({ type: 'timeline', id: item.id, title: item.title })}
                        className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB F: CUSTOMIZATION */}
          {activeTab === 'customization' && localSettings && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Website Customization</h2>
                  <p className="text-xs text-slate-400">Edit titles, hero text, maker profile, and theme branding without touching code.</p>
                </div>
                <button
                  onClick={handleSaveSettings}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Settings</span>
                </button>
              </div>

              <div className="bg-[#090e1a] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 uppercase">Website Title</label>
                    <input
                      type="text"
                      value={localSettings.siteTitle}
                      onChange={(e) => setLocalSettings({ ...localSettings, siteTitle: e.target.value })}
                      className="w-full bg-[#060a12] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 uppercase">Tagline</label>
                    <input
                      type="text"
                      value={localSettings.tagline}
                      onChange={(e) => setLocalSettings({ ...localSettings, tagline: e.target.value })}
                      className="w-full bg-[#060a12] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300 uppercase">Hero Headline</label>
                  <input
                    type="text"
                    value={localSettings.heroHeadline}
                    onChange={(e) => setLocalSettings({ ...localSettings, heroHeadline: e.target.value })}
                    className="w-full bg-[#060a12] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300 uppercase">Hero Subheadline</label>
                  <textarea
                    rows={2}
                    value={localSettings.heroSubheadline}
                    onChange={(e) => setLocalSettings({ ...localSettings, heroSubheadline: e.target.value })}
                    className="w-full bg-[#060a12] border border-slate-800 rounded-xl p-3 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 uppercase">Maker Name</label>
                    <input
                      type="text"
                      value={localSettings.makerName}
                      onChange={(e) => setLocalSettings({ ...localSettings, makerName: e.target.value })}
                      className="w-full bg-[#060a12] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 uppercase">Maker Role</label>
                    <input
                      type="text"
                      value={localSettings.makerRole}
                      onChange={(e) => setLocalSettings({ ...localSettings, makerRole: e.target.value })}
                      className="w-full bg-[#060a12] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300 uppercase">Maker Bio & Philosophy</label>
                  <textarea
                    rows={4}
                    value={localSettings.makerBio}
                    onChange={(e) => setLocalSettings({ ...localSettings, makerBio: e.target.value })}
                    className="w-full bg-[#060a12] border border-slate-800 rounded-xl p-3 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 uppercase">Contact Email</label>
                    <input
                      type="email"
                      value={localSettings.contactEmail}
                      onChange={(e) => setLocalSettings({ ...localSettings, contactEmail: e.target.value })}
                      className="w-full bg-[#060a12] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 uppercase">GitHub URL</label>
                    <input
                      type="text"
                      value={localSettings.githubUrl}
                      onChange={(e) => setLocalSettings({ ...localSettings, githubUrl: e.target.value })}
                      className="w-full bg-[#060a12] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 uppercase">YouTube URL</label>
                    <input
                      type="text"
                      value={localSettings.youtubeUrl}
                      onChange={(e) => setLocalSettings({ ...localSettings, youtubeUrl: e.target.value })}
                      className="w-full bg-[#060a12] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB G: SECURITY & AUDIT LOGS */}
          {activeTab === 'security' && (
            <div className="space-y-8 max-w-4xl">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Security & Access Control</h2>
                <p className="text-xs text-slate-400">Update master password and review all system mutation logs.</p>
              </div>

              {/* Password update box */}
              <div className="bg-[#090e1a] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-cyan-400" />
                  <span>Update Coordinator Master Password</span>
                </h3>

                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400 uppercase">Current Password</label>
                    <input
                      type="password"
                      required
                      value={currentPwd}
                      onChange={(e) => setCurrentPwd(e.target.value)}
                      className="w-full bg-[#060a12] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400 uppercase">New Password (Min 8 chars)</label>
                    <input
                      type="password"
                      required
                      value={newPwd}
                      onChange={(e) => setNewPwd(e.target.value)}
                      className="w-full bg-[#060a12] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>

                  {pwdStatus && (
                    <div className={`p-3 rounded-xl text-xs ${
                      pwdStatus.startsWith('Error')
                        ? 'bg-rose-950/60 text-rose-300 border border-rose-500/40'
                        : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {pwdStatus}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs"
                  >
                    Change Password
                  </button>
                </form>
              </div>

              {/* Complete Audit Log */}
              <div className="bg-[#090e1a] border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-fuchsia-400" />
                  <span>Immutable System Audit Logs ({auditLogs.length})</span>
                </h3>

                <div className="max-h-96 overflow-y-auto overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500">
                        <th className="pb-2">Action</th>
                        <th className="pb-2">Target</th>
                        <th className="pb-2">Details</th>
                        <th className="pb-2">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="text-slate-300">
                          <td className="py-2 text-cyan-400 font-semibold">{log.action}</td>
                          <td className="py-2 text-slate-400">{log.entityType}</td>
                          <td className="py-2 font-sans max-w-sm truncate">{log.details}</td>
                          <td className="py-2 text-slate-500 text-[11px] whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB H: BACKUP & RESTORE */}
          {activeTab === 'backup' && (
            <div className="space-y-8 max-w-4xl">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Database Backup & Disaster Recovery</h2>
                <p className="text-xs text-slate-400">Download point-in-time JSON snapshots or restore complete database states.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#090e1a] border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Download className="w-4 h-4 text-cyan-400" />
                    <span>Export Database Snapshot</span>
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Generates a standalone JSON dump containing all projects, categories, workshop articles, code snippets, timeline milestones, and site configuration.
                  </p>
                  <button
                    onClick={handleExportDatabase}
                    className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download JSON File</span>
                  </button>
                </div>

                <div className="bg-[#090e1a] border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Upload className="w-4 h-4 text-fuchsia-400" />
                    <span>Restore From JSON</span>
                  </h3>
                  <textarea
                    rows={4}
                    placeholder="Paste database JSON payload here..."
                    value={restorePayload}
                    onChange={(e) => setRestorePayload(e.target.value)}
                    className="w-full bg-[#060a12] border border-slate-800 rounded-xl p-3 text-xs text-white font-mono"
                  />
                  {restoreStatus && (
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-cyan-300">
                      {restoreStatus}
                    </div>
                  )}
                  <button
                    onClick={handleRestoreDatabase}
                    className="px-5 py-2.5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold text-xs flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Execute Restore</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB I: MESSAGES INBOX */}
          {activeTab === 'messages' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Messages Inbox</h2>
                <p className="text-xs text-slate-400">Incoming transmissions received via public contact form.</p>
              </div>

              {messages.length === 0 ? (
                <div className="p-12 text-center bg-[#090e1a] rounded-2xl border border-slate-800 text-slate-400 text-xs">
                  No transmissions received yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`bg-[#090e1a] border rounded-2xl p-6 space-y-3 transition-colors ${
                        msg.isRead ? 'border-slate-800' : 'border-cyan-500/40 bg-cyan-950/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-white">{msg.senderName}</span>
                          <span className="text-xs font-mono text-cyan-400">({msg.senderEmail})</span>
                        </div>
                        <span className="text-xs font-mono text-slate-500">
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-slate-300">{msg.subject}</div>
                      <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                        {msg.message}
                      </p>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        {!msg.isRead && (
                          <button
                            onClick={async () => {
                              await api.markMessageRead(msg.id);
                              await loadAllDashboardData();
                            }}
                            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300"
                          >
                            Mark Read
                          </button>
                        )}
                        <button
                          onClick={async () => {
                            await api.deleteMessage(msg.id);
                            await loadAllDashboardData();
                          }}
                          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-rose-950 text-xs text-slate-400 hover:text-rose-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* PROJECT EDITOR MODAL */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#090e1a] border border-cyan-500/30 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setEditingProject(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white">
              {editingProject.id ? `Edit Project: ${editingProject.title}` : 'Add New Project'}
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300 uppercase">Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full bg-[#060a12] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300 uppercase">Category</label>
                  <select
                    value={editingProject.category || 'Arduino Projects'}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full bg-[#060a12] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                  >
                    <option>AI Assistants and AI Experiments</option>
                    <option>Arduino Projects</option>
                    <option>ESP32 and ESP8266 Projects</option>
                    <option>Robotics and Automation</option>
                    <option>Women Safety Device</option>
                    <option>Retro Gaming and Handheld Consoles</option>
                    <option>Smart Home and IoT</option>
                    <option>Sensors and Weather Stations</option>
                    <option>Computer Hardware and Operating Systems</option>
                    <option>Displays, OLED and LCD Projects</option>
                    <option>Wireless Communication and ESP-NOW</option>
                    <option>Experimental Builds and Future Projects</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300 uppercase">Status</label>
                  <select
                    value={editingProject.status || 'In Progress'}
                    onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as any })}
                    className="w-full bg-[#060a12] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                  >
                    <option>Planned</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Archived</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300 uppercase">Cover Image</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingProject.coverImage || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, coverImage: e.target.value })}
                      className="flex-1 bg-[#060a12] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white truncate"
                    />
                    <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 cursor-pointer flex items-center gap-1 shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'coverImage')}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300 uppercase">Summary (Short)</label>
                <textarea
                  rows={2}
                  value={editingProject.summary || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                  className="w-full bg-[#060a12] border border-slate-800 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300 uppercase">Problem Solved</label>
                <textarea
                  rows={2}
                  value={editingProject.problemSolved || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, problemSolved: e.target.value })}
                  className="w-full bg-[#060a12] border border-slate-800 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300 uppercase">How It Works & Description</label>
                <textarea
                  rows={4}
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full bg-[#060a12] border border-slate-800 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300 uppercase">Wiring Instructions</label>
                <textarea
                  rows={3}
                  value={editingProject.wiringInstructions || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, wiringInstructions: e.target.value })}
                  className="w-full bg-[#060a12] border border-slate-800 rounded-xl p-3 text-xs text-white"
                />
              </div>

              {/* Circuit Diagram / Schematic Picture */}
              <div className="space-y-1.5 p-4 rounded-2xl bg-[#060a12] border border-cyan-500/20">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-cyan-300 uppercase font-semibold flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Circuit Diagram / Schematic Picture</span>
                  </label>
                  {editingProject.circuitDiagramImage && (
                    <span className="text-[11px] font-mono text-emerald-400">Diagram Attached</span>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="URL or uploaded diagram path..."
                    value={editingProject.circuitDiagramImage || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, circuitDiagramImage: e.target.value })}
                    className="flex-1 bg-[#090e1a] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <label className="px-4 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/30 text-xs font-semibold text-cyan-300 cursor-pointer flex items-center justify-center gap-1.5 shrink-0 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Diagram Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'circuitDiagramImage')}
                    />
                  </label>
                </div>
                {editingProject.circuitDiagramImage && (
                  <div className="mt-2 relative w-32 h-20 rounded-lg overflow-hidden border border-slate-800 bg-slate-900">
                    <img
                      src={editingProject.circuitDiagramImage}
                      alt="Circuit Diagram Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* How To Make Process */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300 uppercase flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-fuchsia-400" />
                  <span>How To Make Process (Step-by-Step Assembly Guide)</span>
                </label>
                <textarea
                  rows={5}
                  placeholder={`### Step 1: Component preparation & breadboard staging\n### Step 2: Wiring sensor & power lines\n### Step 3: Compiling & uploading .bin or .ino firmware\n### Step 4: Verification and calibration...`}
                  value={editingProject.howToMakeProcess || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, howToMakeProcess: e.target.value })}
                  className="w-full bg-[#060a12] border border-slate-800 rounded-xl p-3 text-xs text-white font-mono leading-relaxed"
                />
              </div>

              {/* Attach Firmware Code File (.bin or .ino) */}
              <div className="space-y-2 p-4 rounded-2xl bg-[#060a12] border border-fuchsia-500/30">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-fuchsia-300 uppercase font-semibold flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-fuchsia-400" />
                    <span>Attach Firmware Code File (.bin or .ino)</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-400">Directly Flashable Binary or Arduino Sketch</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Firmware filename (e.g. firmware.bin or sketch.ino)..."
                    value={editingProject.firmwareFile?.name || ''}
                    onChange={(e) => {
                      const name = e.target.value;
                      const ext = name.split('.').pop()?.toLowerCase() || 'bin';
                      setEditingProject({
                        ...editingProject,
                        firmwareFile: {
                          name,
                          url: editingProject.firmwareFile?.url || '',
                          fileSize: editingProject.firmwareFile?.fileSize || '1.0 MB',
                          fileType: ext
                        }
                      });
                    }}
                    className="flex-1 bg-[#090e1a] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />

                  <label className="px-4 py-2 rounded-xl bg-fuchsia-950/80 hover:bg-fuchsia-900 border border-fuchsia-500/40 text-xs font-semibold text-fuchsia-300 cursor-pointer flex items-center justify-center gap-1.5 shrink-0 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload .bin / .ino File</span>
                    <input
                      type="file"
                      accept=".bin,.ino,.hex,.cpp,.h,.zip,.txt"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'firmwareFile')}
                    />
                  </label>
                </div>

                {editingProject.firmwareFile?.url && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-fuchsia-900/60 text-fuchsia-200 font-mono uppercase font-bold text-[10px]">
                        .{editingProject.firmwareFile.fileType || 'bin'}
                      </span>
                      <span className="font-semibold text-white">{editingProject.firmwareFile.name}</span>
                      {editingProject.firmwareFile.fileSize && (
                        <span className="text-slate-400 font-mono text-[11px]">({editingProject.firmwareFile.fileSize})</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingProject({ ...editingProject, firmwareFile: undefined })}
                      className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300 uppercase">Code Snippet</label>
                <textarea
                  rows={4}
                  value={editingProject.codeSnippet || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, codeSnippet: e.target.value })}
                  className="w-full bg-[#060a12] border border-slate-800 rounded-xl p-3 text-xs text-white font-mono"
                />
              </div>

              <div className="flex items-center gap-6 pt-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingProject.isPublished ?? true}
                    onChange={(e) => setEditingProject({ ...editingProject, isPublished: e.target.checked })}
                    className="rounded bg-slate-900 border-slate-800 text-cyan-500"
                  />
                  <span>Published on Public Website</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingProject.isFeatured ?? false}
                    onChange={(e) => setEditingProject({ ...editingProject, isFeatured: e.target.checked })}
                    className="rounded bg-slate-900 border-slate-800 text-cyan-500"
                  />
                  <span>Featured on Homepage</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setEditingProject(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProject}
                className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs"
              >
                Save Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ARTICLE EDITOR MODAL */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#090e1a] border border-cyan-500/30 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold text-white">Edit Workshop Article</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Article Title"
                value={editingArticle.title || ''}
                onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                className="w-full bg-[#060a12] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
              />
              <textarea
                rows={2}
                placeholder="Summary..."
                value={editingArticle.summary || ''}
                onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                className="w-full bg-[#060a12] border border-slate-800 rounded-xl p-3 text-xs text-white"
              />
              <textarea
                rows={8}
                placeholder="Full markdown tutorial content..."
                value={editingArticle.contentMarkdown || ''}
                onChange={(e) => setEditingArticle({ ...editingArticle, contentMarkdown: e.target.value })}
                className="w-full bg-[#060a12] border border-slate-800 rounded-xl p-3 text-xs text-white font-mono"
              />
            </div>
            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={() => setEditingArticle(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveArticle}
                className="px-6 py-2 rounded-xl bg-cyan-600 text-slate-950 font-bold text-xs"
              >
                Save Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CODE EDITOR MODAL */}
      {editingCode && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#090e1a] border border-cyan-500/30 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold text-white">Edit Code Snippet</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Snippet Title"
                  value={editingCode.title || ''}
                  onChange={(e) => setEditingCode({ ...editingCode, title: e.target.value })}
                  className="w-full bg-[#060a12] border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
                />
                <select
                  value={editingCode.language || 'ESP32 C++'}
                  onChange={(e) => setEditingCode({ ...editingCode, language: e.target.value as any })}
                  className="w-full bg-[#060a12] border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
                >
                  <option>Arduino C++</option>
                  <option>ESP32 C++</option>
                  <option>Python</option>
                  <option>JavaScript</option>
                </select>
              </div>
              <textarea
                rows={10}
                placeholder="Code content..."
                value={editingCode.code || ''}
                onChange={(e) => setEditingCode({ ...editingCode, code: e.target.value })}
                className="w-full bg-[#060a12] border border-slate-800 rounded-xl p-3 text-xs text-cyan-200 font-mono"
              />
            </div>
            <div className="flex justify-end gap-3 pt-3">
              <button onClick={() => setEditingCode(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs">
                Cancel
              </button>
              <button onClick={handleSaveCode} className="px-6 py-2 rounded-xl bg-cyan-600 text-slate-950 font-bold text-xs">
                Save Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TIMELINE EDITOR MODAL */}
      {editingTimeline && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#090e1a] border border-cyan-500/30 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold text-white">Edit Timeline Milestone</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="YYYY-MM (e.g. 2026-10)"
                  value={editingTimeline.yearMonth || ''}
                  onChange={(e) => setEditingTimeline({ ...editingTimeline, yearMonth: e.target.value })}
                  className="w-full bg-[#060a12] border border-slate-800 rounded-xl px-4 py-2 text-xs text-white font-mono"
                />
                <select
                  value={editingTimeline.category || 'Build'}
                  onChange={(e) => setEditingTimeline({ ...editingTimeline, category: e.target.value as any })}
                  className="w-full bg-[#060a12] border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
                >
                  <option>Milestone</option>
                  <option>Build</option>
                  <option>Failure & Fix</option>
                  <option>Hardware Upgrade</option>
                  <option>Future Vision</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Milestone Title"
                value={editingTimeline.title || ''}
                onChange={(e) => setEditingTimeline({ ...editingTimeline, title: e.target.value })}
                className="w-full bg-[#060a12] border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
              />
              <textarea
                rows={3}
                placeholder="Description..."
                value={editingTimeline.description || ''}
                onChange={(e) => setEditingTimeline({ ...editingTimeline, description: e.target.value })}
                className="w-full bg-[#060a12] border border-slate-800 rounded-xl p-3 text-xs text-white"
              />
              <textarea
                rows={2}
                placeholder="Lesson Learned..."
                value={editingTimeline.lessonsLearned || ''}
                onChange={(e) => setEditingTimeline({ ...editingTimeline, lessonsLearned: e.target.value })}
                className="w-full bg-[#060a12] border border-slate-800 rounded-xl p-3 text-xs text-white"
              />
            </div>
            <div className="flex justify-end gap-3 pt-3">
              <button onClick={() => setEditingTimeline(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs">
                Cancel
              </button>
              <button onClick={handleSaveTimeline} className="px-6 py-2 rounded-xl bg-cyan-600 text-slate-950 font-bold text-xs">
                Save Milestone
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DESTRUCTIVE ACTION CONFIRMATION MODAL */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090e1a] border border-rose-500/40 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-center">
            <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
            <h4 className="text-base font-bold text-white">Confirm Permanent Deletion</h4>
            <p className="text-xs text-slate-300">
              Are you sure you want to permanently delete <strong className="text-white">"{deleteConfirmation.title}"</strong>? This action will be recorded in the system audit trail.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteConfirmation.type === 'project') handleDeleteProject(deleteConfirmation.id);
                  if (deleteConfirmation.type === 'article') handleDeleteArticle(deleteConfirmation.id);
                  if (deleteConfirmation.type === 'code') handleDeleteCode(deleteConfirmation.id);
                  if (deleteConfirmation.type === 'timeline') handleDeleteTimeline(deleteConfirmation.id);
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
