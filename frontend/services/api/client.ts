import { API_CONFIG } from "./config";

// HTTP Methods
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// API Response type
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
    };
    meta?: {
        page?: number;
        per_page?: number;
        total?: number;
        total_pages?: number;
    };
}

// Token storage key
const TOKEN_KEY = "digipandit_auth_token";
const REFRESH_TOKEN_KEY = "digipandit_refresh_token";

// In-memory token storage (you can replace with AsyncStorage for persistence)
let accessToken: string | null = null;
let refreshToken: string | null = null;

// Token management
export const tokenManager = {
    setTokens: (access: string, refresh: string) => {
        accessToken = access;
        refreshToken = refresh;
    },
    getAccessToken: () => accessToken,
    getRefreshToken: () => refreshToken,
    clearTokens: () => {
        accessToken = null;
        refreshToken = null;
    },
};

// API Client class
class ApiClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    private async request<T>(
        method: HttpMethod,
        endpoint: string,
        body?: any,
        requiresAuth: boolean = false
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseURL}${endpoint}`;

        const headers: Record<string, string> = {
            ...API_CONFIG.headers,
        };

        if (requiresAuth && accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }

        const options: RequestInit = {
            method,
            headers,
        };

        if (body && method !== "GET") {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url, options);

            // Handle 204 No Content
            if (response.status === 204) {
                return { success: true, data: undefined };
            }

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.error || { code: "UNKNOWN", message: "An error occurred" },
                };
            }

            return data;
        } catch (error) {
            console.error("API Request Error:", error);
            return {
                success: false,
                error: {
                    code: "NETWORK_ERROR",
                    message: error instanceof Error ? error.message : "Network error occurred",
                },
            };
        }
    }

    // Public methods
    async get<T>(endpoint: string, requiresAuth: boolean = false): Promise<ApiResponse<T>> {
        return this.request<T>("GET", endpoint, undefined, requiresAuth);
    }

    async post<T>(endpoint: string, body?: any, requiresAuth: boolean = false): Promise<ApiResponse<T>> {
        return this.request<T>("POST", endpoint, body, requiresAuth);
    }

    async put<T>(endpoint: string, body?: any, requiresAuth: boolean = false): Promise<ApiResponse<T>> {
        return this.request<T>("PUT", endpoint, body, requiresAuth);
    }

    async delete<T>(endpoint: string, requiresAuth: boolean = false): Promise<ApiResponse<T>> {
        return this.request<T>("DELETE", endpoint, undefined, requiresAuth);
    }

    async patch<T>(endpoint: string, body?: any, requiresAuth: boolean = false): Promise<ApiResponse<T>> {
        return this.request<T>("PATCH", endpoint, body, requiresAuth);
    }
}

// Export singleton instance
export const apiClient = new ApiClient(API_CONFIG.baseURL);
