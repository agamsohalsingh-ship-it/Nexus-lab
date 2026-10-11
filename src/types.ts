export interface PinConnection {
  id: string;
  componentPin: string;
  mcuPin: string;
  description: string;
  voltage: string;
}

export interface ProjectComponent {
  id: string;
  name: string;
  specs: string;
  count: number;
  category?: string;
}

export interface BuildLogEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  imageUrl?: string;
  type: 'progress' | 'failure' | 'breakthrough' | 'upgrade';
}

export interface DownloadableFile {
  id: string;
  name: string;
  fileType: string;
  fileSize: string;
  url: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: 'Planned' | 'In Progress' | 'Completed' | 'Archived';
  summary: string;
  description: string;
  problemSolved: string;
  howItWorks: string;
  coverImage: string;
  galleryImages: string[];
  circuitDiagramImage?: string;
  howToMakeProcess?: string;
  firmwareFile?: {
    name: string;
    url: string;
    fileSize?: string;
    fileType?: string;
  };
  components: ProjectComponent[];
  pinConnections: PinConnection[];
  wiringInstructions: string;
  codeSnippet: string;
  codeSnippetLanguage: string;
  downloadableFiles: DownloadableFile[];
  features: string[];
  specifications: Record<string, string>;
  challengesAndImprovements: string;
  demoVideoUrl?: string;
  buildLogs: BuildLogEntry[];
  futureUpgrades: string[];
  tags: string[];
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
}

export interface WorkshopArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  contentMarkdown: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readTimeMinutes: number;
  coverImage: string;
  pinoutTable: PinConnection[];
  diagrams: { id: string; title: string; imageUrl: string; description: string }[];
  codeSnippet: string;
  codeSnippetLanguage: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CodeVaultEntry {
  id: string;
  title: string;
  language: 'Arduino C++' | 'ESP32 C++' | 'Python' | 'JavaScript' | 'HTML/CSS';
  description: string;
  code: string;
  projectId?: string;
  projectTitle?: string;
  version: string;
  filename: string;
  isPublished: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEntry {
  id: string;
  yearMonth: string;
  title: string;
  description: string;
  category: 'Milestone' | 'Build' | 'Failure & Fix' | 'Hardware Upgrade' | 'Competition' | 'Future Vision';
  mediaUrl?: string;
  isHighlight: boolean;
  lessonsLearned?: string;
}

export interface WebsiteSettings {
  id: number;
  siteTitle: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  makerName: string;
  makerRole: string;
  makerBio: string;
  makerAvatar: string;
  contactEmail: string;
  githubUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
  discordHandle: string;
  accentColor: string;
  enableAnimations: boolean;
  showXiaozhiBanner: boolean;
  metaDescription: string;
}

export interface DatabaseStats {
  totalProjects: number;
  completedProjects: number;
  inProgressProjects: number;
  plannedProjects: number;
  archivedProjects: number;
  publishedProjects: number;
  totalArticles: number;
  totalCodeSnippets: number;
  totalTimelineEntries: number;
  unreadMessages: number;
  categoryCounts: Record<string, number>;
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  username: string;
  timestamp: string;
}

export interface ContactMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}
