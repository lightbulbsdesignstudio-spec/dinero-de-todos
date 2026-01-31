# Portal Transparencia México 🇲🇽

Plataforma ciudadana para el seguimiento del gasto público y la rendición de cuentas en México.

## Características

- **Flujo de Recursos**: Diagrama Sankey interactivo que visualiza el origen y destino del presupuesto federal
- **Explorador de Presupuesto**: Treemap navegable con drill-down por jerarquía (Ramo → Programa → Partida)
- **Mapa de Obras**: Geolocalización de obras públicas y contratos en todo el territorio nacional
- **Análisis de Gasto**: Comparativa de presupuesto aprobado vs ejercido por ramo y programa

## Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Visualizaciones**: D3.js (Sankey, Treemap)
- **Mapas**: Leaflet
- **Iconos**: Lucide React

## Instalación

```bash
# Clonar repositorio
git clone https://github.com/portal-transparencia-mx/portal.git

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build
npm start
```

## Estructura del Proyecto

```
src/
├── app/                    # Rutas de la aplicación
│   ├── page.tsx           # Landing page
│   ├── presupuesto/       # Análisis de presupuesto
│   ├── flujo-recursos/    # Diagrama Sankey
│   ├── explorador/        # Treemap navegable
│   └── mapa-obras/        # Mapa geolocalizado
├── components/
│   ├── layout/            # Navbar, Footer
│   ├── charts/            # SankeyChart, TreemapChart
│   ├── maps/              # ObrasMap
│   └── ui/                # StatCard, FeatureCard, ProgressBar
├── data/
│   └── mock/              # Datos de demostración
└── lib/
    └── utils.ts           # Utilidades y formateo
```

## Fuentes de Datos (MVP)

Este MVP utiliza datos de demostración realistas basados en:
- Presupuesto de Egresos de la Federación (PEF) 2024
- Estructura presupuestaria real (ramos, programas)
- Ubicaciones aproximadas de obras públicas

Para la versión producción, se conectará a:
- API de Transparencia Presupuestaria (SHCP)
- Plataforma Nacional de Transparencia (PNT/INAI)
- Gaceta Parlamentaria / SIL

## Licencia

MIT License - Código abierto para la sociedad civil

## Contribuir

Las contribuciones son bienvenidas. Por favor abre un issue primero para discutir los cambios propuestos.

---

Desarrollado con ❤️ para la transparencia y rendición de cuentas en México.
