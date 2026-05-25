import React from 'react';
import {
  DarkTheme,
  DefaultTheme,
  type Theme as NavigationTheme,
} from '@react-navigation/native';

import { usePreferences } from '@/providers/PreferencesProvider';

export const palette = {
  ink: '#111827',
  slate: '#475569',
  muted: '#64748b',
  paper: '#fbf9ff',
  paperCool: '#eef7fb',
  white: '#ffffff',
  indigo: '#4f46e5',
  sky: '#0284c7',
  mint: '#0f766e',
  coral: '#e11d48',
  amber: '#b45309',
  darkBackground: '#0f172a',
  darkSurface: '#172033',
  darkText: '#f8fafc',
};

export type ThemeMode = 'Light' | 'Dark';

type StatusBarStyle = 'light-content' | 'dark-content';

export interface AppThemeColors {
  background: string;
  backgroundPanel: string;
  surface: string;
  surfaceMuted: string;
  border: string;
  borderStrong: string;
  shadow: string;
  glass: string;
  glassStrong: string;
  glassBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  accent: string;
  accentSoft: string;
  success: string;
  warning: string;
  danger: string;
  tabBarBackground: string;
  tabBarBorder: string;
}

export interface AppTheme {
  mode: ThemeMode;
  isDark: boolean;
  statusBarStyle: StatusBarStyle;
  colors: AppThemeColors;
  navigationTheme: NavigationTheme;
}

const buildThemeColors = (mode: ThemeMode): AppThemeColors => {
  if (mode === 'Dark') {
    return {
      background: palette.darkBackground,
      backgroundPanel: '#12213a',
      surface: palette.darkSurface,
      surfaceMuted: '#1e293b',
      border: 'rgba(148, 163, 184, 0.22)',
      borderStrong: 'rgba(148, 163, 184, 0.34)',
      shadow: 'rgba(2, 6, 23, 0.46)',
      glass: 'rgba(15, 23, 42, 0.78)',
      glassStrong: 'rgba(30, 41, 59, 0.88)',
      glassBorder: 'rgba(226, 232, 240, 0.16)',
      textPrimary: palette.darkText,
      textSecondary: '#cbd5e1',
      textMuted: '#94a3b8',
      textInverse: palette.darkText,
      accent: '#38bdf8',
      accentSoft: 'rgba(56, 189, 248, 0.16)',
      success: '#2dd4bf',
      warning: '#f59e0b',
      danger: '#fb7185',
      tabBarBackground: 'rgba(15, 23, 42, 0.92)',
      tabBarBorder: 'rgba(148, 163, 184, 0.22)',
    };
  }

  return {
    background: palette.paper,
    backgroundPanel: palette.paperCool,
    surface: palette.white,
    surfaceMuted: '#f3f7fb',
    border: 'rgba(148, 163, 184, 0.24)',
    borderStrong: 'rgba(79, 70, 229, 0.22)',
    shadow: 'rgba(79, 70, 229, 0.14)',
    glass: 'rgba(255, 255, 255, 0.74)',
    glassStrong: 'rgba(255, 255, 255, 0.9)',
    glassBorder: 'rgba(255, 255, 255, 0.62)',
    textPrimary: palette.ink,
    textSecondary: palette.slate,
    textMuted: palette.muted,
    textInverse: palette.white,
    accent: palette.indigo,
    accentSoft: 'rgba(79, 70, 229, 0.1)',
    success: palette.mint,
    warning: palette.amber,
    danger: palette.coral,
    tabBarBackground: 'rgba(255, 255, 255, 0.9)',
    tabBarBorder: 'rgba(148, 163, 184, 0.2)',
  };
};

export const getAppTheme = (mode: ThemeMode): AppTheme => {
  const isDark = mode === 'Dark';
  const colors = buildThemeColors(mode);
  const baseTheme = isDark ? DarkTheme : DefaultTheme;

  return {
    mode,
    isDark,
    statusBarStyle: isDark ? 'light-content' : 'dark-content',
    colors,
    navigationTheme: {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        background: colors.background,
        card: colors.surface,
        text: colors.textPrimary,
        border: colors.border,
        primary: colors.accent,
        notification: colors.danger,
      },
    },
  };
};

export const useAppTheme = () => {
  const { themeMode } = usePreferences();

  return React.useMemo(() => getAppTheme(themeMode), [themeMode]);
};