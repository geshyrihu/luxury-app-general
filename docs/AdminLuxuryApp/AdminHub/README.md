# 📋 Conventions Viewer - Guía Visual Interactiva

**Ubicación:** `admin-wrapper/conventions-viewer/`
**Ruta:** `/admin/conventions-guide`
**Propósito:** Visualizar el sistema rector de convenciones por dominio, tipo de tarea y severidad.

---

## 🎯 Características

- ✅ **Interfaz Visual Limpia** — Tarjetas expandibles por convención
- ✅ **Busqueda en Tiempo Real** — Filtra por palabras clave
- ✅ **Filtrado Avanzado** — Por sección, severidad, tecnología
- ✅ **Taxonomía Nueva** — Dominio y tipo de tarea alineados con el sistema rector
- ✅ **Ejemplos de Código** — Angular, .NET, Flutter (copy-to-clipboard)
- ✅ **Indicadores de Severidad** — Colores distintivos (🔴/🟠/🟡/🔵)
- ✅ **Responsive** — Mobile-first design (375px+)
- ✅ **Fast Loading** — Standalone component, lazy-loaded

---

## 📁 Estructura de Carpetas

```
conventions-viewer/
├── conventions-viewer.ts                    # Componente principal (OnPush)
├── conventions-viewer.html                  # Template con tabs + filtros
├── conventions-viewer.scss                  # Estilos responsive
├── conventions-viewer.service.ts            # Datos + búsqueda
├── conventions-viewer.utils.ts              # Utilidades (severityColor, severityIcon)
├── components/
│   └── convention-card/
│       ├── convention-card.ts               # Tarjeta individual
│       ├── convention-card.html             # Detalles + ejemplos
│       └── convention-card.scss             # Estilos tarjeta
└── README.md                                # Este archivo
```

---

## 🚀 Cómo Usar

### Acceder en Admin Panel

1. Ir a: **Herramientas de Desarrollo/Prueba**
2. Click en: **📋 Conventions Guide**
3. Se abre la guía interactiva

### Buscar una Convención

```
Usar la barra de búsqueda:
- "strict" → encuentra regla de Strict TypeScript
- "wrapper" → encuentra regla de wrappers
- "angular" → encuentra reglas para Angular
```

### Filtrar por Criterios

**Tabs disponibles:**

