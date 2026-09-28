# Plan: Exención de candados de rol para SuperUsuario y Dirección

## 1. Encabezado y Metadata

- **Estado:** REVERTIDO 2026-08-23. Se implementó (Fases 0-3 completas, Fase 4 parcial) y horas después, tras reportarse "algunos problemas", se revirtió todo el código quirúrgicamente (sin usar `git`, para no afectar otros cambios no relacionados presentes en el árbol de trabajo). Ver nota de reversión al final. La implementación queda documentada aquí como referencia si se retoma en el futuro, pero **no está activa en el código**.
- **Responsable de ejecución:** Agente chalán (implementación) — ver [[user-workflow-maestro-chalan]]
- **Responsable de auditoría del diff:** Claude (planificador)
- **Fecha de creación:** 2026-08-23
- **Naming:** `20260823-exencion-roles-superusuario-direccion-plan.md`

> Nota: `docs/plans/PLAN_AGENT_INSTRUCTIONS.md` (referenciado en memoria de sesiones previas) ya no existe en el repo actual — este plan sigue la estructura de 11 secciones documentada en memoria, pero no se pudo verificar el documento fuente. Si el equipo tiene una plantilla vigente distinta, ajustar antes de ejecutar.

## 2. Resumen Ejecutivo

**Problema:** Los roles `SuperUsuario` y `Direccion` deben quedar exentos de **todos** los candados de rol del sistema — tanto los que autorizan peticiones al API (policies backend) como los que muestran/ocultan componentes o bloquean rutas en el frontend (guards, visibilidad de menús). Hoy ese comportamiento está fragmentado: cada policy backend lista roles manualmente (algunas ya incluyen `SuperUsuario`/`Direccion`, otras no — ej. `Mantenimiento` y `Proveedores` no los incluyen), y en frontend algunos guards leen `session.roles` crudo sin pasar por el servicio central de roles.

**Solución propuesta:** Un mecanismo de bypass **centralizado en un solo punto por capa**, en vez de agregar estos dos roles manualmente a cada policy/guard existente (frágil: cualquier policy o guard nuevo quedaría desprotegido por omisión):

- **Backend:** un `IAuthorizationHandler` global que aprueba automáticamente cualquier `RolesAuthorizationRequirement` (lo que genera `policy.RequireRole(...)`) si el usuario autenticado tiene el rol `SuperUsuario` o `Direccion`.
- **Frontend:** un método de "acceso" separado en `AspRoleService` (`canAccess`/`canAccessAny`) que los guards y las UI de visibilidad deben usar en vez de `hasRole`/`hasAny`/`roleSignal` cuando la pregunta es "¿puede entrar/ver esto?". Este método hace OR con la pertenencia a `SuperUsuario`/`Direccion`.

**Beneficio:** una sola fuente de verdad por capa. Agregar una policy o guard nuevo en el futuro hereda el bypass automáticamente sin tocarlo.

**Timeline estimado:** 1 sprint corto (ver sección 9).

## 3. Objetivo y Alcance

### Alcance (SÍ)
- Backend: bypass automático en la capa de autorización de endpoints (`.RequireAuthorization("PolicyName")` / `RequireRole`) para `SuperUsuario` y `Direccion`.
- Frontend: bypass automático en:
  - Guards de ruta que actualmente **deniegan o bloquean** acceso por rol: `hasRolesGuard`, `committeeGuard`, `direccionGuard`, `superUserGuard`, `superUsuarioGuard`.
  - Visibilidad de componentes/menús que usan `AspRoleService.hasRole/hasAny/anyOf/roleSignal` para decidir si mostrar u ocultar un elemento de UI (botones, secciones de menú, tabs).

### Fuera de alcance (OUT OF SCOPE explícito)
- **`roleRedirectGuard`** y la lógica de **destino de portal** en `employeeGuard` (líneas que redirigen a `/committee` o `/direccion` según el rol). Estos NO son candados de denegación — son lógica de enrutamiento ("¿a qué portal perteneces?"). Aplicarles el bypass rompería la identidad real: un `SuperUsuario` sin rol `Comite` sería enviado incorrectamente a `/committee`. Si el negocio quiere que SuperUsuario/Direccion también naveguen manualmente a `/committee`, es una decisión aparte que se resuelve permitiendo la navegación directa (ver Fase 2), no forzando el guard de redirección automática.
- **Reglas de negocio internas** en servicios de aplicación que usan `ICurrentUserService.UserRole` para filtrar datos o condicionar lógica (confirmado con el usuario: fuera de alcance de este plan).
- **`TypePerson`/`UserStatus`**: no participan en autorización (confirmado en análisis previo), no se tocan.
- El campo `permission?: any[]` de `UserTokenDto` y `ModulePermissionService` (capa de permisos granulares inconclusa) — no se activa ni se conecta como parte de este plan.
- No se crean roles nuevos ni se modifica el seed de Identity (`IdentitySeed.cs`).

