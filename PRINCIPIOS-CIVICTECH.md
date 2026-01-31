# Principios de Diseño Centrado en Personas

## ⚡ Checklist obligatorio ANTES de cada entrega

Ninguna feature está "terminada" hasta pasar estos 4 filtros:

### 1. ¿Tiene contexto?
- [ ] Se explica el "por qué" detrás de cada número
- [ ] Hay referencias claras (promedios, comparaciones, fuentes)
- [ ] El usuario entiende qué significa el dato en la práctica
- [ ] Se reconocen las limitaciones de los datos

### 2. ¿Lo visual tiene sentido?
- [ ] El tamaño/color/posición comunica correctamente
- [ ] Hay jerarquía visual clara (qué ver primero, segundo)
- [ ] No hay elementos que puedan engañar o confundir
- [ ] Los números grandes están humanizados

### 3. ¿El lenguaje es simple?
- [ ] Lo entendería alguien sin educación universitaria
- [ ] No hay jerga técnica sin explicar
- [ ] Las oraciones son cortas y directas
- [ ] Los títulos son preguntas que la gente se hace

### 4. ¿Está centrado en personas?
- [ ] Responde preguntas reales de ciudadanos
- [ ] Conecta con su vida cotidiana
- [ ] Permite formar una opinión informada
- [ ] No asume conocimiento previo

---

# Principios de Civic Tech

Basados en mySociety (UK), Code for America, y mejores prácticas internacionales.

## 1. Diseñar para el ciudadano, no para el experto

> "Si tu abuela no puede entenderlo, rediseña."

- ❌ "Ejecución presupuestal del Ramo 28"
- ✅ "Dinero que llega a tu estado"

**Aplicación:**
- Usar lenguaje cotidiano siempre
- Evitar jerga técnica y siglas sin explicar
- Probar con personas sin conocimiento previo

## 2. Hacer los números comprensibles

> "Un billón de pesos no significa nada para nadie."

**Técnicas:**
- **Per cápita**: "$8,500 por cada mexicano"
- **Comparaciones**: "Equivale a 45,000 escuelas primarias"
- **Tiempo**: "Lo que gana un trabajador en 15,000 años"
- **Escala local**: "Con esto se pavimentarían todas las calles de tu colonia"

## 3. Ser radicalmente abiertos

> "Openness has behavioral benefits" - mySociety

- Publicar TODO el código fuente (MIT License)
- Documentar metodología de forma transparente
- Permitir descargar los datos en formatos abiertos
- Explicar las limitaciones honestamente

## 4. Interacción bidireccional: El ciudadano es auditor

> "The Auditor Rule" - El usuario no es un consumidor pasivo, es un auditor activo.

**Implementación obligatoria:**
- Cada visualización de datos debe tener opciones de acción:
  - "¿Ves un error?" - Reportar datos incorrectos
  - "Reportar anomalía" - Algo que requiere investigación
  - "Pedir explicación" - Cuando algo no se entiende

**Componente:** `<ActionTrigger />` integrado en todas las tablas y visualizaciones.

**Referencia:** Georgia "Budget Monitor" permite solicitudes de auditoría desde la visualización.

**Por qué importa:**
- Mejora la calidad de los datos con retroalimentación ciudadana
- Empodera al ciudadano como vigilante activo
- Crea un canal directo entre datos y accountability

## 5. Narrativa visual: Flujo sobre tablas

> "Flow over Grids" - Las hojas de cálculo ocultan relaciones que las visualizaciones revelan.

**Vista predeterminada por tipo de dato:**

| Tipo de dato | Visualización primaria | Secundaria |
|--------------|----------------------|------------|
| Presupuesto (origen→destino) | Diagrama Sankey | Tabla detalle |
| Jerarquías de gasto | Treemap interactivo | Lista expandible |
| Comparaciones entre entidades | Barras horizontales | Tabla ordenable |
| Evolución temporal | Líneas/áreas | Tabla de periodos |
| Distribución geográfica | Mapa coroplético | Tabla por región |

**Principios de OpenSpending:**
- Las tablas son para **detalles**, no para **entender**
- El usuario debe **ver la historia** antes de leer los números
- Permitir drill-down: Vista general → Detalle específico

**Implementación actual:**
- `/flujo-recursos` → Sankey (✅ correcto)
- `/explorador` → Treemap (✅ correcto)
- `/tu-estado` → Tabla con contexto (agregar visualización)
- `/presupuesto` → Tabla (agregar barras comparativas)

## 6. Rendimiento Inclusivo: Móvil y Baja Banda

> "Asumir que el usuario tiene 3G inestable y dispositivo de gama media/baja."

### Implementación técnica:

**1. Detección de conexión:**
```typescript
const { isSlowConnection, saveData } = useConnectionQuality();
// Detecta: 2G, 3G, modo ahorro datos, <1.5Mbps
```

**2. Fallbacks estáticos para D3.js:**
- `<TreemapFallback />` - Lista con barras de progreso
- `<SankeyFallback />` - Dos columnas con %

**3. Componente wrapper:**
```tsx
<PerformanceWrapper
  ariaLabel="Distribución del presupuesto"
  fallback={<TreemapFallback items={data} />}
>
  <TreemapChart data={data} />
</PerformanceWrapper>
```

### Accesibilidad obligatoria:

