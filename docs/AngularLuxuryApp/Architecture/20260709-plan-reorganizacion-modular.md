📍 **Ruta:** 📂 `client/angular` > 📄 `PLAN-REORGANIZACION-MODULAR.md`

📅 **Última Revisión:** 09-Jul-2026
🛡️ **Estado:** En Progreso
👤 **Responsable:** Agente GEMINI & Usuario (Trabajo Conjunto)

---

# 🚀 Plan de Migración: Monolito Modular (Fases de Reorganización)

Este documento sirve como bitácora viva de nuestro progreso hacia la Arquitectura de Dominios Verticales (Modular Monolith). Se irá marcando con `[x]` conforme avancemos.

> [!TIP]
> **Metodología de Trabajo Conjunto (Acuerdo de Imports):**
> Para evitar cuelgues o timeouts del Agente al procesar miles de archivos, **el Agente** se encargará de mover/crear los directorios físicos (`mv`, `mkdir`), y **el Usuario** ejecutará los reemplazos masivos de imports de cadena en Visual Studio Code (Global Search & Replace) con las rutas que el Agente le proporcione tras cada fase.

---

## 🏗️ Fase 1: Infraestructura Core (Completado ✅)

El objetivo es consolidar la infraestructura puramente transversal.

### Tarea 1.1: `core/auth/`
- [x] Mover `core/guard/` → `core/auth/guards/`.
- [x] Mover `core/services/auth.service.ts` y derivados (ej. `token.service.ts`) → `core/auth/services/`.
- [x] (Usuario) Reemplazar imports masivamente.

### Tarea 1.2: `core/http/`
- [x] Mover interceptores (`jwt.interceptor`, `offline.interceptor`, etc.) de `core/services/` → `core/http/interceptors/`.
- [x] Mover manejadores de API globales a `core/http/services/`.
- [x] (Usuario) Reemplazar imports masivamente.

### Tarea 1.3: `core/layout/`
- [x] Mover `layout/` (top-level) → `core/layout/`.
- [x] Mover los archivos de top-level `login/` → `apps/auth.luxuryapp/` (esto pertenece al dominio Auth, preparatorio para la Fase 4).
- [x] (Usuario) Reemplazar imports masivamente.

---

## 🧩 Fase 2: Capa Compartida (Design System & Utils) (Completado ✅)

- [x] Mover `core/utils/` → `shared/utils/`.
- [x] Mover `core/pipes/` → `shared/pipes/`.
- [x] Fusionar `shared/components/` → `shared/ui/`.
- [x] (Usuario) Reemplazar imports masivamente.

---

## 🏗️ Fase 3: Scaffold de Portales `apps/` (Completado ✅)

- [x] Crear carpetas base para los 15 portales dentro de `apps/` (`admin.luxuryapp/`, `operations.luxuryapp/`, etc.).
- [x] Crear la estructura interna vacía (`pages/`, `components/`, `services/`, `models/`, `INDEX.ts`, `{portal}.routes.ts`) en cada portal.

---

## 🚛 Fase 4: Migración de Dominios `features/` → `apps/` (Completado ✅)

- [x] Migrar System → `apps/admin.luxuryapp/` (y separar dominio user-facing `system`).
- [x] Migrar RRHH → `apps/recursos-humanos.luxuryapp/`.
- [x] Migrar Contabilidad → `apps/contabilidad.luxuryapp/`.
- [x] Migrar Mantenimiento → `apps/mantenimiento.luxuryapp/`.
- [x] Migrar Operaciones y Dirección → `apps/operations.luxuryapp/` y `apps/direccion.luxuryapp/`.
- [x] Migrar Web → `apps/web.luxuryapp/`.
- [x] Migrar Dominios Adicionales (Legal, Reclutamiento, Compras) → `apps/legal.luxuryapp/`, `apps/reclutamiento.luxuryapp/`, `apps/supplier.luxuryapp/`.
- [x] (Agente/Usuario) Reemplazar masivamente imports y actualizar el `app.routes.ts` (Lazy Loading).

---

## ✨ Fase 5: Limpieza y Enforcement (Pendiente 📋)

- [ ] Eliminar la carpeta `features/` por completo.
- [ ] Agregar reglas de Lint (Boundary Enforcement) para prohibir importaciones cruzadas entre `apps/`.
- [ ] Validar que `ng build` inicial se haya reducido drásticamente.
