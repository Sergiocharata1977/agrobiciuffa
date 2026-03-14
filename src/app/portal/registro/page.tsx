'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    createUserWithEmailAndPassword,
    updateProfile,
} from 'firebase/auth';

import { getAuthClient } from '@/firebase/config';

export default function PortalRegistroPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        telefono: '',
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
            const credential = await createUserWithEmailAndPassword(
                getAuthClient(),
                formData.email,
                formData.password
            );

            await updateProfile(credential.user, { displayName: formData.nombre });

            const token = await credential.user.getIdToken();
            localStorage.setItem('portal_token', token);

            try {
                const response = await fetch('/api/public/clientes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        uid: credential.user.uid,
                        nombre: formData.nombre,
                        email: formData.email,
                        telefono: formData.telefono || undefined,
                    }),
                });

                if (!response.ok && response.status !== 404) {
                    console.error('Portal cliente profile creation failed:', response.status);
                }
            } catch (profileError) {
                console.error('Portal cliente profile request failed:', profileError);
            }

            router.replace('/portal/mis-solicitudes');
        } catch (err: unknown) {
            console.error('Portal registration error:', err);

            if (err instanceof Error && err.message.includes('auth/email-already-in-use')) {
                setError('Ese email ya está registrado.');
            } else if (err instanceof Error && err.message.includes('auth/weak-password')) {
                setError('La contraseña debe tener al menos 6 caracteres.');
            } else if (err instanceof Error && err.message.includes('auth/invalid-email')) {
                setError('Ingresá un email válido.');
            } else {
                setError('No se pudo crear la cuenta. Intentá nuevamente.');
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
                                Alta de clientes
                            </p>
                        </div>
                    </Link>
                </div>

                <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/70">
                    <div className="h-2 bg-[#c8102e]" />
                    <div className="p-6">
                        <h1 className="text-2xl font-bold text-zinc-900">Crear cuenta</h1>
                        <p className="mt-1 text-sm text-zinc-500">
                            Registrate para seguir tus solicitudes desde el portal.
                        </p>

                        {error ? (
                            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        ) : null}

                        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                            <div>
                                <label htmlFor="nombre" className="mb-1.5 block text-sm font-medium text-zinc-700">
                                    Nombre completo
                                </label>
                                <input
                                    id="nombre"
                                    name="nombre"
                                    type="text"
                                    autoComplete="name"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-[#c8102e] focus:ring-2 focus:ring-red-100"
                                    placeholder="Juan Pérez"
                                />
                            </div>

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
                                    autoComplete="new-password"
                                    minLength={6}
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-[#c8102e] focus:ring-2 focus:ring-red-100"
                                    placeholder="Mínimo 6 caracteres"
                                />
                            </div>

                            <div>
                                <label htmlFor="telefono" className="mb-1.5 block text-sm font-medium text-zinc-700">
                                    Teléfono
                                </label>
                                <input
                                    id="telefono"
                                    name="telefono"
                                    type="tel"
                                    autoComplete="tel"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-[#c8102e] focus:ring-2 focus:ring-red-100"
                                    placeholder="+54 9 11 5555 5555"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-2xl bg-[#c8102e] px-4 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-zinc-500">
                            ¿Ya tenés cuenta?{' '}
                            <Link href="/portal/login" className="font-semibold text-[#c8102e]">
                                Ingresá
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
