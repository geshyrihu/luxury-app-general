# Diagnostico de Folios Duplicados - Solicitudes de Compra

**Fecha:** 2026-09-20
**Estado:** Diagnostico completado; correccion de datos pendiente
**Tabla:** `PurchaseRequests`
**Regla objetivo:** folios sin duplicados por `(CustomerId, Folio)` mediante generador controlado

## Resultado

Consulta ejecutada sobre base local `LuxuryBuildingGroup`:

```sql
SELECT CustomerId, Folio, COUNT(*)
FROM PurchaseRequests
WHERE Folio IS NOT NULL
GROUP BY CustomerId, Folio
HAVING COUNT(*) > 1;
```

| Metrica | Resultado |
|---|---:|
| Grupos duplicados | 95 |
| Filas dentro de grupos duplicados | 283 |
| Filas excedentes a resolver | 188 |
| Maximo de filas con un mismo folio | 20 |
| Clientes afectados | 8 |

## Decision

No aplicar `UX_PurchaseRequests_CustomerId_Folio`. La reparacion se ejecutara por
el servicio administrativo y la prevencion quedara en el generador transaccional.

La correccion debe ser reversible y conservar trazabilidad:

1. Exportar respaldo de filas duplicadas y relaciones dependientes.
2. Definir con owner funcional cual registro conserva folio original.
3. Asignar folios nuevos unicos a filas restantes usando generador controlado.
4. Verificar que no cambien `Id`, relaciones, autorizaciones ni ordenes vinculadas.
5. Reejecutar consulta hasta obtener cero grupos duplicados.
6. Ejecutar prueba concurrente de creacion.

## Criterios de seguridad

- No borrar solicitudes para resolver duplicados.
- No cambiar folios automaticamente sin respaldo y aprobacion funcional.
- No reutilizar folios historicos liberados sin regla aprobada.
- Registrar `Id`, folio anterior, folio nuevo, usuario/ejecutor y fecha de cada cambio.
- Validar que Ordenes de Compra, archivos y evidencias sigan vinculados por `Id`.

## Estado tecnico

- Validacion de servicio ya agregada.
- Constraint `UX_PurchaseRequests_CustomerId_Folio` revertido del modelo y ausente
  en la base local.
- Generador corregido para usar maximo real por cliente/periodo y bloqueo SQL Server.
- Metodo administrativo disponible para reasignar duplicados.

## Siguiente accion requerida

Aprobacion del owner funcional para ejecutar `repair-folios`. Conserva el registro
mas antiguo por fecha y `Id`, reasigna los restantes, y revierte toda la transaccion
si ocurre un error.
