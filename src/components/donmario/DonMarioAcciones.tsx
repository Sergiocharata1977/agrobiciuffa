'use client';

import { useRouter } from 'next/navigation';

import type { DonMarioAccion } from '@/types/donmario';

interface DonMarioAccionesProps {
    acciones: DonMarioAccion[];
}

export function DonMarioAcciones({ acciones }: DonMarioAccionesProps) {
    const router = useRouter();

    if (acciones.length === 0) {
        return null;
    }

    return (
        <div className="mt-3 flex flex-wrap gap-2">
            {acciones.map((accion) => (
                <button
                    key={`${accion.href}-${accion.label}`}
                    type="button"
                    onClick={() => router.push(accion.href)}
                    className="rounded-full border border-red-600 px-3 py-1 text-sm text-red-600 transition-colors hover:bg-red-50"
                >
                    {accion.label}
                </button>
            ))}
        </div>
    );
}
