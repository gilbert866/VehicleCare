// Backend authentication types only
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