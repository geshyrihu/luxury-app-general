# 🧠 Plan de Implementación: Simulador (Mock) Aspel COI

Este documento contiene los **Prompts Estructurados de Ejecución** para que un Agente CLI (Aider, Claude Code, Cline, etc.) construya el Módulo Aislado del Simulador Aspel.

> **Instrucciones para el Agente CLI:**
> 1. Ejecuta cada FASE de forma secuencial. No avances a la siguiente sin reportar éxito.
> 2. Una vez que termines una fase, escribe un reporte detallado en el archivo `docs/plans/mock-aspel-execution-report.md`.
> 3. No asumas reglas de Clean Architecture; básate en la estructura existente de LuxuryApp y asegúrate de mantener este módulo **totalmente aislado** de `LuxuryApp.Infrastructure.Data`.

---

## 🚀 FASE 01: Infraestructura y Entidades Base (DbContext)
**Objetivo:** Crear el cascarón de la base de datos simulada y las 5 entidades maestras.

### Prompt de Ejecución (Copiar y pegar al Agente CLI)
```text
Crea la infraestructura aislada para el Mock de Aspel.
1. En `api/LuxuryApp.Infrastructure.MockAspel/`, crea un nuevo proyecto de biblioteca de clases o simplemente una nueva carpeta (si ya está dentro de un proyecto único de infraestructura) dedicada exclusivamente al Mock.
2. Crea una clase base abstracta `MockAspelBaseEntity` que contenga: `Guid Id`, `Guid CustomerId`, `string TipoEmpresa`, `int IntEmpresa`.
3. Crea las 5 entidades heredando de esta base:
   - `MockCuenta` (Num_Cta, Nombre, Tipo, Status, Naturaleza, Cta_Papa, Nivel...)
   - `MockPoliza` (Tipo_Poli, Num_Poliz, Ejercicio, Periodo, Fecha_Pol, Concep_Po...)
   - `MockAuxiliar` (Num_Part, Num_Cta, Debe_Haber, MontoMov, TipCambio...)
   - `MockPresupuesto` (Num_Cta, Ejercicio, Presup01 al Presup14...)
   - `MockSaldo` (Num_Cta, Ejercicio, Inicial, Cargo01-12, Abono01-12...)
   *Nota: Revisa los JSONs en `api/LuxuryApp.Application/Moduls/ContabilidadLuxuryApp/ContabilidadOnline/Responses/RespuestaCobranza/` para mapear los tipos correctos de cada propiedad.*
4. Establece las relaciones: `MockCuenta` 1:N `MockSaldos` y `MockPresupuestos`. `MockPoliza` 1:N `MockAuxiliar`.
5. Crea el `MockAspelDbContext` heredando de DbContext. En el `OnModelCreating`, asegura que EF Core ignore las PKs originales de Aspel (ej. `intEmpresa`+`Num_Poliz`) y use `Id` como llave principal, pero pon un índice único a las llaves de negocio.
6. Registra este DbContext en la inyección de dependencias (para usar base de datos en memoria o SQLite temporal, a elección de arquitectura actual).
7. Al terminar, escribe un resumen técnico de lo que construiste en `docs/plans/mock-aspel-execution-report.md` bajo el título "Reporte Fase 01".
```

---

## 🚀 FASE 02: Seeder de Datos Reales (JSON a DB)
**Objetivo:** Alimentar la base de datos de pruebas usando la data real descargada de Aspel.

### Prompt de Ejecución (Copiar y pegar al Agente CLI)
```text
Crea el mecanismo de siembra de datos (Seeding) para el MockAspelDbContext.
1. Crea un servicio `MockAspelDataSeeder`.
2. El servicio debe leer los 5 archivos `.json` ubicados en `api/LuxuryApp.Application/Moduls/ContabilidadLuxuryApp/ContabilidadOnline/Responses/RespuestaCobranza/`.
3. Deserializa el nodo `data` de cada JSON a las entidades `Mock...` correspondientes.
4. Asígnales un `CustomerId` genérico de pruebas, y como `TipoEmpresa` ponle "Cobranza". Respeta el `IntEmpresa` que traiga el JSON.
5. Usa `DbContext.AddRange()` para inyectar estos datos masivamente si la base de datos está vacía.
6. Asegúrate de ejecutar este Seeder durante el startup de la aplicación en modo desarrollo.
7. Al terminar, actualiza el archivo `docs/plans/mock-aspel-execution-report.md` bajo el título "Reporte Fase 02", indicando si hubo problemas de deserialización o mapeo (ej. diferencias entre nulos y vacíos).
```

