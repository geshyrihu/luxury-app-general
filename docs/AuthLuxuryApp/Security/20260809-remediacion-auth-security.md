# Plan de Remediacion - AuthLuxuryApp

**Fecha:** 2026-08-09
**Estado:** Propuesto para revision
**Modulo:** `AuthLuxuryApp`
**Responsable de aprobacion:** Tech Lead
**Auditoria origen:** Auditoria interna sobre `AuthLuxuryApp` realizada el 2026-08-08
**Backend:** [api/LuxuryApp.Application/Moduls/AuthLuxuryApp](D:/repos/luxuryapp-api/api/LuxuryApp.Application/Moduls/AuthLuxuryApp)
**Frontend:** [client/luxuryapp/projects/luxury-app/src/app/apps/auth.luxuryapp](D:/repos/luxuryapp-api/client/luxuryapp/projects/luxury-app/src/app/apps/auth.luxuryapp)

---

## Fase 0. Pre-planeacion

### 0.1 Problem Statement + KPIs

Actualmente, usuarios y administradores sufren de brechas de seguridad,
incumplimientos de convenciones y drift contractual en `AuthLuxuryApp` cuando
intentan autenticarse, recuperar acceso o autogestionar su perfil, lo que
resulta en riesgo de exposicion de credenciales, posibilidad de operaciones
sobre cuentas ajenas y deuda tecnica que complica el mantenimiento del modulo.

Esto afecta al flujo transversal de acceso del sistema y a todos los usuarios
que dependen de login, refresh token, recuperacion de password y autoservicio
de perfil.

| KPI | Baseline | Target | Timeline | Verificacion |
|---|---|---|---|---|
| Endpoints de autoservicio vulnerables a IDOR | Existen | 0 | Fase 1 | revision de codigo + prueba negativa |
| Passwords guardadas en cliente | Existen en web | 0 | Fase 1 | inspeccion de `localStorage` en QA |
| Reglas RN de auth desalineadas con codigo | Existen | 0 criticas | Fase 1 | trazabilidad doc vs codigo |
| DTOs que incumplen `1 archivo = 1 DTO` | Existen | 0 | Fase 2 | revision de carpeta DTOs |
| Endpoints hardcodeados en feature frontend | Existen | 0 | Fase 2 | grep local + smoke review |
| Hardcodes visuales y overrides no alineados con tokens | Existen | 0 nuevos y remediacion del inventario critico | Fase 3 | audit CSS/tokens del modulo |
| Flujos criticos sin cobertura minima | Cobertura parcial | cobertura de escenarios criticos | Fase 4 | specs y pruebas del modulo |

### 0.2 Matriz de Reglas de Negocio del Modulo

**Nivel 1. Invariantes**

- `RN-AUTH-001`: Ningun usuario puede operar password o foto de perfil de otra
  cuenta mediante autoservicio.
- `RN-AUTH-002`: Las credenciales del usuario no se almacenan en texto plano en
  cliente bajo ninguna modalidad de recordatorio.
- `RN-AUTH-003`: El modulo debe respetar contratos de autenticacion y
  convenciones rectoras sin introducir drift entre backend, frontend y
  documentacion.

**Nivel 2. Flujo y estados**

- `RN-AUTH-010`: Login exitoso genera access token, refresh token y estado de
  sesion coherente con la politica `rememberMe`.
- `RN-AUTH-011`: Refresh token invalido o expirado obliga limpieza de sesion y
  redireccion a login.
- `RN-AUTH-012`: Recuperacion de password siempre responde mensaje generico y
  restablecimiento usa token valido, vigente y no reutilizable.
- `RN-AUTH-013`: La remediacion del modulo se ejecuta por fases y no mezcla
  fixes criticos con refactors no auditados.

**Nivel 3. Seguridad y autorizacion**

- `RN-AUTH-020`: Cualquier usuario autenticado puede autenticarse, pero los
  flujos de autoservicio solo pueden afectar su propia cuenta salvo aprobacion
  explicita de un flujo administrativo separado.
- `RN-AUTH-021`: Roles del sistema se obtienen exclusivamente del catalogo
  oficial y no por strings inventados.
- `RN-AUTH-022`: Login, logout, refresh, recover y confirm deben dejar
  trazabilidad coherente con `UserActivity` y mensajes de error controlados.

