# Bitácora de Cambios - Fondeos (AccountingLuxuryApp)

## 2026-10-06 — Implementación de remediaciones de seguridad e integridad (Auditoría)

**Fase/Plan relacionado:** Remediación basada en [20261005-auditoria-accounting-fundings.md](./20261005-auditoria-accounting-fundings.md)
**Ejecutado por:** Agente Antigravity

**Cambios aplicados:**
- Backend: Modificación en `FundingFileEndpoints.cs` para incluir `.RequireAuthorization()` al endpoint de descarga de ZIPs de solicitudes de pago.
- Backend: Modificación en `FundingAppService.cs` para incluir *Guard Clauses* que impiden la mutación (Update, Delete, UpdateOrder, UpdatePurchasePaidStatus) de un fondeo si este ya ha sido verificado.
- Backend: Modificación en `FundingAppService.cs` (`DeleteByIdAsync`) para bloquear lógicamente la eliminación de un fondeo si existen órdenes de compra vinculadas a su periodo/año o a su `FundingId`.
- Backend: Modificación en `FundingAppService.cs` (`AddAsync`) agregando validación de concurrencia y unicidad para evitar duplicación de periodos de fondeo por cliente.

**Desviaciones del plan original:**
- La remediación número 5 (Comités Dinámicos) se ha dejado pospuesta para una fase posterior por instrucción explícita del usuario.

**Pruebas ejecutadas:** Modificaciones estáticas en código, pendientes de build y verificación.
**Pendientes / deuda generada:** N/A
