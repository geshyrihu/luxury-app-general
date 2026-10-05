# Auditoría Ejecutada — Descarga Masiva de CFDI del SAT

**Doc #7 de §4.7.** Sigue el framework de `conventions/audit/audit-prompt-comprehensive.md` (6 categorías de errores de lógica).
**Fecha:** 2026-10-05. **Alcance:** módulo completo, construido el 2026-10-04.

## 1. Matriz de Reglas de Negocio (4 niveles)

Ver tabla completa de las 13 reglas en [FASE 0](./20261004-business-rules-accounting-cfdi-download.md) §0.2 — no se duplica aquí. Resumen por nivel: 4 Invariantes (RN-CFD-001/002/003/004), 3 Flujo/Estados (010/011/012), 3 Seguridad (020/021/022), 3 Validación (030/031/032/033).

## 2. Matriz de permisos (Endpoint × Rol × Autorización)

| Endpoint | SuperUsuario | Direccion | Administrador | Contador | GerOp | GerAt | Asist | GerMtto | SupOp | Resto (34) |
|---|---|---|---|---|---|---|---|---|---|---|
| GET credential | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| POST credential | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| POST requests | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| GET requests/status | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| GET cfdi (list/pdf/excel) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| POST efos/import | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |

Verificado contra el código real (`[Authorize(Roles=...)]` de cada `*Endpoints.cs`), no inferido. `Direccion` entra en credential/efos por D17 (el Vault ya lo exige, no es una ampliación propia).

## 3. Diagrama de flujo principal (ASCII)

```
┌─────────────┐   ┌──────────────────┐   ┌───────────────────┐   ┌──────────────┐
│ Cargar      │──►│ Solicitar        │──►│ Verificar/Descargar│──►│ Consultar/   │
│ e.firma     │   │ descarga         │   │ (repetible)        │   │ Exportar     │
│(SU/Direcc.) │   │ (8 roles)        │   │ (8 roles)          │   │ (8 roles)    │
└─────────────┘   └──────────────────┘   └───────────────────┘   └──────────────┘
                                                   │
                                         ┌─────────┴─────────┐
                                         │ EnProceso: repetir│
                                         │ Fallida: terminal │
                                         │ Descargada:       │
                                         │  reconcilia CFDI  │
                                         │  + cruce EFOS     │
                                         └────────────────────┘
```

## 4. Validaciones Front vs Back

| Campo | Frontend | Backend | ¿Consistente? |
|---|---|---|---|
| `.cer`/`.key` tipo de archivo | `accept=".cer"`/`.key"` (solo UI hint, no bloquea) | Valida por **contenido** (`Certificate`/`PrivateKey` constructors fallan si no es válido) | ✅ Backend es la fuente de verdad real, correcto por diseño |
| Password requerida | `Validators.required` | `string.IsNullOrWhiteSpace` | ✅ |
| `FechaInicio < FechaFin` | **No validado** en `requestForm` (solo `required` en cada campo) | ✅ Validado explícitamente | ⚠️ **Inconsistente — ver hallazgo F1 abajo** |
| Tamaño máximo de archivo (.cer/.key) | No limitado | No limitado | ⚠️ Ninguno de los 2 limita — ver hallazgo F2 |
| RFC del certificado = `Customer.RFC` | No se valida en frontend (no es posible sin leer el .cer en el navegador) | ✅ Validado | Aceptable — requiere parseo binario, correcto que solo backend lo haga |

## 5. Errores de lógica (6 categorías) — hallazgos reales

### 5.1 Estados Imposibles
Sin hallazgos. `SatCfdiRecibido.SatDownloadPackageId` es `[Required]` (no puede existir huérfano); `EfosEstado` es un enum tipado (no acepta valores fuera de catálogo); no hay transición de estado que salte el flujo Creada→...→Descargada/Fallida.

### 5.2 Validaciones Inconsistentes
**Hallazgo F1 (Medio):** el frontend no valida `FechaInicio < FechaFin` antes de enviar — el usuario solo se entera por un toast de error después del POST. El backend sí lo rechaza correctamente (ningún dato corrupto llega a persistirse), es un problema de UX, no de integridad.

