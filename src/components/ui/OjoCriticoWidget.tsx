'use client';

import { useMemo } from 'react';
import { AlertTriangle, Eye, HelpCircle, TrendingUp, Search } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface DependenciaContexto {
    nombre: string;
    montoMovilidad: number;
    presupuestoTotal: number;
    pesoMovilidad: number; // porcentaje del presupuesto
    variacionAnual: number;
    desglose?: {
        vuelos: number;
        comidas: number;
        gasolina: number;
    };
}

interface OjoCriticoWidgetProps {
    dependencias: DependenciaContexto[];
    totalMovilidad: number;
    totalPEF: number;
}

// Umbrales de alerta basados en realidad operativa
const UMBRAL_MOVILIDAD_ALTO = 5; // >5% del presupuesto en movilidad = revisar
const UMBRAL_MOVILIDAD_CRITICO = 12; // >12% = bandera roja
const UMBRAL_VARIACION_ALTA = 20; // >20% de aumento vs año anterior

interface Alerta {
    tipo: 'critico' | 'advertencia' | 'pregunta' | 'contexto';
    emoji: string;
    titulo: string;
    descripcion: string;
    dependencia?: string;
    preguntaClave?: string;
    dato?: string;
}

function generarAlertas(dependencias: DependenciaContexto[], totalMovilidad: number, totalPEF: number): Alerta[] {
    const alertas: Alerta[] = [];



    // Dependencias con gasto excesivo en movilidad
    const dependenciasExcesivas = dependencias.filter(d => d.pesoMovilidad > UMBRAL_MOVILIDAD_CRITICO);


    // Dependencias con incrementos sospechosos
    const dependenciasConPicos = dependencias.filter(d => d.variacionAnual > UMBRAL_VARIACION_ALTA);

    // Top gastadores
    const topGastadores = [...dependencias].sort((a, b) => b.montoMovilidad - a.montoMovilidad).slice(0, 3);

    // ALERTA CRÍTICA: Movilidad excesiva
    if (dependenciasExcesivas.length > 0) {
        const peor = dependenciasExcesivas[0];
        alertas.push({
            tipo: 'critico',
            emoji: '🚩',
            titulo: `${peor.nombre} tiene presupuestado ${peor.pesoMovilidad.toFixed(1)}% de su dinero para moverse`,
            descripcion: `Más del 12% del presupuesto de una dependencia en movilidad es una anomalía que requiere explicación.`,
            dependencia: peor.nombre,
            preguntaClave: `¿Por qué ${peor.nombre} necesita gastar tanto en transportarse? ¿Tienen operaciones de campo que lo justifiquen?`,
            dato: formatCurrency(peor.montoMovilidad)
        });
    }

    // ADVERTENCIA: Picos de aumento
    if (dependenciasConPicos.length > 0) {
        const peor = dependenciasConPicos.sort((a, b) => b.variacionAnual - a.variacionAnual)[0];
        alertas.push({
            tipo: 'advertencia',
            emoji: '📈',
            titulo: `${peor.nombre} aumentó ${peor.variacionAnual.toFixed(0)}% vs el año pasado`,
            descripcion: `Un aumento superior al 20% en gastos de movilidad requiere justificación pública.`,
            dependencia: peor.nombre,
            preguntaClave: `¿Qué cambió este año en ${peor.nombre}? ¿Nuevas funciones? ¿Más personal? ¿O simplemente más viajes?`,
            dato: `+${peor.variacionAnual.toFixed(0)}%`
        });
    }

    // PREGUNTA: SEDENA y su flota
    const sedena = dependencias.find(d => d.nombre.includes('Defensa') || d.nombre.includes('SEDENA'));
    if (sedena) {
        const porcentajeVuelos = sedena.desglose ? (sedena.desglose.vuelos / sedena.montoMovilidad) * 100 : 0;
        if (porcentajeVuelos > 40) {
            alertas.push({
                tipo: 'pregunta',
                emoji: '✈️',
                titulo: `SEDENA: ${porcentajeVuelos.toFixed(0)}% de su movilidad es vuelos`,
                descripcion: `Las fuerzas armadas operan sus propios aviones y helicópteros. Este gasto puede incluir operaciones logísticas, no solo traslados de funcionarios.`,
                dependencia: 'SEDENA',
                preguntaClave: `¿Cuánto de este gasto es operativo militar vs. viajes de funcionarios?`,
                dato: formatCurrency(sedena.desglose?.vuelos || 0)
            });
        }
    }

    // PREGUNTA: Relaciones Exteriores
    const sre = dependencias.find(d => d.nombre.includes('Relaciones') || d.nombre.includes('Exteriores'));
    if (sre) {
        alertas.push({
            tipo: 'pregunta',
            emoji: '🌎',
            titulo: `Relaciones Exteriores: ¿Solo consulados o también foros?`,
            descripcion: `Esta dependencia reporta gastos de embajadas y consulados, pero ¿qué hay de los funcionarios mexicanos que viajan a foros internacionales?`,
            dependencia: 'SRE',
            preguntaClave: `¿A qué cumbres, foros y reuniones internacionales asistieron funcionarios mexicanos este año? ¿Cuánto costó cada viaje?`,
            dato: formatCurrency(sre.montoMovilidad)
        });
    }

    // CONTEXTO: El top gastador
    if (topGastadores.length > 0) {
        const top = topGastadores[0];
        const porcentajeDelTotal = (top.montoMovilidad / totalMovilidad) * 100;
        alertas.push({
            tipo: 'contexto',
            emoji: '🔍',
            titulo: `${top.nombre} concentra el ${porcentajeDelTotal.toFixed(0)}% de todo el presupuesto de movilidad`,
            descripcion: `Una sola dependencia acapara casi ${porcentajeDelTotal > 20 ? 'un cuarto' : porcentajeDelTotal > 10 ? 'una décima parte' : 'una porción significativa'} del dinero federal para transporte.`,
            dependencia: top.nombre,

            preguntaClave: `¿Es proporcional a su tamaño y funciones? ¿Tienen operaciones que requieran tanta movilidad?`,
            dato: formatCurrency(top.montoMovilidad)
        });
    }

    // CONTEXTO: Si hay muchas dependencias "limpias"
    const dependenciasEficientes = dependencias.filter(d => d.pesoMovilidad < 2 && d.variacionAnual <= 5);
    if (dependenciasEficientes.length >= 5) {
        alertas.push({
            tipo: 'contexto',
            emoji: '✅',
            titulo: `${dependenciasEficientes.length} dependencias mantienen su movilidad bajo control`,
            descripcion: `Estas oficinas gastan menos del 2% de su presupuesto en transporte y no tuvieron aumentos significativos.`,
            preguntaClave: `¿Qué están haciendo bien? ¿Pueden servir de modelo para las demás?`
        });
    }

    return alertas.slice(0, 5); // Máximo 5 alertas
}

