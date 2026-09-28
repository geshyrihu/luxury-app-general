# Reporte Visual De Módulos Front Vs API

Fecha de corte: 2026-07-25
Repositorio: `D:\repos\luxuryapp-api`

## Objetivo

Tener en un solo lugar una vista clara de:

- qué módulos existen en frontend
- qué módulos existen en backend
- en qué carpeta vive cada uno
- si están alineados 1 a 1
- cuáles son portales solo frontend
- cuáles son módulos transversales solo backend

---

## Leyenda

| Estado | Significado |
|---|---|
| `SI` | Existe espejo entre front y api |
| `SOLO FRONT` | Existe solo como app/portal frontend |
| `SOLO API` | Existe solo como módulo backend |

| Tipo | Significado |
|---|---|
| `Modulo espejo` | Existe en front y backend como dominio equivalente |
| `Portal frontend` | App de experiencia/UI que consume varios módulos backend |
| `Transversal backend` | Soporte común backend, sin app propia espejo |

---

## Tabla Maestra

| Dominio Canonico | Front Existe | Ruta Front | Modulo Front | API Existe | Ruta API | Modulo API | Espejo Front/API | Tipo | Dictamen |
|---|---|---|---|---|---|---|---|---|---|
| `admin` | `SI` | `client/angular/src/app/apps/admin.luxuryapp` | `admin.luxuryapp` | `SI` | `api/LuxuryApp.Application/Moduls/AdminLuxuryApp` | `AdminLuxuryApp` | `SI` | `Modulo espejo` | `Alineado` |
| `auth` | `SI` | `client/angular/src/app/apps/auth.luxuryapp` | `auth.luxuryapp` | `SI` | `api/LuxuryApp.Application/Moduls/AuthLuxuryApp` | `AuthLuxuryApp` | `SI` | `Modulo espejo` | `Alineado` |
| `cobranza` | `SI` | `client/angular/src/app/apps/cobranza.luxuryapp` | `cobranza.luxuryapp` | `SI` | `api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp` | `CobranzaLuxuryApp` | `SI` | `Modulo espejo` | `Alineado` |
| `committee` | `SI` | `client/angular/src/app/apps/committee.luxuryapp` | `committee.luxuryapp` | `SI` | `api/LuxuryApp.Application/Moduls/CommitteeLuxuryApp` | `CommitteeLuxuryApp` | `SI` | `Modulo espejo` | `Alineado` |
| `contabilidad` | `SI` | `client/angular/src/app/apps/contabilidad.luxuryapp` | `contabilidad.luxuryapp` | `SI` | `api/LuxuryApp.Application/Moduls/ContabilidadLuxuryApp` | `ContabilidadLuxuryApp` | `SI` | `Modulo espejo` | `Alineado` |
| `direccion` | `SI` | `client/angular/src/app/apps/direccion.luxuryapp` | `direccion.luxuryapp` | `SI` | `api/LuxuryApp.Application/Moduls/DireccionLuxuryApp` | `DireccionLuxuryApp` | `SI` | `Modulo espejo` | `Alineado` |
| `legal` | `SI` | `client/angular/src/app/apps/legal.luxuryapp` | `legal.luxuryapp` | `SI` | `api/LuxuryApp.Application/Moduls/LegalLuxuryApp` | `LegalLuxuryApp` | `SI` | `Modulo espejo` | `Alineado` |
| `mantenimiento` | `SI` | `client/angular/src/app/apps/mantenimiento.luxuryapp` | `mantenimiento.luxuryapp` | `SI` | `api/LuxuryApp.Application/Moduls/MantenimientoLuxuryApp` | `MantenimientoLuxuryApp` | `SI` | `Modulo espejo` | `Alineado` |
| `operations` | `SI` | `client/angular/src/app/apps/operations.luxuryapp` | `operations.luxuryapp` | `SI` | `api/LuxuryApp.Application/Moduls/OperationsLuxuryApp` | `OperationsLuxuryApp` | `SI` | `Modulo espejo` | `Alineado` |
| `reclutamiento` | `SI` | `client/angular/src/app/apps/reclutamiento.luxuryapp` | `reclutamiento.luxuryapp` | `SI` | `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp` | `ReclutamientoLuxuryApp` | `SI` | `Modulo espejo` | `Alineado` |
| `recursos-humanos` | `SI` | `client/angular/src/app/apps/recursos-humanos.luxuryapp` | `recursos-humanos.luxuryapp` | `SI` | `api/LuxuryApp.Application/Moduls/RecursosHumanosLuxuryApp` | `RecursosHumanosLuxuryApp` | `SI` | `Modulo espejo` | `Alineado` |
| `supplier` | `SI` | `client/angular/src/app/apps/supplier.luxuryapp` | `supplier.luxuryapp` | `SI` | `api/LuxuryApp.Application/Moduls/SupplierLuxuryApp` | `SupplierLuxuryApp` | `SI` | `Modulo espejo` | `Alineado` |
| `system` | `SI` | `client/angular/src/app/apps/system.luxuryapp` | `system.luxuryapp` | `SI` | `api/LuxuryApp.Application/Moduls/SystemLuxuryApp` | `SystemLuxuryApp` | `SI` | `Modulo espejo` | `Alineado` |
| `public` | `SI` | `client/angular/src/app/apps/public.luxuryapp` | `public.luxuryapp` | `NO` | `--` | `--` | `SOLO FRONT` | `Portal frontend` | `No requiere modulo API espejo directo` |
| `resident` | `SI` | `client/angular/src/app/apps/resident.luxuryapp` | `resident.luxuryapp` | `NO` | `--` | `--` | `SOLO FRONT` | `Portal frontend` | `Consume dominios backend cruzados` |
| `security` | `SI` | `client/angular/src/app/apps/security.luxuryapp` | `security.luxuryapp` | `NO` | `--` | `--` | `SOLO FRONT` | `Portal frontend` | `Consume dominios backend cruzados` |
| `web` | `SI` | `client/angular/src/app/apps/web.luxuryapp` | `web.luxuryapp` | `NO` | `--` | `--` | `SOLO FRONT` | `Portal frontend` | `Portal web sin espejo backend dedicado` |
| `shared` | `NO` | `--` | `--` | `SI` | `api/LuxuryApp.Application/Moduls/SharedLuxuryApp` | `SharedLuxuryApp` | `SOLO API` | `Transversal backend` | `Soporte comun backend` |

