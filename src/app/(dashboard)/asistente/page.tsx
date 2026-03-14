'use client';

import { useEffect, useState } from 'react';
import { Bot, MessageSquareText, PackageSearch, Settings2, UserRoundPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { DonMarioChat } from '@/components/donmario/DonMarioChat';

const CAPACIDADES = [
    {
        icon: PackageSearch,
        text: 'Iniciar solicitudes de repuesto o servicio tecnico',
    },
    {
        icon: MessageSquareText,
        text: 'Consultar el estado de tus solicitudes',
    },
    {
        icon: Settings2,
        text: 'Informarte sobre maquinaria CASE IH',
    },
    {
        icon: UserRoundPlus,
        text: 'Conectarte con un asesor humano',
    },
];

function ChatSkeleton() {
    return (
        <div className="flex flex-1 flex-col overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 bg-red-600 px-4 py-4 text-white">
                <div className="flex h-11 w-11 animate-pulse items-center justify-center rounded-full bg-white/15">
                    <Bot className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-48 animate-pulse rounded-full bg-white/20" />
                    <div className="h-3 w-64 animate-pulse rounded-full bg-white/20" />
                </div>
            </div>

            <div className="flex-1 space-y-4 bg-white px-4 py-4">
                {[0, 1, 2].map((item) => (
                    <div
                        key={item}
                        className={`flex ${item % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                    >
                        <div className="h-20 w-full max-w-[85%] animate-pulse rounded-2xl bg-zinc-100" />
                    </div>
                ))}
            </div>

            <div className="border-t border-zinc-200 bg-zinc-50 p-4">
                <div className="h-11 animate-pulse rounded-full bg-zinc-200" />
            </div>
        </div>
    );
}

export default function AsistentePage() {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = window.localStorage.getItem('portal_token');

        setToken(storedToken);
        setLoading(false);

        if (!storedToken) {
            router.replace('/portal/login');
        }
    }, [router]);

    if (loading || !token) {
        return (
            <main className="flex min-h-[calc(100vh-3rem)] flex-col gap-6">
                <section className="space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
                        Don Mario - Asistente de Agro Biciuffa
                    </h1>
                    <p className="max-w-2xl text-sm leading-6 text-zinc-600">
                        Consulta sobre tus solicitudes, equipos, repuestos o cualquier necesidad.
                    </p>
                </section>
                <ChatSkeleton />
            </main>
        );
    }

    return (
        <main className="flex min-h-[calc(100vh-3rem)] flex-col gap-6">
            <section className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
                    Don Mario - Asistente de Agro Biciuffa
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-zinc-600">
                    Consulta sobre tus solicitudes, equipos, repuestos o cualquier necesidad.
                </p>
            </section>

            <div className="flex flex-1 flex-col gap-6">
                <DonMarioChat
                    modo="portal"
                    tokenCliente={token}
                    className="flex-1 !h-full !min-h-[540px]"
                />

                <section className="hidden rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm lg:block">
                    <h2 className="text-lg font-semibold text-zinc-950">
                        Don Mario puede ayudarte a...
                    </h2>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                        {CAPACIDADES.map(({ icon: Icon, text }) => (
                            <div
                                key={text}
                                className="flex items-start gap-3 rounded-2xl bg-zinc-50 px-4 py-3 ring-1 ring-zinc-200"
                            >
                                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                                    <Icon className="h-4 w-4" />
                                </div>
                                <p className="text-sm leading-6 text-zinc-700">{text}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
