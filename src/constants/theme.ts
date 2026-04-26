// ============================================================================
// TravelBank Ultra - Theme Constants
// Premium Glassmorphism + Neumorphism Theme System
// ============================================================================

import { ThemeColors, Theme, AnimationConfig } from '../types';

// ============================================================================
// LIGHT THEME COLORS
// ============================================================================

export const lightColors: ThemeColors = {
  primary: '#6366F1',
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  secondary: '#EC4899',
  secondaryLight: '#F472B6',
  secondaryDark: '#DB2777',
  accent: '#06B6D4',
  accentLight: '#22D3EE',
  background: '#F8FAFC',
  backgroundSecondary: '#F1F5F9',
  backgroundTertiary: '#E2E8F0',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfacePressed: '#F1F5F9',
  card: '#FFFFFF',
  cardElevated: '#FFFFFF',
  text: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',
  textInverse: '#FFFFFF',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  divider: '#E2E8F0',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
  shadow: 'rgba(0, 0, 0, 0.08)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  shimmer: '#E2E8F0',
  gradient1Start: '#6366F1',
  gradient1End: '#8B5CF6',
  gradient2Start: '#EC4899',
  gradient2End: '#F43F5E',
  gradient3Start: '#06B6D4',
  gradient3End: '#3B82F6',
  tabBarBackground: '#FFFFFF',
  tabBarActive: '#6366F1',
  tabBarInactive: '#94A3B8',
  statusBarStyle: 'dark',
  glassBg: 'rgba(255, 255, 255, 0.72)',
  glassBorder: 'rgba(255, 255, 255, 0.18)',
  neumorphLight: '#FFFFFF',
  neumorphDark: '#D1D9E6',
};

// ============================================================================
// DARK THEME COLORS
// ============================================================================

export const darkColors: ThemeColors = {
  primary: '#818CF8',
  primaryLight: '#A5B4FC',
  primaryDark: '#6366F1',
  secondary: '#F472B6',
  secondaryLight: '#F9A8D4',
  secondaryDark: '#EC4899',
  accent: '#22D3EE',
  accentLight: '#67E8F9',
  background: '#0F172A',
  backgroundSecondary: '#1E293B',
  backgroundTertiary: '#334155',
  surface: '#1E293B',
  surfaceElevated: '#243247',
  surfacePressed: '#334155',
  card: '#1E293B',
  cardElevated: '#243247',
  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textTertiary: '#64748B',
  textInverse: '#0F172A',
  border: '#334155',
  borderLight: '#1E293B',
  divider: '#334155',
  success: '#34D399',
  successLight: '#064E3B',
  warning: '#FBBF24',
  warningLight: '#78350F',
  error: '#F87171',
  errorLight: '#7F1D1D',
  info: '#60A5FA',
  infoLight: '#1E3A5F',
  shadow: 'rgba(0, 0, 0, 0.3)',
  overlay: 'rgba(0, 0, 0, 0.7)',
  shimmer: '#334155',
  gradient1Start: '#818CF8',
  gradient1End: '#A78BFA',
  gradient2Start: '#F472B6',
  gradient2End: '#FB7185',
  gradient3Start: '#22D3EE',
  gradient3End: '#60A5FA',
  tabBarBackground: '#1E293B',
  tabBarActive: '#818CF8',
  tabBarInactive: '#64748B',
  statusBarStyle: 'light',
  glassBg: 'rgba(30, 41, 59, 0.72)',
  glassBorder: 'rgba(148, 163, 184, 0.18)',
  neumorphLight: '#243247',
  neumorphDark: '#0F172A',
};

// ============================================================================
// THEME CONFIGURATION
// ============================================================================

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

const typography = {
  h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40, letterSpacing: -0.5 },
  h2: { fontSize: 28, fontWeight: '700' as const, lineHeight: 36, letterSpacing: -0.3 },
  h3: { fontSize: 24, fontWeight: '600' as const, lineHeight: 32 },
  h4: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  button: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24, letterSpacing: 0.5 },
  label: { fontSize: 14, fontWeight: '500' as const, lineHeight: 20 },
};

export const lightTheme: Theme = {
  mode: 'light',
  colors: lightColors,
  spacing,
  borderRadius,
  typography,
};

export const darkTheme: Theme = {
  mode: 'dark',
  colors: darkColors,
  spacing,
  borderRadius,
  typography,
};

// ============================================================================
// ANIMATION CONFIGS
// ============================================================================

export const springConfig: AnimationConfig = {
  duration: 400,
  damping: 15,
  stiffness: 150,
  mass: 1,
};

export const bounceConfig: AnimationConfig = {
  duration: 600,
  damping: 8,
  stiffness: 200,
  mass: 0.8,
};

export const smoothConfig: AnimationConfig = {
  duration: 300,
  damping: 20,
  stiffness: 100,
  mass: 1.2,
};

