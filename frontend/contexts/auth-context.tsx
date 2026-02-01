import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { authService, User, SignUpData, SignInData, UpdateProfileData } from "@/services/auth";

// Auth Context State
interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

// Auth Context Value
interface AuthContextValue extends AuthState {
    signUp: (data: SignUpData) => Promise<{ success: boolean; error?: string }>;
    signIn: (data: SignInData) => Promise<{ success: boolean; error?: string }>;
    signOut: () => Promise<void>;
    updateProfile: (data: UpdateProfileData) => Promise<{ success: boolean; error?: string }>;
    refreshUser: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Provider Props
interface AuthProviderProps {
    children: ReactNode;
}

// Auth Provider Component
export function AuthProvider({ children }: AuthProviderProps) {
    const [state, setState] = useState<AuthState>({
        user: null,
        isLoading: true,
        isAuthenticated: false,
    });

    // Load user on mount
    useEffect(() => {
        loadUser();
    }, []);

    // Load current user
    const loadUser = useCallback(async () => {
        if (!authService.isAuthenticated()) {
            setState({ user: null, isLoading: false, isAuthenticated: false });
            return;
        }

        try {
            const response = await authService.getProfile();
            if (response.success && response.data) {
                setState({
                    user: response.data.user,
                    isLoading: false,
                    isAuthenticated: true,
                });
            } else {
                // Token might be expired, try to refresh
                const refreshResponse = await authService.refreshToken();
                if (refreshResponse.success) {
                    const profileResponse = await authService.getProfile();
                    if (profileResponse.success && profileResponse.data) {
                        setState({
                            user: profileResponse.data.user,
                            isLoading: false,
                            isAuthenticated: true,
                        });
                        return;
                    }
                }
                // Refresh failed, clear auth state
                setState({ user: null, isLoading: false, isAuthenticated: false });
            }
        } catch (error) {
            console.error("Failed to load user:", error);
            setState({ user: null, isLoading: false, isAuthenticated: false });
        }
    }, []);

    // Sign up
    const signUp = useCallback(async (data: SignUpData) => {
        setState((prev) => ({ ...prev, isLoading: true }));

        const response = await authService.signUp(data);

        if (response.success && response.data) {
            // Set authenticated immediately - the AuthGate will handle navigation
            setState({
                user: null,
                isLoading: false,
                isAuthenticated: true,
            });

            // Try to load profile in background
            loadUser().catch(console.error);

            return { success: true };
        }

        setState((prev) => ({ ...prev, isLoading: false }));
        return {
            success: false,
            error: response.error?.message || "Sign up failed",
        };
    }, [loadUser]);

    // Sign in
    const signIn = useCallback(async (data: SignInData) => {
        setState((prev) => ({ ...prev, isLoading: true }));

        const response = await authService.signIn(data);

        if (response.success && response.data) {
            // Set authenticated immediately - the AuthGate will handle navigation
            setState({
                user: null, // Profile will be loaded separately if needed
                isLoading: false,
                isAuthenticated: true,
            });

            // Try to load profile in background (optional, won't block navigation)
            loadUser().catch(console.error);

            return { success: true };
        }

        setState((prev) => ({ ...prev, isLoading: false }));
        return {
            success: false,
            error: response.error?.message || "Sign in failed",
        };
    }, [loadUser]);

    // Sign out
    const signOut = useCallback(async () => {
        setState((prev) => ({ ...prev, isLoading: true }));
        await authService.signOut();
        setState({ user: null, isLoading: false, isAuthenticated: false });
    }, []);

    // Update profile
    const updateProfile = useCallback(async (data: UpdateProfileData) => {
        const response = await authService.updateProfile(data);

        if (response.success && response.data) {
            setState((prev) => ({ ...prev, user: response.data!.user }));
            return { success: true };
        }

        return {
            success: false,
            error: response.error?.message || "Update failed",
        };
    }, []);

    // Refresh user
    const refreshUser = useCallback(async () => {
        await loadUser();
    }, [loadUser]);

    const value: AuthContextValue = {
        ...state,
        signUp,
        signIn,
        signOut,
        updateProfile,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
