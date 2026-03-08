'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface SolicitudResumen {
    id: string;
    numeroSolicitud: string;
    tipo: 'repuesto' | 'servicio' | 'comercial';
    estado: 'recibida' | 'en_revision' | 'gestionando' | 'cerrada' | 'cancelada';
    nombre: string;
    email: string;
    telefono: string;
    created_at: string;
    // Campos tipo-específicos opcionales
    maquina_tipo?: string;
    modelo?: string;
    descripcion_repuesto?: string;
    descripcion_problema?: string;
    localidad?: string;
    provincia?: string;
    producto_interes?: string;
    producto_nombre?: string;
    requiere_financiacion?: boolean;
    comentarios?: string;
}

interface UseMisSolicitudesResult {
    solicitudes: SolicitudResumen[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

const BASE_URL = (
    process.env.NEXT_PUBLIC_9001APP_URL ??
    process.env.NEXT_PUBLIC_DONC_SOLICITUDES_URL ??
    ''
).replace(/\/$/, '');

export function useMisSolicitudes(): UseMisSolicitudesResult {
    const { firebaseUser } = useAuth();
    const [solicitudes, setSolicitudes] = useState<SolicitudResumen[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tick, setTick] = useState(0);

    const refetch = useCallback(() => setTick(t => t + 1), []);

    useEffect(() => {
        if (!firebaseUser) {
            setSolicitudes([]);
            setLoading(false);
            return;
        }

        if (!BASE_URL) {
            setError('El servicio no está configurado.');
            setLoading(false);
            return;
        }

        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);

            try {
                const token = await firebaseUser!.getIdToken();
                const res = await fetch(`${BASE_URL}/api/public/solicitudes/mias`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error((data as { error?: string }).error ?? `Error ${res.status}`);
                }

                const data = await res.json() as { success: boolean; data: SolicitudResumen[] };

                if (!cancelled) {
                    setSolicitudes(data.data ?? []);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : 'No se pudo cargar las solicitudes.');
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();

        return () => { cancelled = true; };
    }, [firebaseUser, tick]);

    return { solicitudes, loading, error, refetch };
}
