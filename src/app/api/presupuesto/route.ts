import { NextResponse } from 'next/server';
import { getPresupuestoRamos, getResumenPresupuesto } from '@/lib/api/presupuesto';

export async function GET() {
  try {
    const [ramos, resumen] = await Promise.all([
      getPresupuestoRamos(),
      getResumenPresupuesto(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        ramos,
        resumen,
      },
      meta: {
        fuente: 'Transparencia Presupuestaria - SHCP',
        actualizacion: resumen.fechaActualizacion,
        disclaimer: 'Datos con fines demostrativos. Para datos oficiales consulte transparenciapresupuestaria.gob.mx',
      },
    });
  } catch (error) {
    console.error('Error en API presupuesto:', error);
    return NextResponse.json(
      { success: false, error: 'Error obteniendo datos del presupuesto' },
      { status: 500 }
    );
  }
}