- 📚 **Todas** (muestra todas las reglas)
- 🗂️ **Por Dominio** (Core, Backend, Frontend, UI, Styles, Audit, etc.)
- 🛠️ **Por Tarea** (Implementación Backend, Frontend/UI, Flutter, Auditoría, etc.)
- ⚠️ **Por Severidad** (CRÍTICA, ALTA, MEDIA, BAJA)
- 💻 **Por Tecnología** (Angular, .NET, TypeScript, C#, Flutter)

### Expandir Detalles

Click en cualquier tarjeta para:

- Ver DESCRIPCIÓN completa
- Entender por qué es importante
- Ver ejemplos de código
- Copiar ejemplos al clipboard
- Ver secciones relacionadas

---

## 📊 Estructura de Datos

Cada regla contiene:

```typescript
interface ConventionRule {
  id: string; // "angular-strict-ts"
  domain: ConventionDomain; // core, backend, frontend, ui, styles...
  taskTypes: ConventionTaskType[]; // implementacion-backend, auditoria...
  title: string; // "TypeScript Strict Mode Obligatorio"
  description: string; // DESCRIPCIÓN breve
  severity: "CRÍTICA" | "ALTA" | "MEDIA" | "BAJA";
  technologies: string[]; // ['Angular', 'TypeScript']
  examples: {
    angular?: { code: string; description: string };
    dotnet?: { code: string; description: string };
    flutter?: { code: string; description: string };
  };
  relatedRules?: string[]; // reglas relacionadas
  importance: string; // Por qué es importante
}
```

> Nota: el viewer ya no depende del esquema histórico por secciones 1-22 como
> modelo principal. Ahora su dataset base responde a la taxonomía nueva del
> sistema rector.

---

## 🎨 Colores de Severidad

| Severidad   | Color      | Icono | Significado                      |
| ----------- | ---------- | ----- | -------------------------------- |
| **CRÍTICA** | 🔴 #dc2626 | 🔴    | Bloquea merge en pre-commit      |
| **ALTA**    | 🟠 #f97316 | 🟠    | Falla auditoría, debe arreglarse |
| **MEDIA**   | 🟡 #eab308 | 🟡    | Comentario en code review        |
| **BAJA**    | 🔵 #3b82f6 | 🔵    | Sugerencia, mejora menor         |

---

## ⚙️ Componentes

### `ConventionsViewer` (Principal)

**Responsabilidades:**

- Gestionar estado (búsqueda, filtros, tab activo)
- Cargar datos desde servicio
- Aplicar filtros complejos
- Renderizar grid de tarjetas

**Patrón:** Standalone (implícito en Angular 22, sin necesidad de `standalone: true`)

**Signals utilizados:**

```typescript
conventions = signal<ConventionRule[]>([]);
filteredConventions = signal<ConventionRule[]>([]);
activeTab = signal<TabType>("all");
searchQuery = signal("");
selectedSection = signal<number | null>(null);
selectedSeverity = signal<SeverityType | null>(null);
selectedTechnology = signal<string>("");
```

### `ConventionCard` (Tarjeta)

**Responsabilidades:**

- Mostrar tarjeta individual
- Expandir/contraer detalles
- Cambiar ejemplo (Angular, .NET, Flutter)
- Copiar código al clipboard

**Patrón:** Standalone (implícito en Angular 22)

**Signal Input:**

```typescript
convention = input.required<ConventionRule>();
```

### `ConventionsService` (Datos)

**Métodos:**

```typescript
getConventions(): Observable<ConventionRule[]>        // Todas
getConventionBySection(section: number): Observable   // Por sección
searchConventions(query: string): Observable          // Búsqueda
getBySeverity(severity: string): Observable          // Por severidad
getByTechnology(technology: string): Observable       // Por tecnología
```

---

## 🔍 Agregar Nueva Convención

Para agregar una nueva regla, edita `conventions-viewer.service.ts`:

```typescript
{
  id: 'nuevo-id',
  section: 2,
  title: 'Nueva Regla',
  description: 'DESCRIPCIÓN clara y concisa',
  severity: 'ALTA',
  technologies: ['Angular', '.NET'],
  examples: {
    angular: {
      code: `// ✅ BIEN\ncode example here`,
      description: 'Explicación del ejemplo'
    },
    dotnet: {
      code: `// ✅ BIEN\ncode example here`,
      description: 'Explicación del ejemplo'
    }
  },
  relatedSections: [5, 6],
  importance: 'Por qué es importante esta regla'
}
```

---

## 📱 Responsive Breakpoints

- **Mobile** (375px): Grid de 1 columna
- **Tablet** (768px): Grid de 2 columnas
- **Desktop** (1024px): Grid de 3 columnas

---

## 🔗 Conexiones

### Usa:

- `ConventionsService` — Datos de convenciones
- Controles Angular 22: @if, @for (built-in, sin CommonModule)

### Usado por:

- Admin Panel (`/admin/conventions-guide`)
- Git Hooks (referenciado en error messages)
- Onboarding de developers

---

## 💡 Notas de Desarrollo

### Performance

- ✅ ChangeDetectionStrategy.OnPush en ambos componentes
- ✅ Signals en lugar de RxJS (más ligero)
- ✅ Standalone implícito (Angular 22, sin boilerplate)
- ✅ Lazy loading vía route (no precarga)
- ✅ Ningún subscriptions sin unsubscribe (OnDestroy no necesario)

### Testing

Para agregar tests, crear:

```
conventions-viewer.spec.ts
components/convention-card/convention-card.spec.ts
conventions-viewer.service.spec.ts
```

### Future Enhancements

- [ ] Export convenciones a PDF
- [ ] Marcar favoritas
- [ ] Comparación de severidades
- [ ] Integración con git hooks (mostrar qué regla falló)
- [ ] Versioning de convenciones (histórico)

---

## 🐛 Troubleshooting

| Problema             | Solución                                          |
| -------------------- | ------------------------------------------------- |
| No carga datos       | Verificar ConventionsService en providers         |
| Filtros no funcionan | Revisar signal updates en updateFiltered()        |
| Código no se copia   | Verificar navigator.clipboard en navegador        |
| Estilos rotos        | Verificar SCSS imports en conventions-viewer.scss |

---

**Última actualización:** 2026-07-28
**Versión:** 1.1 — Angular 22 signals, sin .component suffix, stricto TypeScript
**Autor:** LuxuryApp Tech Team
