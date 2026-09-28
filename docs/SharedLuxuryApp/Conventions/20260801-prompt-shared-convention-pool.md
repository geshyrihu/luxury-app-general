Quiero una auditoría técnica completa y basada en evidencia sobre el uso de conexiones SQL Server, connection pooling de ADO.NET y pooling de `DbContext` de Entity Framework Core en LuxuryApp.

IMPORTANTE:

- En esta primera etapa solo debes analizar y reportar.
- No modifiques código, configuraciones, cadenas de conexión ni archivos.
- No agregues `AddDbContextPool`.
- No cambies `Max Pool Size`, `Min Pool Size`, timeouts ni políticas de reintento.
- No ejecutes pruebas de carga que puedan afectar SQL Server.
- No muestres contraseñas, tokens ni cadenas de conexión completas.
- No concluyas que el pooling está desactivado solamente porque no aparece `Pooling=true`.
- Diferencia claramente:
  1. Pooling de conexiones de ADO.NET/`Microsoft.Data.SqlClient`.
  2. Pooling de instancias de `DbContext` de EF Core.
  3. Conexiones utilizadas por Hangfire, jobs, servicios de respaldo y procesos en segundo plano.

## Objetivo

Determinar:

1. Si LuxuryApp usa correctamente el connection pooling de SQL Server.
2. Si existe riesgo real de agotamiento del pool.
3. Si hay conexiones, readers, comandos o transacciones que no se liberan correctamente.
4. Si el `CommandTimeout(300)` está justificado o puede provocar que las conexiones permanezcan ocupadas demasiado tiempo.
5. Si activar `AddDbContextPool` aportaría una mejora medible.
6. Si `AddDbContextPool` sería seguro en la arquitectura multi-tenant de LuxuryApp.
7. Si existe alguna razón técnica comprobable para modificar `Max Pool Size`.
8. Qué información o métricas faltan antes de recomendar cambios.

## Alcance del análisis

Analiza todo el backend bajo:

`api/`

El cliente Angular solamente deberá revisarse si existe alguna ejecución server-side, proxy, SSR o servicio Node que abra conexiones a bases de datos. No busques pooling SQL en componentes Angular normales.

Revisa especialmente:

- `Program.cs`
- Archivos de registro de servicios y extensiones de DI.
- `DbContextServiceExtensions.cs`
- `ApplicationDbContext`
- `VaultDbContext`
- Todos los demás tipos derivados de `DbContext`.
- `OnConfiguring`
- `OnModelCreating`
- Interceptores de EF Core.
- Filtros globales multi-tenant.
- Servicios que resuelvan `CustomerId`, tenant o usuario actual.
- Repositorios y Unit of Work.
- Hangfire y sus configuraciones.
- Hosted services, background services y jobs.
- Procesos de respaldo y restauración.
- Servicios que usan ADO.NET directamente.
- Configuración de SQL Server.
- `appsettings*.json`
- Variables de entorno y configuración de secretos, sin revelar sus valores.
- Proyectos `.csproj`, `Directory.Packages.props` y versiones de EF Core y `Microsoft.Data.SqlClient`.

## Fase 1: inventario de DbContext

Localiza todos los `DbContext` y presenta una tabla con:

| DbContext | Registro DI | Lifetime | Pooling de DbContext | Cadena utilizada | Multi-tenant | Uso en jobs |
| --------- | ----------- | -------- | -------------------- | ---------------- | ------------ | ----------- |

Para cada contexto verifica:

- Si usa `AddDbContext`, `AddDbContextFactory`, `AddDbContextPool` o `AddPooledDbContextFactory`.
- Si se registra más de una vez.
- Si se crea manualmente con `new`.
- Si se obtiene desde `IServiceProvider`.
- Si se usa dentro de singletons.
- Si se comparte entre tareas concurrentes.
- Si se utiliza después de terminar su scope.
- Si existen operaciones paralelas sobre la misma instancia.
- Si todos los métodos asíncronos se esperan correctamente con `await`.
- Si contiene propiedades o campos mutables relacionados con el tenant, usuario o solicitud.

No marques `AddDbContext` como problema por sí mismo. Es el registro normal scoped de EF Core.

## Fase 2: aislamiento multi-tenant

LuxuryApp utiliza `CustomerId` para separar información de diferentes clientes. Determina exactamente cómo se obtiene y aplica ese valor.

