# 📖 BRAND GUIDELINES: Dinero de Todos
## Portal de Transparencia Ciudadana México

---

## 🎨 1. Design Tokens (Colores)

| Token | HEX | Nombre | Uso |
| :--- | :--- | :--- | :--- |
| `--color-primary` | `#004B57` | Azul Vigilante | Navegación, Títulos, Texto Pesado |
| `--color-accent` | `#00A896` | Verde Talavera | Botones de acción, Éxito, Gráficas |
| `--color-highlight` | `#F29100` | Oro Ciudadano | Signos de $, Alertas, Datos Clave |
| `--color-bg-light` | `#F8F9FA` | Blanco Nube | Fondo de página, Cards |
| `--color-text-main` | `#1A1A1A` | Texto Principal | Cuerpo de texto para alta legibilidad |

### CSS Variables (globals.css)
```css
:root {
  --color-primary: #004B57;      /* Azul Vigilante */
  --color-accent: #00A896;       /* Verde Talavera */
  --color-highlight: #F29100;    /* Oro Ciudadano */
  --color-bg-light: #F8F9FA;     /* Blanco Nube */
  --color-text-main: #1A1A1A;    /* Texto principal */
}
```

### Aliases para Tailwind
```css
@theme inline {
  --color-vigilante: var(--color-primary);
  --color-talavera: var(--color-accent);
  --color-oro: var(--color-highlight);
  --color-nube: var(--color-bg-light);
}
```

---

## 🔤 2. Tipografía

### Jerarquía
| Uso | Fuente | Peso | Tamaño |
|-----|--------|------|--------|
| Títulos H1 | Montserrat | Bold (700) | 3rem - 4rem |
| Títulos H2 | Montserrat | Bold (700) | 2rem - 2.5rem |
| Subtítulos | Montserrat | Semibold (600) | 1.25rem |
| Cuerpo | Inter | Regular (400) | 1rem |
| Datos/Tablas | Inter | Medium (500) | 0.875rem |
| Captions | Inter | Regular (400) | 0.75rem |

### Clases CSS
```css
.font-display  /* Montserrat - Títulos */
.font-body     /* Inter - Cuerpo y datos */
.monto-dinero  /* Montos destacados en Oro */
```

### Tono de Voz
- **Ciudadano**: Directo, sin rodeos
- **Pedagógico**: Explica conceptos complejos
- **Mexicano**: "Tu lana", "Presupuesto", NO "vuestro dinero"

---

## 🎯 3. Elementos de Marca

### Logo
- Archivo: `/public/logo-dinero-todos.png`
- Uso: Navbar, Footer, OG Images
- Tamaño mínimo: 40x40px

### Nombre de Marca
```
DINERO
DE TODOS
```
- "DINERO" en blanco/primary, bold
- "DE TODOS" en accent (#00A896), semibold, tracking-widest

### Signo de Dinero ($)
- Siempre en Oro Ciudadano (#F29100)
- Ejemplo: `<span className="text-[#F29100]">$</span>9.2 billones`

---

## 🎨 4. Gradientes

### Hero/CTA Principal
```css
background: linear-gradient(to bottom-right, #004B57, #003d47, #002d35);
```

### Elementos Decorativos
- Blur verde: `bg-[#00A896]` con `blur-3xl opacity-10`
- Blur oro: `bg-[#F29100]` con `blur-3xl opacity-10`

---

## 🔘 5. Botones

### Primario (CTA)
```css
bg-[#00A896] text-white hover:bg-[#00937f]
```

### Secundario
```css
bg-white/10 text-white border border-[#00A896]/50 hover:bg-white/20
```

### Texto/Link
```css
text-[#00A896] hover:text-[#004B57]
```

---

## 📐 6. Componentes

### Cards
- Fondo: `bg-white`
- Borde: `border border-gray-200`
- Hover: `hover:shadow-lg hover:-translate-y-1`
- Radio: `rounded-2xl`

### Progress Bars
- Track: `bg-gray-200`
- Fill: `bg-[#00A896]`

### Badges/Tags
```css
bg-[#00A896]/10 text-[#004B57] border border-[#00A896]/20
```

---

## 📱 7. Responsive

| Breakpoint | Tamaño |
|------------|--------|
| Mobile | < 640px |
| Tablet | 640px - 1024px |
| Desktop | > 1024px |

---

## ♿ 8. Accesibilidad

### Contraste
- Texto en fondos claros: `#1A1A1A` (WCAG AAA)
- Texto en fondos oscuros: `#FFFFFF`

### Focus States
```css
outline: 2px solid #00A896;
outline-offset: 2px;
```

### Alto Contraste
- Activar con clase `.high-contrast`
- Fondo negro, texto blanco, enlaces en verde

---

---

## 🛠 9. Componentes de UI

### Tablas de Vigilancia Presupuestal
```tsx
<TablaVigilancia
  datos={presupuesto}
  columnas={[...]}
  busqueda={true}
  titulo="Gasto por dependencia"
/>
```
- **Zebra striping**: Filas alternadas con `bg-nube`
- **Montos**: Siempre en `text-oro font-bold`
- **Headers**: Fondo Azul Vigilante, texto blanco
- **Hover**: Fondo Verde Talavera al 8%

### Filtros Píldora
```tsx
<FiltroPildora label="Educación" activo={true} onClick={...} />
```
- Siempre visibles encima de tablas
- `rounded-full` con borde sutil
- Estado activo: fondo Verde Talavera

### Cards de Funcionarios
```tsx
<CardFuncionario funcionario={data} />
```
- Foto con `rounded-full` y borde Talavera
- Mini-barras de asistencia/desempeño
- Badge de tipo de elección (neutro)

### Skeleton Loading
```tsx
<SkeletonTable rows={5} cols={4} />
<SkeletonCard />
<SkeletonStats count={3} />
```
- Mantienen estructura de contenido
- Animación sutil de gradiente
- Mobile-first

---

## 🇲🇽 10. Contexto Cultural

### Patrón Talavera
```css
.patron-talavera::before {
  opacity: 0.03;  /* Muy sutil */
  /* SVG de cruces inspiradas en Talavera */
}
```
- Usar solo en fondos de secciones grandes
- Opacidad máxima: 5%

### Idioma: Español de México
| ❌ Evitar | ✅ Usar |
|-----------|---------|
| "Vuestros impuestos" | "Tus impuestos" |
| "Ordenador" | "Computadora" |
| "Dinero público" | "Tu lana" (contexto informal) |
| "Presupuesto General" | "Presupuesto Federal" |

---

## ♿ 11. Accesibilidad (WCAG AA)

- **Contraste mínimo**: 4.5:1
- **Focus visible**: outline 2px Verde Talavera
- **Responsive**: Mobile-first
- **Skeletons**: Mantienen estructura durante carga

---

## 📁 Archivos de Referencia

### Estilos
- `/src/app/globals.css` - Variables CSS y componentes

### Componentes UI
- `/src/components/ui/TablaVigilancia.tsx` - Tablas con zebra/montos
- `/src/components/ui/Skeleton.tsx` - Loading states
- `/src/components/ui/CardFuncionario.tsx` - Cards con barras
- `/src/components/ui/FeatureCard.tsx` - Cards de navegación

### Layout
- `/src/components/layout/Navbar.tsx` - Header con marca
- `/src/components/layout/Footer.tsx` - Footer con marca

### Assets
- `/public/logo-dinero-todos.png` - Logo principal
