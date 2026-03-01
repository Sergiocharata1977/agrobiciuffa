// Firebase Client SDK Configuration
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { FirebaseStorage } from 'firebase/storage';

// Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate configuration
if (
    !firebaseConfig.apiKey ||
    !firebaseConfig.authDomain ||
    !firebaseConfig.projectId
) {
    console.error('Firebase configuration is missing required fields');
    console.error('Make sure to set NEXT_PUBLIC_FIREBASE_* environment variables');
}

let cachedApp: FirebaseApp | null = null;
let cachedAuth: Auth | null = null;
let cachedDb: Firestore | null = null;
let cachedStorage: FirebaseStorage | null = null;

function hasRequiredClientConfig(): boolean {
    return Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId);
}

export function getFirebaseApp(): FirebaseApp | null {
    if (cachedApp) return cachedApp;

    // Prevent initialization during server-side rendering (SSR/SSG)
    if (typeof window === 'undefined') return null;

    // Check if configuration is just placeholder strings
    if (firebaseConfig.apiKey === 'your-api-key' || firebaseConfig.apiKey === 'undefined') {
        return null;
    }

    if (!hasRequiredClientConfig()) return null;

    cachedApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    return cachedApp;
}

export function getAuthClient(): Auth {
    if (cachedAuth) return cachedAuth;
    const app = getFirebaseApp();
    if (!app) {
        if (typeof window === 'undefined') return {} as Auth;
        throw new Error('Firebase client is not configured');
    }
    cachedAuth = getAuth(app);
    return cachedAuth;
}

export function getDbClient(): Firestore {
    if (cachedDb) return cachedDb;
    const app = getFirebaseApp();
    if (!app) {
        if (typeof window === 'undefined') return {} as Firestore;
        throw new Error('Firebase client is not configured');
    }
    cachedDb = getFirestore(app);
    return cachedDb;
}

export function getStorageClient(): FirebaseStorage {
    if (cachedStorage) return cachedStorage;
    const app = getFirebaseApp();
    if (!app) {
        if (typeof window === 'undefined') return {} as FirebaseStorage;
        throw new Error('Firebase client is not configured');
    }
    cachedStorage = getStorage(app);
    return cachedStorage;
}

// Analytics only on client side
export const analytics =
    typeof window !== 'undefined'
        ? isSupported().then(yes => {
            const app = getFirebaseApp();
            return yes && app ? getAnalytics(app) : null;
        })
        : null;

export default getFirebaseApp;
