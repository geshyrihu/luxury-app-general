# Modulo: Shared (Servicios Compartidos de Contabilidad)

> **Area funcional:** Contabilidad / Infraestructura Compartida
> **Tag de version:** `v1.0`
> **Owner tecnico:** `@equipo-contabilidad`
> **Ultima actualizacion:** `2026-06-25`

---

## Vision General

Modulo compartido de servicios contables reutilizables por todos los submodulos de Accounting. Proporciona (1) cliente HTTP para API Aspel COI con cache y retry, (2) formateo/normalizacion de numeros de cuenta, y (3) construccion del catalogo de cuentas en formato arbol y plano.

---

## Servicios

### AspelCoiApiClient (`IAspelCoiApiClient`)
Cliente HTTP para los 5 endpoints de Aspel COI API:

| Endpoint | Descripcion |
|----------|-------------|
| `GetCuentasAsync` | Catalogo de cuentas contables |
| `GetSaldosAsync` | Saldos por cuenta y periodo |
| `GetPresupuestosAsync` | Presupuestos anuales por cuenta |
| `GetPolizasAsync` | Polizas contables del periodo |
| `GetAuxiliaresAsync` | Auxiliares (movimientos detallados) |

**Caracteristicas:**
- Los 5 endpoints se llaman en paralelo via `Task.WhenAll`
- Cache en memoria con default de 30 minutos (llave: `aspel-coi:{empresa}:{anio}`)
- Retry logic con backoff exponencial para errores transitorios (5xx, 429, timeouts)
- Consolidacion de datos via GroupJoin entre polizas y auxiliares
- Soporte para invalidacion manual de cache

### AspelAccountFormatter
Utilidad estatica de normalizacion de numeros de cuenta Aspel:
- Cuentas >= 10 digitos: formato `XXX-YYY-ZZZ-WWW` (4 niveles)
- Cuentas <= 9 digitos: formato `XXX-YYY-ZZZ` (3 niveles)
- Rellena con ceros a la derecha si es necesario

### AccountCatalogService (`IAccountCatalogService`)
Construye el catalogo de cuentas Aspel en formato arbol (jerarquico hasta nivel 3) o plano.

| Metodo | Descripcion |
|--------|-------------|
| `GetAccountTreeAsync` | Catalogo en arbol agrupado por: ACTIVO (1), PASIVO (2), CAPITAL (3), INGRESOS (4), COSTOS (5), GASTOS (6) |
| `GetAccountFlatAsync` | Version plana con ParentCode |

Cada nodo incluye: Code, Name, Level, Naturaleza (D/A), SaldoInicial, AcumuladoAnual (cargos - abonos).

---

## Dependencias

- `IContabilidadOnlineLocalService` — Interfaz para obtener datos via la API de contabilidad en linea