**Hallazgo F2 (Bajo):** ni frontend ni backend limitan el tamaño máximo de `.cer`/`.key`. Riesgo bajo (archivos reales de e.firma son de pocos KB), pero nada impide subir un archivo arbitrariamente grande hasta el límite general de request del servidor.

### 5.3 Datos Huérfanos
Sin endpoints DELETE en todo el módulo — no hay vector de huérfanos vía la API. No se configuró explícitamente comportamiento `ON DELETE` a nivel EF Core para las FKs del módulo (se deja el default de EF Core); como no hay operación de borrado expuesta, el riesgo práctico es nulo hoy, pero queda sin definir para si se agrega borrado en el futuro.

### 5.4 Estados Finales
`Descargada`/`Fallida` son tratados como terminales en `CheckStatusAsync` (corta antes de re-autenticar). No hay forma de revertir una solicitud `Fallida` — el usuario debe crear una nueva. Correcto, sin hallazgos.

### 5.5 Permisos
Sin hallazgos nuevos — ya cubierto exhaustivamente en F7 (el hallazgo real de esa fase, `CheckStatusAsync` sin filtro de tenant, ya está corregido y probado). Frontend y backend coinciden en los 8 roles / SuperUsuario+Direccion.

### 5.6 Datos Duplicados
**Hallazgo F3 (Bajo):** si dos solicitudes de carga de e.firma para el **mismo customer** llegan simultáneamente (ambas ven "no existe credencial"), la segunda falla con un mensaje genérico ("No se pudo guardar la e.firma de forma segura") en vez de un mensaje específico de condición de carrera. No hay corrupción de datos (el índice único de BD y el propio `StoreSecretAsync` del Vault lo impiden), solo un mensaje de error menos claro de lo ideal para ese caso específico.

## 6. Hallazgos por severidad

| Severidad | # | Hallazgo | Estado |
|---|---|---|---|
| Crítico | — | (El hallazgo crítico real del módulo, R7/fuga entre tenants, se encontró y cerró durante F7 — no queda abierto) | Cerrado |
| Medio | F1 | Frontend no valida `FechaInicio < FechaFin` antes de enviar | Abierto |
| Bajo | F2 | Sin límite de tamaño de archivo en carga de e.firma | Abierto |
| Bajo | F3 | Mensaje genérico en condición de carrera al cargar e.firma concurrentemente | Abierto |

## 7. Checklist de validación

- [x] Entidades auditadas (6/6)
- [x] Enums auditados (3/3)
- [x] DTOs backend vs interfaces frontend (coinciden campo a campo — verificado al escribir `SatCfdiRecibidoDTO`/`SatCfdiRecibidoDto`)
- [x] Matriz de permisos verificada contra código real (no inferida)
- [x] 6 categorías de errores de lógica revisadas explícitamente
- [x] Aislamiento multi-tenant probado (F7)

## 8. Plan de remediación priorizado

| # | Acción | Prioridad | Esfuerzo |
|---|---|---|---|
| 1 | Agregar validador cross-field en `requestForm` (Angular `Validators`) para `FechaInicio < FechaFin` | Media | Bajo (15 min) |
| 2 | Agregar límite de tamaño de archivo en `credential-form.ts` (`input.files[0].size`) y/o en el DTO backend | Baja | Bajo (15 min) |
| 3 | Mejorar mensaje de error de condición de carrera en `CustomerSatCredentialAppService.UploadAsync` | Baja | Bajo (15 min) |
| 4 | Ejecutar el happy path real con e.firma de sandbox/usuarios de los 8 roles (pendiente desde F2/F6) | Alta (cuando haya credenciales disponibles) | Medio |
| 5 | Decisión del Tech Lead sobre política de retención de CFDI (R5) | Media | N/A (decisión, no código) |

Ninguno de estos 3 hallazgos de código (F1-F3) es bloqueante para que el módulo opere correctamente; son mejoras de robustez/UX, no defectos de integridad de datos.