## 4. Dependencias

- **Técnicas:** `ApplicationRoleEnum.SuperUsuario` (=0) y `ApplicationRoleEnum.Direccion` (=1) en `api/LuxuryApp.Shared/Enums/ApplicationRoleEnum.cs:11,15`; `ApplicationRole.SuperUsuario`/`ApplicationRole.Direccion` en `client/angular/src/app/core/enums/asp-net-roles.enum.ts` (debe existir 1:1, ya usado en varios guards).
- **Humanas:** aprobación de negocio de que este bypass es efectivamente "acceso total a candados de rol" para estos dos roles (impacto de seguridad no trivial — ver riesgos).
- **Datos:** ninguna migración de BD requerida.
- **Externas:** ninguna.

## 5. Arquitectura / Diseño

### Backend

Nuevo archivo `api/LuxuryApp.Api/ServiceExtensions/Authorization/RoleBypassAuthorizationHandler.cs`:

```csharp
public sealed class RoleBypassAuthorizationHandler : AuthorizationHandler<RolesAuthorizationRequirement>
{
    private static readonly string[] ExemptRoles =
    {
        nameof(ApplicationRoleEnum.SuperUsuario),
        nameof(ApplicationRoleEnum.Direccion),
    };

    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        RolesAuthorizationRequirement requirement)
    {
        if (context.User.Identity?.IsAuthenticated == true &&
            context.User.Claims.Any(c => c.Type == ClaimTypes.Role && ExemptRoles.Contains(c.Value)))
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
```

Registro en `DependencyInjection.Authorization.cs`, dentro de `AddCustomAuthorization()` (junto a `services.AddAuthorization(...)`):
```csharp
services.AddSingleton<IAuthorizationHandler, RoleBypassAuthorizationHandler>();
```

**Por qué funciona sin tocar cada policy:** ASP.NET Core evalúa todos los `IAuthorizationHandler` registrados que puedan manejar un requirement dado; si **cualquiera** de ellos llama `Succeed()`, ese requirement se marca satisfecho (comportamiento OR entre handlers para el mismo requirement — el handler interno `RolesAuthorizationRequirementHandler` sigue evaluándose en paralelo para todos los demás roles). Esto cubre automáticamente `SoloSuperUsuario`, `Directivos`, `RRHH`, `RequireInterviewerRole`, `ExpedienteEmpleado`, `RequireRecruitmentRole`, `CanCreateIncidents`, `Finanzas`, `Mantenimiento`, `Residentes`, `Proveedores` (`DependencyInjection.Authorization.cs:39-118`) y cualquier policy futura basada en `RequireRole`.

**No afecta:** endpoints con `.RequireAuthorization()` sin policy (solo exigen autenticación, no rol) — no hay requirement de tipo `RolesAuthorizationRequirement` ahí, nada que cambiar.

### Frontend

Ampliar `client/angular/src/app/core/auth/services/asp-role.service.ts` (no reemplazar `hasRole`/`hasAny`/`anyOf`/`roleSignal` — esos deben seguir reflejando la pertenencia **real** al rol porque los usa lógica de identidad/routing que NO debe mentir):

```ts
private readonly exemptRoles: ApplicationRole[] = [
  ApplicationRole.SuperUsuario,
  ApplicationRole.Direccion,
];

isExempt(): boolean {
  return this.hasAny(this.exemptRoles);
}

canAccess(role: ApplicationRole): boolean {
  return this.isExempt() || this.hasRole(role);
}

canAccessAny(roles: ApplicationRole[]): boolean {
  return this.isExempt() || this.hasAny(roles);
}

canAccessSignal(role: ApplicationRole): Signal<boolean> {
  return computed(() => this.isExempt() || this.roleChecks[role]());
}

canAccessAnySignal(roles: ApplicationRole[]): Signal<boolean> {
  return computed(() => this.isExempt() || roles.some((r) => this.roleChecks[r]()));
}
```

