# Análisis de Brechas QA y Arquitectura (Punta a Punta) - Mock Aspel COI

## Objetivo
Auditoría destructiva del módulo `LuxuryApp.Infrastructure.MockAspel` recién implementado en la Fase 03, validando cumplimiento de casos borde, integridad y máquinas de estado estipulados en los requerimientos maestros (`../../../docs/AccountingLuxuryApp/Aspel/20260801-plan-accounting-aspel-integracion.md`).

## 📊 Matriz de Hallazgos y Vulnerabilidades

| Proceso / Entidad | Vulnerabilidad Encontrada (Brecha) | Causa Raíz | Solución Propuesta |
| :--- | :--- | :--- | :--- |
| **Pólizas (Creación)** | **Duplicidad cruda (Error 500):** Si se envía dos veces la misma póliza (`Tipo_Poli` + `Num_Poliz` + `Periodo` + `Ejercicio`), EF Core arrojará una excepción de base de datos (`DbUpdateException`) por el índice único, resultando en un error 500 en lugar del `409 Conflict` requerido. | Falta de validación preventiva (bloqueo lógico) o `try-catch` con mapeo de excepción a `BusinessException`. | Implementar un chequeo `AnyAsync` preventivo antes del `Add`, o capturar la excepción SQL/EF para retornar `Results.Conflict()`. |
| **Pólizas (Cierre)** | **Omisión de Periodos Cerrados:** Se pueden insertar o modificar pólizas en cualquier mes, ignorando la regla `RN-POL-03` de regresar `403 Forbidden` si el periodo ya fue cerrado o auditado. | El simulador no cuenta con una tabla de `MockPeriodosContables` para determinar qué meses están bloqueados. | Crear configuración en memoria que asuma ciertos meses cerrados o un flag quemado para simular la RN-POL-03. |
| **Pólizas (Relaciones)** | **Orfandad de Cuentas (Error 500/Sin validar):** El endpoint recibe un arreglo de `Partidas`. Si un `Num_Cta` inyectado no existe en `MockCuentas`, el sistema arrojará una violación de llave foránea o lo aceptará si no hay constraint duro, violando la regla `RN-POL-02` (Debe ser `400 Bad Request`). | Falta de validación de pertenencia. La API confía ciegamente en el payload del Frontend. | Realizar un `.CountAsync` de las cuentas en la BD filtrado por los `Num_Cta` recibidos y comparar que todas existan antes de guardar. |
| **Saldos (Efecto Secundario)** | **Saldos Inconsistentes (Descuadre futuro):** Al insertar una póliza exitosamente, el mock guarda la póliza pero *no actualiza* automáticamente la tabla `MockSaldos` ni recalcula. Esto significa que el `GET /Query/Saldos` mostrará información obsoleta. | Falta de un Trigger de software (Side-effect). En Aspel COI real, una póliza afecta el saldo automáticamente. | Crear un servicio/método interno `UpdateSaldoOnPolizaCreated` que se mande llamar dentro del endpoint después del cuadre y antes del `SaveChangesAsync`. |

---

## 🛑 Conclusión del Arquitecto
El agente CLI hizo un trabajo excelente implementando el "camino feliz" (Happy Path) y la regla de cuadre contable (Debe == Haber ➔ 422). Sin embargo, bajo un entorno real de uso por parte del Frontend, estas brechas provocarán errores 500 confusos y saldos congelados.

**ACCIÓN REQUERIDA:**
Según el protocolo, **NO** implementaré ni delegaré la creación de estos parches sin tu aprobación explícita. 

¿Autorizas que formulemos la "Fase 04: Parches de QA y Consistencia" para enviar al agente CLI a tapar estas brechas?