**Toggle global (`<AccessibilityProvider />`):**
- 👁 Alto contraste (WCAG AAA)
- 🔤 Texto grande (+20%)
- Preferencias guardadas en localStorage

**Skip link:**
```html
<a href="#main-content" class="skip-link">
  Saltar al contenido principal
</a>
```

**ARIA en visualizaciones:**
- `role="list"` / `role="listitem"` para datos
- `role="progressbar"` con `aria-valuenow`
- `aria-label` descriptivo en cada región

**CSS de accesibilidad:**
- `@media (prefers-reduced-motion: reduce)` - Sin animaciones
- `.high-contrast` - Fondo negro, texto blanco, enlaces verdes
- `.large-text` - Escala todos los tamaños de fuente
- Focus visible con outline 2px verde

**Print styles:**
- URLs de enlaces visibles
- Ocultar elementos interactivos

## 7. Behavioral UX: Diseñar para participación recurrente

> "No queremos visitas únicas, queremos ciudadanos vigilantes."

**Principio clave:** Usar nudges positivos, no vergüenza.

### ❌ Evitar (shame avoidance):
- "Tu diputado es faltista"
- "El gobierno no cumple"
- "Nadie vigila esto"

### ✅ Usar (positive framing):
- "Tu diputado ha asistido al 80% de sesiones. ¡Exígele llegar al 100%!"
- "Se ha ejercido el 65% del presupuesto. ¿Es el ritmo adecuado?"
- "Has completado 3 de 7 logros cívicos. ¡Sigue explorando!"

### Implementación:

**Componente `<CivicNudge />`** con variantes:
- `card` - Tarjeta con progreso visual
- `banner` - Horizontal para destacar
- `toast` - Notificación temporal

**Generador de nudges:** `generarNudgePositivo()`
```typescript
// Transforma datos en mensajes motivacionales
generarNudgePositivo({
  tipo: 'asistencia' | 'gasto' | 'participacion' | 'transparencia',
  valor: 80,
  maximo: 100,
  nombre: 'Diputado García'
})
```

**Sistema de progreso cívico:** `<ProgresoCivico />`
- Logros desbloqueables por acciones
- Barra de progreso gamificada
- Sin ranking público (evita competencia tóxica)

**Logros disponibles:**
- 👀 Ciudadano curioso (primera visita)
- 🔍 Explorador fiscal (revisar 3+ áreas)
- 🧮 Contribuyente informado (usar calculadora)
- 🏠 Vigilante local (ver tu estado)
- 📝 Auditor ciudadano (reportar anomalía)
- 📢 Multiplicador cívico (compartir)
- 📋 Demandante de transparencia (solicitud INAI)

## 7. Confianza y trazabilidad: Source Linking

> "La confianza se gana demostrando el origen. El sistema no debe parecer una caja negra."

**Implementación obligatoria:**
- Cada dato debe mostrar su fuente con enlace directo
- Indicar el tipo de dato:
  - 🟢 **Oficial**: Publicado por institución gubernamental
  - 🔵 **Procesado**: Extraído de fuente oficial y transformado
  - 🟡 **Estimado**: Calculado con metodología propia
- Mostrar fechas: cuándo se publicó y cuándo lo consultamos
- Si hay procesamiento, enlazar al código/script usado

**Componente:** `<SourceLink />` con variantes:
- `inline` - Solo icono con tooltip
- `badge` - Etiqueta compacta
- `detailed` - Panel expandible con todas las fuentes

**Registro centralizado:** `/src/data/fuentes.ts`

**Por qué importa:**
- Permite verificación independiente
- Genera confianza por transparencia metodológica
- Facilita replicar y auditar los cálculos

## 7. Enfocarse en la acción, no solo información

> "No basta con informar, hay que empoderar."

- ¿Qué puede HACER el ciudadano con esta información?
- Agregar botones de "Reportar", "Compartir", "Preguntar"
- Conectar con mecanismos reales de participación (solicitudes INAI)

## 5. Vigilar lo que importa

> "Follow the money to the details that matter."

**Datos de alto impacto ciudadano:**
- Viáticos de funcionarios
- Gastos en vehículos oficiales
- Celulares y telecomunicaciones
- Eventos y publicidad
- Bonos y compensaciones

## 6. Contextualizar siempre

> "Un número sin contexto es ruido."

- Comparar con años anteriores
- Mostrar tendencias
- Explicar por qué importa
- Dar referencias de otros países o estados

## 7. Mobile-first, conexión-lenta-friendly

> "La mayoría de los mexicanos acceden por celular con datos limitados."

- Diseño responsivo obligatorio
- Cargar rápido en 3G
- Funcionar sin JavaScript cuando sea posible

## 8. Construir confianza gradualmente

> "La transparencia sobre la transparencia."

- Mostrar fecha de actualización de datos
- Citar fuentes específicas
- Reconocer errores públicamente
- No exagerar ni sensacionalizar

---

## Checklist para cada feature

- [ ] ¿Un ciudadano sin estudios puede entenderlo?
- [ ] ¿Los números tienen contexto humano?
- [ ] ¿Hay una acción clara que el usuario puede tomar?
- [ ] ¿Funciona bien en celular?
- [ ] ¿Las fuentes están citadas?
- [ ] ¿Hay forma de reportar errores?
