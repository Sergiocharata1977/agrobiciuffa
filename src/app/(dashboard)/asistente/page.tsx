'use client';

import { useEffect, useRef, useState } from 'react';
import { Headphones, Loader2, Mic, Volume2, VolumeX } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useMisSolicitudes } from '@/hooks/useMisSolicitudes';
import { useVoicePlayer } from '@/hooks/useVoicePlayer';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

type SpeechRecognitionLike = {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    onstart: (() => void) | null;
    onend: (() => void) | null;
    onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
    start: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

// Equipos de demo (en produccion vendrian del backend)
const EQUIPOS_DEMO = [
    { tipo: 'Tractor', marca: 'CASE IH', modelo: 'Puma 185', numero_serie: 'JBAH185EX6M123456', anio: 2019 },
    { tipo: 'Cosechadora', marca: 'CASE IH', modelo: 'Axial-Flow 8250', numero_serie: 'CAFE8250YP7A98765', anio: 2021 },
    { tipo: 'Pulverizadora', marca: 'CASE IH', modelo: 'Patriot 250', numero_serie: 'CAP250YZAB1B54321', anio: 2020 },
];

const SUGERENCIAS = [
    'Como solicito un repuesto?',
    'Cual es el estado de mis solicitudes?',
    'Necesito servicio tecnico para mi tractor',
    'Que mantenimiento preventivo se recomienda?',
];

export default function AsistentePage() {
    const { user, firebaseUser } = useAuth();
    const { solicitudes } = useMisSolicitudes();

    const nombre = user?.displayName || firebaseUser?.displayName || 'Cliente';
    const email = user?.email || firebaseUser?.email || '';
    const firstName = nombre.split(' ')[0];

    const [messages, setMessages] = useState<Message[]>([]);
    const [draft, setDraft] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [started, setStarted] = useState(false);

    const scrollRef = useRef<HTMLDivElement | null>(null);
    const prevMsgLenRef = useRef(0);
    const { speak, stop, isPlaying, isLoading: isAudioLoading } = useVoicePlayer();
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [autoplay, setAutoplay] = useState(false);
    const [listening, setListening] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    // Welcome message
    useEffect(() => {
        setMessages([
            {
                role: 'assistant',
                content: `Hola ${firstName}! Soy Don Mario IA, tu asistente del portal de Agro Biciufa.\n\nPuedo ayudarte con consultas sobre tus equipos CASE IH, el estado de tus solicitudes, repuestos, mantenimiento y mas. En que te puedo ayudar hoy?`,
            },
        ]);
    }, [firstName]);

    // Auto-scroll on new messages
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }, [messages, sending]);

    // Autoplay: reproducir respuesta del asistente automaticamente
    useEffect(() => {
        if (autoplay && messages.length > prevMsgLenRef.current) {
            const last = messages[messages.length - 1];
            if (last?.role === 'assistant') {
                setPlayingId(`msg-${messages.length - 1}`);
                void speak(last.content).finally(() => setPlayingId(null));
            }
        }
        prevMsgLenRef.current = messages.length;
    }, [messages, autoplay, speak]);

    // Auto-resize textarea
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = '0';
        el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    }, [draft]);

    const sendMessage = async (content: string) => {
        if (!content.trim() || sending) return;

        const userMsg: Message = { role: 'user', content };
        const nextMessages = [...messages, userMsg];
        setMessages(nextMessages);
        setDraft('');
        setSending(true);
        setError(null);
        setStarted(true);

        try {
            const context = {
                nombre,
                email,
                equipos: EQUIPOS_DEMO,
                solicitudes: solicitudes.slice(0, 10).map((s) => ({
                    numeroSolicitud: s.numeroSolicitud,
                    tipo: s.tipo,
                    estado: s.estado,
                    modelo: s.modelo,
                })),
            };

            const res = await fetch('/api/asistente', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: content,
                    chatHistory: messages.slice(-10),
                    context,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || `Error ${res.status}`);
            }

            setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'No se pudo enviar el mensaje');
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            void sendMessage(draft.trim());
        }
    };

    const handleMic = () => {
        const speechWindow = window as typeof window & {
            SpeechRecognition?: SpeechRecognitionConstructor;
            webkitSpeechRecognition?: SpeechRecognitionConstructor;
        };
        const SR = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
        if (!SR) return;
        const recognition = new SR();
        recognition.lang = 'es-AR';
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.onstart = () => setListening(true);
        recognition.onend = () => setListening(false);
        recognition.onresult = (event) => {
            setDraft(event.results[0][0].transcript);
        };
        recognition.start();
    };

    return (
        <div className="flex flex-col" style={{ height: 'calc(100vh - 5rem)' }}>
            {/* Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-zinc-200">
                <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white font-bold text-lg flex-shrink-0">
                        DM
                    </div>
                    <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></span>
                </div>
                <div>
                    <h1 className="font-bold text-zinc-900 text-lg leading-tight">Don Mario IA</h1>
                    <p className="text-xs text-zinc-500">Asistente de Agro Biciufa · CASE IH</p>
                </div>
                <button
                    onClick={() => setAutoplay((v) => !v)}
                    className={`ml-auto flex items-center justify-center h-8 w-8 rounded-full transition-colors ${autoplay ? 'bg-red-100 text-red-600' : 'text-zinc-400 hover:text-red-600 hover:bg-red-50'}`}
                    title={autoplay ? 'Autoplay ON - click para desactivar' : 'Activar reproduccion automatica'}
                >
                    <Headphones className="w-4 h-4" />
                </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto py-4 space-y-4 min-h-0">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'assistant' && (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white font-bold text-xs flex-shrink-0 mr-2 mt-1">
                                DM
                            </div>
                        )}
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                                msg.role === 'user'
                                    ? 'bg-zinc-900 text-white rounded-tr-sm'
                                    : 'bg-white border border-zinc-200 text-zinc-800 rounded-tl-sm'
                            }`}
                        >
                            {msg.content}
                            {msg.role === 'assistant' && (
                                <button
                                    onClick={() => {
                                        const id = `msg-${i}`;
                                        if (playingId === id) {
                                            stop();
                                            setPlayingId(null);
                                        } else {
                                            stop();
                                            setPlayingId(id);
                                            void speak(msg.content).finally(() => setPlayingId(null));
                                        }
                                    }}
                                    className="mt-1.5 flex items-center gap-1 text-xs text-zinc-400 hover:text-red-600 transition-colors"
                                    title={playingId === `msg-${i}` ? 'Detener' : 'Escuchar respuesta'}
                                >
                                    {isAudioLoading && playingId === `msg-${i}` ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : playingId === `msg-${i}` && isPlaying ? (
                                        <VolumeX className="w-3.5 h-3.5" />
                                    ) : (
                                        <Volume2 className="w-3.5 h-3.5" />
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {sending && (
                    <div className="flex justify-start">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white font-bold text-xs flex-shrink-0 mr-2 mt-1">
                            DC
                        </div>
                        <div className="bg-white border border-zinc-200 rounded-2xl rounded-tl-sm px-4 py-3">
                            <div className="flex gap-1.5 items-center h-4">
                                <span className="h-2 w-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="h-2 w-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="h-2 w-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}
            </div>

            {/* Sugerencias rapidas (solo si no empezo) */}
            {!started && (
                <div className="pb-3 flex flex-wrap gap-2">
                    {SUGERENCIAS.map((s) => (
                        <button
                            key={s}
                            onClick={() => void sendMessage(s)}
                            className="text-xs bg-white border border-zinc-200 text-zinc-600 px-3 py-1.5 rounded-full hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}

            {/* Input */}
            <div className="border-t border-zinc-200 pt-3">
                <div className="flex gap-3 items-end">
                    <textarea
                        ref={textareaRef}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={sending}
                        placeholder="Escribi tu consulta... (Enter para enviar)"
                        rows={1}
                        className="flex-1 resize-none rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-red-300 focus:ring-1 focus:ring-red-200 transition-colors disabled:opacity-50 min-h-[46px]"
                        style={{ overflow: 'hidden' }}
                    />
                    <button
                        type="button"
                        onClick={handleMic}
                        disabled={sending}
                        className={`flex h-[46px] w-[46px] items-center justify-center rounded-xl transition-colors flex-shrink-0 ${listening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-zinc-100 text-zinc-500 hover:bg-red-50 hover:text-red-600'} disabled:opacity-40`}
                        title={listening ? 'Escuchando...' : 'Dictado por voz'}
                    >
                        <Mic className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => void sendMessage(draft.trim())}
                        disabled={!draft.trim() || sending}
                        className="flex h-[46px] w-[46px] items-center justify-center rounded-xl bg-red-600 text-white hover:bg-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
                <p className="text-xs text-zinc-400 mt-2 text-center">
                    Don Mario IA puede cometer errores. Para info critica consulta al equipo de Agro Biciufa.
                </p>
            </div>
        </div>
    );
}
