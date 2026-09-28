ENTREGABLE ADICIONAL: componente único "Catálogo de KPIs" para revisión de negocio

Además de la vista real /dashboard/metrics, crea UN solo componente que muestre TODOS los KPIs juntos,
para que el Tech Lead pueda revisar si falta alguno, si hay que modificar alguno, y qué rol ve cada uno.

- Ruta: /dashboard/metrics/catalog. Accesible para SuperUsuario y Direccion (que no tienen acceso a la
  vista real en esta fase) además de los 15 roles de la Fase 1. Verifica en el código cómo se declaran
  los guards por rol y reutiliza el patrón existente.
- Usa DATOS DE MUESTRA estáticos (sin llamar al backend), con una etiqueta visible "Datos de muestra".
  Así no toca RN-DASH-020/022 y funciona para cualquier rol autorizado.
- Define los KPIs en un único archivo de configuración tipado (por ejemplo kpi-catalog.config.ts),
  una entrada por KPI, con: id, nombre, descripción, grupo (Operativo / Financiero / Soporte-SLA /
  Ejecutivo), estado (Implementado en Fase 1 / Planeado Fase 2, 3 o 4), fuente de datos (entidad o
  endpoint real), tipo de visualización (card, barras, línea, donut), alcance por RoleType
  (Corporate = todos los customers, Staff = customer seleccionado) y lista de roles que lo ven.
- Incluye TODOS los KPIs del prompt.md original (D:\repos\luxuryapp-api\prompt.md, sección 3), no solo
  los de la Fase 1:
  Operativos: pendientes vs completadas, tiempo promedio de resolución, distribución por tipo de operación.
  Financieros: ingresos diarios/mensuales, costos operativos, margen por operación.
  Soporte/Seguridad: tickets abiertos/cerrados, SLA cumplidos vs incumplidos, roles activos y accesos recientes.
  Los de Fases 2-4 se muestran marcados como "Planeado", con la fuente de datos que ya identificó el
  análisis (docs/OperationsLuxuryApp/Dashboard/20260921-analisis-operations-dashboard.md). No inventes
  fuentes que no existan; si un KPI no tiene fuente hoy (ej. margen por operación), márcalo "Sin fuente de datos".
- Layout: agrupado por grupo de KPI, cada KPI renderizado con su visualización de muestra (reutilizando
  <app-chart-wrapper> y las mismas KPI cards de la vista real) y, junto a cada uno, un bloque con estado,
  fuente, alcance y roles que lo ven.
- Al inicio de la página, agrega una matriz de visibilidad: filas = KPIs, columnas = los 17 roles
  candidatos (SuperUsuario, Direccion, Legal, CoordinacionLegal, RecursosHumanos, Reclutamiento,
  GerenteMantenimiento, SistemasGeneral, Mensajeria, SupervisionOperativa, Administrador,
  GerenteOperaciones, GerenteAtencion, Asistente, Contador, Cobranza, JefeMantenimiento), marcando con
  un indicador accesible (icono AppIcon + texto para lectores de pantalla, no solo color) dónde es visible.
  Para SuperUsuario y Direccion muestra "Por definir (Fase 4)".
- Tokens de diseño y reglas de fechas/iconos igual que el resto de la fase. Incluye este componente en
  los greps de tokens y en el build.
- Si la vista real de /dashboard/metrics puede leer la misma configuración para decidir qué KPI mostrar
  por rol, hazlo; si eso obliga a modificar el diseño ya aprobado, no lo hagas y repórtalo como propuesta.

En el reporte (response.md) agrega una sección "Catálogo de KPIs" con: la ruta, el archivo de
configuración, y una tabla resumen de KPI, estado y roles, generada desde lo realmente implementado.
