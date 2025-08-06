// Authentication types
export interface User {
    id: string;
    name: string;
    email: string;
}

export interface AuthCredentials {
    name?: string;
    email: string;
    password: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    message?: string;
}

// Backend authentication types
export interface BackendAuthUser {
    id: number;
    username: string;
    email: string;
    role: string;
    token?: string;
}

export interface BackendAuthError {
    message: string;
    status?: number;
}

export interface BackendRegisterRequest {
    username: string;
    email: string;
    password: string;
    role: string;
}

export interface BackendLoginRequest {
    username: string;
    password: string;
}

export interface RegisterResponse {
    user: BackendAuthUser;
    token: string;
    message: string;
}

export interface LoginResponse {
    user: BackendAuthUser;
    token: string;
    message: string;
} 