Revisa:

- Inyección de un servicio scoped de tenant o usuario.
- Propiedades como `CustomerId`, `TenantId`, `CurrentCustomer`, `CurrentTenant` o equivalentes.
- Global Query Filters.
- Interceptores de `SaveChanges`.
- Sobrescrituras de `SaveChanges` y `SaveChangesAsync`.
- Estado almacenado dentro del `DbContext`.
- Estado agregado manualmente a `DbConnection`.
- Uso de `HttpContext` dentro del contexto.
- Configuración variable dentro de `OnConfiguring`.
- Cambio dinámico de cadena de conexión por cliente.

Responde explícitamente:

1. ¿Una instancia reutilizada de `ApplicationDbContext` podría conservar el `CustomerId` de una solicitud anterior?
2. ¿Existen servicios scoped inyectados dentro del contexto?
3. ¿Los filtros globales capturan valores que cambian por solicitud?
4. ¿El sistema usa una base compartida o una cadena diferente por tenant?
5. ¿Activar `AddDbContextPool` podría provocar fuga de información entre clientes?
6. ¿Qué condiciones concretas deben cumplirse para considerarlo seguro?

Si no puedes demostrar que es seguro, clasifica `AddDbContextPool` como “requiere rediseño o prueba adicional”, no como una recomendación inmediata.

## Fase 3: inventario de conexiones ADO.NET

Busca todos los usos de:

- `SqlConnection`
- `DbConnection`
- `SqlCommand`
- `DbCommand`
- `SqlDataReader`
- `DbDataReader`
- `BeginTransaction`
- `TransactionScope`
- `Open`
- `OpenAsync`
- Dapper, si se utiliza.
- Cualquier proveedor SQL adicional.

Entrega una tabla:

| Archivo y método | Tipo de conexión | Apertura | Liberación | Transacción | Riesgo |
| ---------------- | ---------------- | -------- | ---------- | ----------- | ------ |

Comprueba que:

- Las conexiones estén dentro de `using` o `await using`.
- Los readers y comandos también se liberen correctamente.
- Las conexiones se cierren incluso cuando hay excepciones.
- No se devuelvan readers que dependan de una conexión ya fuera de scope.
- No existan conexiones almacenadas en campos estáticos, singletons o servicios de larga duración.
- Las transacciones siempre terminen con commit o rollback.
- No haya conexiones abiertas durante operaciones de archivos, red, envío de correo o procesamiento prolongado.
- No haya consultas enumeradas después de salir del scope.
- Los jobs no retengan scopes o contextos entre ejecuciones.

Distingue entre crear frecuentemente un objeto `SqlConnection` y abrir una conexión física nueva. Crear y desechar `SqlConnection` correctamente es compatible con el pooling.

## Fase 4: cadenas y fragmentación del pool

Enumera las cadenas de conexión de forma anonimizada. Nunca muestres usuario ni contraseña.

Para cada una informa solamente:

- Nombre de configuración.
- Servidor anonimizado.
- Base de datos.
- Proveedor.
- `Pooling`.
- `Max Pool Size`.
- `Min Pool Size`.
- `Connect Timeout`.
- `Command Timeout`, cuando aplique.
- `Connection Lifetime` o `Load Balance Timeout`.
- `MultipleActiveResultSets`.
- `Application Name`.
- `Encrypt`.
- `TrustServerCertificate`.

Determina si existen cadenas semánticamente equivalentes pero textualmente distintas. Considera que pequeñas diferencias, distinto orden, credenciales o identidad pueden crear pools separados.

Identifica:

- Cuántos pools potenciales puede crear el proceso.
- Si Hangfire comparte exactamente la misma cadena o genera otro pool.
- Si Vault usa otra base o pool.
- Si las cadenas se modifican dinámicamente.
- Si hay una cadena distinta por cada tenant.
- Si existen diferentes valores entre desarrollo, pruebas y producción.
- Si las cadenas se construyen concatenando valores.

No confundas varios pools con un error: explica cuándo es normal y cuándo puede aumentar excesivamente el total de conexiones.

## Fase 5: configuración EF Core y SQL Server

Analiza:

