// User types for authentication and user management

export interface User {
    id: string;
    email: string;
    displayName: string | null;
    photoURL: string | null;
    createdAt: Date;
    updatedAt: Date;
    // Current active organization
    currentOrganizationId?: string;
}

export interface UserProfile extends User {
    phone?: string;
    bio?: string;
    preferences?: UserPreferences;
}

export interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    language: 'es' | 'en';
    notifications: {
        email: boolean;
        push: boolean;
    };
}

// Auth context state
export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

// Auth form types
export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterFormData {
    email: string;
    password: string;
    confirmPassword: string;
    displayName: string;
    organizationName?: string; // Optional: create org on register
}

export interface ResetPasswordFormData {
    email: string;
}

export type UserRole = 'cliente' | 'mecanico' | 'repuestero' | 'admin';

export interface UserClaims {
    role: UserRole;
    organizationId?: string;
}

export interface AuthUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    role: UserRole;
}

export interface DecodedToken {
    uid: string;
    email?: string;
    name?: string;
    claims: UserClaims;
}
