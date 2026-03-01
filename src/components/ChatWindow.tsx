// ChatWindow - Ventana de chat expandida
'use client';

import { Button } from '@/components/ui/button';
import { DonCandidoAvatar } from '@/components/ui/DonCandidoAvatar';
import { Input } from '@/components/ui/input';
import type { ChatMessage } from '@/types/chat';
import { Loader2, Send, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ChatWindowProps {
    onClose: () => void;
    position?: 'bottom-right' | 'bottom-left';
}

export function ChatWindow({
    onClose,
    position = 'bottom-right',
}: ChatWindowProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId] = useState(
        () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    );
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const positionClasses = {
        'bottom-right': 'bottom-6 right-6',
        'bottom-left': 'bottom-6 left-6',
    };

    // Mensaje de bienvenida inicial
    useEffect(() => {
        const welcomeMessage: ChatMessage = {
            id: 'welcome',
            role: 'assistant',
            content:
                '¡Hola! 👋 Soy el asistente virtual de Agro Biciuffa SRL. ¿En qué maquina o servicio te puedo ayudar hoy?',
            timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
    }, []);

    // Auto-scroll al último mensaje
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: `user_${Date.now()}`,
            role: 'user',
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input.trim(),
                    sessionId,
                    chatHistory: messages,
                }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Error al procesar mensaje');
            }

            const assistantMessage: ChatMessage = {
                id: `assistant_${Date.now()}`,
                role: 'assistant',
                content: data.reply,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error: any) {
            console.error('Error sending message:', error);
            const errorMessage: ChatMessage = {
                id: `error_${Date.now()}`,
                role: 'assistant',
                content:
                    'Lo siento, hubo un error al comunicar con el servidor. ¿Podrías intentarlo de nuevo?',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div
            className={`fixed ${positionClasses[position]} z-50 w-[400px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-100px)] bg-white rounded-2xl shadow-xl border border-zinc-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300`}
        >
            {/* Header */}
            <div className="bg-red-600 text-white p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <DonCandidoAvatar mood="chatbot" className="w-8 h-8 brightness-0 invert" />
                    </div>
                    <div>
                        <h3 className="font-bold text-base">Asistente Agro Biciuffa</h3>
                        <p className="text-xs text-red-100 font-medium">Experto en Case IH</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-white hover:bg-white/20"
                    aria-label="Cerrar chat"
                >
                    <X className="w-5 h-5" />
                </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
                {messages.map(message => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}
                    >
                        {message.role === 'assistant' && (
                            <div className="w-8 h-8 flex-shrink-0 bg-red-100 rounded-full flex items-center justify-center">
                                <DonCandidoAvatar mood="chatbot" className="w-6 h-6" />
                            </div>
                        )}
                        <div
                            className={`max-w-[80%] rounded-xl px-4 py-2.5 ${message.role === 'user'
                                    ? 'bg-red-600 text-white rounded-br-sm'
                                    : 'bg-white border border-slate-200 text-zinc-800 rounded-bl-sm shadow-sm'
                                }`}
                        >
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        </div>
                    </div>
                ))}

                {/* Typing indicator */}
                {isLoading && (
                    <div className="flex justify-start gap-2">
                        <div className="w-8 h-8 flex-shrink-0 bg-red-100 rounded-full flex items-center justify-center">
                            <DonCandidoAvatar mood="chatbot" className="w-6 h-6" />
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl rounded-bl-sm px-4 py-3 shadow-sm">
                            <div className="flex gap-1.5 mt-1">
                                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-200">
                <div className="flex gap-2 items-center">
                    <Input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Pregunta sobre maquinaria..."
                        className="flex-1 rounded-full border-slate-300 focus:border-red-500 focus:ring-red-500"
                        disabled={isLoading}
                        aria-label="Escribe tu mensaje aquí"
                    />
                    <Button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        size="icon"
                        className="rounded-full bg-red-600 hover:bg-red-700 text-white flex-shrink-0 shadow-sm"
                        aria-label="Enviar mensaje"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4 ml-0.5" />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
