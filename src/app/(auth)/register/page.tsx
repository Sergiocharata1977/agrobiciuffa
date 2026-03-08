'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUp } from '@/firebase/auth';
import { UserService } from '@/services/auth/UserService';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            const userCredential = await signUp(
                formData.email,
                formData.password,
                formData.displayName
            );

            await UserService.create(userCredential.user.uid, {
                email: formData.email,
                displayName: formData.displayName,
            });

            router.push('/dashboard');
        } catch (err: unknown) {
            console.error('Registration error:', err);
            if (err instanceof Error) {
                if (err.message.includes('email-already-in-use')) {
                    setError('Este email ya está registrado. Intentá iniciar sesión.');
                } else if (err.message.includes('weak-password')) {
                    setError('La contraseña es muy débil');
                } else if (err.message.includes('invalid-email')) {
                    setError('Email inválido');
                } else {
                    setError('Error al registrar. Intenta nuevamente.');
                }
            } else {
                setError('Error al registrar. Intenta nuevamente.');
            }
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
                    <h1 className="text-xl font-bold text-white mb-1">Crear cuenta</h1>
                    <p className="text-zinc-400 text-sm mb-6">Registrate para hacer seguimiento de tus solicitudes</p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="displayName" className="block text-sm font-medium text-zinc-300 mb-1.5">
                                Nombre completo
                            </label>
                            <input
                                id="displayName"
                                name="displayName"
                                type="text"
                                value={formData.displayName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                placeholder="Juan Pérez"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1.5">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
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
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                className="w-full px-4 py-2.5 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                placeholder="Mínimo 6 caracteres"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300 mb-1.5">
                                Confirmar contraseña
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                        </button>
                    </form>

                    <p className="text-center text-zinc-500 mt-6 text-sm">
                        ¿Ya tenés cuenta?{' '}
                        <Link href="/login" className="text-red-400 hover:text-red-300 font-medium">
                            Iniciá sesión
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
