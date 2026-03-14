'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { getAuthClient } from '@/firebase/config';

export default function PortalLoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const credential = await signInWithEmailAndPassword(
                getAuthClient(),
                formData.email,
                formData.password
            );
            const token = await credential.user.getIdToken();
            localStorage.setItem('portal_token', token);
            router.replace('/portal/mis-solicitudes');
        } catch (err: unknown) {
            console.error('Portal login error:', err);

            if (err instanceof Error && err.message.includes('auth/invalid-credential')) {
                setError('Email o contraseña incorrectos.');
            } else if (err instanceof Error && err.message.includes('auth/invalid-email')) {
                setError('Ingresá un email válido.');
            } else {
                setError('No se pudo iniciar sesión. Intentá nuevamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-8">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <Link href="/" className="inline-flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c8102e] text-white shadow-lg shadow-red-200">
                            <span className="text-lg font-bold">AB</span>
                        </div>
                        <div className="text-left">
                            <p className="text-lg font-bold text-zinc-900">Agro Biciufa</p>
                            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                                Portal clientes
                            </p>
                        </div>
                    </Link>
                </div>

                <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/70">
                    <div className="h-2 bg-[#c8102e]" />
                    <div className="p-6">
                        <h1 className="text-2xl font-bold text-zinc-900">Ingresar</h1>
                        <p className="mt-1 text-sm text-zinc-500">
                            Accedé para revisar solicitudes, equipos y tu perfil.
                        </p>

                        {error ? (
                            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        ) : null}

                        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                            <div>
                                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-zinc-700">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-[#c8102e] focus:ring-2 focus:ring-red-100"
                                    placeholder="cliente@email.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-zinc-700">
                                    Contraseña
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-[#c8102e] focus:ring-2 focus:ring-red-100"
                                    placeholder="Tu contraseña"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-2xl bg-[#c8102e] px-4 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? 'Ingresando...' : 'Ingresar'}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-zinc-500">
                            ¿No tenés cuenta?{' '}
                            <Link href="/portal/registro" className="font-semibold text-[#c8102e]">
                                Registrate
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
