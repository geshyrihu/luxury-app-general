# Design Handoff — Tokens y Reglas de Negocio

Documento de transferencia para la Fase 2. Fuente de verdad de estilo y copy.
En conflicto diseño vs lógica: **la lógica/copy del código gana**; el diseño gana en estilo aplicado vía tokens de tema (nunca HEX hardcodeado en widgets).

---

## 1. Tokens de color (Light / Dark)

### Light — "Institutional Elegance"
| Token | Uso | HEX |
|-------|-----|-----|
| `primary` | Marca, appbar, CTAs | `#003152` |
| `ctaGold` | Acción dorada (hover `ctaGoldHover`) | `#D4A74A` / hover `#E8B233` |
| `surface` | Tarjetas | `#FFFFFF` |
| `background` | Fondo app | `#F8F9FC` |
| `border` | Bordes | `#E2E8F0` |
| `textPrimary` | Texto principal | `#0F172A` |
| `textSecondary` | Subtexto | `#64748B` |
| `success` | | `#157A55` |
| `warning` | | `#7A5E15` |
| `danger` | | `#A63939` |
| `info` | | `#245FA1` |

### Dark — "Nocturnal Institutional"
| Token | Uso | HEX |
|-------|-----|-----|
| `background` | Fondo app | `#000C14` |
| `surface` | Tarjetas | `#0D141C` |
| `elevated` | Superficies elevadas | `#1A2634` |
| `border` | Bordes | `#2B475A` |
| `textPrimary` | Texto principal | `#F8FAFC` |
| `textSecondary` | Subtexto | `#9AACBB` |
| `gold` | Acento dorado | `#D2A957` |
| `blue` | Acento azul | `#7CB6DC` |
| `success` | | `#36C993` |
| `danger` | | `#E59C9C` |

> Nota: el primary actual de Flutter es `0xFF0B3164` (diferente del `#003152` del diseño).
> La Fase 2 debe migrar a `#003152` y definir `ColorScheme` light/dark completos.

---

## 2. Tipografía

- **Font principal:** `Figtree` (añadir a `pubspec.yaml` + `fonts` en `pubspec.yaml` / `ThemeData.fontFamily`).
- **Montos financieros:** fuente **monospace** (`RobotoMono` o `ThemeData.textTheme` con `fontFamily: 'RobotoMono'`).
- Radios: **16px** cards · **12–14px** inputs/botones · **32px** top de bottom sheets.
- Sombras: suaves y azuladas (ej. `BoxShadow(color: primary.withOpacity(0.12), blur 10, offset 0,4)`).

---

## 3. Reglas de negocio (copy exacto)

### Auth móvil
- Títulos: **"Bienvenido de nuevo"** / **"Inicia sesión para continuar"**.
- Campos: **Usuario** / **Contraseña**; botón **"INICIAR SESIÓN"**; enlace **"¿Olvidaste tu contraseña?"**.
- **SIN "Recordarme"** (prohibido en móvil).
- Recovery: **2 pasos**; **countdown 120s**; **"Reenviar código"** habilitado solo cuando `countdown == 0`.
- Token de recovery por **navigation state**, **nunca en URL**.
- Reset: token/email faltante → **"Enlace inválido o expirado."**; nuevo password `RN-CRED-032` (8 chars, mayús, minús, número).

### Cobranza
- Hero: **"Cartera vencida"** + **"{X} de {Y} condóminos deben"**.
- **"Cobrado del mes"** + progreso + **"Meta del mes"**.
- **"En cobranza judicial"** + "acumulados".
- Severidades: `JUDICIAL`=danger, `MOROSOS`=warn, `CORRIENTE`=info.
- Modal de deuda: **UNA sola caja de criterio** con textos exactos de `ruleTitle`/`ruleDescription` (extraer de `committee-cobranza-detail-modal.ts` en Angular) + nota:
  *"Una cuota vencida es cada vez que la cuota vigente del condómino cabe completa dentro de su saldo. Cuota vigente: la del mes consultado."*
- Conceptos: `MTTO`/`MANTENIMIENTO`=info, `EXTRA`=warn, `RESERVA`=success, `PENA`/`MORATORIO`=danger.
- Saldos `>0` naranja, `<0` verde.
- MXN **sin decimales en cards**, **2 decimales en desglose**; montos en monospace.
- Vacíos: **"Sin propiedades con deuda."** / **"No hay información de cobranza."**
- Loading: **"Cargando desglose..."** · Error: **"No se pudo cargar el desglose."**

### Minutas
- 4 secciones: **Administración / Comité / Invitados Externos / Acuerdos y Asuntos Tratados** con contadores y **"No registrados"**.
- Acuerdos agrupados por `areaName`.
- Estados: `pendiente`=warning, `en progreso`/`proceso`/`doing`=primary, `concluido`/`completado`/`hecho`=success, `cancelado`/`no autorizado`=danger.
- **"Último seguimiento"** condicional.
- Error standalone: **"No se pudo cargar la información de la minuta."**

### Directorio
- Personal = sin `groupName`; Casetas = con `groupName`.
- `isOnShift` true → **"En turno"** (live), false → **"Fuera de turno"** (paused), null → sin indicador.
- WhatsApp: prefijo **52** si el número tiene 10 dígitos.
- Vacíos: **"No hay miembros disponibles"** / **"No hay casetas registradas"**.
- Horario: **"Sin horario registrado."**

### Biblioteca
- **"Concesión barranca"** solo `customerId=3`; **"Concesión pozo"** solo `customerId=4`.
- Detalle con `primaryDetail` + fecha opcional.
- Vacío: **"No se encontraron documentos"**.

### Póliza
- Campos: **Proveedor / Descripción / Fecha Inicio / Fecha Fin** (`dd/MM/yyyy`).
- Botón PDF solo si existe `pathDocument`.
- Vacío: **"No hay póliza disponible"**.

### Perfil
- Foto con cámara.
- Cambio de contraseña → **logout al éxito**.

### Listas documentales
- Subtítulo: **"Archivo .{ext}"**.

---

## 4. Endpoints (mismos paths que Angular / backend .NET)

- **Committee.BoardDirectors:** `monthlyMeetingsByCustomer(customerId)`, `meetingMinutesByCustomer(customerId)`, `meetingMinuteDetailById(id)`, `financialReportsByCustomer(customerId)`.
- **Committee.Library:** `policyContracts(customerId, true)`, `customDocumentsByType(customerId, type)`, `buildingInsurance(customerId)`.
- **Committee.Cobranza:** `morosos(customerId)`, `morosoDetalle(customerId, numCtaBase)`.
- **Committee.Directorio:** `byCustomer(customerId)`.
- **Users:** `updateImage(id)`, `changePassword(id)`.
- **Auth:** `recoverAccount.initiateByCode`, `recoverAccount.validateCode`, `confirmRecoverPassword`.

---

## 5. Prohibiciones absolutas (Fase 2)

- No inventar features: sin botones de pago, sin biometría, sin push (la app ya integra OneSignal; no añadir nuevas), sin "Contacto Siniestros", sin "Recordarme" en móvil, sin tags "Vigente"/"Activo".
- No modificar la app Angular ni el backend.
- No hardcodear HEX en widgets (usar tokens de tema).
- No cambiar el stack Flutter (Riverpod/Retrofit/go_router/get_it).
- No refactorizar masivamente sin preguntar.
