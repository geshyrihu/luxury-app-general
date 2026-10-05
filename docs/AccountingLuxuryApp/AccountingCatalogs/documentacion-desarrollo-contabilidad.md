# Desarrollo - Módulo Contabilidad

> Documento de seguimiento del desarrollo del módulo de Contabilidad.

---

## 📋 Índice

1. [Componentes Creados](#componentes-creados)
2. [Rutas Registradas](#rutas-registradas)
3. [Análisis de Rutas](#análisis-de-rutas)
4. [Servicios](#servicios)
5. [Modelos](#modelos)
6. [Endpoints API](#endpoints-api)
7. [Historial de Cambios](#historial-de-cambios)

---

## 🧩 Componentes Creados

### Master Dashboard

| Propiedad | Valor |
|-----------|-------|
| **Selector** | `app-master-dashboard` |
| **Path** | `contabilidad/master-dashboard/` |
| **Tipo** | Standalone Component |
| **Estado** | ✅ Creado - Pendiente implementación |

**Archivos:**
- `master-dashboard.component.ts`
- `master-dashboard.component.html`
- `master-dashboard.component.scss`

**Funcionalidad:**
Panel principal del módulo de contabilidad con:
- Cards de resumen (Total registros, Pendientes, Procesados, Total monto)
- Tabla de resumen de actividades

**Próximos pasos:**
- [ ] Conectar con endpoints reales de la API
- [ ] Implementar señales para datos dinámicos
- [ ] Agregar filtros de búsqueda
- [ ] Implementar exportación de datos

---

## 🛣️ Rutas Registradas

### Rutas Principales (pages.routing.ts)

| Ruta | Módulo | Descripción |
|------|--------|-------------|
| `/accounting` | `accounting.routing.ts` | Módulo contabilidad (presupuesto, catálogos, etc.) |
| `/accounting-coi` | `accounting-coi.routes.ts` | Contabilidad COI (cobranza nativa, pólizas, presupuestos) |
| `/contabilidad` | `contabilidad.routing.ts` | Dashboard principal contabilidad |

### Estructura Actual de Rutas

**1. `accounting.routing.ts`** - Rutas legacy y específicas:
- `budget` → Presupuesto Aspel
- `accounting-catalog` → Catálogo Contable
- `minutes-pendings` → Pendientes de Minutas
- `funding-list`, `funding-details/:id` → Fondeo Contabilidad
- `financial-report-sending` → Reporte Envío Financieros
- `financial-statements` → Estados Financieros
- `financial-summary` → Resumen Financiero
- `reporte-aspel` → Reportes Aspel
- `budget-proposal` → Presupuesto Propuesta

**2. `accounting-coi.routes.ts`** (en `cobranza-nativa/`) - 19 rutas:
- `accounts` → Catálogo de Cuentas COI
- `cobranza`, `cobranza/saldos`, `cobranza/movimientos`, `cobranza/polizas`, `cobranza/estado-cuenta`, `cobranza/cartera`, `cobranza/mapeo` → Cobranza Legacy
- `policies` → Pólizas COI
- `budgets` → Presupuestos COI
- `cobranza-nativa/*` → Cobranza Nativa (charge-templates, charges, payments, late-fee-policies, estado-cuenta, dashboard, demo)
- `financial-statements` → Estados Financieros
- `""` → Dashboard COI

**3. `contabilidad.routing.ts`** - Centralizador (en construcción):
- `""` → Master Dashboard

---

## 🔧 Servicios

| Servicio | Descripción | Estado |
|----------|-------------|--------|
| - | - | ⏳ Pendiente |

---

## 📦 Modelos

| Modelo | Descripción | Estado |
|--------|-------------|--------|
| - | - | ⏳ Pendiente |

---

## 🌐 Endpoints API

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| - | - | - |

---

## 📝 Historial de Cambios

### 2026-04-02

| Hora | Cambio | Responsable |
|------|--------|-------------|
| - | Creación del componente `MasterDashboardComponent` | Agente |
| - | Registro de ruta principal en `contabilidad.routing.ts` | Agente |
| - | Creación de documento de seguimiento `DESARROLLO.md` | Agente |
| - | Análisis de estructura de rutas: `pages.routing.ts`, `accounting.routing.ts`, `accounting-coi.routes.ts` | Agente |
| - | ✅ Centralización de rutas en `contabilidad.routing.ts` (31 rutas total) | Agente |
| - | ✅ Actualización de `pages.routing.ts` con redireccions legacy | Agente |
| - | ✅ Implementación de UI tipo dashboard con cards de módulos (5 grupos, 28 cards) | Agente |
| - | ✅ Refactorización: extracción de módulos a archivo independiente `contabilidad-modules.ts` | Agente |
| - | ✅ Creación de modelo tipado `contabilidad-module.model.ts` | Agente |

**Rutas centralizadas:**
- 13 rutas desde `accounting.routing.ts`
- 18 rutas desde `accounting-coi.routes.ts`
- Cada ruta incluye comentario con su ruta anterior

**Redireccions configuradas:**
- `/accounting` → `/contabilidad`
- `/accounting-coi` → `/contabilidad`

**Grupos de módulos implementados:**
1. **Contabilidad General** (4 cards): Catálogo Contable, Pólizas, Presupuestos, Estados Financieros
2. **Cobranza Legacy** (7 cards): Cobranza, Saldos, Movimientos, Pólizas, Estado de Cuenta, Cartera, Mapeo
3. **Cobranza Nativa** (7 cards): Dashboard, Plantillas, Cargos, Pagos, Políticas de Mora, Estado de Cuenta, Demo
4. **Presupuesto y Reportes** (6 cards): Presupuesto Aspel, Propuesta, Ejecución, Reportes, Resumen, Envío
5. **Minutas y Fondeos** (4 cards): Pendientes, PDF, Fondeos

---

## ✅ Tareas Completadas

- [x] Crear componente Master Dashboard
- [x] Analizar estructura de rutas existentes
- [x] Centralizar todas las rutas de contabilidad en `contabilidad.routing.ts`
- [x] Agregar comentarios con rutas anteriores en cada definición
- [x] Configurar redireccions para rutas legacy (`/accounting`, `/accounting-coi`)
- [x] Actualizar `pages.routing.ts` para usar solo `contabilidad.routing.ts`
- [x] Implementar UI de dashboard siguiendo patrón `hr-dashboard.html`
- [x] Crear 5 grupos de módulos con 28 cards en total
- [x] Agregar navegación por ruta en cada card
- [x] Extraer arreglo de módulos a archivo independiente (`contabilidad-modules.ts`)
- [x] Crear modelo tipado en `models/contabilidad-module.model.ts`

---

## 📌 Notas Pendientes

- [ ] Eliminar archivos de routing legacy (`accounting.routing.ts`, `accounting-coi.routes.ts`) después de validación
- [ ] Verificar que todas las rutas funcionen correctamente
- [ ] Actualizar referencias en navegación/sidebar
- [ ] Identificar entidades y relaciones de negocio
- [ ] Mapear endpoints del backend
- [ ] Definir permisos y roles de acceso

---

*Última actualización: 2026-04-02*
