'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile } from '@/firebase/auth';

export default function MiCuentaPage() {
    const { user, firebaseUser, refreshUser, logout } = useAuth();

    const [displayName, setDisplayName] = useState(
        user?.displayName || firebaseUser?.displayName || ''
    );
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firebaseUser) return;

        setSaving(true);
        setSuccess(false);
        setError('');

        try {
            await updateProfile(firebaseUser, { displayName });
            await refreshUser();
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error(err);
            setError('No se pudo guardar. Intentá nuevamente.');
        } finally {
            setSaving(false);
        }
    };

    const email = user?.email || firebaseUser?.email || '';
    const initials = displayName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'C';

    return (
        <div className="max-w-lg">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-zinc-900">Mi Cuenta</h1>
                <p className="text-zinc-500 text-sm mt-1">Administrá tus datos personales</p>
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-4 mb-8">
                <div className="h-16 w-16 rounded-full bg-red-600/15 border-2 border-red-600/30 flex items-center justify-center text-red-600 text-xl font-bold">
                    {initials}
                </div>
                <div>
                    <p className="font-semibold text-zinc-900">{displayName || 'Sin nombre'}</p>
                    <p className="text-sm text-zinc-500">{email}</p>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-xl border border-zinc-200 p-6">
                <h2 className="font-semibold text-zinc-900 mb-4">Datos personales</h2>

                {success && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                        Datos guardados correctamente.
                    </div>
                )}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label htmlFor="displayName" className="block text-sm font-medium text-zinc-700 mb-1.5">
                            Nombre completo
                        </label>
                        <input
                            id="displayName"
                            type="text"
                            value={displayName}
                            onChange={e => setDisplayName(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                            placeholder="Tu nombre"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full px-4 py-2.5 bg-zinc-100 border border-zinc-200 rounded-lg text-zinc-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-zinc-400 mt-1">El email no se puede modificar.</p>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Danger zone */}
            <div className="mt-6 bg-white rounded-xl border border-zinc-200 p-6">
                <h2 className="font-semibold text-zinc-900 mb-1">Sesión</h2>
                <p className="text-sm text-zinc-500 mb-4">Cerrá sesión en este dispositivo.</p>
                <button
                    onClick={logout}
                    className="px-4 py-2 border border-zinc-300 rounded-lg text-sm text-zinc-700 hover:bg-zinc-50 hover:border-zinc-400 transition-colors"
                >
                    Cerrar sesión
                </button>
            </div>
        </div>
    );
}
