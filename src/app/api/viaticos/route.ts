import { NextResponse } from 'next/server';
import { getViaticosReales } from '@/lib/api/viaticos';

export async function GET() {
    try {
        const { viaticos, totalGlobalPEF } = await getViaticosReales();

        return NextResponse.json({
            success: true,
            data: {
                viaticos,
                totalGlobalPEF,
            },
            meta: {
                fuente: 'Transparencia Presupuestaria - SHCP',
                total: viaticos.length,
            },
        });
    } catch (error) {
        console.error('Error en API viaticos:', error);
        return NextResponse.json(
            { success: false, error: 'Error obteniendo datos de viáticos' },
            { status: 500 }
        );
    }
}

