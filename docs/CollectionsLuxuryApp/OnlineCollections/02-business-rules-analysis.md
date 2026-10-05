# FASE 0: Business Rules Analysis - Cobranza Online

**Fecha:** 2026-07-31
**Módulo:** Cobranza Online

Este documento formaliza las reglas de negocio del módulo según el estándar `AGENT_AUDIT_PROTOCOL.md` (FASE 0).

---

## Nivel 1: Invariantes de Dominio
Restricciones inmutables (leyes físicas del negocio).

- **RN-COB-001 (Sincronización Transaccional):** La sincronización con Aspel (401) es una operación atómica que debe reflejar fielmente los saldos exactos al momento de la consulta.
- **RN-COB-002 (Preservación Presupuestal):** El módulo de Cobranza Online es exclusivamente de lectura/análisis para los saldos operativos y **no debe** modificar partidas ni contratos de presupuesto en su operación diaria.

## Nivel 2: Flujo y Estados
Ciclos de vida y transiciones.

- **RN-COB-003 (Drilldown de Cuentas):** El flujo de análisis permite desglosar desde el nivel de Cuenta Resumen (401 global) hacia Cuentas de Departamento (subcuentas), y finalmente al histórico detallado (Estado de Cuenta y Pólizas).
- **RN-COB-004 (Estado de Sincronización):** El dashboard notifica el estado de los datos (fresco, aceptable, desactualizado) basado en la métrica `CobranzaOnlineSyncMetadata`.

## Nivel 3: Seguridad y Autorización (RBAC)
Quién puede hacer qué.

- **RN-COB-005 (Acceso a Sincronización Manual):** Los endpoints de `AspelSyncEndPoints` (Sincronización Completa, Contabilidad y Cobranza) están estrictamente limitados al rol `SoloSuperUsuario` (`.RequireAuthorization("SoloSuperUsuario")`). 
- **RN-COB-006 (Visualización de Dashboard):** El acceso al dashboard, análisis y reporte financiero está protegido y filtrado por `CustomerId` para garantizar el aislamiento de datos (Multi-tenant).

## Nivel 4: Validación de Datos
Formatos, límites y constraints.

- **RN-COB-007 (Validación de Clientes Omitidos):** En la sincronización (`AspelSyncEndPoints`), se valida si el cliente está en la lista de exclusión (`CobranzaOnlineCustomerScope.IsOmittedCustomer`). Si lo está, la sincronización se aborta preventivamente devolviendo éxito con una bandera de omitido, evitando alterar datos sensibles protegidos.
- **RN-COB-008 (Parámetros Temporales):** Las consultas de estados de cuenta y dashboards requieren obligatoriamente parámetros válidos de Año (`year:int`) y en su caso Mes/Día (`month:int`, `day:int`) consistentes con el calendario fiscal.
