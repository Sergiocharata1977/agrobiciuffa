import type { ReactNode } from 'react';

interface FortalezaCardProps {
    icono: ReactNode;
    titulo: string;
    descripcion: string;
}

export function FortalezaCard({
    icono,
    titulo,
    descripcion,
}: FortalezaCardProps) {
    return (
        <article className="flex h-full min-h-[240px] flex-col items-center justify-center rounded-2xl bg-transparent p-6 text-center">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 shadow-sm">
                {icono}
            </div>
            <h3 className="text-lg font-bold tracking-tight text-zinc-900">{titulo}</h3>
            <p className="mt-3 max-w-xs text-sm leading-6 text-zinc-600">{descripcion}</p>
        </article>
    );
}
