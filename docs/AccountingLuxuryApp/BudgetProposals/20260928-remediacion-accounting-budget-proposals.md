# BitÃ¡cora de RemediaciÃ³n - Budget Proposals
**Fecha:** 2026-09-28
**MÃ³dulo:** AccountingLuxuryApp
**SubmÃ³dulo:** BudgetProposals

Este documento registra todas las correcciones, ajustes y refactorizaciones realizadas en el mÃ³dulo de Presupuesto Propuesta tanto en Backend (C#) como en Frontend (Angular), para asegurar su correcto funcionamiento.

---

## 1. Backend (C#) - `BudgetProposalService.cs`

### 1.1 CorrecciÃ³n del filtro de Cuentas Disponibles (Cuentas Hoja de Nivel 2)
* **Problema:** Cuentas nuevas creadas en Aspel con formato de nivel 2 (ej. `609-001-000`, `608-001-000`) no aparecÃ­an en el modal de "AÃ±adir Cuenta" del frontend a pesar de ser cuentas operativas reales (sin hijos).
* **Causa:** ExistÃ­a un filtro estricto por cÃ³digo (`isPart3Zero`) en `GetAvailableAspelAccountsAsync` que descartaba forzosamente cualquier cuenta cuyo tercer segmento fuera `000`, asumiendo errÃ³neamente que todas las cuentas hoja deben ser de nivel 3.
* **SoluciÃ³n:** Se eliminÃ³ el filtro estÃ¡tico `isPart3Zero`. Ahora el sistema delega y confÃ­a correctamente en la bandera `!cuenta.EsFilaAgrupadora` proporcionada directamente por el catÃ¡logo de Aspel.

### 1.2 NormalizaciÃ³n de NÃºmeros de Cuenta Aspel
* **Problema:** Inconsistencias al sincronizar datos histÃ³ricos y de propuestas debido a que Aspel enviaba en ocasiones cuentas con sub-sufijos de 4 bloques (ej. `609-001-000-000`).
* **SoluciÃ³n:** Se aplicÃ³ el mÃ©todo auxiliar `NormalizeAccountNumber` para limpiar de forma consistente los sufijos `-000` adicionales, asegurando que las comparaciones en diccionarios y LINQ funcionen correctamente durante la creaciÃ³n y actualizaciÃ³n de partidas.

### 1.3 PrevenciÃ³n de CondiciÃ³n de Carrera en `TotalAmount`
* **Problema:** Al actualizar partidas concurrentemente, el cÃ¡lculo en memoria de `TotalAmount` en la propuesta se desincronizaba.
* **SoluciÃ³n:** Se reemplazÃ³ la acumulaciÃ³n matemÃ¡tica en memoria por una re-totalizaciÃ³n directa y segura desde la base de datos dentro de `UpdateProposalItemAsync` mediante la funciÃ³n `RecalculateProposalTotalsFromDatabaseAsync`.

---

## 2. Frontend (Angular) - `presupuesto-propuesta.ts` & `.html`

### 2.1 Visibilidad y CÃ¡lculo en Tiempo Real de Filas Agrupadoras (Totales)
* **Problema:** 
  1. Los montos de los totales agregadores no se calculaban en la vista "Normal".
  2. Cuando el usuario editaba el input numÃ©rico, los grupos padre no se actualizaban inmediatamente.
  3. El texto de la fila agrupadora era negro sobre un fondo azul (ilegible).
* **SoluciÃ³n:** 
  1. Se eliminÃ³ la restricciÃ³n de que `calculateAggregateTotals` solo corriera en las vistas de niveles, ejecutÃ¡ndolo incondicionalmente en `applyFilters()`.
  2. Se invocÃ³ explÃ­citamente `this.applyFilters()` en el handler `onProposedAmountChange(item)`, permitiendo que el estado de los padres se regenere en tiempo real y sin perder el foco del input del usuario (Angular Signals reactivity).
  3. En `presupuesto-propuesta.html`, se inyectÃ³ la clase `[class.text-white]="item.nivelCuenta === 1"` en las filas agrupadoras para sobreescribir el estilo base de Bootstrap y forzar el color blanco.

### 2.2 CorrecciÃ³n de fÃ³rmulas de Diferencia y Porcentaje (DIF y %)
* **Problema:** La vista principal calculaba de forma errÃ³nea los indicadores visuales `DIF` y `%`, basÃ¡ndose en los gastos promediados en lugar del presupuesto real vigente.
* **SoluciÃ³n:** Se ajustaron las funciones matemÃ¡ticas en el frontend para realizar los cÃ¡lculos de DIF y % tomando como base la propiedad `item.currentAmount` entregada por la API, alineando asÃ­ los nÃºmeros mostrados con la regla de negocio aprobada.

### 2.3 Corrección en columna "PROM MENSUAL" del Footer (Filas Totales)
* **Problema:** En el pie de página de la tabla de totales, la columna "PROM MENSUAL" repetía el valor del *gasto promedio mensual* tanto para la fila "TOTAL PRESUP. MES" como para "TOTAL GASTO MES" (ej. mostrando 812,648 en ambas).
* **Solución:** Se ajustó la plantilla HTML (presupuesto-propuesta.html) para que la primera fila del footer ("TOTAL PRESUP. MES") mande a llamar a la función getTotalAverageMonthlyBudget() en lugar de getTotalAverageMonthlyExpense(), reflejando así de forma correcta el promedio presupuestado.

### 2.4 Ignorar Decimales en el Resaltado de Exceso de Presupuesto
* **Problema:** El sistema marcaba falsamente en color rojo el gasto de un mes (ej. JARDINERIA en mayo) porque la comparación consideraba decimales matemáticos invisibles en la UI (ej. Gasto 17000.01 > Presupuesto 17000.00).
* **Solución:** Se creó una función auxiliar gastoExcedePresupuesto(item, month) en presupuesto-propuesta.ts que implementa Math.round() tanto para el gasto como para el presupuesto antes de compararlos. Se actualizó el HTML para consumir este helper y así evitar que diferencias de centavos disparen la alerta visual roja.

### 2.5 Limpieza Visual: Ocultar Agrupadores en Vista Normal
* **Problema:** En la vista "Normal", la tabla se veía visualmente saturada porque mostraba tanto las cuentas detalle (hojas) como sus respectivas filas agrupadoras (Mayor y Nivel 2), duplicando la información y ocupando mucho espacio vertical.
* **Solución:** Se modificó la lógica del método pplyFilters() en presupuesto-propuesta.ts para que, cuando el modo seleccionado sea "normal", se filtren y oculten automáticamente todas las filas donde esFilaAgrupadora === true. De esta manera, la vista normal queda limpia exclusivamente para visualizar y capturar presupuestos sobre las cuentas de último nivel, delegando los totales por grupo a las vistas dedicadas ("Mayor" y "2do Nivel").

### 2.6 Arreglo de Visibilidad y Color Institucional en Vistas Agrupadas
* **Problema:** Al utilizar los filtros de vista "Mayor" y "2do Nivel", el texto de las filas desaparecía porque la clase .fila-vista-agregada estaba forzando un fondo blanco (ar(--rf-surface)) mientras que el HTML forzaba el texto a ser blanco. Adicionalmente, el usuario solicitó cambiar el fondo azul (ar(--rf-navy)) de las cuentas de Mayor por un gris más institucional.
* **Solución:** 
  - Se eliminaron las clases restrictivas de texto blanco duro (	ext-white) en las celdas congeladas del HTML.
  - En _financial-tables.scss, se reemplazó el color azul oscuro por un gris institucional oscuro (#475569) para .fila-nivel-1 y un gris institucional claro (#e2e8f0) para .fila-nivel-2-agrupadora.
  - Se eliminó la regla que forzaba el fondo blanco en .fila-vista-agregada, permitiendo que en las vistas "Mayor" y "2do Nivel" las filas conserven sus respectivos colores grises institucionales, solucionando así el problema de contraste de texto invisible.

### 2.7 Corrección de Cuentas de Último Nivel en Filtros de Agrupación
* **Problema:** Al utilizar el filtro "2do Nivel", se estaban mostrando erróneamente cuentas de último nivel (hojas editables) que pertenecían al segundo o primer nivel jerárquico (ej. 608-001-000 ACTUALIZACIONES). Esto ensuciaba la vista de agrupadores con celdas de captura blancas.
* **Solución:** Se ajustó la lógica en pplyFilters() dentro de presupuesto-propuesta.ts para exigir estrictamente la condición p.esFilaAgrupadora === true cuando se filtra por las vistas "Mayor" (level1) y "2do Nivel" (level2). Esto garantiza que los filtros superiores de la tabla muestren exclusivamente las filas calculadas de totales y oculten por completo cualquier fila transaccional de captura, respetando la pureza de la vista ejecutiva.

### 2.8 Resaltado en Rojo para Excesos de Presupuesto en Cuentas Agrupadoras
* **Problema:** La lógica visual que pinta de rojo el texto y el fondo cuando un gasto mensual sobrepasa lo presupuestado solo estaba aplicándose a las cuentas de último nivel (hojas). Los bloques consolidadores (Mayor y 2do Nivel) no alertaban visualmente el exceso, como se observó en la vista ejecutiva de "GASTOS DE PERSONAL".
* **Solución:** Se extendió el uso de las clases condicionales 	ext-red-700 y g-red-50 al bloque HTML que renderiza las filas esFilaAgrupadora. Ambas validaciones consumen la misma regla de negocio sin decimales (gastoExcedePresupuesto). Ahora, un sobregiro a nivel global o departamental será inmediatamente visible con resaltado rojo en las vistas agregadas.

### 2.9 Reparación de Eliminación de Datos UI al Marcar Partidas y Nuevos Filtros de Finalización
* **Problema 1:** Al hacer clic en "Listo" para marcar una partida como finalizada, la interfaz sobreescribía los montos de gasto y presupuesto del mes a 0 (mostrando " - "), debido a que la respuesta del endpoint de FinalizeItem devuelve el DTO del esquema primario de la base de datos sin volver a inyectar el enriquecimiento externo y costoso de Aspel, y la UI fusionaba incondicionalmente estos 0s destructivos contra su estado local.
* **Problema 2:** El usuario requería una forma rápida de filtrar la tabla para solo ver las cuentas que le falta trabajar.
* **Solución 1:** Se reescribió la lógica del método patchItemInState dentro de presupuesto-propuesta.ts introduciendo una función segura (pplySafeUpdate). Esta función solo permite sobreescribir los estados que corresponden puramente a la finalización (isFinalized, inalizedByUserName, etc.) o aquellos que no hayan venido indefinidos, protegiendo herméticamente las propiedades enriquecidas para evitar el borrado destructivo en la UI que forzaba al usuario a recargar la página.
* **Solución 2:** Se transformaron los *badges* informativos ("Por trabajar", "Finalizadas", "Pendientes") de la cabecera en botones accionables de filtro. Al presionarlos, el estado global de la vista iewMode cambia a "normal" (vista de hoja) y se ocultan dinámicamente las partidas que no cumplen la condición.

---

## 3. Entregables Adicionales
* Se generÃ³ de forma automatizada un AnÃ¡lisis de Brechas de Calidad (QA) (`qa_gap_analysis_presupuesto_propuesta.md`), documentando casos borde faltantes.








### 2.10 Sincronización Real-Time SignalR (Listo / Eliminar)
- **Problema:** Los cambios de estado de 'Listo' y la eliminación de cuentas no se reflejaban en tiempo real para otros usuarios conectados al mismo grupo (cliente/ejercicio), o, si lo hacían, sobreescribían y borraban la data enriquecida (Aspel) local.
- **Solución UI:** Se actualizó handleBudgetProposalItemUpdate para utilizar patchItemInState y se añadió suscripción y método handleBudgetProposalItemDelete en presupuesto-propuesta.ts.
- **Solución Backend:** Se añadió el evento SignalR ReceiveBudgetProposalItemDelete mediante SendBudgetProposalItemDeleteAsync e IBudgetProposalRealTimeService, inyectándolo en el endpoint DELETE y recogiendo el excludedConnectionId por *query parameter*.
