export const APP_NAME = 'CodeReview AI';
export const APP_VERSION = '1.0.0';

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  PR_REVIEW: '/pr/:number',
  LOGIN: '/login',
  SETTINGS: '/settings',
  PROFILE: '/profile',
} as const;

export const PR_STATUS_COLORS = {
  open: 'bg-green-100 text-green-700 border-green-200',
  closed: 'bg-red-100 text-red-700 border-red-200',
  merged: 'bg-purple-100 text-purple-700 border-purple-200',
  draft: 'bg-gray-100 text-gray-700 border-gray-200',
} as const;

export const REVIEW_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  changes_requested: 'bg-red-100 text-red-700',
  commented: 'bg-blue-100 text-blue-700',
} as const;

export const INSIGHT_SEVERITY_COLORS = {
  critical: 'bg-red-100 text-red-700 border-red-300',
  high: 'bg-orange-100 text-orange-700 border-orange-300',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  low: 'bg-blue-100 text-blue-700 border-blue-300',
  info: 'bg-gray-100 text-gray-700 border-gray-300',
} as const;

export const INSIGHT_TYPE_ICONS = {
  security: '🛡️',
  performance: '⚡',
  quality: '✨',
  'best-practice': '📋',
} as const;

export const FILE_STATUS_COLORS = {
  added: 'text-green-600',
  modified: 'text-yellow-600',
  deleted: 'text-red-600',
  renamed: 'text-blue-600',
} as const;

export const LANGUAGE_COLORS: Record<string, string> = {
  typescript: '#3178c6',
  javascript: '#f7df1e',
  python: '#3776ab',
  java: '#007396',
  go: '#00add8',
  rust: '#dea584',
  ruby: '#cc342d',
  php: '#777bb4',
  html: '#e34c26',
  css: '#563d7c',
  json: '#292929',
  markdown: '#083fa1',
};

export const COLLABORATION_COLORS = [
  'rgb(59, 130, 246)',   // blue
  'rgb(34, 197, 94)',    // green
  'rgb(168, 85, 247)',   // purple
  'rgb(251, 146, 60)',   // orange
  'rgb(236, 72, 153)',   // pink
  'rgb(14, 165, 233)',   // sky
  'rgb(234, 179, 8)',    // yellow
  'rgb(239, 68, 68)',    // red
];