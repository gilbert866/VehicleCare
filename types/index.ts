// Export all types from their respective domain files
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

// Navigation types
export interface NavigationState {
    currentRoute: string;
    previousRoute?: string;
    params?: Record<string, any>;
}

// App state types
export interface AppState {
    theme: 'light' | 'dark';
    isLoading: boolean;
    error: string | null;
    networkStatus: 'online' | 'offline';
} 