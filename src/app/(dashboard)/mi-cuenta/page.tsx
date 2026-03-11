'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile } from '@/firebase/auth';

// Campos extra guardados en localStorage (en producción irían a Firestore)
function loadLocalProfile(uid: string) {
    if (typeof window === 'undefined') return {} as Record<string, string>;
    try {
        const raw = localStorage.getItem(`profile_extra_${uid}`);
        return raw ? (JSON.parse(raw) as Record<string, string>) : ({} as Record<string, string>);
    } catch {
        return {} as Record<string, string>;
    }
}

function saveLocalProfile(uid: string, data: Record<string, string>) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`profile_extra_${uid}`, JSON.stringify(data));
}

export default function MiCuentaPage() {
    const { user, firebaseUser, refreshUser, logout } = useAuth();

    const uid = firebaseUser?.uid || '';
    const savedExtra = loadLocalProfile(uid);

    const [displayName, setDisplayName] = useState(
        user?.displayName || firebaseUser?.displayName || ''
    );
    const [telefono, setTelefono] = useState(savedExtra.telefono || '');
    const [cuit, setCuit] = useState(savedExtra.cuit || '');
    const [direccion, setDireccion] = useState(savedExtra.direccion || '');
    const [localidad, setLocalidad] = useState(savedExtra.localidad || '');
    const [provincia, setProvincia] = useState(savedExtra.provincia || '');
    const [codigoPostal, setCodigoPostal] = useState(savedExtra.codigoPostal || '');

    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const email = user?.email || firebaseUser?.email || '';
    const initials = displayName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() || 'C';

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firebaseUser) return;

        setSaving(true);
        setSuccess(false);
        setError('');

        try {
            await updateProfile(firebaseUser, { displayName });
            await refreshUser();
            saveLocalProfile(uid, { telefono, cuit, direccion, localidad, provincia, codigoPostal });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error(err);
            setError('No se pudo guardar. Intentá nuevamente.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="w-full space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-zinc-900">Mi Cuenta</h1>
                <p className="text-zinc-500 text-sm mt-1">Tus datos personales y de facturación</p>
            </div>

            {/* Avatar + resumen */}
            <div className="bg-zinc-900 rounded-2xl p-6 flex items-center gap-5">
                <div className="h-16 w-16 rounded-full bg-red-600/20 border-2 border-red-600/40 flex items-center justify-center text-red-400 text-2xl font-bold flex-shrink-0">
                    {initials}
                </div>
                <div>
                    <p className="font-bold text-white text-lg">{displayName || 'Sin nombre'}</p>
                    <p className="text-zinc-400 text-sm">{email}</p>
                    {cuit && <p className="text-zinc-500 text-xs mt-0.5">CUIT: {cuit}</p>}
                    {localidad && provincia && (
                        <p className="text-zinc-500 text-xs">{localidad}, {provincia}</p>
                    )}
                </div>
            </div>

            {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                    ✓ Datos guardados correctamente.
                </div>
            )}
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-5">
                {/* Datos de identidad */}
                <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
                    <h2 className="font-semibold text-zinc-900">Datos personales</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                                Nombre completo
                            </label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={e => setDisplayName(e.target.value)}
                                required
                                placeholder="Juan García"
                                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                                Teléfono / WhatsApp
                            </label>
                            <input
                                type="tel"
                                value={telefono}
                                onChange={e => setTelefono(e.target.value)}
                                placeholder="+54 9 351 000-0000"
                                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full px-4 py-2.5 bg-zinc-100 border border-zinc-200 rounded-lg text-zinc-400 cursor-not-allowed text-sm"
                        />
                        <p className="text-xs text-zinc-400 mt-1">El email no se puede modificar.</p>
                    </div>
                </div>

                {/* Datos fiscales */}
                <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
                    <h2 className="font-semibold text-zinc-900">Datos fiscales</h2>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                            CUIT
                        </label>
                        <input
                            type="text"
                            value={cuit}
                            onChange={e => setCuit(e.target.value)}
                            placeholder="20-12345678-9"
                            maxLength={13}
                            className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all text-sm font-mono"
                        />
                    </div>
                </div>

                {/* Domicilio */}
                <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
                    <h2 className="font-semibold text-zinc-900">Domicilio / Establecimiento</h2>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                            Dirección
                        </label>
                        <input
                            type="text"
                            value={direccion}
                            onChange={e => setDireccion(e.target.value)}
                            placeholder="Ruta 9 km 123, Parcela 4"
                            className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                                Localidad
                            </label>
                            <input
                                type="text"
                                value={localidad}
                                onChange={e => setLocalidad(e.target.value)}
                                placeholder="San Francisco"
                                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                                Código postal
                            </label>
                            <input
                                type="text"
                                value={codigoPostal}
                                onChange={e => setCodigoPostal(e.target.value)}
                                placeholder="X2400"
                                maxLength={8}
                                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                            Provincia
                        </label>
                        <select
                            value={provincia}
                            onChange={e => setProvincia(e.target.value)}
                            className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all text-sm"
                        >
                            <option value="">Seleccioná una provincia</option>
                            {['Buenos Aires','Córdoba','Santa Fe','Entre Ríos','La Pampa','Santiago del Estero','Tucumán','Salta','Chaco','Formosa','Misiones','Corrientes','Mendoza','San Juan','San Luis','Río Negro','Neuquén','Chubut','Santa Cruz','Tierra del Fuego','Jujuy','Catamarca','La Rioja'].map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                    {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
            </form>

            {/* Sesión */}
            <div className="bg-white rounded-xl border border-zinc-200 p-6">
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
