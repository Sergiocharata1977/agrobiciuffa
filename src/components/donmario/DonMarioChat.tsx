'use client';

import { Bot, Loader2, Send } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { DonMarioAcciones } from '@/components/donmario/DonMarioAcciones';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/types/chat';
import type { DonMarioAccion, DonMarioRequest, DonMarioResponse } from '@/types/donmario';

interface PortalChatMessage extends ChatMessage {
    acciones?: DonMarioAccion[];
}

interface DonMarioChatProps {
    modo: 'portal';
    tokenCliente?: string;
    className?: string;
}

function decodeTokenPayload(token?: string): Record<string, unknown> | null {
    if (!token) {
        return null;
    }

    const segments = token.split('.');
    if (segments.length < 2) {
        return null;
    }

    try {
        const payload = segments[1].replace(/-/g, '+').replace(/_/g, '/');
        const normalized = payload.padEnd(Math.ceil(payload.length / 4) * 4, '=');
        return JSON.parse(window.atob(normalized)) as Record<string, unknown>;
    } catch {
        return null;
    }
}

function getNombreCliente(tokenCliente?: string): string | null {
    const payload = decodeTokenPayload(tokenCliente);
    const candidates = [payload?.name, payload?.displayName, payload?.email];

    for (const candidate of candidates) {
        if (typeof candidate === 'string' && candidate.trim()) {
            return candidate.includes('@') ? candidate.split('@')[0] : candidate.trim();
        }
    }

    return null;
}

function buildHistory(messages: PortalChatMessage[]) {
    return messages.map(({ role, content }) => ({ role, content }));
}

export function DonMarioChat({ modo, tokenCliente, className }: DonMarioChatProps) {
    const [messages, setMessages] = useState<PortalChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState(
        () => `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
    );
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const nombreCliente = useMemo(() => getNombreCliente(tokenCliente), [tokenCliente]);

    useEffect(() => {
        const saludo = nombreCliente?.trim()
            ? `Hola ${nombreCliente}. ¿En qué te ayudo?`
            : 'Hola. ¿En qué te ayudo?';

        setMessages([
            {
                id: 'welcome',
                role: 'assistant',
                content: saludo,
                timestamp: new Date(),
            },
        ]);
    }, [nombreCliente]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSend = async () => {
        const trimmedInput = input.trim();
        if (!trimmedInput || isLoading) {
            return;
        }

        const userMessage: PortalChatMessage = {
            id: `user_${Date.now()}`,
            role: 'user',
            content: trimmedInput,
            timestamp: new Date(),
        };

        const history = buildHistory(messages);

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const payload: DonMarioRequest = {
                message: trimmedInput,
                session_id: sessionId,
                history,
            };

            const response = await fetch('/api/chat/don-mario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(tokenCliente
                        ? { Authorization: `Bearer ${tokenCliente}` }
                        : {}),
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Error al procesar mensaje');
            }

            const data: DonMarioResponse = await response.json();
            setSessionId(data.session_id || sessionId);

            setMessages((prev) => [
                ...prev,
                {
                    id: `assistant_${Date.now()}`,
                    role: 'assistant',
                    content: data.reply,
                    timestamp: new Date(),
                    acciones: data.acciones,
                },
            ]);
        } catch (error) {
            console.error('[DonMarioChat]', error);
            setMessages((prev) => [
                ...prev,
                {
                    id: `error_${Date.now()}`,
                    role: 'assistant',
                    content: 'Lo siento, hubo un problema al responder. Intentá de nuevo en unos segundos.',
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            void handleSend();
        }
    };

    return (
        <section
            className={cn(
                'flex h-[600px] min-h-[600px] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm',
                className
            )}
            data-modo={modo}
        >
            <header className="flex items-center gap-3 bg-red-600 px-4 py-4 text-white">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
                    <Bot className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-base font-bold">Don Mario — Tu asistente de Agro Biciuffa</h2>
                    <p className="text-sm text-red-100">Asistencia contextual para repuestos, servicio y maquinaria</p>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto bg-white px-4 py-4">
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}
                        >
                            <div
                                className={cn(
                                    'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                                    message.role === 'user'
                                        ? 'rounded-br-sm bg-zinc-900 text-white'
                                        : 'rounded-bl-sm border border-zinc-200 bg-zinc-50 text-zinc-900'
                                )}
                            >
                                <p className="whitespace-pre-wrap">{message.content}</p>
                                {message.role === 'assistant' && message.acciones && (
                                    <DonMarioAcciones acciones={message.acciones} />
                                )}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="rounded-2xl rounded-bl-sm border border-zinc-200 bg-zinc-50 px-4 py-3">
                                <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="border-t border-zinc-200 bg-zinc-50 p-4">
                <div className="flex items-center gap-2">
                    <Input
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Consultá sobre repuestos, servicio técnico o maquinaria..."
                        className="h-11 rounded-full border-zinc-300 bg-white"
                        disabled={isLoading}
                    />
                    <Button
                        type="button"
                        size="icon"
                        onClick={() => void handleSend()}
                        disabled={!input.trim() || isLoading}
                        className="h-11 w-11 rounded-full bg-red-600 text-white hover:bg-red-700"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
        </section>
    );
}