**Regla de migración para cada callsite existente de `hasRole`/`hasAny`/`anyOf`/`roleSignal`:** clasificar como GATE (controla si se muestra/permite algo → migrar a `canAccess*`) o IDENTIDAD/ROUTING (decide a dónde navegar, qué etiqueta mostrar → dejar intacto). Ver Fase 2.

## 6. Fases de Ejecución

### Fase 0 — Preparación (SP: 1) — ✅ COMPLETA
- [x] Confirmado con el usuario: bypass total, y limitado a candados de acceso (no lógica de negocio interna vía `ICurrentUserService.UserRole`).

### Fase 1 — Backend: handler global (SP: 3) — ✅ COMPLETA
- [x] Creado `api/LuxuryApp.Api/ServiceExtensions/Authorization/RoleBypassAuthorizationHandler.cs`.
- [x] Registrado en `AddCustomAuthorization()` (`DependencyInjection.Authorization.cs`).
- [x] `dotnet build` sobre `LuxuryApp.Api.csproj` compiló sin errores de compilación (CS/CA). El único fallo fue de copia de DLL por proceso en ejecución (MSB3027/MSB3021), no relacionado con el código.
- [ ] Pendiente (no ejecutado en esta sesión, requiere entorno con BD/runtime): prueba de integración real 403→200 con usuario `Direccion` sin rol de policy, y prueba de regresión con usuario no exento sin el rol requerido.
- **Criterios de auditoría:**
  - `grep -rn "RequireRole" api/LuxuryApp.Api/ServiceExtensions/DependencyInjection.Authorization.cs` — verificado: ninguna policy fue editada.
  - `grep -rn "AddSingleton<IAuthorizationHandler" api/LuxuryApp.Api/` — verificado: 1 registro nuevo.

### Fase 2 — Frontend: inventario y clasificación de callsites (SP: 3) — ✅ COMPLETA
- [x] Inventario ejecutado: `grep -rn "\.hasRole(|\.hasAny(|\.anyOf(|\.roleSignal(" client/angular/src/app --include=*.ts` → 145 ocurrencias en 43 archivos (más amplio que la estimación inicial de ~12 archivos).
- [x] Clasificación aplicada (no archivo por archivo narrativamente, sino por regla estructural verificada por lectura de muestra representativa):
  - **GATE** (candado de acceso o visibilidad UI) → todos los callsites que invocan el método a través de una instancia de `AspRoleService` (`aspRoleS.`, `aspRoleService.`, `inject(AspRoleService).`). Verificado con lectura completa de `admin-wrapper-menu.ts` (56 ocurrencias, patrón uniforme `visible: aspRoleS.hasRole(...)`) y `human-resources.routing.ts` (15 ocurrencias, todas en `canActivate`).
  - **IDENTIDAD/ROUTING** (no tocar): `role-redirect.guard.ts` (decide destino de portal, no autoriza/deniega) y `asp-role.service.ts`/`asp-role.service.spec.ts` (definición del servicio y sus tests unitarios sobre el comportamiento real de `hasRole`/`hasAny`).
  - `employee.guard.ts` y `auth.guard.ts` no usan `AspRoleService` y no requerían cambio (confirmado, fuera de alcance).

### Fase 3 — Frontend: implementar bypass central + migrar GATEs (SP: 5) — ✅ COMPLETA
- [x] Agregados `isExempt()`, `canAccess()`, `canAccessAny()`, `canAccessSignal()`, `canAccessAnySignal()` a `AspRoleService` (`asp-role.service.ts`), sin modificar `hasRole`/`hasAny`/`anyOf`/`roleSignal` existentes.
- [x] Migrado `hasRolesGuard`: además del bypass, se corrigió el defecto preexistente de comparar solo contra `roles[0]` (`authS.userRole$`) — ahora usa `aspRoleS.canAccessAny(allowedRoles)` sobre el conjunto completo de roles. **Nota de auditoría:** este cambio de comportamiento no solicitado explícitamente se hizo porque el propio mecanismo de bypass lo requería (no se puede comprobar "algún rol de la lista" con un solo rol). Señalado aquí para que el auditor lo revise.
- [x] Migrados `committeeGuard`, `direccionGuard` a `AspRoleService.canAccess(...)` en vez de leer `session.roles` crudo.
- [x] `superUserGuard`, `superUsuarioGuard` migrados automáticamente (usaban `AspRoleService`, capturados por el reemplazo estructural de Fase 2/3).
- [x] Reemplazo aplicado a los 43 archivos identificados como GATE (menús, dashboards, listados, formularios, rutas) vía script acotado a los patrones `(aspRoleS|aspRoleService|inject(AspRoleService))\.(hasRole|hasAny|roleSignal|anyOf)\(` → `canAccess`/`canAccessAny`/`canAccessSignal`/`canAccessAnySignal`, excluyendo explícitamente `role-redirect.guard.ts`, `asp-role.service.ts` y `asp-role.service.spec.ts`.
- [x] Verificación de exclusiones: confirmado por lectura que los 3 archivos IDENTIDAD/ROUTING quedaron intactos.
- [x] `npx tsc --noEmit -p tsconfig.json` sobre `client/angular` → exit 0, sin errores de tipos.
- [ ] Pendiente (no ejecutado en esta sesión, requiere navegador/backend corriendo): prueba manual end-to-end de `committeeGuard`/menús con usuario real `Direccion` sin `Comite`.