- `CommandTimeout`.
- `EnableDetailedErrors`.
- `EnableSensitiveDataLogging`.
- Logging de comandos SQL.
- Reintentos con `EnableRetryOnFailure`.
- Split queries.
- Consultas sin seguimiento.
- Consultas que carguen grandes grafos.
- Consultas sin paginación.
- Transacciones extensas.
- Ejecuciones en bucle.
- Problemas N+1.
- Operaciones masivas.
- Bloqueos por consultas síncronas.
- Cancelación mediante `CancellationToken`.

Sobre `CommandTimeout(300)`, determina:

1. Dónde se aplica.
2. Qué operaciones necesitan hasta cinco minutos.
3. Si es global para todas las consultas.
4. Si existen timeouts registrados.
5. Si una consulta lenta puede retener conexiones durante demasiado tiempo.
6. Si sería preferible configurar un timeout especial únicamente para procesos largos.

No cambies el valor; entrega evidencia y recomendación.

## Fase 6: evidencia de ejecución

Primero identifica qué telemetría ya existe:

- Logs de timeout.
- Errores “max pool size was reached”.
- Duración de comandos EF Core.
- Métricas de conexiones.
- Application Insights, OpenTelemetry, Serilog u otra plataforma.
- Métricas de Hangfire.
- Registros de SQL Server.
- Contadores de rendimiento disponibles.

Busca en logs del repositorio, pero no expongas información sensible.

Determina si existe evidencia real de:

- Agotamiento del pool.
- Espera para obtener conexiones.
- Consultas lentas.
- Bloqueos.
- Deadlocks.
- Jobs solapados.
- Elevada concurrencia.
- Conexiones que no regresan al pool.

Si hay acceso autorizado a una base de desarrollo o pruebas, únicamente propón consultas DMV de solo lectura. No las ejecutes contra producción sin autorización explícita.

Las consultas propuestas deben ayudar a observar:

- Sesiones por aplicación y base.
- Solicitudes activas.
- Consultas bloqueadas.
- Duración.
- Wait types.
- Transacciones abiertas.
- Cantidad de conexiones sleeping.
- Nombre de aplicación de cada conexión.

Aclara que las DMV de SQL Server no muestran directamente la estructura interna del pool del proceso .NET.

## Fase 7: capacidad y concurrencia

No uses el número de condominios o residenciales como equivalente directo a conexiones.

Identifica o estima, indicando claramente las suposiciones:

- Usuarios concurrentes.
- Solicitudes por segundo.
- Número de instancias de IIS.
- Número de worker processes.
- Jobs simultáneos.
- Duración promedio y percentil 95/99 de consultas.
- Número de cadenas distintas.
- Capacidad de SQL Server.
- Límite de conexiones de SQL Server.
- CPU, memoria, I/O y bloqueos.
- Horarios de mayor carga.

Explica que cada proceso y cada cadena distinta puede tener su propio pool. Si IIS tiene más de un worker o la aplicación se escala horizontalmente, calcula el máximo teórico total:

`instancias × pools por instancia × Max Pool Size`

No presentes ese máximo como consumo real; úsalo únicamente como límite potencial.

## Fase 8: evaluación de AddDbContextPool

Antes de recomendarlo, responde:

- ¿La creación del `DbContext` aparece como un cuello de botella medido?
- ¿Cuántas instancias se crean por segundo?
- ¿Existe presión relevante de CPU o asignaciones de memoria?
- ¿El contexto contiene estado mutable?
- ¿Depende de servicios scoped?
- ¿Es compatible con el sistema multi-tenant actual?
- ¿Los interceptores son seguros al reutilizar el contexto?
- ¿Existe código que modifique opciones, conexión o tracking por solicitud?
- ¿Cómo se garantizaría el restablecimiento del estado?
- ¿Qué benchmark demostraría la mejora?

Distingue:

- Beneficio esperado del pooling de objetos `DbContext`.
- Efecto sobre el pooling de conexiones SQL.
- Riesgo de contaminación de estado entre solicitudes.
- Complejidad adicional.

No recomiendes un `poolSize` arbitrario. Si propones una prueba, define cómo comparar:

- `AddDbContext`.
- `AddDbContextPool`.
- Throughput.
- Latencia p50, p95 y p99.
- CPU.
- Memoria y asignaciones.
- Errores.
- Conexiones SQL concurrentes.
- Correcto aislamiento de `CustomerId`.

## Fase 9: evaluación de Max Pool Size

No recomiendes aumentar el límite solamente para evitar timeouts.

Antes determina si el problema proviene de:

