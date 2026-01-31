'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X, ChevronDown, Bot, Loader2 } from 'lucide-react';
import { getCalificacionMexicana } from '@/lib/fiscal';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function FiscalAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: '¡Hola! Soy tu Auditor Inteligente. Selecciona una de las opciones rápidas para generar un informe o escribe tu pregunta.',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Acciones rápidas (One-Click Reports)
    const quickActions = [
        {
            id: 'audit',
            label: '📄 Generar Reporte Ejecutivo',
            icon: '📊',
            prompt: 'Genera un reporte ejecutivo de los datos que estoy viendo, enfocándote en anomalías.'
        },
        {
            id: 'media',
            label: '📰 Buscar en Medios',
            icon: '🔍',
            prompt: 'Busca noticias verificadas recientes sobre este proyecto/dependencia.'
        },
        {
            id: 'risks',
            label: '⚠️ Analizar Riesgos',
            icon: '🛡️',
            prompt: 'Analiza los riesgos de corrupción o mal uso de recursos en este rubro.'
        }
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleQuickAction = (actionPrompt: string) => {
        // Simular flujo de usuario
        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: actionPrompt,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);

        // Zero-Cost Logic Handler
        setTimeout(() => {
            let response = "";
            let link = "";

            if (actionPrompt.includes("Reporte")) {
                // Simulación de calificación para el reporte
                const score = 5.8; // Ejemplo de reprobado para generar impacto
                const calif = getCalificacionMexicana(score);

                response = `📊 CALIFICACIÓN FISCAL: ${calif.calificacion}\n` +
                    `ESTADO: ${calif.mensaje.toUpperCase()}\n\n` +
                    `${calif.subtexto}\n\n` +
                    `DETALLE DEL REPORTE:\n` +
                    `1. 🚑 Salud: Meta 20% | Real: ~12% 🔴\n` +
                    `2. 🌱 Ciencia: Meta 4.5% | Real: <1% ⚠️\n` +
                    `3. ⚡ Burocracia: Meta <5% | Real: 7% 🟡\n\n` +
                    `Estamos calificando con rigor mexicano: Sin 6.0 no hay pase.`;
            } else if (actionPrompt.includes("Medios")) {
                response = "He preparado una búsqueda para que veas tú mismo la verdad en las noticias. Sin filtros. Haz clic abajo 👇";
                link = "https://www.google.com/search?q=presupuesto+mexico+2026+ciencia+tecnologia+vs+infraestructura+site:animalpolitico.com+OR+site:eleconomista.com.mx";
            } else {
                const score = 7.2; // Ejemplo "De panzazo"
                const calif = getCalificacionMexicana(score);

                response = `⚠️ RIESGO CIUDADANO: ${calif.calificacion}\n` +
                    `DIAGNÓSTICO: ${calif.mensaje.toUpperCase()}\n\n` +
                    `🔴 GASTO EN GOBIERNO: Excesivo.\n` +
                    `🟢 OBRAS: Inversión alta, pero con alertas de sobrecosto.\n` +
                    `🟡 PROTECCIÓN SOCIAL: Insuficiente.\n\n` +
                    `El "panzazo" significa que estamos sobreviviendo, no creciendo.`;
            }

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);

            if (link) {
                window.open(link, '_blank');
            }

            setIsLoading(false);
        }, 1000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        // TODO: Connect to real API
        // Mock response for now
        setTimeout(() => {
            const responses = [
                "Entendido. Basado en los datos de la SHCP para 2026, esa obra tiene un sobrecosto del 25%. Esto significa que está costando más de lo planeado originalmente.",
                "Esa es una buena pregunta. El financiamiento 'autosuficiente' significa que la obra genera sus propios recursos (como un aeropuerto que cobra TUA) y no depende de tus impuestos directos.",
                "He buscado en medios verificados y encontré que esta obra ha tenido 3 retrasos importantes reportados por Animal Político y El Economista.",
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: randomResponse,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 ${isOpen
                    ? 'bg-slate-800 hover:bg-slate-900 text-white rotate-0'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-105'
                    }`}
            >
                {isOpen ? (
                    <>
                        <X className="w-5 h-5" />
                        <span className="font-semibold">Cerrar Auditor</span>
                    </>
                ) : (
                    <>
                        <Sparkles className="w-5 h-5" />
                        <span className="font-semibold">Generar Informe IA</span>
                    </>
                )}
            </button>

            {/* Chat Window */}
            <div
                className={`fixed bottom-20 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] bg-white rounded-2xl shadow-2xl border border-gray-100 transition-all duration-300 origin-bottom-right flex flex-col overflow-hidden ${isOpen
                    ? 'opacity-100 scale-100 translate-y-0'
                    : 'opacity-0 scale-95 translate-y-10 pointer-events-none'
                    }`}
                style={{ height: '600px', maxHeight: '70vh' }}
            >
                {/* Header */}
                <div className="bg-slate-900 p-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-sm">Auditor Inteligente</h3>
                            <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                Tecnología Cívica Open Source • Costo $0
                            </p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 relative">
                    <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-slate-50 to-transparent z-10"></div>

                    {/* Quick Actions Grid (Always visible at top if no messages, or embedded) */}
                    {messages.length === 1 && (
                        <div className="grid grid-cols-1 gap-2 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Informes Disponibles:</p>
                            {quickActions.map(action => (
                                <button
                                    key={action.id}
                                    onClick={() => handleQuickAction(action.prompt)}
                                    className="bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 p-3 rounded-xl text-left transition-all flex items-center gap-3 shadow-sm hover:shadow-md group"
                                >
                                    <span className="text-xl group-hover:scale-110 transition-transform">{action.icon}</span>
                                    <div>
                                        <h4 className="font-bold text-slate-700 text-sm group-hover:text-indigo-700">{action.label}</h4>
                                        <p className="text-[10px] text-slate-400 leading-tight">Click para generar</p>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-slate-300 ml-auto -rotate-90 group-hover:text-indigo-400" />
                                </button>
                            ))}
                        </div>
                    )}

                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-br-none hidden'
                                    : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                                    }`}
                            >
                                {msg.content.includes('CALIFICACIÓN FISCAL:') && msg.role === 'assistant' ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-4 border-b border-slate-100 pb-3">
                                            <div
                                                className="text-4xl font-black px-4 py-2 rounded-xl text-white shadow-inner"
                                                style={{ backgroundColor: getCalificacionMexicana(parseFloat(msg.content.split('CALIFICACIÓN FISCAL: ')[1])).color }}
                                            >
                                                {msg.content.split('\n')[0].split(': ')[1]}
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-900 leading-tight">
                                                    {msg.content.split('\n')[1].split(': ')[1]}
                                                </div>
                                                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Escala MX 0-10</div>
                                            </div>
                                        </div>
                                        <div className="text-slate-600 text-xs">
                                            {msg.content.split('\n').slice(2).join('\n')}
                                        </div>
                                    </div>
                                ) : (
                                    msg.content
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                                <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                                <span className="text-xs text-slate-400">Consultando fuentes y analizando datos...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area (Minimized) */}
                <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-100 shrink-0">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="O escribe una pregunta específica..."
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-full pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-indigo-600 disabled:opacity-50"
                            disabled={isLoading || !input.trim()}
                            onClick={handleSubmit}
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
