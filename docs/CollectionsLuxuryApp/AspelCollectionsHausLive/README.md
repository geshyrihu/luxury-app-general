📍 Ruta: 📂 Documentación > 💼 Contabilidad > AspelCobranzaHausLive
📅 Última Revisión: 03-Jul-26
🛡️ Estado: Vigente (Módulo Funcional)
👤 Responsable: Equipo de Desarrollo / GEMINI

> [!CAUTION]
> **BLOQUEO ESTRICTO DE MODIFICACIÓN DE CÓDIGO**
> Este módulo (`AspelCobranzaHausLive`) se encuentra **actualmente estable y totalmente funcional en producción**. 
> Se prohíbe realizar cualquier refactorización, limpieza, o modificación de código en los servicios (`AspelCobranzaHausDetalleAppService.cs`, etc.), DTOs, controladores o interfaces de esta carpeta **SIN LA AUTORIZACIÓN EXPLÍCITA Y DIRECTA DEL USUARIO**.

## 🛑 Reglas para Agentes (IA)
1. **NO TOCAR**: Si estás realizando tareas en módulos adyacentes y el contexto involucra este módulo, **no alteres nada aquí**.
2. **Pedir Permiso**: Si crees que una modificación es absolutamente crítica por un bug, debes detenerte, elaborar un plan y **solicitar confirmación explícita** antes de aplicar cualquier cambio.
3. **El Algoritmo Contable (Cruce de Saldos)**: El cálculo matemático de `SaldoFinal`, y el cruce de `AdvanceBalance` y `DirectCreditBalance` fue ajustado meticulosamente para resolver casos borde. Tocar este código sin entender el flujo completo romperá el cuadre de los avisos de cobro.
4. **Normalización de Pólizas en Rojo**: Al leer auxiliares de Aspel, cualquier monto negativo (ej. abonos en rojo) se convierte automáticamente a monto positivo invirtiendo su naturaleza (Abono -> Cargo, Cargo -> Abono). **NO MODIFICAR ESTO**, es vital para que las reclasificaciones sumen correctamente a la deuda sin reescribir todo el algoritmo.
5. **Reconciliación Visual de Descuentos**: En `ReconcileNegativeConceptBalances`, cuando el saldo de un descuento (ej. "DESCUENTO POR PRONTO PAGO") se usa para matar recibos vencidos de otra cuenta (ej. "CUOTA DE MTTO"), **también se transfiere la columna `TotalCredits`**. Esto garantiza que en el Aviso de Cobro la cuenta de Mantenimiento consolide todos los abonos y refleje el `Pendiente` real en una sola línea, desapareciendo la fila fantasma del descuento.

---
✨ *Cualquier duda, consultar primero.*
