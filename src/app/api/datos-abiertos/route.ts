import { NextResponse } from 'next/server';
import { searchDatasets } from '@/lib/api/presupuesto';

/**
 * API para buscar datasets en datos.gob.mx
 * Ejemplo: /api/datos-abiertos?q=presupuesto&rows=10
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || 'presupuesto';
    const rows = parseInt(searchParams.get('rows') || '10');

    const result = await searchDatasets(query, rows);

    return NextResponse.json({
      success: true,
      data: result,
      meta: {
        query,
        rows,
        fuente: 'datos.gob.mx - API CKAN',
      },
    });
  } catch (error) {
    console.error('Error buscando datasets:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error buscando datasets en datos.gob.mx',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
