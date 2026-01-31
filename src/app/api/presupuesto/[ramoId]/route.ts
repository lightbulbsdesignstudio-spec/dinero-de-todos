import { NextResponse } from 'next/server';
import { getPresupuestoRamos, getProgramasPorRamo } from '@/lib/api/presupuesto';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ ramoId: string }> }
) {
  try {
    const { ramoId } = await params;
    
    const [ramos, programas] = await Promise.all([
      getPresupuestoRamos(),
      getProgramasPorRamo(ramoId),
    ]);

    const ramo = ramos.find(r => r.id === ramoId);

    if (!ramo) {
      return NextResponse.json(
        { success: false, error: 'Ramo no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ramo,
        programas,
      },
    });
  } catch (error) {
    console.error('Error en API ramo:', error);
    return NextResponse.json(
      { success: false, error: 'Error obteniendo datos del ramo' },
      { status: 500 }
    );
  }
}