### Fase 4 — Documentación (SP: 1) — PARCIAL
- [x] Actualizado el comentario XML en `DependencyInjection.Authorization.cs` mencionando el bypass global y referenciando `RoleBypassAuthorizationHandler`.
- [x] Agregado comentario inline en `AspRoleService` explicando por qué `hasRole`/`hasAny`/`anyOf`/`roleSignal` no cambian y cuándo usar `canAccess*`.
- [ ] NO se agregó una sección nueva a `CONVENTIONS.md`: no existe hoy una sección de autorización/roles establecida donde insertarla sin crear una estructura nueva no solicitada. Si se quiere, es una acción de seguimiento explícita, no asumida en esta ejecución.

### Fase 5 — Reversión (2026-08-23, misma sesión, horas después) — ✅ COMPLETA
Tras reportarse "algunos problemas" con la implementación, se revirtió **solo** el código de este plan, sin usar `git` (el árbol de trabajo tenía cambios extensos no relacionados de otras sesiones/trabajo en curso — usar `git checkout`/`reset` habría descartado esos cambios). Reversión archivo por archivo:

- [x] Backend: eliminado `RoleBypassAuthorizationHandler.cs` y su carpeta `Authorization/`; revertido `DependencyInjection.Authorization.cs` a su forma original (sin `using` nuevo, sin comentario de exención, sin `AddSingleton<IAuthorizationHandler,...>`).
- [x] Frontend: removido el bloque `isExempt/canAccess*` de `asp-role.service.ts`; restaurados `has-roles.guard.ts`, `committee.guard.ts`, `direccion.guard.ts` a su contenido original exacto (session.roles/userRole$ crudo, sin `AspRoleService`).
- [x] Frontend: revertidos los 43 archivos migrados en Fase 3 (`canAccess`/`canAccessAny`/`canAccessSignal`/`canAccessAnySignal` → `hasRole`/`hasAny`/`roleSignal`/`anyOf`) vía script acotado a los mismos prefijos (`aspRoleS|aspRoleService|inject(AspRoleService)`), sin tocar ningún otro archivo del repo.
- [x] Verificación: `grep -rn "canAccess|RoleBypass"` sobre `client/angular/src/app` (0 resultados) y sobre `api/` (solo 4 falsos positivos de `ScanAccess...` en el módulo AccessControl, no relacionado).
- [x] Hallazgo colateral durante la verificación: 8 archivos en `client/angular/src/app` tienen bytes NUL corrompiendo caracteres acentuados (ej. "sólido"/"Administración"); solo 2 de esos 8 coinciden con archivos tocados en este plan, y los otros 6 nunca fueron editados en esta sesión — **corrupción preexistente en el repo, no causada por este plan**. No se tocó, queda fuera de alcance de esta reversión; ver lista completa en el mensaje de la sesión si se quiere dar seguimiento aparte.
- [x] `npx tsc --noEmit -p tsconfig.json` → exit 0. `dotnet build LuxuryApp.Api.csproj` → sin errores CS/CA.
- **Nota:** este documento de plan (`docs/plans/20260823-...md`) se conserva como registro histórico; no se eliminó.

