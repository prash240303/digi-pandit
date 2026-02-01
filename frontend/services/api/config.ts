// API Configuration
// Update API_BASE_URL based on your environment

declare const __DEV__: boolean;
// Development URL Configuration:
// - Web browser: use "http://localhost:8080"
// - Android Emulator: use "http://10.0.2.2:8080"
// - iOS Simulator: use "http://localhost:8080"
// - Physical device: use your computer's IP (run 'ipconfig' to find it)
const DEV_API_URL = "http://localhost:8080";
const PROD_API_URL = "https://api.digipandit.com"; // Replace with production URL

export const API_BASE_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;

// API Configuration
export const API_CONFIG = {
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
};

// API Endpoints
export const ENDPOINTS = {
    // Auth
    AUTH: {
        SIGNUP: "/api/v1/auth/signup",
        SIGNIN: "/api/v1/auth/signin",
        SIGNOUT: "/api/v1/auth/signout",
        REFRESH: "/api/v1/auth/refresh",
        OAUTH: "/api/v1/auth/oauth",
        ME: "/api/v1/auth/me",
    },
    // Users
    USERS: {
        ME: "/api/v1/users/me",
    },
    // Health
    HEALTH: "/api/v1/health",
} as const;
