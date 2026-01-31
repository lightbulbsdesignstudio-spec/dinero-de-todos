export interface Estado {
    id: string;
    nombre: string;
    poblacion: number;
    totalFederal: number;
    participaciones: number;
    aportaciones: number;
    perCapita: number;
    perCapitaParticipaciones: number;
    perCapitaAportaciones: number;
    pobrezaPorcentaje: number;
}

export interface EvaluacionEquidad {
    categoria: 'necesita_mas' | 'proporcional' | 'recibe_mas';
    etiqueta: string;
    explicacion: string;
    razon: string;
    color: string;
    icono: string;
}

export interface EvaluacionMexicana {
    calificacion: number;
    mensaje: string;
    color: string;
    subtexto: string;
}

const ESTADOS_PETROLEROS = ['cam', 'tab'];
const ESTADOS_FRONTERIZOS = ['bc', 'son', 'chih', 'coah', 'nl', 'tam'];
const ESTADOS_TURISTICOS = ['qroo', 'bcs'];
const CAPITAL = ['cdmx'];

export function evaluarEquidad(estado: Estado, promedioNacional: number): EvaluacionEquidad {
    const dineroRelativo = estado.perCapita / promedioNacional;
    const diferenciaPesos = Math.round(Math.abs(estado.perCapita - promedioNacional));
    const diferenciaPorcentaje = Math.round((dineroRelativo - 1) * 100);

    let razonRecibeMas = '';
    if (ESTADOS_PETROLEROS.includes(estado.id)) {
        razonRecibeMas = 'La fórmula de participaciones considera la producción petrolera del estado, por eso recibe más.';
    } else if (ESTADOS_FRONTERIZOS.includes(estado.id)) {
        razonRecibeMas = 'Los estados fronterizos tienen mayor actividad económica y recaudación, lo que aumenta sus participaciones.';
    } else if (ESTADOS_TURISTICOS.includes(estado.id)) {
        razonRecibeMas = 'El turismo genera mayor recaudación local, lo que se refleja en más participaciones federales.';
    } else if (CAPITAL.includes(estado.id)) {
        razonRecibeMas = 'Como sede de los poderes federales, concentra actividad económica y recaudación.';
    }

    if (estado.pobrezaPorcentaje > 45 && dineroRelativo < 0.98) {
        return {
            categoria: 'necesita_mas',
            etiqueta: 'Necesita más',
            explicacion: `Tiene ${estado.pobrezaPorcentaje.toFixed(0)}% de pobreza pero recibe $${diferenciaPesos.toLocaleString('es-MX')} menos por habitante que el promedio.`,
            razon: 'La fórmula actual no compensa suficientemente la pobreza. Estos estados podrían beneficiarse de una distribución más equitativa.',
            color: '#dc2626',
            icono: '⚠️'
        };
    }

    if (dineroRelativo > 1.25) {
        return {
            categoria: 'recibe_mas',
            etiqueta: `+${diferenciaPorcentaje}% vs promedio`,
            explicacion: `Recibe $${diferenciaPesos.toLocaleString('es-MX')} más por habitante que el promedio nacional.`,
            razon: razonRecibeMas || 'Factores económicos o de recaudación local aumentan sus participaciones.',
            color: '#2563eb',
            icono: '📊'
        };
    }

    if (dineroRelativo < 0.90) {
        return {
            categoria: 'necesita_mas',
            etiqueta: `${diferenciaPorcentaje}% vs promedio`,
            explicacion: `Recibe $${diferenciaPesos.toLocaleString('es-MX')} menos por habitante que el promedio.`,
            razon: estado.pobrezaPorcentaje > 40
                ? `Con ${estado.pobrezaPorcentaje.toFixed(0)}% de pobreza, podría requerir más recursos para atender sus necesidades.`
                : 'La fórmula de distribución considera recaudación y población.',
            color: '#f59e0b',
            icono: '📉'
        };
    }

    return {
        categoria: 'proporcional',
        etiqueta: 'Cerca del promedio',
        explicacion: `Recibe aproximadamente lo mismo que el promedio nacional por habitante.`,
        razon: 'La distribución es proporcional a su población y características económicas.',
        color: '#10b981',
        icono: '✓'
    };
}

export function getCalificacionMexicana(score: number): EvaluacionMexicana {
    if (score >= 9) {
        return { calificacion: score, mensaje: 'Excelente', color: '#10b981', subtexto: 'El gasto está alineado con las mejores prácticas internacionales.' };
    } else if (score >= 8) {
        return { calificacion: score, mensaje: 'Bueno', color: '#3b82f6', subtexto: 'Buen desempeño, aunque hay áreas de oportunidad en inversión.' };
    } else if (score >= 6) {
        return { calificacion: score, mensaje: 'Regular', color: '#f59e0b', subtexto: 'Se detectan riesgos de ineficiencia y concentración.' };
    } else {
        return { calificacion: score, mensaje: 'Reprobado', color: '#ef4444', subtexto: 'Alerta crítica: El presupuesto muestra desviaciones severas.' };
    }
}
