// Export backend-related types and device types
export * from './api';
export * from './auth';
export * from './battery';
export * from './chat';
export * from './location';
export * from './mechanic';

// Common UI types
export interface ThemeColors {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
}

export interface AppTheme {
    light: ThemeColors;
    dark: ThemeColors;
} 