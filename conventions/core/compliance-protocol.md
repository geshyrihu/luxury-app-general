# Compliance Protocol

**Ultima revision:** 2026-07-30
**Deriva de:** [CONVENTIONS.md](../CONVENTIONS.md)

## Proposito

Formalizar el ciclo obligatorio de cumplimiento para auditorias, remediaciones,
migraciones, cambios documentales y ejecuciones de agentes.

## Regla de oro

Toda accion relevante debe alinearse con el sistema rector vigente antes de
ejecutarse. Si falta la regla o hay contradiccion con legacy, no se improvisa:
se reporta, se propone y se espera aprobacion cuando corresponda.

## Ciclo oficial de compliance

1. leer `CONVENTIONS.md` y el stack aplicable
2. auditar o diagnosticar el caso
3. reportar y clasificar hallazgos
4. crear plan por fases con checklist si hay cambios materiales
5. esperar revision/aprobacion cuando aplique
6. ejecutar bajo el plan aprobado
7. reauditar o reverificar
8. sincronizar documentos, indices, viewer y bitacora si la regla cambio

## Reglas operativas

- no se salta de diagnostico a ejecucion en cambios sensibles
- no se toma un documento legacy como fuente normativa primaria
- no se activan reglas nuevas que contradigan codigo vivo sin plan de migracion
- no se cierran auditorias oficiales sin reporte, clasificacion y plan
- no se crean documentos paralelos si ya existe el documento oficial
- toda regla aprobada debe reflejarse en el sistema completo

## Casos que exigen control formal

- cambios sobre shared, contratos o servicios transversales
- cambios de rutas publicas o payloads serializados
- cambios de reglas financieras, de seguridad o autorizacion
- alineaciones grandes de estructura o namespaces
- remediaciones de modulos con legacy fuerte
- creacion o ajuste de reglas del sistema de convenciones

## Resultado esperado

- agentes distintos ejecutan con el mismo criterio
- la autoridad documental siempre apunta al sistema rector vigente
- la auditoria y la remediacion conservan trazabilidad completa

## Fuentes historicas absorbidas

- [PROTOCOLO_COMPLIANCE_CONVENCIONES.md](../../PROTOCOLO_COMPLIANCE_CONVENCIONES.md)
- [agent-audit-protocol.md](../../agent-audit-protocol.md)


