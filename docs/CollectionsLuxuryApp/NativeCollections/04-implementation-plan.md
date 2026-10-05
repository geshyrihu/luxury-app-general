# Plan de Implementación: Cobranza Nativa

Este documento divide el módulo padre (**Cobranza Nativa**) en sus respectivos **Sub-módulos lógicos**, detallando qué existe, qué falta y el estatus de cada funcionalidad.

---

## 1. Sub-módulo: Dueños y Propiedades (`Core/Members`, `Core/Properties`)

_Gestión de quién recibe la cobranza y cómo se comunica con ellos._

| Funcionalidad                    | DESCRIPCIÓN                                                                                  | Estatus Actual   | Tareas Pendientes (Fases)                                                                                                                 |
| -------------------------------- | -------------------------------------------------------------------------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Preferencias de Notificación** | Configurar independientemente si un dueño/propiedad recibe avisos por SMS, WhatsApp o Email. | 🔴 **Faltante**  | - [ ] Backend: Añadir booleanos (`CanReceiveSms`, etc) a la entidad.<br>- [ ] Frontend: Crear panel de checkboxes en el perfil del dueño. |
| **Relación Dueño-Propiedad**     | Saber a qué propiedad se le cobra y quién es el responsable de pago.                         | 🟢 **Existente** | - (Completado) El sistema base ya maneja esta relación.                                                                                   |

---

## 2. Sub-módulo: Configuración de Reglas (`Core/ChargeTypes`, `Core/LateFees`, `Core/Templates`)

_El cerebro de las reglas de negocio (mora, pronto pago)._

| Funcionalidad                              | DESCRIPCIÓN                                                                               | Estatus Actual  | Tareas Pendientes (Fases)                                                                                               |
| ------------------------------------------ | ----------------------------------------------------------------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Excepción de Fines de Semana**           | Si el vencimiento del descuento cae en sábado/domingo, se traslada al lunes (RN-COB-015). | 🔴 **Faltante** | - [ ] Backend: Inyectar lógica de días hábiles en los validadores.<br>- [ ] Pruebas unitarias para esta regla estricta. |
| **Prevención de Descuentos Incompatibles** | Evitar sumar pronto pago + condonaciones especiales.                                      | 🔴 **Faltante** | - [ ] Backend: Validar antes de aplicar abonos.                                                                         |
| **Configuración UI**                       | Pantallas para que el contador asigne las vigencias y % de mora.                          | 🟡 **Parcial**  | - [ ] Frontend: Ajustar `late-fee-policies` a las nuevas reglas.                                                        |

---

## 3. Sub-módulo: Aplicación de Cargos (`Core/Charges`, `Jobs`)

_El motor que factura._

| Funcionalidad                     | DESCRIPCIÓN                                                       | Estatus Actual  | Tareas Pendientes (Fases)                                        |
| --------------------------------- | ----------------------------------------------------------------- | --------------- | ---------------------------------------------------------------- |
| **Cargos Manuales Restringidos**  | Prohibir cargos sin concepto claro ("cargo genérico").            | 🟡 **Parcial**  | - [ ] Backend: Añadir validación estricta en `ChargeAppService`. |
| **Generación Mensual Automática** | Job que corre el día 1 generando cuotas de mantenimiento.         | 🔴 **Faltante** | - [ ] Backend: Crear `MonthlyChargeJob` en Hangfire.             |
| **Recargos Automáticos**          | Job diario que castiga saldos vencidos.                           | 🔴 **Faltante** | - [ ] Backend: Crear `LateFeeCalculationJob` en Hangfire.        |
| **Triggers de Notificación**      | Disparar avisos el día 1 y 3 días antes de vencer el pronto pago. | 🔴 **Faltante** | - [ ] Backend: Conectar el Dispatcher al terminar el Job.        |

---

## 4. Sub-módulo: Pagos y Referencias (`Core/Payments`, `Core/References`)

_El motor de recepción de dinero y conciliación._

| Funcionalidad                       | DESCRIPCIÓN                                                          | Estatus Actual  | Tareas Pendientes (Fases)                                                                                           |
| ----------------------------------- | -------------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Importación Excel (Referencias)** | Cargar referencias bancarias vía Layout Excel y asociarlas a cargos. | 🔴 **Faltante** | - [ ] Backend: Crear `ReferenceImportAppService`.<br>- [ ] Frontend: Crear pantalla Drag&Drop para mapear columnas. |
| **Unicidad de Referencias**         | No permitir que una referencia bancaria se asigne dos veces.         | 🔴 **Faltante** | - [ ] Backend: Índice UNIQUE en base de datos y validación.                                                         |
| **Pago Manual Estricto**            | Exigir PDF/JPG y comprobante antes de guardar.                       | 🟡 **Parcial**  | - [ ] Frontend: Bloquear formulario si no hay adjunto válido.                                                       |
| **No Borrado de Pagos**             | Solo se permite cancelar vía nota de crédito/reverso (RN-COB-001).   | 🔴 **Faltante** | - [ ] Backend: Eliminar endpoint DELETE, forzar reverso.                                                            |

---

## 5. Sub-módulo: Estado de Cuenta (`Core/Statements`)

_Visibilidad de los saldos._

| Funcionalidad                     | DESCRIPCIÓN                                               | Estatus Actual | Tareas Pendientes (Fases)                                                 |
| --------------------------------- | --------------------------------------------------------- | -------------- | ------------------------------------------------------------------------- |
| **Vista Global (Administrativa)** | Tabla completa con saldos por edificio, propiedad y mora. | 🟡 **Parcial** | - [ ] Frontend: Optimizar filtros en `native-statement`.                  |
| **Vista Aislada (Condómino)**     | El usuario solo ve su propia deuda (RN-COB-022).          | 🟡 **Parcial** | - [ ] Backend: Asegurar que el DTO filtre forzosamente por Token/Usuario. |

---

## 6. Sub-módulo: Integración Contable (`Core/AspelExport`)

_La salida de datos a los sistemas financieros._

| Funcionalidad                 | DESCRIPCIÓN                                                            | Estatus Actual  | Tareas Pendientes (Fases)                                                                                                                                           |
| ----------------------------- | ---------------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Generador de Layout Aspel** | Generar archivo Excel/TXT compatible con pólizas dinámicas de Aspel.   | 🔴 **Faltante** | - [ ] Backend: Crear `AspelExportAppService` que cruce pagos/cargos de un periodo cerrado.<br>- [ ] Frontend: Pantalla para seleccionar mes y descargar el archivo. |
| **Candado de Exportación**    | Evitar exportar un mismo cargo dos veces o exportar periodos abiertos. | 🔴 **Faltante** | - [ ] Backend: Marcar `IsExported = true` en los registros.                                                                                                         |
