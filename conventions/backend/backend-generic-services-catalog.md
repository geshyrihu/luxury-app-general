# Backend Generic Services Catalog

**Ultima revision:** 2026-07-29

## Objetivo

Mantener un catalogo estandar de servicios genericos backend por caso de uso.

## Casos de uso a cubrir

- respuesta API estandar
- paginacion
- date/time provider
- current user / identity context
- storage
- email
- pdf
- vault / secrets
- logging
- cache
- SignalR / notificaciones

## Regla

Si ya existe servicio generico oficial, debe usarse antes de crear otro.

## Reglas operativas

- Todo nuevo caso de uso debe verificar primero si ya existe servicio generico, helper compartido o contrato transversal aplicable.
- Si no existe, se propone el nuevo servicio como regla o extension del catalogo y se espera aprobacion.
- Si el cambio impacta `Shared`, `Providers`, contratos comunes o infraestructura usada por multiples modulos, debe ir con analisis de impacto y plan.

## Casos sensibles

- `Response<T>` o `ApiResponseDTO`
- paginacion canonica
- identity context / current user
- cache
- storage
- secrets / vault
- email
- SignalR
- PDF
- logging

## Prohibiciones

- No duplicar wrappers de respuesta.
- No crear paginaciones alternas si ya existe contrato canonico.
- No crear servicios de correo o notificacion paralelos sin validar el catalogo.
- No introducir contratos shared por intuicion.