**Nivel 4. Validacion de datos**

- `RN-AUTH-030`: `rememberMe=true` y `rememberMe=false` deben producir politicas
  de expiracion distinguibles y verificables.
- `RN-AUTH-031`: Los DTOs de recuperacion deben mantener contratos tipados
  explicitos y estructura conforme a convenciones.
- `RN-AUTH-032`: Formularios frontend de auth deben usar rutas oficiales, tipos
  consistentes y validaciones reactivas auditables.

### 0.3 Riesgos, Pre-Mortem y Flujos

| Riesgo | Impacto | Probabilidad | Mitigacion |
|---|---|---|---|
| Corregir seguridad en perfil rompe consumidores actuales | Alto | Media | aislar autoservicio del flujo admin y validar callers |
| Ajustar refresh token cambia sesiones activas | Alto | Media | aplicar cambio con pruebas de login, refresh y logout |
| Remover almacenamiento local de password afecta UX esperada | Media | Alta | conservar solo username y comunicar cambio |
| Limpiar DTOs/archivos residuales rompe referencias ocultas | Media | Media | buscar referencias antes de dividir o eliminar |
| Corregir CSS mobile genera regresiones visuales | Media | Media | hacer remediacion por inventario y smoke visual |

**Happy path**

1. Usuario inicia sesion con `rememberMe` definido.
2. Backend valida credenciales, roles y estado activo.
3. Sistema emite JWT + refresh token con expiracion correcta.
4. Frontend guarda solo datos de sesion permitidos.
5. Usuario puede actualizar su propio perfil sin tocar cuentas ajenas.

**Sad path**

1. Usuario intenta refresh con cookie expirada o ausente.
2. Sistema responde con fallo controlado.
3. Cliente limpia sesion y redirige a login.

**Edge path**

1. Usuario autenticado manipula manualmente un `applicationUserId` ajeno en URL
   de cambio de password o foto.
2. Backend debe rechazar la operacion.
3. No se modifica ningun dato de la cuenta objetivo.

---

## 1. Resumen Ejecutivo

Se propone una remediacion por fases para `AuthLuxuryApp`, enfocada primero en
seguridad critica y coherencia de autenticacion, luego en cumplimiento de
convenciones backend/frontend, despues en higiene visual/estructural del
frontend ubicado en `client/luxuryapp/projects/luxury-app/src/app/apps/auth.luxuryapp`,
y finalmente en cobertura de pruebas.

El plan evita expandir el alcance a otros modulos y no autoriza tocar `shared`
ni contratos transversales sin analisis adicional. Su objetivo es dejar el
modulo apto para remediacion controlada y aprobable, no rehacer la arquitectura
completa en una sola iteracion.

---

## 2. Scope y Restricciones

**Incluye**

- seguridad de autoservicio en `ProfileUsers`
- politicas de login, refresh token y `rememberMe`
- recuperacion y confirmacion de password
- limpieza de incumplimientos DTO/estructura dentro de `AuthLuxuryApp`
- frontend de auth en la ruta confirmada por el usuario
- alineacion de endpoints, forms y estilos criticos del modulo
- cobertura minima de pruebas de flujos auth
- actualizacion documental local del modulo si se toca comportamiento

**No incluye**

- rediseño completo del sistema de auth global
- migracion general del `AuthService` de toda la app fuera del alcance del
  modulo de auth
- cambios a otros dominios que consumen roles o token si no son requeridos para
  la remediacion
- nuevas reglas de negocio fuera de las ya detectadas

**Restricciones**

- no tocar shared sin aprobacion
- no romper contratos sensibles sin plan de migracion
- no reubicar codigo existente por iniciativa propia
- no ejecutar la remediacion hasta aprobacion del plan
- mantener el frontend auditado acotado a
  `client/luxuryapp/projects/luxury-app/src/app/apps/auth.luxuryapp`

---

## 3. Arquitectura y Diseno Tecnico

### 3.1 Principios de remediacion

1. seguridad y contratos primero
2. cambios acotados al modulo
3. trazabilidad uno a uno entre hallazgo y tarea
4. no aprovechar para refactors amplios no aprobados

### 3.2 Capas objetivo

**Backend**

