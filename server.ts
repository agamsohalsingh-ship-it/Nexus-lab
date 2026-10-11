import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import multer from 'multer';
import { db } from './server/db.ts';
import type { CoordinatorUser } from './server/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Ensure upload directory exists
const UPLOADS_DIR = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

// Configure multer for disk storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${Date.now()}_${cleanName}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|webp|gif|svg|pdf|ino|bin|hex|cpp|h|py|zip|json|txt)$/i;
    if (file.originalname.match(allowed)) {
      cb(null, true);
    } else {
      cb(new Error('File type not supported for upload'));
    }
  }
});

// Authentication middleware for coordinator routes - requires valid credentials
interface AuthenticatedRequest extends Request {
  user?: CoordinatorUser;
}

const requireCoordinator = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  let token = '';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.headers['x-coordinator-token']) {
    token = String(req.headers['x-coordinator-token']);
  }

  if (token) {
    const user = db.validateSession(token);
    if (user) {
      req.user = user;
      return next();
    }
  }

  return res.status(401).json({ error: 'Authentication required' });
};

/* ==========================================================================
   PUBLIC API ENDPOINTS
   ========================================================================== */

// Real database statistics
app.get('/api/stats', (_req: Request, res: Response) => {
  try {
    const stats = db.getRealDatabaseStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Website settings (theme, title, maker bio)
app.get('/api/settings', (_req: Request, res: Response) => {
  try {
    const settings = db.getSettings();
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Categories list
app.get('/api/categories', (_req: Request, res: Response) => {
  try {
    const categories = db.getCategories();
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Public projects list (published only, with optional search & category filter)
app.get('/api/projects', (req: Request, res: Response) => {
  try {
    let projects = db.getProjects(false);
    const category = req.query.category as string;
    const search = req.query.search as string;
    const status = req.query.status as string;

    if (category && category !== 'All') {
      projects = projects.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (status && status !== 'All') {
      projects = projects.filter(p => p.status.toLowerCase() === status.toLowerCase());
    }

    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      projects = projects.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.components.some(c => c.name.toLowerCase().includes(q))
      );
    }

    res.json(projects);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Single project detail by slug or ID
app.get('/api/projects/:slug', (req: Request, res: Response) => {
  try {
    const project = db.getProjectBySlug(req.params.slug, false);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Public articles list (published only)
app.get('/api/articles', (_req: Request, res: Response) => {
  try {
    const articles = db.getArticles(false);
    res.json(articles);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Single article detail
app.get('/api/articles/:slug', (req: Request, res: Response) => {
  try {
    const article = db.getArticleBySlug(req.params.slug, false);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Code vault entries (published only)
app.get('/api/code', (req: Request, res: Response) => {
  try {
    let items = db.getCodeVault(false);
    const lang = req.query.lang as string;
    const search = req.query.search as string;

    if (lang && lang !== 'All') {
      items = items.filter(c => c.language === lang);
    }

    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      items = items.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Maker journey timeline entries
app.get('/api/timeline', (_req: Request, res: Response) => {
  try {
    const timeline = db.getTimeline();
    res.json(timeline);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Public contact form with spam protection (honeypot + input validation)
app.post('/api/contact', (req: Request, res: Response) => {
  try {
    const { name, email, subject, message, honeypot } = req.body;

    // Spam honeypot detection: bots fill hidden fields
    if (honeypot && String(honeypot).trim().length > 0) {
      return res.status(200).json({ success: true, message: 'Message sent successfully.' });
    }

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    if (!email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const saved = db.addContactMessage(name, email, subject || 'General Maker Inquiry', message);
    res.json({ success: true, message: 'Message received by the lab.', id: saved.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* ==========================================================================
   PRIVATE COORDINATOR AUTHENTICATION & MANAGEMENT ENDPOINTS
   ========================================================================== */

// Coordinator Login
app.post('/api/coordinator/login', (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Identifier and password are required' });
    }

    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    const authResult = db.authenticateUser(identifier, password, clientIp);

    if (!authResult) {
      return res.status(401).json({ error: 'Invalid coordinator credentials' });
    }

    res.json({
      success: true,
      token: authResult.token,
      user: {
        id: authResult.user.id,
        username: authResult.user.username,
        email: authResult.user.email,
        role: authResult.user.role
      }
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Coordinator Logout
app.post('/api/coordinator/logout', (req: AuthenticatedRequest, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      db.logoutSession(authHeader.substring(7));
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Coordinator Me / Session Check
app.get('/api/coordinator/me', requireCoordinator, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    user: {
      id: req.user!.id,
      username: req.user!.username,
      email: req.user!.email,
      role: req.user!.role
    }
  });
});

// Change Coordinator Password
app.post('/api/coordinator/change-password', requireCoordinator, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    db.updatePassword(req.user!.id, currentPassword, newPassword);
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// File and Image Upload for projects, diagrams, and code attachments
app.post('/api/coordinator/upload', requireCoordinator, upload.single('file'), (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const publicUrl = `/uploads/${req.file.filename}`;
    db.addAuditLog('FILE_UPLOAD', 'Media', req.file.filename, `Uploaded file ${req.file.originalname} (${(req.file.size / 1024).toFixed(1)} KB)`, req.user!.username);

    res.json({
      success: true,
      url: publicUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Projects Management (Coordinator CRUD)
app.get('/api/coordinator/projects', requireCoordinator, (_req: AuthenticatedRequest, res: Response) => {
  res.json(db.getProjects(true));
});

app.post('/api/coordinator/projects', requireCoordinator, (req: AuthenticatedRequest, res: Response) => {
  try {
    const created = db.createProject(req.body, req.user!.username);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/coordinator/projects/:id', requireCoordinator, (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = db.updateProject(req.params.id, req.body, req.user!.username);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/coordinator/projects/:id', requireCoordinator, (req: AuthenticatedRequest, res: Response) => {
  try {
    const success = db.deleteProject(req.params.id, req.user!.username);
    if (!success) return res.status(404).json({ error: 'Project not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/coordinator/projects/:id/duplicate', requireCoordinator, (req: AuthenticatedRequest, res: Response) => {
  try {
    const dup = db.duplicateProject(req.params.id, req.user!.username);
    res.json(dup);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Articles Management
app.get('/api/coordinator/articles', requireCoordinator, (_req: AuthenticatedRequest, res: Response) => {
  res.json(db.getArticles(true));
});

app.post('/api/coordinator/articles', requireCoordinator, (req: AuthenticatedRequest, res: Response) => {
  try {
    const saved = db.saveArticle(req.body, req.user!.username);
    res.json(saved);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/coordinator/articles/:id', requireCoordinator, (req: AuthenticatedRequest, res: Response) => {
  try {
    const success = db.deleteArticle(req.params.id, req.user!.username);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Code Vault Management
app.get('/api/coordinator/code', requireCoordinator, (_req: AuthenticatedRequest, res: Response) => {
  res.json(db.getCodeVault(true));
});

app.post('/api/coordinator/code', requireCoordinator, (req: AuthenticatedRequest, res: Response) => {
  try {
    const saved = db.saveCodeVaultEntry(req.body, req.user!.username);
    res.json(saved);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/coordinator/code/:id', requireCoordinator, (req: AuthenticatedRequest, res: Response) => {
  try {
    const success = db.deleteCodeVaultEntry(req.params.id, req.user!.username);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Timeline Management
app.get('/api/coordinator/timeline', requireCoordinator, (_req: AuthenticatedRequest, res: Response) => {
  res.json(db.getTimeline());
});

app.post('/api/coordinator/timeline', requireCoordinator, (req: AuthenticatedRequest, res: Response) => {
  try {
    const saved = db.saveTimelineEntry(req.body, req.user!.username);
    res.json(saved);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/coordinator/timeline/:id', requireCoordinator, (req: AuthenticatedRequest, res: Response) => {
  try {
    const success = db.deleteTimelineEntry(req.params.id, req.user!.username);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Category Management
app.post('/api/coordinator/categories', requireCoordinator, (req: AuthenticatedRequest, res: Response) => {
  try {
    const saved = db.saveCategory(req.body, req.user!.username);
    res.json(saved);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/coordinator/categories/:id', requireCoordinator, (req: AuthenticatedRequest, res: Response) => {
  try {
    const success = db.deleteCategory(req.params.id, req.user!.username);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Website Customization & Settings
app.put('/api/coordinator/settings', requireCoordinator, (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = db.updateSettings(req.body, req.user!.username);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Audit Logs
app.get('/api/coordinator/audit-logs', requireCoordinator, (_req: AuthenticatedRequest, res: Response) => {
  res.json(db.getAuditLogs(150));
});

// Contact Messages
app.get('/api/coordinator/messages', requireCoordinator, (_req: AuthenticatedRequest, res: Response) => {
  res.json(db.getContactMessages());
});

app.put('/api/coordinator/messages/:id/read', requireCoordinator, (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: db.markContactMessageRead(req.params.id) });
});

app.delete('/api/coordinator/messages/:id', requireCoordinator, (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: db.deleteContactMessage(req.params.id) });
});

// Data Backup Export & Restore
app.get('/api/coordinator/export', requireCoordinator, (req: AuthenticatedRequest, res: Response) => {
  const exportData = db.exportData();
  db.addAuditLog('EXPORT_DATABASE', 'System', 'all', 'Exported database JSON dump', req.user!.username);
  res.setHeader('Content-Disposition', `attachment; filename="nexus_backup_${Date.now()}.json"`);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(exportData, null, 2));
});

app.post('/api/coordinator/restore', requireCoordinator, (req: AuthenticatedRequest, res: Response) => {
  try {
    const payload = req.body;
    db.restoreData(payload, req.user!.username);
    res.json({ success: true, message: 'Database successfully restored from payload' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/* ==========================================================================
   VITE & FRONTEND MOUNTING
   ========================================================================== */

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // In dev mode, mount Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve dist folder
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[NEXUS SERVER] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[NEXUS SERVER] Failed to start server:', err);
  process.exit(1);
});
