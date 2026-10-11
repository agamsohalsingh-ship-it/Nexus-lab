import type {
  Project,
  Category,
  WorkshopArticle,
  CodeVaultEntry,
  TimelineEntry,
  WebsiteSettings,
  DatabaseStats,
  AuditLog,
  ContactMessage
} from '../types';

const TOKEN_KEY = 'nexus_coordinator_token';

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

const getHeaders = (isJson = true): Record<string, string> => {
  const headers: Record<string, string> = {};
  if (isJson) headers['Content-Type'] = 'application/json';
  const token = getAuthToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

export const api = {
  // Public
  async getStats(): Promise<DatabaseStats> {
    const res = await fetch('/api/stats');
    if (!res.ok) throw new Error('Failed to fetch statistics');
    return res.json();
  },

  async getSettings(): Promise<WebsiteSettings> {
    try {
      const res = await fetch('/api/settings');
      if (!res.ok) throw new Error('Failed to fetch settings');
      const data = await res.json();
      localStorage.setItem('nexus_cached_settings', JSON.stringify(data));
      return data;
    } catch (err) {
      const cached = localStorage.getItem('nexus_cached_settings');
      if (cached) return JSON.parse(cached);
      throw err;
    }
  },

  async getCategories(): Promise<Category[]> {
    const res = await fetch('/api/categories');
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async getProjects(params?: { category?: string; search?: string; status?: string }): Promise<Project[]> {
    try {
      const q = new URLSearchParams();
      if (params?.category) q.set('category', params.category);
      if (params?.search) q.set('search', params.search);
      if (params?.status) q.set('status', params.status);
      const res = await fetch(`/api/projects?${q.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch projects');
      const data = await res.json();
      localStorage.setItem('nexus_cached_projects', JSON.stringify(data));
      return data;
    } catch (err) {
      const cached = localStorage.getItem('nexus_cached_projects');
      if (cached) return JSON.parse(cached);
      throw err;
    }
  },

  async getProjectBySlug(slug: string): Promise<Project> {
    const res = await fetch(`/api/projects/${encodeURIComponent(slug)}`);
    if (!res.ok) throw new Error('Project not found');
    return res.json();
  },

  async getArticles(): Promise<WorkshopArticle[]> {
    const res = await fetch('/api/articles');
    if (!res.ok) throw new Error('Failed to fetch articles');
    return res.json();
  },

  async getArticleBySlug(slug: string): Promise<WorkshopArticle> {
    const res = await fetch(`/api/articles/${encodeURIComponent(slug)}`);
    if (!res.ok) throw new Error('Article not found');
    return res.json();
  },

  async getCode(params?: { lang?: string; search?: string }): Promise<CodeVaultEntry[]> {
    const q = new URLSearchParams();
    if (params?.lang) q.set('lang', params.lang);
    if (params?.search) q.set('search', params.search);
    const res = await fetch(`/api/code?${q.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch code vault');
    return res.json();
  },

  async getTimeline(): Promise<TimelineEntry[]> {
    const res = await fetch('/api/timeline');
    if (!res.ok) throw new Error('Failed to fetch timeline');
    return res.json();
  },

  async sendContactMessage(data: { name: string; email: string; subject: string; message: string; honeypot?: string }): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to send message');
    return json;
  },

  // Coordinator Auth
  async login(identifier: string, password: string): Promise<{ token: string; user: { id: string; username: string; email: string; role: string } }> {
    const res = await fetch('/api/coordinator/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Authentication failed');
    setAuthToken(json.token);
    return json;
  },

  async logout(): Promise<void> {
    try {
      await fetch('/api/coordinator/logout', {
        method: 'POST',
        headers: getHeaders()
      });
    } finally {
      clearAuthToken();
    }
  },

  async checkAuth(): Promise<{ user: { id: string; username: string; email: string; role: string } } | null> {
    const token = getAuthToken();
    if (!token) return null;
    try {
      const res = await fetch('/api/coordinator/me', { headers: getHeaders() });
      if (res.ok) {
        return res.json();
      }
      clearAuthToken();
      return null;
    } catch {
      return null;
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const res = await fetch('/api/coordinator/change-password', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Password update failed');
  },

  async uploadFile(file: File): Promise<{ url: string; filename: string; originalName: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const token = getAuthToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch('/api/coordinator/upload', {
      method: 'POST',
      headers,
      body: formData
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Upload failed');
    return json;
  },

  // Coordinator Management
  async getCoordinatorProjects(): Promise<Project[]> {
    const res = await fetch('/api/coordinator/projects', { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch coordinator projects');
    return res.json();
  },

  async createProject(project: Partial<Project>): Promise<Project> {
    const res = await fetch('/api/coordinator/projects', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(project)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to create project');
    return json;
  },

  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    const res = await fetch(`/api/coordinator/projects/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(project)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update project');
    return json;
  },

  async deleteProject(id: string): Promise<void> {
    const res = await fetch(`/api/coordinator/projects/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete project');
  },

  async duplicateProject(id: string): Promise<Project> {
    const res = await fetch(`/api/coordinator/projects/${encodeURIComponent(id)}/duplicate`, {
      method: 'POST',
      headers: getHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to duplicate project');
    return json;
  },

  async getCoordinatorArticles(): Promise<WorkshopArticle[]> {
    const res = await fetch('/api/coordinator/articles', { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch coordinator articles');
    return res.json();
  },

  async saveArticle(article: Partial<WorkshopArticle>): Promise<WorkshopArticle> {
    const res = await fetch('/api/coordinator/articles', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(article)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to save article');
    return json;
  },

  async deleteArticle(id: string): Promise<void> {
    const res = await fetch(`/api/coordinator/articles/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete article');
  },

  async getCoordinatorCode(): Promise<CodeVaultEntry[]> {
    const res = await fetch('/api/coordinator/code', { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch code vault items');
    return res.json();
  },

  async saveCode(code: Partial<CodeVaultEntry>): Promise<CodeVaultEntry> {
    const res = await fetch('/api/coordinator/code', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(code)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to save code');
    return json;
  },

  async deleteCode(id: string): Promise<void> {
    const res = await fetch(`/api/coordinator/code/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete code');
  },

  async saveTimelineEntry(entry: Partial<TimelineEntry>): Promise<TimelineEntry> {
    const res = await fetch('/api/coordinator/timeline', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(entry)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to save timeline entry');
    return json;
  },

  async deleteTimelineEntry(id: string): Promise<void> {
    const res = await fetch(`/api/coordinator/timeline/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete timeline entry');
  },

  async updateSettings(settings: Partial<WebsiteSettings>): Promise<WebsiteSettings> {
    const res = await fetch('/api/coordinator/settings', {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(settings)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update settings');
    localStorage.setItem('nexus_cached_settings', JSON.stringify(json));
    return json;
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    const res = await fetch('/api/coordinator/audit-logs', { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return res.json();
  },

  async getMessages(): Promise<ContactMessage[]> {
    const res = await fetch('/api/coordinator/messages', { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },

  async markMessageRead(id: string): Promise<void> {
    await fetch(`/api/coordinator/messages/${encodeURIComponent(id)}/read`, {
      method: 'PUT',
      headers: getHeaders()
    });
  },

  async deleteMessage(id: string): Promise<void> {
    await fetch(`/api/coordinator/messages/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
  },

  async exportDatabase(): Promise<Blob> {
    const res = await fetch('/api/coordinator/export', { headers: getHeaders() });
    if (!res.ok) throw new Error('Export failed');
    return res.blob();
  },

  async restoreDatabase(data: any): Promise<void> {
    const res = await fetch('/api/coordinator/restore', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Restore failed');
  }
};