- endurecer `ProfileUsers` para autoservicio seguro
- alinear `AuthAppService` con RN documentadas
- normalizar DTOs y archivos residuales del modulo

**Frontend**

- eliminar persistencia insegura de credenciales
- centralizar consumo de endpoints auth en catalogo oficial
- mejorar typing, forms y estados en piezas de perfil/auth
- remediar inventario visual critico sin salir del modulo auth

**Documentacion**

- alinear `AUTH-FLUJO-COMPLETO.md` con comportamiento real o viceversa
- dejar claras las decisiones sobre `rememberMe`, lockout y autoservicio

### 3.3 Decisiones sensibles a validar durante ejecucion

| Tema | Decision propuesta |
|---|---|
| `applicationUserId` en autoservicio | tomar usuario autenticado como fuente de verdad o validar coincidencia estricta |
| `rememberMe` | implementar politica diferenciada real en refresh token/cookie |
| `savedPassword` | eliminar por completo; solo conservar `savedUsername` si negocio lo pide |
| DTOs multiples por archivo | separar en archivos individuales |
| hardcodes frontend | migrar a `Endpoints.Auth` y catalogos oficiales |

---

## 4. Backlog de Tasks

- [ ] blindar `change-password` para impedir autoservicio sobre cuentas ajenas
- [ ] blindar `update-image` para impedir autoservicio sobre cuentas ajenas
- [ ] decidir si el `applicationUserId` de ruta se elimina o se valida
- [ ] remover `savedPassword` de `localStorage`
- [ ] mantener solo `savedUsername` si sigue aprobado
- [ ] implementar expiracion diferenciada de refresh token basada en
  `RememberMe`
- [ ] manejar explicitamente `LockedOut` y estados equivalentes
- [ ] validar coherencia de `RecoverPassword` y `ConfirmRecoverPassword`
- [ ] separar `RecoverPasswordDTO` y `ConfirmRecoverPasswordDTO`
- [ ] separar `CredentialDTOs.cs` si contiene mas de un DTO del modulo
- [ ] limpiar archivos residuales `sed*` dentro de `AuthLuxuryApp`
- [ ] migrar endpoints hardcodeados en frontend al catalogo oficial
- [ ] revisar `UntypedFormGroup`, `any` y accesos inseguros en perfil
- [ ] inventariar y remediar hardcodes visuales/token drift del auth frontend
- [ ] ampliar pruebas backend de login, refresh, logout y autoservicio
- [ ] ampliar pruebas frontend de login, recovery, reset y profile
- [ ] actualizar documentacion tecnica del modulo si cambia el comportamiento

---

## 5. Fases de Ejecucion

### Fase 1. Seguridad critica y reglas de autenticacion

- corregir IDOR/autoservicio en cambio de password
- corregir IDOR/autoservicio en actualizacion de foto
- eliminar almacenamiento de password en cliente
- implementar `rememberMe` real
- manejar `LockedOut` y estados criticos documentados

**Criterio de paso**

- un usuario autenticado no puede afectar cuentas ajenas
- no existe password persistida en cliente
- `rememberMe=true/false` produce comportamiento verificable y documentado
- login/refresh/logout siguen funcionando con respuesta controlada

### Fase 2. Contratos, DTOs y estructura backend

- separar DTOs que incumplen `1 archivo = 1 DTO`
- revisar `CredentialDTOs.cs` y `RecoverPasswordDTO.cs`
- limpiar archivos residuales `sed*`
- confirmar que el modulo no deja drift entre doc y codigo

**Criterio de paso**

- no hay DTOs multiples por archivo dentro del alcance
- no quedan residuos estructurales no justificados
- documentacion y contratos del modulo quedan coherentes

### Fase 3. Alineacion frontend auth

- migrar strings inline de endpoints a `Endpoints.Auth`
- revisar forms y typing de perfil/auth dentro del frontend autorizado
- remediar hardcodes visuales, `::ng-deep` critico y overrides mas riesgosos
- mantener uso del catalogo `@ui/*` conforme a convenciones

**Criterio de paso**

- no quedan endpoints hardcodeados en la feature auth
- formularios criticos de auth/perfil quedan mas tipados y auditables
- el inventario visual critico del modulo queda alineado a tokens o documentado

