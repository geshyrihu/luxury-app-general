# Security Audit Checklist

**Ultima revision:** 2026-09-30

## Origen y alcance de esta adaptación

Este documento adapta al stack de LuxuryApp (.NET 10 Minimal API + EF Core + Angular 22, multi-tenant por `Customer`) las clases de ataque, el modelo de veredictos y el patrón de verificación de [`cloudflare/security-audit-skill`](https://github.com/cloudflare/security-audit-skill) (MIT). No se adoptó completo — evaluado el 2026-09-30 (ver memoria de la decisión): el repo original asume un sandbox OS-enforced con `fstat`/`O_NOFOLLOW` que no corre en Windows, y cubre superficie (memory-safety/binario, IPC de escritorio, protocolos RPC) que no existe en este proyecto. Lo que sí se adapta es lo que llenaba un hueco real: aquí no existía checklist de clases de ataque ni distinción entre "confirmado" y "necesita validación".

**No reemplaza** `qa-punta-a-punta` (auditoría de máquinas de estado e integridad referencial orientada a negocio) ni `audit-severity-model.md` (clasificación general de hallazgos). Lo complementa cuando el hallazgo tiene un componente de seguridad: quién puede hacer qué, sobre el recurso de quién.

## Regla base: un hallazgo de seguridad necesita boundary + resultado

No es un hallazgo de seguridad reportar que falta una buena práctica genérica. Para cada candidato, nombrar:

1. El principal de menor confianza (rol, usuario sin la autorización esperada, otro `Customer`).
2. El valor o acción que el sistema acepta de ese principal.
3. El control que debería rechazarlo, acotarlo o revocarlo — y su ubicación exacta (`archivo:línea`).
4. El recurso o principal afectado y el resultado concreto observable.

Una capa de defensa ausente cuando otra capa ya bloquea el ataque es una nota de endurecimiento, no una vulnerabilidad — anótala aparte, no la reportes con severidad.

## Veredictos: confirmado / necesita validación / rechazado

Reemplaza el uso genérico de "incumplimiento crítico" para hallazgos de seguridad (ver `audit-severity-model.md`, que ahora distingue esto):

- **`confirmado`** — trazado completo desde el origen (`archivo:línea`) hasta el efecto, con un resultado acotado observado (test, fixture local, o lectura de código suficiente para probar el camino sin ambigüedad). Lleva severidad.
- **`necesita validación`** — el candidato está fundamentado en código real, pero un hecho decisivo vive fuera del repo (configuración de despliegue, política del proxy/CDN, comportamiento real de un proveedor externo). Nombra el hecho exacto que falta y quién puede confirmarlo. **Nunca lleva severidad** — no es "una vulnerabilidad de baja confianza", es una pregunta pendiente.
- **`rechazado`** — el candidato quedó refutado por el propio código o por el resultado del fixture. Se conserva para que una auditoría futura no repita la misma hipótesis ya descartada, salvo que el código relevante haya cambiado.

**Severidad = likelihood × impact, nunca solo impact.** La severidad global no puede superar el impacto demostrado. Anclas:

| Severidad | Ancla |
|---|---|
| crítica | un actor no autenticado obtiene ejecución de código, acceso completo a datos, o control total de cuentas |
| alta | un actor derrota por completo un control explícito con consecuencia real: bypass de autenticación, lectura/escritura cross-tenant (otro `Customer`), ejecución autenticada de código |
| media | violación real de un límite, pero con alcance acotado o precondiciones poco comunes |
| baja | divulgación de detalles internos no secretos, o esfuerzo sostenido para ganancia mínima |
| informativa | observación confirmada de impacto mínimo, útil como prerrequisito de otro hallazgo |

Discriminador alto/medio: ¿el resultado demostrado derrota por completo un control explícito, o solo lo debilita? Si no puedes nombrar el daño concreto, la severidad es menor de lo que parece.

## Patrón obligatorio: quien encuentra no verifica

El agente que reporta un candidato **nunca** es el que decide si queda `confirmado`. Un segundo agente, con contexto fresco (sin el razonamiento del primero, solo el candidato y el contrato que debe cumplir), intenta refutarlo antes de aceptarlo. Esto es la misma disciplina que `doubt-driven-development` (pendiente de adopción desde la evaluación de `agent-skills`, 2026-09-24) aplicada específicamente a hallazgos de seguridad:

1. El hallador entrega el candidato con trace `archivo:línea`, evidencia y el resultado observado — sin conclusión de severidad todavía.
2. Un verificador fresco recibe **solo** el candidato y el contrato (qué debe probar para confirmar), nunca el razonamiento del hallador.
3. El verificador intenta activamente refutarlo: relee cada línea citada, reproduce el resultado si es posible, busca la capa de control que el hallador pudo haber pasado por alto.
4. Solo tras esa revisión adversarial el hallazgo pasa a `confirmado`, se degrada a `necesita validación`, o se marca `rechazado`.

Para una auditoría de un módulo pequeño esto puede ser un segundo pase propio releyendo con esta lista antes de reportar; para hallazgos `alto`/`crítico` antes de entregarlos al Tech Lead, usar un subagente fresco (`Task`/`Agent`) con el prompt adversarial de abajo.

**Prompt adversarial mínimo para el verificador:**
```
No escribiste este candidato. Intenta refutarlo desde el código fuente.
1. Relee cada línea citada en el trace. ¿El primer paso es realmente un punto de entrada
   de menor confianza? ¿El último es realmente el sink o efecto reclamado?
2. Busca la capa de control más fuerte visible en el código sobre ese camino
   (autorización, filtro por CustomerId, validación) — ¿ya bloquea esto?
3. Si es "confirmado" propuesto: reproduce el resultado mínimo observado si es posible.
4. Si es "necesita validación" propuesto: ¿el hecho faltante es realmente externo al
   repo, o el código ya lo resuelve? Si el código lo resuelve, rechaza.
5. Devuelve: confirmado | necesita_validacion | rechazado, con tu propia evidencia.
```

## Clases de ataque aplicables a LuxuryApp

Seleccionadas de las 9 "companions" del repo original: solo las que aplican a una app de gestión .NET/Angular multi-tenant. Memory-safety/binario, IPC de escritorio y protocolos RPC (gRPC/GraphQL) no aplican — no hay C/C++ unsafe, ni IPC nativo, ni esos protocolos en el stack.

### 1. Aislamiento entre `Customer` (multi-tenant) — la más crítica en este stack

Un campo `CustomerId` en la entidad **no es aislamiento por sí solo**. Encuentra el query, filtro o política que lo aplica en cada camino de lectura y escritura:

- ¿El `AppService` filtra por el `CustomerId` del usuario autenticado (`ICurrentUserService`/equivalente), o confía en un `customerId` que llega del query string, del body, o de `CustomerIdService` en el frontend sin re-verificar en backend?
- Endpoints de listado, bulk, export, import, background jobs y Hangfire: ¿aplican el mismo filtro que el endpoint interactivo, o tienen un camino separado que lo omite?
- Claves de caché, archivos temporales, nombres de documento generados: ¿incluyen el `CustomerId` o pueden colisionar entre dos clientes?
- Exports/reportes (Excel, PDF): ¿el query que arma el reporte respeta el mismo alcance de `Customer` que la lista en pantalla, o es un query distinto escrito a mano?
- Borrado lógico (`IsDeleted`/equivalente): ¿un lookup directo, un `include` de navegación, o un job en segundo plano puede devolver o actuar sobre un registro ya borrado, ignorando el filtro?

Grep de referencia:
```bash
grep -rn "\.Where(" api/LuxuryApp.Application --include="*.cs" -A2 | grep -B2 "CustomerId ==" | grep -c "request\.\|dto\."
# Busca CustomerId comparado contra un valor que vino del request, no del usuario autenticado
grep -rln "FromQuery.*customerId\|FromRoute.*customerId" api/LuxuryApp.Application --include="*.cs"
```

### 2. Control de acceso (roles y `ApplicationRole`)

No basta verificar que existe un check de permiso — verificar que es el permiso correcto para el recurso correcto:

- ¿Hay un segundo camino al mismo cambio de estado que valida un rol más débil?
- ¿Un campo del body puede sobrescribir lo que el sistema de roles pretendía restringir (p. ej. mandar `customerId` o `applicationUserId` de otro usuario en el payload)?
- Endpoints que solo validan autenticación (`[Authorize]`) pero olvidan autorización específica del recurso.
- Operaciones bulk/batch/export: ¿aplican el chequeo de permiso por cada ítem, o solo una vez al entrar al endpoint?

### 3. Inyección

En un stack EF Core + Minimal API el riesgo mayor no es SQL injection clásico (parametrizado por defecto), sino:

- SQL dinámico o `FromSqlRaw`/`ExecuteSqlRaw` con interpolación de string en vez de parámetros — buscar en migraciones de datos legacy (Aspel, integraciones) y en reportes dinámicos.
- Construcción de rutas de archivo a partir de input del usuario (nombre de documento, adjunto) sin sanitizar — path traversal hacia `IFileReadPathService`/`IFileWritePathService`.
- Log injection: datos de usuario sin escapar en mensajes de `ILogger`.

### 4. Lógica de negocio como vector de seguridad

Complementa (no duplica) `qa-punta-a-punta`: ahí el foco es integridad funcional, aquí es si la falla de lógica cruza un boundary de autorización:

- Manipulación numérica: valores negativos, cero, overflow en montos, cantidades, porcentajes de presupuesto.
- Condiciones de carrera con impacto de negocio: doble aprobación, doble submit en flujos financieros (órdenes de compra, nómina).
- Suposición implícita de confianza: dato leído de otra tabla/módulo asumido válido "porque ya se validó al guardarlo" — ¿qué pasa si otro camino de código lo escribió sin esa validación?

### 5. Abuso de features y fuga de datos

- Export/backup como exfiltración: ¿un usuario de bajo privilegio puede disparar un export que incluye datos de otro `Customer` o campos que no debería ver en pantalla?
- Búsqueda/filtro como oráculo: ¿un filtro o autocomplete revela existencia de registros a los que el usuario no tiene acceso directo?
- Enumeración por efectos secundarios: ¿mensajes de error distintos para "no existe" vs "sin permiso"?

### 6. Cosas obvias (revisar primero, es barato)

- Secretos hardcodeados: `grep -rn "password\s*=\|apikey\|Bearer \|-----BEGIN" api --include="*.cs" -i`
- `appsettings.*.json` con secretos reales commiteados (verificar contra `appsettings.Development.json`/`appsettings.Local.json` en `.gitignore`).
- Endpoints de debug/diagnóstico sin `[Authorize(Roles = "SuperUsuario")]` o equivalente.
- CORS: ¿algún `AllowAnyOrigin()` combinado con credenciales?
- Cookies de sesión/refresh token sin `HttpOnly`/`Secure`/`SameSite` (ver `frontend/jwt-storage-security.md`, ya cubierto para el frontend — verificar que el backend las emite así).

## Cómo usar esto en una auditoría de módulo

1. En `audit-module-conventions.md`, el ítem "seguridad y permisos" de la auditoría completa usa esta checklist.
2. Reporta cada candidato con veredicto (`confirmado`/`necesita validación`/`rechazado`), no solo "incumplimiento crítico" — la clasificación de `audit-severity-model.md` sigue aplicando para el resto del reporte.
3. Antes de reportar `confirmado` con severidad `alta` o `crítica`, pasa el hallazgo por el patrón adversarial de arriba.
4. No pruebes contra el ambiente desplegado, no uses credenciales reales, no ejecutes builds/tests fuera de lo que ya corre en local — nada de sandboxing especial: si la evidencia necesaria requiere ejecutar código del sistema en producción o con datos reales, es `necesita validación`, no `confirmado`.
