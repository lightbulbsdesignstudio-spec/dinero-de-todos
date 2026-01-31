import { NextResponse } from 'next/server';
import { getObrasPublicas, getEstadisticasObras, FiltrosObras } from '@/lib/api/obras';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parsear filtros de la URL
    const filtros: FiltrosObras = {};
    
    if (searchParams.get('estado')) {
      filtros.estado = searchParams.get('estado')!;
    }
    if (searchParams.get('tipo')) {
      filtros.tipo = searchParams.get('tipo')!;
    }
    if (searchParams.get('montoMin')) {
      filtros.montoMin = parseInt(searchParams.get('montoMin')!);
    }
    if (searchParams.get('montoMax')) {
      filtros.montoMax = parseInt(searchParams.get('montoMax')!);
    }
    if (searchParams.get('avanceMin')) {
      filtros.avanceMin = parseInt(searchParams.get('avanceMin')!);
    }
    if (searchParams.get('estatus')) {
      filtros.estatus = searchParams.get('estatus')!;
    }

    const [obras, estadisticas] = await Promise.all([
      getObrasPublicas(Object.keys(filtros).length > 0 ? filtros : undefined),
      getEstadisticasObras(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        obras,
        estadisticas,
      },
      meta: {
        fuente: 'Proyectos de Inversión - SHCP',
        total: obras.length,
        filtrosAplicados: filtros,
      },
    });
  } catch (error) {
    console.error('Error en API obras:', error);
    return NextResponse.json(
      { success: false, error: 'Error obteniendo datos de obras' },
      { status: 500 }
    );
  }
}
