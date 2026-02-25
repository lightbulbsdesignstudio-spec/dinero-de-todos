# project_state.md — Dinero de Todos
> Actualizado: 2026-02-24

---

## ¿Qué es este proyecto?
**Dinero de Todos** es una app web de periodismo de datos que hace el Presupuesto de Egresos de la Federación (PEF) 2026 comprensible para el ciudadano promedio. Stack: Next.js 16 + React 19 + TypeScript + Tailwind 4 + D3.

---

## Estado actual: MVP lanzado ✅

### Lo que está terminado
- [x] Landing page con resumen ejecutivo del PEF 2026
- [x] Visualización del presupuesto total y breakdown por ramos
- [x] Mapa de obras estratégicas (`/mapa-obras`) con Leaflet
- [x] Gráfica Sankey (flujo presupuestal ingreso → egreso)
- [x] Tabla de finanzas por estado (per cápita, participaciones, aportaciones)
- [x] Sección de fuentes de ingreso federal
- [x] Proyectos estratégicos con descripción ciudadana
- [x] Disclaimer legal visible
- [x] Datos reales inyectados en `pef_2026_master.json`
- [x] Script de actualización `update_budget_data.ts` conectado al CSV real del PEF 2026

### Lo que está en progreso / pendiente
- [ ] Conectar `fetchExternalData()` y correr por primera vez contra el CSV real para validar totales (requiere correr `npm run update-data`)
- [ ] Verificar que `budget_totals` del JSON resultante cuadre con los datos oficiales SHCP (~10.19 billones MXN)
- [ ] Actualización de `state_finances.totalFederal` desde el CSV por entidad federativa (actualmente datos curados)
- [ ] Cuando SHCP publique CGPE Q1-2026: actualizar `ejercido_total` con datos reales
- [ ] SEO básico (meta tags, og:image)
- [ ] Compartir por redes sociales (ShareAction.tsx — hay cambios sin commit)

---

## Arquitectura de datos

```
src/data/pef_2026_master.json   ← fuente única de verdad (se regenera con el script)
scripts/update_budget_data.ts   ← descarga CSV SHCP → parsea → valida → escribe master
```

**Campos del master y su origen:**
| Campo | Origen |
|-------|--------|
| `budget_totals.*` | CSV PEF 2026 (MONTO_APROBADO — real) |
| `budget_totals.ejercido_total` | `null` — Q1-2026 no reportado por SHCP |
| `income_sources` | Datos curados (CSV egresos no incluye ingresos) |
| `strategic_projects` | Datos curados con descripciones ciudadanas |
| `state_finances` | Datos curados (per cápita, pobreza, población) |
| `indicators` | Calculados/curados |
| `sankey_data` | Calculado del presupuesto |

---

## Deuda técnica nombrada (no tocar sin permiso)
- `mapa-obras/page.tsx` tiene cambios sin commit — verificar qué son antes de mergear
- `ShareAction.tsx` tiene cambios sin commit — verificar
- La validación de `strategic_projects` en el Guardian usa unidades inconsistentes (valores en millones vs total en pesos) — no es un bug crítico, solo confuso

---

## Comandos clave
```bash
npm run dev           # servidor local
npm run update-data   # descarga CSV SHCP y actualiza pef_2026_master.json
npm run build         # build de producción
```

---

## Próximas sesiones — qué atacar
1. **Correr `npm run update-data`** y verificar que los totales del CSV coinciden con el PEF 2026 oficial
2. **Commit de cambios pendientes** en mapa-obras y ShareAction una vez revisados
3. **SEO básico** para lanzamiento público
4. **Actualizar ejercido_total** cuando SHCP publique informe trimestral Q1-2026 (esperado ~mayo 2026)