export const quickConfig: AnimationConfig = {
  duration: 200,
  damping: 25,
  stiffness: 300,
  mass: 0.5,
};

// ============================================================================
// GRADIENT PRESETS
// ============================================================================

export const gradientPresets = {
  primary: ['#6366F1', '#8B5CF6', '#A855F7'],
  secondary: ['#EC4899', '#F43F5E', '#EF4444'],
  accent: ['#06B6D4', '#3B82F6', '#6366F1'],
  success: ['#10B981', '#34D399', '#6EE7B7'],
  warning: ['#F59E0B', '#FBBF24', '#FDE68A'],
  error: ['#EF4444', '#F87171', '#FCA5A5'],
  sunset: ['#F97316', '#EC4899', '#8B5CF6'],
  ocean: ['#0891B2', '#06B6D4', '#22D3EE'],
  forest: ['#059669', '#10B981', '#34D399'],
  midnight: ['#1E293B', '#334155', '#475569'],
  aurora: ['#818CF8', '#C084FC', '#F472B6'],
  goldPremium: ['#D97706', '#F59E0B', '#FBBF24'],
  darkPrimary: ['#312E81', '#4338CA', '#6366F1'],
  darkAccent: ['#164E63', '#0E7490', '#06B6D4'],
  travel: ['#6366F1', '#8B5CF6', '#C084FC'],
  banking: ['#059669', '#10B981', '#34D399'],
  flightCard: ['#7C3AED', '#8B5CF6', '#A78BFA'],
  hotelCard: ['#DB2777', '#EC4899', '#F472B6'],
  trainCard: ['#0891B2', '#06B6D4', '#22D3EE'],
  busCard: ['#D97706', '#F59E0B', '#FBBF24'],
};

// ============================================================================
// NEUMORPHISM STYLES
// ============================================================================

export const neumorphismLight = {
  shadowColor: '#D1D9E6',
  shadowOffset: { width: 6, height: 6 },
  shadowOpacity: 1,
  shadowRadius: 12,
  elevation: 8,
};

export const neumorphismDark = {
  shadowColor: '#0A1128',
  shadowOffset: { width: 6, height: 6 },
  shadowOpacity: 1,
  shadowRadius: 12,
  elevation: 8,
};

export const neumorphismInsetLight = {
  shadowColor: '#D1D9E6',
  shadowOffset: { width: -3, height: -3 },
  shadowOpacity: 0.5,
  shadowRadius: 6,
  elevation: 2,
};

// ============================================================================
// GLASSMORPHISM CONFIGS
// ============================================================================

export const glassConfig = {
  light: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'rgba(255, 255, 255, 0.18)',
    blurAmount: 20,
    blurType: 'light' as const,
  },
  dark: {
    backgroundColor: 'rgba(30, 41, 59, 0.25)',
    borderColor: 'rgba(148, 163, 184, 0.18)',
    blurAmount: 20,
    blurType: 'dark' as const,
  },
};

// ============================================================================
// TAB CONFIGURATIONS
// ============================================================================

export const travelTabs = [
  { name: 'FlightsTab', label: 'Flights', icon: 'airplane' },
  { name: 'HotelsTab', label: 'Hotels', icon: 'bed' },
  { name: 'TrainsTab', label: 'Trains', icon: 'train' },
  { name: 'BookingsTab', label: 'Bookings', icon: 'calendar' },
  { name: 'SettingsTab', label: 'More', icon: 'ellipsis-horizontal' },
];

export const bankingTabs = [
  { name: 'AccountsTab', label: 'Accounts', icon: 'wallet' },
  { name: 'SendMoneyTab', label: 'Send', icon: 'send' },
  { name: 'BillsTab', label: 'Bills', icon: 'receipt' },
  { name: 'InvestmentsTab', label: 'Invest', icon: 'trending-up' },
  { name: 'SettingsTab', label: 'More', icon: 'ellipsis-horizontal' },
];

// ============================================================================
// APP CONSTANTS
// ============================================================================

export const APP_NAME = 'TravelBank Ultra';
export const APP_VERSION = '2.0.0';
export const CURRENCY_SYMBOL = '₹';
export const DEFAULT_CURRENCY = 'INR';

export const SCREEN_TRANSITION_DURATION = 300;
export const SKELETON_ANIMATION_DURATION = 1200;
export const TOAST_DURATION = 3000;
export const PULL_TO_REFRESH_OFFSET = 80;
export const INFINITE_SCROLL_THRESHOLD = 0.8;
export const PAGE_SIZE = 20;

export const HAPTIC_STYLES = {
  light: 'light' as const,
  medium: 'medium' as const,
  heavy: 'heavy' as const,
  success: 'success' as const,
  warning: 'warning' as const,
  error: 'error' as const,
};