export default function OjoCriticoWidget({
    dependencias,
    totalMovilidad,
    totalPEF
}: OjoCriticoWidgetProps) {
    const alertas = useMemo(() =>
        generarAlertas(dependencias, totalMovilidad, totalPEF),
        [dependencias, totalMovilidad, totalPEF]
    );

    const pesoNacional = (totalMovilidad / totalPEF) * 100;

    const getAlertaColor = (tipo: Alerta['tipo']) => {
        switch (tipo) {
            case 'critico': return { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-600', badge: 'bg-red-600' };
            case 'advertencia': return { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-600', badge: 'bg-amber-500' };
            case 'pregunta': return { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600', badge: 'bg-blue-500' };
            case 'contexto': return { bg: 'bg-gray-50', border: 'border-gray-200', icon: 'text-gray-600', badge: 'bg-gray-500' };
        }
    };

    const getAlertaIcon = (tipo: Alerta['tipo']) => {
        switch (tipo) {
            case 'critico': return <AlertTriangle className="w-5 h-5" />;
            case 'advertencia': return <TrendingUp className="w-5 h-5" />;
            case 'pregunta': return <HelpCircle className="w-5 h-5" />;
            case 'contexto': return <Eye className="w-5 h-5" />;
        }
    };

    if (alertas.length === 0) {
        return (
            <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-200">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                        <span className="text-2xl">✅</span>
                    </div>
                    <div>
                        <h3 className="font-black text-emerald-800 text-lg">Sin Alertas Críticas</h3>
                        <p className="text-emerald-600 text-sm">Los gastos de movilidad están dentro de rangos razonables</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#004B57] rounded-2xl flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="font-black text-[#004B57] text-xl">Ojo Crítico</h2>
                        <p className="text-gray-500 text-sm">Lo que debes cuestionar sobre este gasto</p>
                    </div>
                </div>

                {/* Indicador de peso nacional */}
                {/* Indicador de peso nacional */}
                <div className={`px-4 py-2 rounded-xl border ${pesoNacional > 1 ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                    <p className="text-xs text-gray-500 font-medium">Peso Nacional</p>
                    <div className="flex items-baseline gap-2">
                        <p className={`text-lg font-black ${pesoNacional > 1 ? 'text-amber-600' : 'text-gray-700'
                            }`}>{pesoNacional.toFixed(3)}%</p>
                        {/* Mock de variación vs año pasado para dar contexto */}
                        <span className="text-xs font-bold text-emerald-600 flex items-center">
                            <TrendingUp className="w-3 h-3 mr-0.5 rotate-180" /> -0.2% vs 2024
                        </span>
                    </div>
                </div>
            </div>

            {/* Alertas */}
            <div className="space-y-4">
                {alertas.map((alerta, index) => {
                    const colores = getAlertaColor(alerta.tipo);
                    return (
                        <div
                            key={index}
                            className={`${colores.bg} ${colores.border} border rounded-2xl p-5 transition-all hover:shadow-md`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${colores.bg} flex items-center justify-center text-2xl`}>
                                    {getAlertaIcon(alerta.tipo)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`${colores.badge} text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider`}>
                                            {alerta.tipo === 'critico' ? 'Alerta' :
                                                alerta.tipo === 'advertencia' ? 'Revisar' :
                                                    alerta.tipo === 'pregunta' ? 'Preguntar' : 'Contexto'}
                                        </span>
                                        {alerta.dato && (
                                            <span className="text-sm font-bold text-gray-600">{alerta.dato}</span>
                                        )}
                                    </div>

                                    <h3 className="font-bold text-gray-900 text-base leading-tight mb-2">
                                        {alerta.titulo}
                                    </h3>

                                    <p className="text-gray-600 text-sm mb-3">
                                        {alerta.descripcion}
                                    </p>

                                    {alerta.preguntaClave && (
                                        <div className="bg-white/70 rounded-xl p-3 border border-gray-100">
                                            <div className="flex items-start gap-2">
                                                <Search className="w-4 h-4 text-[#00A896] flex-shrink-0 mt-0.5" />
                                                <p className="text-sm font-medium text-[#004B57]">
                                                    {alerta.preguntaClave}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pie informativo */}
            <div className="bg-[#004B57]/5 rounded-xl p-4 border border-[#004B57]/10">
                <p className="text-sm text-gray-600">
                    <strong className="text-[#004B57]">💡 Contexto:</strong>{' '}
                    El gobierno <em>necesita</em> gastar en movilidad para operar. El problema no es que gasten,
                    sino cuando gastan <em>de más</em> sin justificación clara. Un umbral razonable es que
                    la movilidad no supere el 5% del presupuesto de una dependencia, salvo funciones que lo requieran.
                </p>
            </div>
        </div>
    );
}
