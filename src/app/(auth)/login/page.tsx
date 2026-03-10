'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn, signInWithGoogle } from '@/firebase/auth';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const credential = await signIn(email, password);
            // Set cookie immediately before navigating so middleware sees it
            document.cookie = `auth-token=${credential.user.uid}; path=/; max-age=604800; SameSite=Lax`;
            router.push('/dashboard');
        } catch (err: unknown) {
            console.error('Login error:', err);
            if (err instanceof Error) {
                if (err.message.includes('user-not-found') || err.message.includes('wrong-password') || err.message.includes('invalid-credential')) {
                    setError('Email o contraseña incorrectos');
                } else if (err.message.includes('too-many-requests')) {
                    setError('Demasiados intentos. Intenta más tarde.');
                } else {
                    setError('Error al iniciar sesión. Intenta nuevamente.');
                }
            } else {
                setError('Error al iniciar sesión. Intenta nuevamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setLoading(true);

        try {
            const credential = await signInWithGoogle();
            // Set cookie immediately before navigating so middleware sees it
            document.cookie = `auth-token=${credential.user.uid}; path=/; max-age=604800; SameSite=Lax`;
            router.push('/dashboard');
        } catch (err) {
            console.error('Google signin error:', err);
            setError('Error al iniciar sesión con Google');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <div className="inline-flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-600">
                                <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <p className="text-white font-bold text-xl leading-tight">Agro Biciufa</p>
                                <p className="text-zinc-400 text-xs">Portal del cliente</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Form Card */}
                <div className="bg-zinc-800 rounded-2xl p-6 border border-zinc-700 shadow-xl">
                    <h1 className="text-xl font-bold text-white mb-1">Iniciar sesión</h1>
                    <p className="text-zinc-400 text-sm mb-6">Ingresá para ver el estado de tus solicitudes</p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1.5">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                placeholder="tu@email.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1.5">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex items-center justify-end text-sm">
                            <Link href="/forgot-password" className="text-red-400 hover:text-red-300">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Ingresando...' : 'Ingresar'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-5">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-zinc-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-zinc-800 text-zinc-500">O continúa con</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full py-2.5 bg-white hover:bg-gray-100 text-gray-800 font-semibold rounded-lg border border-gray-300 flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                    </button>

                    <p className="text-center text-zinc-500 mt-6 text-sm">
                        ¿Primera vez acá?{' '}
                        <Link href="/register" className="text-red-400 hover:text-red-300 font-medium">
                            Creá tu cuenta
                        </Link>
                    </p>
                </div>

                <p className="text-center text-zinc-600 text-xs mt-6">
                    <Link href="/" className="hover:text-zinc-400 transition-colors">
                        ← Volver a la web
                    </Link>
                </p>
            </div>
        </div>
    );
}