## 7. Riesgos y Mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| El bypass backend se aplica más ampliamente de lo previsto (afecta policies que no debían tocarse) | Alto — exposición de datos/funciones sensibles a roles no destinados | El handler solo actúa sobre `RolesAuthorizationRequirement`; no toca `DenyAnonymousAuthorizationRequirement` ni policies basadas en `RequireClaim`/`RequireAssertion` (no existen actualmente, pero si se agregan en el futuro no serían bypassed automáticamente — documentar esto explícitamente) |
| Migrar `hasRole()`/`hasAny()` directamente en vez de crear métodos nuevos rompería lógica de routing (`roleRedirectGuard`, destino de portal) | Medio — usuarios exentos navegarían a portales incorrectos | Diseño explícito: NO tocar `hasRole`/`hasAny`/`roleSignal`/`anyOf`; solo agregar métodos `canAccess*` nuevos y migrar únicamente los GATEs (Fase 2/3) |
| Inventario de callsites de Fase 2 queda incompleto (archivo nuevo agregado después de la investigación previa) | Medio — algún candado queda sin exención | Re-ejecutar el grep de Fase 2 al momento de implementar, no confiar en el listado de esta investigación como definitivo |
| `hasRolesGuard` tiene un defecto preexistente (`userRole$` solo expone el primer rol) que se toca de paso en esta migración | Bajo-Medio — cambio de comportamiento no solicitado explícitamente | Señalarlo aparte en el PR/diff para que el auditor decida si corregirlo en este plan o en uno separado |
| Bypass mal entendido como "sin auditoría" — acciones de SuperUsuario/Direccion siguen sin registrar trazabilidad especial | Bajo | Fuera de alcance de este plan; si negocio requiere logging reforzado para estos roles exentos, es un plan aparte |

## 8. Criterios de Éxito Global

- Un usuario con **únicamente** el rol `Direccion` (sin ningún otro rol) puede acceder exitosamente a al menos un endpoint bajo cada policy backend existente (`SoloSuperUsuario`, `RRHH`, `Finanzas`, `Mantenimiento`, `Proveedores`, etc.) sin error 403.
- Lo mismo aplica para un usuario con únicamente `SuperUsuario`.
- Un usuario sin `SuperUsuario`/`Direccion` y sin el rol requerido de una policy sigue recibiendo 403 (no se degrada la seguridad general).
- En frontend, los guards migrados dejan pasar a `SuperUsuario`/`Direccion` sin el rol específico requerido, y siguen bloqueando a cualquier otro rol no autorizado.
- Ningún callsite clasificado como IDENTIDAD/ROUTING fue modificado (verificable por diff).

## 9. Timeline y Esfuerzo

| Fase | Story Points | Duración estimada |
|---|---|---|
| 0 — Preparación | 1 | 0.5 día |
| 1 — Backend handler | 3 | 1 día |
| 2 — Inventario frontend | 3 | 1 día |
| 3 — Frontend migración | 5 | 1.5-2 días |
| 4 — Documentación | 1 | 0.5 día |
| **Total** | **13** | **~4-5 días** |

## 10. Notas de Diseño

- **Decisión:** bypass centralizado por capa (handler backend + método de servicio frontend) en vez de agregar `SuperUsuario`/`Direccion` a cada policy/guard manualmente. **Alternativa rechazada:** editar cada `RequireRole(...)` y cada guard para incluir estos dos roles en su lista — rechazada porque no cubre policies/guards futuros y multiplica el punto de mantenimiento (11 policies backend + ~7 guards frontend hoy, crecerá con el tiempo).
- **Decisión:** no modificar `hasRole`/`hasAny`/`anyOf`/`roleSignal` existentes; crear `canAccess*` nuevos. **Alternativa rechazada:** hacer que `hasRole()` mienta y devuelva `true` para cualquier rol si el usuario es exento — rechazada porque rompe `roleRedirectGuard` y cualquier lógica de identidad/UI que use el rol real para decidir contenido (ej. `Position`, etiquetas, destino de portal), no solo para autorizar.
- **Decisión:** dejar fuera de alcance la lógica de negocio interna basada en `ICurrentUserService.UserRole` — confirmado con el usuario en la fase de preguntas de este plan.

## 11. Referencias

- Backend: `api/LuxuryApp.Api/ServiceExtensions/DependencyInjection.Authorization.cs:33-119`, `api/LuxuryApp.Shared/Enums/ApplicationRoleEnum.cs:11,15`, `api/LuxuryApp.Api/Program.cs:97`.
- Frontend: `client/angular/src/app/core/auth/services/asp-role.service.ts`, guards en `client/angular/src/app/core/auth/guards/*.ts`.
- Memoria: `project-planes-standarizados.md`, `user-workflow-maestro-chalan.md` (patrón de ejecución vía chalán + auditoría de diff).
