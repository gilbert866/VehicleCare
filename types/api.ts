// API response types
export interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
}

export interface ApiError {
    message: string;
    status: number;
    code?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    total_pages: number;
    total_count: number;
    has_next: boolean;
    has_previous: boolean;
} 