---

## Vista Compacta De Alineación

| Dominio | Front | API | Resultado |
|---|---|---|---|
| `admin` | `SI` | `SI` | `OK` |
| `auth` | `SI` | `SI` | `OK` |
| `cobranza` | `SI` | `SI` | `OK` |
| `committee` | `SI` | `SI` | `OK` |
| `contabilidad` | `SI` | `SI` | `OK` |
| `direccion` | `SI` | `SI` | `OK` |
| `legal` | `SI` | `SI` | `OK` |
| `mantenimiento` | `SI` | `SI` | `OK` |
| `operations` | `SI` | `SI` | `OK` |
| `reclutamiento` | `SI` | `SI` | `OK` |
| `recursos-humanos` | `SI` | `SI` | `OK` |
| `supplier` | `SI` | `SI` | `OK` |
| `system` | `SI` | `SI` | `OK` |
| `public` | `SI` | `NO` | `SOLO FRONT` |
| `resident` | `SI` | `NO` | `SOLO FRONT` |
| `security` | `SI` | `NO` | `SOLO FRONT` |
| `web` | `SI` | `NO` | `SOLO FRONT` |
| `shared` | `NO` | `SI` | `SOLO API` |

---

## Resumen Ejecutivo

### Módulos espejo bien definidos

Los siguientes dominios hoy sí tienen estructura espejo clara entre frontend y backend:

- `admin`
- `auth`
- `cobranza`
- `committee`
- `contabilidad`
- `direccion`
- `legal`
- `mantenimiento`
- `operations`
- `reclutamiento`
- `recursos-humanos`
- `supplier`
- `system`

### Portales solo frontend

Estos no deben leerse necesariamente como error arquitectónico; varios son portales/UI que consumen múltiples dominios backend:

- `public`
- `resident`
- `security`
- `web`

### Módulo solo backend

- `shared`

Este es transversal y por naturaleza no necesita una app espejo en `client/angular/src/app/apps`.

---

## Ubicaciones Base

### Frontend

- `D:\repos\luxuryapp-api\client\angular\src\app\apps`

### Backend

- `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Moduls`

---

## Dictamen Final

La estructura física actual sí muestra una base modular bastante ordenada.

El núcleo del sistema está alineado en espejo para los dominios principales, y las diferencias detectadas parecen responder más a naturaleza arquitectónica que a desorden:

- `resident`, `security`, `public`, `web` funcionan más como portales frontend
- `SharedLuxuryApp` funciona más como módulo transversal backend

La tabla maestra de este archivo ya puede usarse como base para:

- auditoría de organización física
- planeación de refactor por módulo
- revisión de brechas front/api
- definición de qué módulos todavía requieren decisión arquitectónica

---

**Archivado en:** `docs/reporte_maestro/analisis/` (2026-07-26)
