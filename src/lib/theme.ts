import type { ThemeFamily } from './relations';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
  glow2: string;
  text: string;
  textMuted: string;
  bg: string;
  cardBg: string;
  border: string;
  chipBg: string;
  chipText: string;
  chipBorder: string;
}

export const THEMES: Record<ThemeFamily, ThemeColors> = {
  cyberpunk: {
    primary: '#22d3ee',
    secondary: '#f472b6',
    accent: '#a78bfa',
    glow: 'rgba(34,211,238,0.5)',
    glow2: 'rgba(244,114,182,0.4)',
    text: '#e0f7fa',
    textMuted: '#7dd3fc',
    bg: '#0a0e1a',
    cardBg: 'rgba(15,23,42,0.55)',
    border: 'rgba(34,211,238,0.3)',
    chipBg: 'rgba(34,211,238,0.12)',
    chipText: '#22d3ee',
    chipBorder: 'rgba(34,211,238,0.35)',
  },
  'gold-minimal': {
    primary: '#fbbf24',
    secondary: '#f59e0b',
    accent: '#fde68a',
    glow: 'rgba(251,191,36,0.4)',
    glow2: 'rgba(245,158,11,0.3)',
    text: '#fef3c7',
    textMuted: '#d4b956',
    bg: '#0d0c08',
    cardBg: 'rgba(30,28,14,0.6)',
    border: 'rgba(251,191,36,0.25)',
    chipBg: 'rgba(251,191,36,0.1)',
    chipText: '#fbbf24',
    chipBorder: 'rgba(251,191,36,0.3)',
  },
  pastel: {
    primary: '#f0abfc',
    secondary: '#a5f3fc',
    accent: '#fbcfe8',
    glow: 'rgba(240,171,252,0.4)',
    glow2: 'rgba(165,243,252,0.3)',
    text: '#fdf4ff',
    textMuted: '#c4b5fd',
    bg: '#0d0a14',
    cardBg: 'rgba(30,20,40,0.5)',
    border: 'rgba(240,171,252,0.25)',
    chipBg: 'rgba(240,171,252,0.1)',
    chipText: '#f0abfc',
    chipBorder: 'rgba(240,171,252,0.3)',
  },
  glass: {
    primary: '#93c5fd',
    secondary: '#6ee7b7',
    accent: '#c4b5fd',
    glow: 'rgba(147,197,253,0.4)',
    glow2: 'rgba(110,231,183,0.3)',
    text: '#f0f9ff',
    textMuted: '#94a3b8',
    bg: '#0a0f1a',
    cardBg: 'rgba(20,30,50,0.4)',
    border: 'rgba(147,197,253,0.2)',
    chipBg: 'rgba(147,197,253,0.1)',
    chipText: '#93c5fd',
    chipBorder: 'rgba(147,197,253,0.25)',
  },
  matrix: {
    primary: '#4ade80',
    secondary: '#22d3ee',
    accent: '#86efac',
    glow: 'rgba(74,222,128,0.4)',
    glow2: 'rgba(34,211,238,0.3)',
    text: '#dcfce7',
    textMuted: '#86efac',
    bg: '#0a0f0a',
    cardBg: 'rgba(15,30,15,0.5)',
    border: 'rgba(74,222,128,0.25)',
    chipBg: 'rgba(74,222,128,0.1)',
    chipText: '#4ade80',
    chipBorder: 'rgba(74,222,128,0.3)',
  },
};

export function getTheme(family: ThemeFamily): ThemeColors {
  return THEMES[family];
}

export type AppTheme = 'dark' | 'light' | 'system';

const APP_THEME_KEY = 'tbx_app_theme';

export function getAppTheme(): AppTheme {
  const stored = localStorage.getItem(APP_THEME_KEY) as AppTheme | null;
  return stored || 'system';
}

export function setAppTheme(theme: AppTheme): void {
  localStorage.setItem(APP_THEME_KEY, theme);
}

export function resolveTheme(theme: AppTheme): 'dark' | 'light' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  return theme;
}
