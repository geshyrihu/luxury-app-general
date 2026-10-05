# Mapeo de Rutas BD → Constantes ROUTES.*

> Generado el 2026-07-01 como parte del plan `nuevo-plan-navegacion.md`
> Propósito: Documentar el mapeo para actualizar la tabla de rutas en BD después de la migración.

## Convención de Nombres

- Las constantes están en **español** (e.g., `COMPRAS.SOLICITUDES`)
- Los valores de ruta reflejan los **paths reales del routing de Angular**
- Las rutas normalizadas a español se documentan como "ruta canónica"

---

## Mapeo Completo

| Ruta actual en BD | Constante ROUTES.* | Ruta canónica (español) | Notas |
|---|---|---|---|
| `/legal/documents/incorporation-deeds` | `LEGAL.DOCUMENTO_ACTAS` | `/legal/documentos/actas-constitutivas` | Pendiente normalizar |
| `/legal/documents/assemblies` | `LEGAL.DOCUMENTO_ASAMBLEAS` | `/legal/documentos/asambleas` | Pendiente normalizar |
| `/legal/documents/ravine-concession` | `LEGAL.DOCUMENTO_CONCESION_BARRANCA` | `/legal/documentos/concesion-barranca` | Pendiente normalizar |
| `/legal/documents/well-concession` | `LEGAL.DOCUMENTO_CONCESION_POZO` | `/legal/documentos/concesion-pozo` | Pendiente normalizar |
| `/legal/documents/regulations` | `LEGAL.DOCUMENTO_REGLAMENTOS` | `/legal/documentos/reglamentos` | Pendiente normalizar |
| `/legal/documents/contratos-empleados` | `LEGAL.DOCUMENTO_CONTRATOS` | `/legal/documentos/contratos-empleados` | Correcto |
| `/legal/documents/juicios` | `LEGAL.DOCUMENTO_JUICIOS` | `/legal/documentos/juicios` | Correcto |
| `/legal/legal-minutes-pendings` | `LEGAL.MINUTAS_PENDIENTES` | `/legal/minutas-pendientes` | Pendiente normalizar |
| `/legal/legal-matter` | `LEGAL.ASUNTO_LEGAL` | `/legal/asuntos-legales` | Pendiente normalizar |
| `/legal/list-ticket-legal` | `LEGAL.LISTA_TICKETS` | `/legal/tickets` | Pendiente normalizar |
| `/legal/pendings` | `LEGAL.PENDIENTES` | `/legal/pendientes` | Correcto |
| `/legal/reports-internal` | `LEGAL.REPORTES_INTERNOS` | `/legal/reportes-internos` | Pendiente normalizar |
| `/legal/reports-external` | `LEGAL.REPORTES_EXTERNOS` | `/legal/reportes-externos` | Pendiente normalizar |
| `/legal/committee-directory` | `LEGAL.DIRECTORIO_COMITES` | `/legal/directorio-comites` | Pendiente normalizar |
| `/committee-meetings/presentations` | `JUNTAS_COMITE.PRESENTACIONES` | `/juntas-comite/presentaciones` | Pendiente normalizar |
| `/contabilidad` | `CONTABILIDAD.DASHBOARD` | `/contabilidad` | Correcto |
| `/cobranza-nativa` | `COBRANZA_NATIVA.DASHBOARD` | `/cobranza-nativa` | Correcto |
| `/contabilidad/minutes-pendings` | `CONTABILIDAD.MINUTAS_PENDIENTES` | `/contabilidad/minutas-pendientes` | Pendiente normalizar |
| `/contabilidad/financial-statements` | `CONTABILIDAD.ESTADOS_FINANCIEROS` | `/contabilidad/estados-financieros` | Pendiente normalizar |
| `/funding/list` | `FONDEOS.LISTA` | `/fondos-lista` | Pendiente normalizar |
| `/contabilidad/financial-report-sending` | `CONTABILIDAD.ENVIO_REPORTE_FINANCIERO` | `/contabilidad/envio-reportes-financieros` | Pendiente normalizar |
| `/contabilidad/budget` | `CONTABILIDAD.PRESUPUESTO` | `/contabilidad/presupuesto` | Pendiente normalizar |
| `/contabilidad/financial-summary` | `CONTABILIDAD.RESUMEN_FINANCIERO` | `/contabilidad/resumen-financiero` | Pendiente normalizar |
| `/contabilidad/budget-proposal` | `CONTABILIDAD.PROPUESTA_PRESUPUESTO` | `/contabilidad/propuesta-presupuesto` | Pendiente normalizar |
| `/contabilidad/accounting-catalog` | `CONTABILIDAD.CATALOGO_CUENTAS` | `/contabilidad/catalogo-cuentas` | Pendiente normalizar |
| `/contabilidad/budget-execution` | `CONTABILIDAD.EJECUCION_PRESUPUESTO` | `/contabilidad/ejecucion-presupuesto` | Pendiente normalizar |
| `/tickets/groups-list` | `TICKETS.GRUPOS_TRABAJO` | `/tickets/grupos-trabajo` | Pendiente normalizar |
| `/tickets/my-assignments` | `TICKETS.MIS_ASIGNACIONES` | `/tickets/mis-asignaciones` | Pendiente normalizar |
| `/tickets/my-requests` | `TICKETS.MIS_SOLICITUDES` | `/tickets/mis-solicitudes` | Pendiente normalizar |
| `/tickets/legal` | `TICKETS.LEGAL` | `/tickets/legal` | Correcto |
| `/inspections/catalog` | `INSPECCIONES.CATALOGO` | `/inspecciones/catalogo` | Pendiente normalizar |
| `/inspections/my-inspection-list` | `INSPECCIONES.MIS_INSPECCIONES_LISTA` | `/inspecciones/mis-inspecciones` | Pendiente normalizar |
| `/calendars/google-calendar` | `CALENDARIOS.GOOGLE_CALENDAR` | `/calendarios/google-calendar` | Pendiente normalizar |
| `/committee-meetings/presentations` | `JUNTAS_COMITE.PRESENTACIONES` | `/juntas-comite/presentaciones` | Pendiente normalizar |
| `/committee-meetings/minutes` | `JUNTAS_COMITE.MINUTAS` | `/juntas-comite/minutas` | Pendiente normalizar |
| `/contabilidad/budget` | `COMPRAS.PRESUPUESTO` | `/compras/presupuesto` | Pendiente normalizar |
| `/purchases/presupuestos` | `COMPRAS.PRESUPUESTO` | `/compras/presupuestos` | Pendiente normalizar |
| `/purchases/products-services` | `COMPRAS.PRODUCTOS_SERVICIOS` | `/compras/productos-servicios` | Pendiente normalizar |
| `/purchases/purchase-requests` | `COMPRAS.SOLICITUDES` | `/compras/solicitudes` | Pendiente normalizar |
| `/purchases/fixed-expenses-catalog` | `COMPRAS.CATALOGO_GASTOS_FIJOS` | `/compras/catalogo-gastos-fijos` | Pendiente normalizar |
| `/purchases/purchase-orders` | `COMPRAS.ORDENES_COMPRA` | `/compras/ordenes-compra` | Pendiente normalizar |
| `/purchases/paid` | `COMPRAS.ORDENES_PAGADAS` | `/compras/pagadas` | Pendiente normalizar |
| `/purchases/maintenance-budget` | `COMPRAS.PRESUPUESTO_MANTENIMIENTO` | `/compras/presupuesto-mantenimiento` | Pendiente normalizar |
| `/funding/list` | `COMPRAS` (alias) | `/fondos` | Pendiente normalizar |
| `/logbook/maintenance-orders` | `BITACORAS.ORDENES_SERVICIO` | `/bitacoras/ordenes-servicio` | Pendiente normalizar |
| `/logbook/recorrido` | N/A | `/bitacoras/recorrido-diario` | No existe en routing actual |
| `/logbook/meter-list` | `BITACORAS.MEDIDORES` | `/bitacoras/medidores` | Pendiente normalizar |
| `/logbook/pool` | `BITACORAS.ALBERCA` | `/bitacoras/alberca` | Pendiente normalizar |
| `/logbook/elevators-emergency-call` | `BITACORAS.FALLA_ELEVADORES` | `/bitacoras/falla-elevadores` | Pendiente normalizar |
| `/logbook/elevator-spare-parts-change` | `BITACORAS.CAMBIO_REFACCIONES_ELEVADOR` | `/bitacoras/cambio-refacciones-elevador` | Pendiente normalizar |
| `/logbook/water-truck-reception` | `BITACORAS.RECEPCION_PIPAS_AGUA` | `/bitacoras/recepcion-pipas-agua` | Correcto |
| `/warehouse/list` | `ALMACEN.LISTA` | `/almacen/lista` | Pendiente normalizar |
| `/warehouse/product-entry` | `ALMACEN.ENTRADA_PRODUCTOS` | `/almacen/entrada-productos` | Pendiente normalizar |
| `/warehouse/product-output` | `ALMACEN.SALIDA_PRODUCTOS` | `/almacen/salida-productos` | Pendiente normalizar |
| `/warehouse/tool-loan` | `ALMACEN.PRESTAMO_HERRAMIENTAS` | `/almacen/prestamo-herramientas` | Pendiente normalizar |
| `/inventory/extinguishers` | `INVENTARIOS.EXTINTORES` | `/inventario/extintores` | Pendiente normalizar |
| `/inventory/hydrants` | `INVENTARIOS.HIDRANTES` | `/inventario/hidrantes` | Pendiente normalizar |
| `/inventory/manual-call-points` | `INVENTARIOS.ESTACIONES_MANUALES` | `/inventario/estaciones-manuales` | Pendiente normalizar |
| `/inventory/smoke-detectors` | `INVENTARIOS.DETECTORES_HUMO` | `/inventario/detectores-humo` | Pendiente normalizar |
| `/inventory/keys` | `INVENTARIOS.LLAVES` | `/inventario/llaves` | Pendiente normalizar |
| `/inventory/tools` | `INVENTARIOS.HERRAMIENTAS` | `/inventario/herramientas` | Pendiente normalizar |
| `/inventory/radios` | `INVENTARIOS.RADIOS` | `/inventario/radios` | Correcto |
| `/inventory/areas-equipment` | `INVENTARIOS.EQUIPOS_AREAS` | `/inventario/equipos-areas` | Pendiente normalizar |
| `/library/incorporation-deed` | `BIBLIOTECA.ACTA_CONSTITUTIVA` | `/biblioteca/acta-constitutiva` | Pendiente normalizar |
| `/library/assemblies` | `BIBLIOTECA.ASAMBLEAS` | `/biblioteca/asambleas` | Correcto |
| `/library/regulations` | `BIBLIOTECA.REGLAMENTOS` | `/biblioteca/reglamentos` | Correcto |
| `/library/ravine-concession` | `BIBLIOTECA.CONCESION_BARRANCA` | `/biblioteca/concesion-barranca` | Correcto |
| `/library/well-concession` | `BIBLIOTECA.CONCESION_POZO` | `/biblioteca/concesion-pozo` | Correcto |
| `/library/financial-report` | `BIBLIOTECA.INFORME_FINANCIERO` | `/biblioteca/informe-financiero` | Pendiente normalizar |
| `/library/maintenance-policies` | `BIBLIOTECA.POLIZAS_MANTENIMIENTO` | `/biblioteca/polizas-mantenimiento` | Pendiente normalizar |
| `/library/templates` | `BIBLIOTECA.PLANTILLAS` | `/biblioteca/plantillas` | Pendiente normalizar |
| `/library/manuals-and-processes` | `BIBLIOTECA.MANUALES_Y_PROCESOS` | `/biblioteca/manuales-y-procesos` | Pendiente normalizar |
| `/library/painting` | `BIBLIOTECA.PINTURA` | `/biblioteca/pintura` | Correcto |
| `/library/lighting` | `BIBLIOTECA.ILUMINACION` | `/biblioteca/iluminacion` | Correcto |
| `/supervision` | `SUPERVISION.DASHBOARD` | `/supervision` | Correcto |
| `/board-directors/monthly-meetings` | `COMITE.CONSEJO_DIRECTIVO.REUNIONES_MENSUALES` | `/comite/consejo-directivo/reuniones-mensuales` | Pendiente normalizar |
| `/board-directors/meeting-minutes` | `COMITE.CONSEJO_DIRECTIVO.MINUTAS` | `/comite/consejo-directivo/minutas` | Pendiente normalizar |
| `/board-directors/financial-reports` | `COMITE.CONSEJO_DIRECTIVO.INFORMES_FINANCIEROS` | `/comite/consejo-directivo/informes-financieros` | Pendiente normalizar |
| `/board-directors/documents` | `COMITE.CONSEJO_DIRECTIVO.DOCUMENTOS` | `/comite/consejo-directivo/documentos` | Pendiente normalizar |
| `/contabilidad/budget-proposal` | `CONTABILIDAD.PROPUESTA_PRESUPUESTO` | `/contabilidad/propuesta-presupuesto` | Pendiente normalizar |
| `/recursos-humanos` | `RECURSOS_HUMANOS.DASHBOARD` | `/recursos-humanos` | Correcto |
| `/human-resources/dashboard` | `RECURSOS_HUMANOS.DASHBOARD` | `/recursos-humanos` | Alias legacy |
| `/human-resources/my-requests` | `RECURSOS_HUMANOS.MIS_PERMISOS` | `/recursos-humanos/mis-permisos` | Alias legacy |
| `/human-resources/my-vacations` | `RECURSOS_HUMANOS.MIS_VACACIONES` | `/recursos-humanos/mis-vacaciones` | Alias legacy |
| `/human-resources/vacation-calendar` | `RECURSOS_HUMANOS.CALENDARIO_VACACIONES` | `/recursos-humanos/calendario-vacaciones` | Alias legacy |
| `/human-resources/approval` | `RECURSOS_HUMANOS.APROBACIONES` | `/recursos-humanos/aprobaciones` | Alias legacy |
| `/human-resources/register-past-vacations` | `RECURSOS_HUMANOS.VACACIONES_PASADAS` | `/recursos-humanos/vacaciones-pasadas` | Alias legacy |
| `/human-resources/requests-history` | `RECURSOS_HUMANOS.HISTORIAL_SOLICITUDES` | `/recursos-humanos/historial-solicitudes` | Alias legacy |
| `/human-resources/auditoria-vacaciones` | `RECURSOS_HUMANOS.AUDITORIA_VACACIONES` | `/recursos-humanos/auditoria-vacaciones` | Correcto |
| `/announcements/manage` | `ANUNCIOS.ADMIN` | `/anuncios/administrar` | Pendiente normalizar |
| `/utilities/calculate-vat` | `UTILIDADES.CALCULADORA_IVA` | `/utilidades/calculadora-iva` | Pendiente normalizar |
| `/directory/vigilance-committee` | `DIRECTORIO.COMITE_VIGILANCIA` | `/directorio/comite-vigilancia` | Pendiente normalizar |
| `/directory/staff` | `DIRECTORIO.PERSONAL_INTERNO` | `/directorio/personal-interno` | Pendiente normalizar |
| `/directory/external-staff` | `DIRECTORIO.PERSONAL_EXTERNO` | `/directorio/personal-externo` | Pendiente normalizar |
| `/directory/provider` | `DIRECTORIO.PROVEEDORES` | `/directorio/proveedores` | Pendiente normalizar |
| `/directory/emergency-phones` | `DIRECTORIO.TELEFONOS_EMERGENCIA` | `/directorio/telefonos-emergencia` | Pendiente normalizar |
| `/directory/condos` | `DIRECTORIO.CONDOMINOS` | `/directorio/condominos` | Pendiente normalizar |
| `/directory/properties` | `DIRECTORIO.PROPIEDADES` | `/directorio/propiedades` | Correcto |
| `/recruitment/requests` | `RECLUTAMIENTO.SOLICITUDES` | `/reclutamiento/solicitudes` | Correcto |
| `/employee-evaluation/templates/list` | `EVALUACION_EMPLEADOS.PLANTILLAS_LISTA` | `/evaluacion-empleados/plantillas` | Pendiente normalizar |
| `/employee-evaluation/conduct/list` | `EVALUACION_EMPLEADOS.CONDUCTA_LISTA` | `/evaluacion-empleados/evaluaciones` | Pendiente normalizar |
| `/delivery-reception/equipment` | `ENTREGA_RECEPCION.EQUIPOS` | `/entrega-recepcion/equipos` | Pendiente normalizar |
| `/delivery-reception/installations` | `ENTREGA_RECEPCION.INSTALACIONES` | `/entrega-recepcion/instalaciones` | Pendiente normalizar |
| `/delivery-reception/tools` | `ENTREGA_RECEPCION.HERRAMIENTAS` | `/entrega-recepcion/herramientas` | Pendiente normalizar |
| `/delivery-reception/supplies` | `ENTREGA_RECEPCION.INSUMOS` | `/entrega-recepcion/insumos` | Pendiente normalizar |
| `/delivery-reception/maintenance` | `ENTREGA_RECEPCION.MANTENIMIENTOS` | `/entrega-recepcion/mantenimientos` | Pendiente normalizar |
| `/report/access-history` | `REPORTES.HISTORIAL_ACCESO` | `/reportes/historial-acceso` | Pendiente normalizar |
| `/report/supervision-report` | `REPORTES.SUPERVISION` | `/reportes/supervision` | Pendiente normalizar |
| `/maintenance/annual-calendar` | `MANTENIMIENTO.CALENDARIO_ANUAL` | `/mantenimiento/calendario-anual` | Pendiente normalizar |

---

## Instrucciones para actualizar BD

1. Ejecutar UPDATE en la tabla de rutas reemplazando `Route` por la "ruta canónica (español)"
2. Los UUIDs se mantienen igual
3. Los registros con `Active = False` deben verificarse si siguen siendo relevantes
4. Las rutas marcadas como "Alias legacy" deben unificarse a la ruta canónica
5. Las rutas "No existe en routing actual" deben darse de baja si ya no se usan