---

## 🚀 FASE 03: Endpoints Simulados (Minimal APIs)
**Objetivo:** Exponer la API RESTful simulada (El "Contrato") para que LuxuryApp la consuma.

### Prompt de Ejecución (Copiar y pegar al Agente CLI)
```text
Expón los Endpoints HTTP del simulador basándote en los requerimientos del archivo `docs/modulos-nuevos/aspel/integracion-aspel-luxuryapp.md`.
1. Crea un módulo de Minimal APIs (ej. `MockAspelEndPoints.cs`) en la capa de Application/Host.
2. Implementa `GET /api/AspelCOI/Query/Movimientos`. Debe aceptar el payload de búsqueda (por Ejercicio, Rango de fechas, y Num_Cta_IniciaCon) y realizar el filtrado sobre el `MockAspelDbContext.MockAuxiliares`.
3. Implementa `POST /api/AspelCOI/Polizas`. Recibe el JSON de la póliza con su arreglo de partidas.
   - REGLA: Valida que la suma de `MontoMov` donde `Debe_Haber == "D"` sea igual a donde `Debe_Haber == "H"`. Si no, retorna 422. Si cuadra, guárdalo en la base de datos simulada.
4. Implementa `GET /api/AspelCOI/Query/Saldos` y `PUT /api/AspelCOI/Cuentas` con lógica básica para leer/actualizar la tabla respectiva.
5. Al terminar, actualiza el archivo `docs/plans/mock-aspel-execution-report.md` bajo el título "Reporte Fase 03" indicando el éxito y las URLs expuestas.
```

---

## ?? FASE 04: Parches de Arquitectura y QA (Consistencia)
**Objetivo:** Sellar las brechas de vulnerabilidad encontradas en el an�lisis Punta a Punta (Mock Aspel).

### Prompt de Ejecuci�n (Copiar y pegar al Agente CLI)
``text
Implementa los siguientes parches de QA en el m�dulo de Minimal APIs de MockAspel:

1. **Control de Duplicidad (409 Conflict):** En POST /Polizas, antes de hacer el Add, revisa si ya existe una p�liza con la misma llave compuesta (IntEmpresa + Ejercicio + Periodo + Tipo_Poli + Num_Poliz). Si existe, retorna Results.Conflict("La p�liza ya existe").
2. **Validaci�n de Cuentas (400 Bad Request):** En POST /Polizas, extrae todos los Num_Cta del arreglo de Partidas y haz una consulta a MockCuentas para verificar que todas existan y sean de Tipo == "D". Si falta alguna o es 'A', retorna Results.BadRequest("Cuenta inv�lida o no es de Detalle").
3. **Simulaci�n de Cierre de Mes (403 Forbidden):** Hardcodea una l�gica sencilla: Si el Ejercicio y Periodo de la p�liza enviada corresponden a un mes anterior al mes en curso (ej. si hoy es agosto, e intentan meter una de junio), retorna Results.Forbid() con mensaje "El periodo contable ya est� cerrado".
4. **Efecto Secundario (Saldos):** Crea una funci�n interna que, al guardar la p�liza exitosamente, busque el MockSaldo del Num_Cta y le sume el monto a CargoXX o AbonoXX (dependiendo del mes y de si fue D o H), para que el GET /Query/Saldos responda con data fresca.
5. Al terminar, actualiza el archivo docs/plans/mock-aspel-execution-report.md bajo el t�tulo "Reporte Fase 04" indicando que los parches de QA fueron aplicados.
``
