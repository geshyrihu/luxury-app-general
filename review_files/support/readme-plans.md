# Planes del Proyecto

> **Estado de autoridad:** documento historico de apoyo controlado.
> La autoridad vigente para creacion de planes vive en `CONVENTIONS.md`,
> `./operations/plan-creation-protocol.md` y
> `./operations/plan-agent-instructions.md`.
> Este archivo no debe usarse como fuente primaria para crear nuevas reglas.

**Proposito:** Centralizar planes tecnicos de implementacion, migraciones y
refactores.

**Fuente operacional para agentes de IA:** [plan-agent-instructions.md](./operations/plan-agent-instructions.md)

---

## Para Crear un Plan

**Agentes de IA (Claude, Codex, Cursor, etc.):**

1. Lee: [plan-creation-protocol.md](./operations/plan-creation-protocol.md)
2. Complementa con: [plan-agent-instructions.md](./operations/plan-agent-instructions.md)
3. Sigue estructura oficial y orden de lectura vigentes
4. Guarda en: `YYYYMMDD-{tema-en-kebab-case}-plan.md`

---

## Planes Activos

### Completados

- **[Paginacion (20260724)](./20260724-estandarizacion-paginacion-plan.md)** - Contrato canonico `PaginationCommonDTO` + `PaginationStore` signals
- **[Control de Accesos (20260713)](./20260713-control-accesos-plan.md)** - Modulo AccessControl: QR, visitas, seguridad (Fases 1-5)

### En Curso

- **[Migracion PostgreSQL (20260714)](./20260714-migracion-postgres-plan.md)** - SQL Server -> PostgreSQL (Fases 0-N)
- **[Normalizacion Endpoints (20260714)](./20260714-endpoints-architecture-normalization-plan.md)** - Endpoints a Minimal APIs
- **[Design System Refactor (20260726)](./20260726-design-system-refactor-plan.md)** - Consolidacion UI components

### Otros Planes

- [Frontend Vista Movil (20260705)](./20260705-frontend-vista-movil-formularios-plan.md)
- [Relocation (20260712)](./20260712-relocation-plan.md)
- [Refactor SelectItem (20260712)](./20260712-refactor-select-item-plan.md)
- [Operations Panic Alert (20260710)](./20260710-operations-panic-alert-plan.md)
- [Reserva Amenidades (20260712)](./20260712-reserva-amenidades-plan.md)
- [Nx Monorepo Migration (20260712)](./20260712-nx-monorepo-migration-plan.md)
- [Arquitectura Nx (20260708)](./20260708-arquitectura-nx-monorepo-estado-plan.md)
- [Application Users Separation (20260713)](./20260713-application-users-separation-plan.md)
- [Select Items Normalization (20260715)](./20260715-select-items-normalization-plan.md)
- [Catalogo UI Showcase (20260715)](./20260715-catalogo-ui-showcase-unificado-plan.md)
- [Cobranza Normalization (20260714)](./20260714-cobranza-architecture-normalization-plan.md)
- [Accounting COI Normalization (20260715)](./20260715-accounting-coi-normalization-plan.md)
- [Customer Locations (20260725)](./20260725-customer-locations-plan.md)

---

## Referencias

- **[plan-creation-protocol.md](./operations/plan-creation-protocol.md)** - Protocolo rector vigente
- **[plan-agent-instructions.md](./operations/plan-agent-instructions.md)** - Guia operativa de apoyo
- **[CONVENTIONS.md](CONVENTIONS.md)** - Fuente rectora del proyecto
- **[docs/README.md](../README.md)** - Documentacion general del proyecto

---

## Estadisticas (2026-07-26)

| Metrica | Valor |
|---|---|
| Planes totales | 19 |
| Completados | 2 |
| En curso | 3+ |
| Esfuerzo consolidado | ~200+ SP |

---

**Ultima actualizacion:** 2026-07-26  
**Mantenido por:** Tech Team
