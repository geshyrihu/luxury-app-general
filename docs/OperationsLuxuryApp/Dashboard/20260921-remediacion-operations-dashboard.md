# Remediación Fase 1.2 — Dashboard de Métricas (OperationsLuxuryApp)

Origen: revisión del orquestador sobre el código real de la Fase 1.2 (plan: `20260921-plan-operations-dashboard.md`).
El build ya compila. No modifiques lo que funciona. No vuelvas a implementar el catálogo: ya existe, solo se corrige.
Ignora `D:\repos\luxuryapp-api\promtp2.md` (entregable ya cumplido).

Rutas base: `appsweb\angular\src\app\modules\operations.luxuryapp\dashboard\metrics\`

## Ajustes (solo estos 6)

### En `catalog\kpi-catalog.config.ts` y `catalog\kpi-catalog.html`

1. **Fuentes de datos inventadas.** Elimina `Invoices, Payments // Asumido`, `Expenses`, `SupportTickets`. Usa SOLO fuentes reales de `docs\OperationsLuxuryApp\Dashboard\20260921-analisis-operations-dashboard.md`:
   - Tickets abiertos/cerrados y SLA cumplidos vs incumplidos: `TaskRecord (Tasks): Status, ClosedDate, BreachedAt/BreachedDay (tolerancia de 5 días fija en código, sin catálogo de SLA)`.
   - Ingresos diarios/mensuales y Costos operativos: `Agregados de AccountingLuxuryApp/FinancialAccounting (nivel tenant/cliente); ServiceOrder.Price es el único costo por operación`.
   - Margen por operación: `Sin fuente de datos (no existe ingreso por operación)`.
   - Roles activos y accesos recientes: `Por confirmar (no explorado en el análisis)`.
2. **Roles inventados.** Para los KPIs planeados de Fases 2-4 deja `roles` vacío y muéstralo en la matriz como texto "Por definir" (no la X). Los 3 KPIs operativos de Fase 1 conservan los 15 roles.
3. **Alcance.** En los 3 KPIs operativos cambia el alcance a "Corporate: todos los customers / Staff: customer de sesión" (ajusta el tipo union si hace falta).
4. **Roles por tarjeta.** En cada tarjeta de KPI agrega la línea "Roles que lo ven:" con la lista real de roles, o "Por definir con negocio".
5. **Tokens.** En `kpi-catalog.html` (líneas ~55, 56, 63) reemplaza `text-white` y `bg-black bg-opacity-50` por tokens `var(--ds-*)` que existan en `appsweb\angular\src\styles` (verifícalo, no lo supongas).

### En `components\dashboard-metrics-filters.ts`

6. Elimina `new Date(today)` (línea ~103) y usa `DateService` (busca si tiene método para restar días; si no existe, repórtalo en lugar de improvisar). Borra el comentario de borrador "Wait, prompt dice..." y los comentarios largos del `ngOnInit`.

## Verificación obligatoria (pega la salida real, no un resumen)

- `npx ng build --configuration development` en `appsweb\angular`.
- Grep de `new Date|text-white|bg-black|#[0-9a-fA-F]{3,6}|Invoices|Expenses|SupportTickets|Asumido` sobre TODO `metrics\` (*.ts y *.html). Debe dar 0 coincidencias, salvo justificación explícita.

## Reporte

Reemplaza `D:\repos\luxuryapp-api\response.md` con un reporte NUEVO y breve que trate solo estos 6 puntos: qué cambiaste en cada uno, cómo lo verificaste, y la salida real de build y grep. No copies el reporte anterior. No agregues explicaciones sobre errores que no hayas reproducido.