- Conexiones no liberadas.
- Consultas lentas.
- Bloqueos.
- Transacciones largas.
- Jobs solapados.
- Fragmentación en múltiples pools.
- Exceso de concurrencia.
- Capacidad insuficiente de SQL Server.
- Timeout global excesivo.

Si no hay evidencia de agotamiento, la recomendación debe ser conservar el valor predeterminado y agregar observabilidad.

No recomiendes `Min Pool Size` ni `Connection Lifetime` salvo que exista un caso concreto que los justifique.

## Formato obligatorio del informe

Entrega el resultado con estas secciones:

### 1. Resumen ejecutivo

Máximo diez puntos. Separa hechos comprobados de hipótesis.

### 2. Veredicto

Selecciona una opción y justifícala:

- Configuración saludable.
- Configuración funcional con observabilidad insuficiente.
- Riesgo moderado.
- Riesgo alto confirmado.
- No hay evidencia suficiente.

### 3. Arquitectura actual

Explica cómo se relacionan:

`HTTP request → DbContext scoped → SqlConnection → pool ADO.NET → SQL Server`

Incluye por separado Hangfire, Vault y jobs.

### 4. Inventario de DbContext

Incluye la tabla solicitada.

### 5. Inventario ADO.NET

Incluye la tabla solicitada y señala posibles fugas.

### 6. Multi-tenancy

Explica cómo se aplica `CustomerId` y el riesgo real de reutilizar contextos.

### 7. Pools potenciales

Lista anonimizada de cadenas y pools posibles.

### 8. Timeouts, consultas y transacciones

Incluye el análisis específico de `CommandTimeout(300)`.

### 9. Evidencia de agotamiento

Indica qué evidencia existe y cuál falta.

### 10. Hallazgos por prioridad

Para cada hallazgo utiliza:

- Severidad: crítica, alta, media, baja o informativa.
- Evidencia: archivo, método y líneas.
- Riesgo real.
- Cómo confirmarlo.
- Acción recomendada.
- Cambio de código requerido: sí/no.

### 11. Decisión sobre AddDbContextPool

Selecciona:

- No recomendable.
- Requiere auditoría multi-tenant adicional.
- Apto para benchmark.
- Recomendable con condiciones.
- Recomendable inmediatamente.

No selecciones “recomendable inmediatamente” sin mediciones y pruebas de aislamiento.

### 12. Decisión sobre Max Pool Size

Selecciona:

- Conservar valor predeterminado.
- Agregar configuración explícita sin modificar el valor.
- Medir antes de cambiar.
- Cambio justificado por evidencia.

### 13. Plan de pruebas seguro

Divide en:

1. Observabilidad.
2. Prueba funcional.
3. Prueba de aislamiento multi-tenant.
4. Prueba de carga en ambiente controlado.
5. Criterios de aceptación.
6. Plan de reversión.

### 14. Cambios recomendados

Clasifica en:

- Inmediatos y de bajo riesgo.
- Requieren medición.
- Requieren rediseño.
- No recomendados actualmente.

### 15. Preguntas para Ricardo

Incluye solamente preguntas que no puedan responderse leyendo el repositorio, por ejemplo:

- Número de instancias de IIS.
- Usuarios concurrentes reales.
- Características del servidor SQL.
- Errores observados.
- Ambiente donde ocurre la lentitud.
- Jobs que coinciden con el problema.

### 16. Conclusión final

Responde directamente:

1. ¿LuxuryApp ya tiene pooling de conexiones?
2. ¿Está funcionando correctamente según la evidencia disponible?
3. ¿Hay fugas de conexiones?
4. ¿Existe agotamiento confirmado?
5. ¿Debe activarse `AddDbContextPool`?
6. ¿Debe modificarse `Max Pool Size`?
7. ¿Cuál es el primer cambio o medición que debería realizarse?

## Reglas de calidad

- Cada afirmación importante debe incluir archivo, método y número de línea.
- No presentes una ausencia de configuración explícita como una falla.
- No confundas `DbContext` pooling con connection pooling.
- No inventes métricas.
- Marca claramente cualquier inferencia.
- No muestres secretos.
- No realices cambios.
- Si encuentras una vulnerabilidad crítica, repórtala inmediatamente, pero continúa la auditoría.
- Prioriza seguridad multi-tenant, liberación de recursos, consultas lentas y observabilidad antes de recomendar aumentar límites.
