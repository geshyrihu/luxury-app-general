# pipes-catalog.md — Catálogo de Pipes Compartidos Aprobados

> **Estado:** Vigente  
> **Autorizado:** 2026-09-20  
> **Ubicación:** `appsweb/angular/src/app/shared/pipes/`  
> **Total:** 14 pipes aprobados

---

## 1. Pipes Obligatorios / Críticos

| Pipe | Archivo | Uso | Documentado en |
|------|---------|-----|----------------|
| **apiDate** | `api-date.pipe.ts` | **OBLIGATORIO** para fechas API → UI | `CONVENTIONS.md §6.1`, `angular-services-catalog.md` |

> **Regla:** `apiDate` es el **único pipe permitido** para formatear fechas que vienen del backend. Prohibido `new Date()`, `formatDate`, `| date` directo.

---

## 2. Pipes de Formato de Datos

| Pipe | Archivo | Entrada | Salida | Ejemplo |
|------|---------|---------|--------|---------|
| **capitalizado** | `capitalizado.pipe.ts` | `string` | `string` | `"juan perez"` → `"Juan Perez"` |
| **currencyMexico** | `currencyMexico.pipe.ts` | `number` | `string` | `1234.56` → `"$1,234.56 MXN"` |
| **celularNumber** | `celular-number.pipe.ts` | `string` | `string` | `"5512345678"` → `"+52 55 1234 5678"` |
| **filesize** | `filesize.pipe.ts` | `number` (bytes) | `string` | `1048576` → `"1 MB"` |
| **initialsAbbr** | `initials-abbr.pipe.ts` | `string` (nombre) | `string` | `"Juan Carlos Perez"` → `"JCP"` |
| **tipoGasto** | `tipo-gasto.pipe.ts` | `TipoGasto` (enum) | `string` | `TipoGasto.Comida` → `"Comida"` |

---

## 3. Pipes de Transformación de Contenido

| Pipe | Archivo | Entrada | Salida | Uso |
|------|---------|---------|--------|-----|
| **sanitizeHtml** | `sanitize-html.pipe.ts` | `string` (HTML) | `string` (seguro) | Prevenir XSS en contenido usuario |
| **stripTags** | `StripTags.pipe.ts` | `string` (HTML) | `string` (texto plano) | Quitar tags HTML: `"<b>Hola</b>"` → `"Hola"` |
| **highlight** | `highlight.pipe.ts` | `string`, `string` (query) | `string` (HTML con `<mark>`) | Resaltar búsqueda en listas |
| **boolText** | `bool-text.pipe.ts` | `boolean` | `string` | `true` → `"Sí"`, `false` → `"No"` |

---

## 4. Pipes Especializados de Negocio

| Pipe | Archivo | Entrada | Salida | Contexto |
|------|---------|---------|--------|----------|
| **areaMinutaDetalles** | `area-minuta-detalles.pipe.ts` | `AreaMinutasDetalles` (enum) | `string` | Minutas/Comités |

---

## 5. Reglas de Uso

| Regla | Descripción |
|-------|-------------|
| **Un solo pipe por transformación** | No crear pipes duplicados (ej. `capitalize` vs `capitalizado`) |
| **Pipes en `shared/pipes/`** | Pipes genéricos/reutilizables → aquí. Pipes de feature → en feature |
| **Tipado estricto** | `PipeTransform` con tipos genéricos: `transform(value: T, ...args): R` |
| **Tests obligatorios** | Cada pipe debe tener `.spec.ts` con casos borde (null, undefined, vacío) |
| **Pure pipes por defecto** | `@Pipe({ pure: true })` salvo que necesite estado (raro) |

---

## 6. Cómo Agregar Nuevo Pipe Compartido

1. **Verificar** que no exista pipe similar en catálogo
2. **Crear** en `shared/pipes/nuevo-pipe.pipe.ts` + `.spec.ts`
3. **Registrar** en `shared/pipes/index.ts` (barrel export)
4. **Documentar** aquí (añadir fila a tabla correspondiente)
5. **Testear** casos: null, undefined, string vacío, tipos incorrectos

---

## 7. Referencias

| Documento | Qué cubre |
|-----------|-----------|
| `angular-components-api.md` | Uso de pipes en templates |
| `frontend-prohibitions.md` | Prohibido `| date` directo en fechas API |
| `angular-services-catalog.md` | `DateService`, `ApiDatePipe` |
| CONVENTIONS.md §6.1 | Tabla de reglas críticas, fila 11 "Fechas y horas" |
| `shared/pipes/` | Implementaciones reales |