import { apiClient, tokenManager, ApiResponse, ENDPOINTS } from "../api";

// Types
export interface User {
    id: string;
    email: string;
    phone?: string;
    full_name?: string;
    avatar_url?: string;
    date_of_birth?: string;
    zodiac_sign?: string;
    region?: string;
    language?: string;
    is_premium: boolean;
    premium_expiry?: string;
    notify_festival: boolean;
    notify_daily: boolean;
    created_at: string;
    updated_at: string;
}

export interface AuthTokens {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
}

export interface AuthResponse extends AuthTokens {
    user: {
        id: string;
        email: string;
        phone?: string;
        created_at: string;
    };
}

export interface SignUpData {
    email: string;
    password: string;
}

export interface SignInData {
    email: string;
    password: string;
}

export interface UpdateProfileData {
    full_name?: string;
    date_of_birth?: string;
    zodiac_sign?: string;
    region?: string;
    language?: string;
    notify_festival?: boolean;
    notify_daily?: boolean;
}

// Auth Service
class AuthService {
    // Sign up with email and password
    async signUp(data: SignUpData): Promise<ApiResponse<AuthResponse>> {
        const response = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.SIGNUP, data);

        if (response.success && response.data) {
            tokenManager.setTokens(
                response.data.access_token,
                response.data.refresh_token
            );
        }

        return response;
    }

    // Sign in with email and password
    async signIn(data: SignInData): Promise<ApiResponse<AuthResponse>> {
        const response = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.SIGNIN, data);

        if (response.success && response.data) {
            tokenManager.setTokens(
                response.data.access_token,
                response.data.refresh_token
            );
        }

        return response;
    }

    // Sign out
    async signOut(): Promise<ApiResponse<void>> {
        const response = await apiClient.post<void>(ENDPOINTS.AUTH.SIGNOUT, undefined, true);
        tokenManager.clearTokens();
        return response;
    }

    // Refresh access token
    async refreshToken(): Promise<ApiResponse<AuthResponse>> {
        const refresh = tokenManager.getRefreshToken();
        if (!refresh) {
            return {
                success: false,
                error: { code: "NO_REFRESH_TOKEN", message: "No refresh token available" },
            };
        }

        const response = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.REFRESH, {
            refresh_token: refresh,
        });

        if (response.success && response.data) {
            tokenManager.setTokens(
                response.data.access_token,
                response.data.refresh_token
            );
        }

        return response;
    }

    // Get current user profile
    async getProfile(): Promise<ApiResponse<{ user: User }>> {
        return apiClient.get<{ user: User }>(ENDPOINTS.USERS.ME, true);
    }

    // Update user profile
    async updateProfile(data: UpdateProfileData): Promise<ApiResponse<{ user: User }>> {
        return apiClient.put<{ user: User }>(ENDPOINTS.USERS.ME, data, true);
    }

    // Delete user account
    async deleteAccount(): Promise<ApiResponse<void>> {
        const response = await apiClient.delete<void>(ENDPOINTS.USERS.ME, true);
        if (response.success) {
            tokenManager.clearTokens();
        }
        return response;
    }

    // Check if user is authenticated
    isAuthenticated(): boolean {
        return !!tokenManager.getAccessToken();
    }

    // Get OAuth URL
    async getOAuthUrl(provider: "google" | "apple", redirectUrl: string): Promise<ApiResponse<{ url: string }>> {
        return apiClient.get<{ url: string }>(
            `${ENDPOINTS.AUTH.OAUTH}?provider=${provider}&redirect_url=${encodeURIComponent(redirectUrl)}`
        );
    }
}

// Export singleton instance
export const authService = new AuthService();