### Fase 4. Testing, cierre y validacion

- agregar o ampliar pruebas backend de escenarios criticos
- agregar o ampliar pruebas frontend de login, recovery, reset y profile
- ejecutar validaciones locales del modulo
- actualizar estatus final del plan y decision de cierre

**Criterio de paso**

- existe cobertura minima de escenarios happy, sad y edge del modulo
- los hallazgos criticos y altos del alcance quedan cerrados o justificados
- el modulo queda listo para nueva auditoria de confirmacion

---

## 6. Checklist por Fase

### Fase 1

- [ ] `UsersEndpoints` ya no acepta escalacion horizontal por ID
- [ ] `UserProfileAppService` usa usuario autenticado o validacion equivalente
- [ ] `login.ts` ya no guarda password
- [ ] politica `rememberMe` implementada y documentada
- [ ] lockout diferenciado de password incorrecta

### Fase 2

- [ ] `RecoverPasswordDTO` queda dividido correctamente
- [ ] `CredentialDTOs.cs` revisado y saneado
- [ ] archivos `sed*` inventariados y retirados si aplica
- [ ] RN del documento auth alineadas a implementacion

### Fase 3

- [ ] `recovery-mobile.ts` usa `Endpoints.Auth.recoverPassword`
- [ ] `password-form.ts` usa catalogo oficial de endpoints
- [ ] `update-password.ts` reduce `UntypedFormGroup`
- [ ] `update-user-photo.ts` reduce `any` y acceso directo riesgoso
- [ ] estilos criticos del modulo auth revisados contra tokens

### Fase 4

- [ ] pruebas backend de login/refresh/logout
- [ ] pruebas backend de cambio password/foto con caso negativo
- [ ] pruebas frontend de persistencia de credenciales
- [ ] pruebas frontend de recovery/reset/profile
- [ ] cierre documental actualizado

---

## 7. Criterios de Paso

| Fase | Criterio de paso |
|---|---|
| Fase 1 | riesgos criticos de seguridad cerrados |
| Fase 2 | estructura y DTOs del modulo quedan alineados a convenciones |
| Fase 3 | frontend auth deja de depender de hardcodes y drift evitable |
| Fase 4 | pruebas cubren flujos criticos y el modulo queda listo para re-auditoria |

---

## 8. Riesgos

| Riesgo | Impacto | Mitigacion |
|---|---|---|
| ajuste de autoservicio rompe un caller admin no documentado | Alto | localizar consumidores antes de endurecer contrato |
| cambio de `rememberMe` afecta sesiones activas y soporte | Alto | validar politica y comunicarla antes de desplegar |
| limpiar DTOs o residuos revela dependencias ocultas | Medio | buscar referencias antes de modificar |
| remediacion visual abre regresiones mobile | Medio | separar inventario critico de mejoras cosmeticas |
| pruebas nuevas fallan por infraestructura legacy | Medio | priorizar escenarios minimos y dobles controlados |

---

## 9. Dependencias e Impactos

**Dependencias**

- aprobacion del Tech Lead
- decision sobre politica final de `rememberMe`
- validacion de si existen flujos administrativos legitimos para cambio de
  password/foto de terceros

**Impactos**

- puede requerir ajuste en consumidores frontend del perfil si hoy dependen del
  `applicationUserId` de ruta
- puede requerir actualizacion de documentacion de auth
- no deberia requerir cambios en shared si se mantiene el alcance

---

## 10. Cierre Esperado

Al finalizar la remediacion aprobada:

- `AuthLuxuryApp` deja cerrados los hallazgos criticos de seguridad del alcance
- el frontend auth en la ruta confirmada por el usuario queda alineado a
  endpoints y patrones oficiales
- la documentacion del modulo deja de contradecir el comportamiento real en los
  puntos criticos
- el modulo queda en condiciones de pasar una auditoria de confirmacion con un
  riesgo residual controlado

---

## 11. Post-Implementation Review

Al cierre se debe revisar:

- si la politica `rememberMe` quedo clara y operable
- si existe un patron repetido de IDOR/autoservicio en otros modulos
- si el `AuthService` global necesita un plan transversal separado
- si el inventario visual restante del modulo auth amerita una fase posterior de
  diseno/cleanup no critica
