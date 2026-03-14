'use client';

import type { FormEvent, ReactNode } from 'react';
import { useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

interface FormInstitucionalProps {
    titulo: string;
    descripcion?: string;
    children: ReactNode;
    onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
    submitLabel?: string;
    successMessage?: string;
}

export function FormInstitucional({
    titulo,
    descripcion,
    children,
    onSubmit,
    submitLabel = 'Enviar consulta',
    successMessage = 'Gracias. Te contactamos pronto.',
}: FormInstitucionalProps) {
    const [status, setStatus] = useState<FormStatus>('idle');
    const [errorMessage, setErrorMessage] = useState('No pudimos enviar tu consulta. Intenta nuevamente.');

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus('loading');
        setErrorMessage('No pudimos enviar tu consulta. Intenta nuevamente.');

        try {
            await onSubmit(event);
            setStatus('success');
        } catch (error) {
            if (error instanceof Error && error.message.trim()) {
                setErrorMessage(error.message);
            }
            setStatus('error');
        }
    };

    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="mb-6">
                <h3 className="text-2xl font-bold tracking-tight text-zinc-900">{titulo}</h3>
                {descripcion ? (
                    <p className="mt-3 text-sm leading-6 text-zinc-600">{descripcion}</p>
                ) : null}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-4">{children}</div>

                {status === 'success' ? (
                    <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                        <p>{successMessage}</p>
                    </div>
                ) : null}

                {status === 'error' ? (
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <p>{errorMessage}</p>
                    </div>
                ) : null}

                <Button
                    type="submit"
                    size="lg"
                    disabled={status === 'loading'}
                    className="w-full bg-red-600 text-white hover:bg-red-700"
                >
                    {status === 'loading' ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enviando...
                        </>
                    ) : (
                        submitLabel
                    )}
                </Button>
            </form>
        </div>
    );
}
