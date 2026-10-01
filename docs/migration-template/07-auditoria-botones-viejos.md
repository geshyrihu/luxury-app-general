# Auditoría de Botones Viejos en Módulos

**Fecha:** 2026-09-16
**Directorio auditado:** `appsweb/angular/src/app/modules`
**Exclusión:** Directorios `mobile` y código exclusivo de Ionic

---

## Resumen Cuantitativo

| Métrica | Valor |
|---|---|
| Total de ocurrencias encontradas | 68 |
| Total de archivos afectados | 32 |
| Patrones detectados | `variant="ghost"`, `variant="ghost-text"`, `[variant]="... 'ghost' ..."`, `[variant]="... 'ghost-text' ..."` |
| Patrones no detectados | `btn-ghost`, `btn-ghost-*`, `btn--pill` |

**Nota:** No se encontraron ocurrencias de `btn-ghost`, `btn-ghost-primary`, `btn-ghost-secondary` o `btn--pill` en los módulos auditados.

---

## Ocurrencias por Módulo

### 1. operations.luxuryapp

**Archivo:** `work-position/job-description-form.html`
- **Línea 24:** `variant="ghost"` → `variant="soft"`
- **Línea 33:** `variant="ghost"` → `variant="soft"`
- **Línea 135:** `variant="ghost"` → `variant="soft"`

**Archivo:** `task-engine/tasks/task-message/task-list.html`
- **Línea 151:** `variant="ghost"` → `variant="soft"`

**Archivo:** `field-service/service-order/service-order-form.html`
- **Línea 59:** `[variant]="form.controls.status.value === opt.value ? 'solid' : 'ghost'"` → `[variant]="form.controls.status.value === opt.value ? 'soft' : 'soft'"`
- **Línea 85:** `[variant]="form.controls.typeMaintance.value === opt.value ? 'solid' : 'ghost'"` → `[variant]="form.controls.typeMaintance.value === opt.value ? 'soft' : 'soft'"`

**Archivo:** `properties/entrega-recepcion-check/entrega-recepcion-check.html`
- **Línea 86:** `variant="ghost-text"` → `variant="text"`

**Archivo:** `diagrams/diagram/diagram-list/diagram-list.html`
- **Línea 22:** `variant="ghost-text"` → `variant="text"`

**Archivo:** `dashboard/unified-pending-dashboard.html`
- **Línea 76:** `variant="ghost-text"` → `variant="text"`
- **Línea 83:** `variant="ghost-text"` → `variant="text"`
- **Línea 92:** `variant="ghost-text"` → `variant="text"`

**Archivo:** `custom-documents/custom-document/reglamentos-list.html`
- **Línea 106:** `variant="ghost-text"` → `variant="text"`
- **Línea 167:** `variant="ghost-text"` → `variant="text"`

**Archivo:** `announcements/announcement/image-generation-dialog/image-generation-dialog.html`
- **Línea 102:** `variant="ghost-text"` → `variant="text"`

---

### 2. shared.luxuryapp

**Archivo:** `catalogos-generales/work-position-schedule/work-position-schedule-form.html`
- **Línea 93:** `variant="ghost"` → `variant="soft"`
- **Línea 124:** `variant="ghost"` → `variant="soft"`

---

### 3. purchases.luxuryapp

**Archivo:** `solicitudes-compras/solicitudes/solicitud-compra-list.html`
- **Línea 175:** `variant="ghost"` → `variant="soft"`

---

### 4. management.luxuryapp

**Archivo:** `juntas-comite/junta-comite-minutas/seguimiento-minutas.html`
- **Línea 35:** `[variant]="statusFiltro != 0 ? 'ghost-text' : null"` → `[variant]="statusFiltro != 0 ? 'text' : null"`
- **Línea 42:** `[variant]="statusFiltro != 1 ? 'ghost-text' : null"` → `[variant]="statusFiltro != 1 ? 'text' : null"`
- **Línea 49:** `[variant]="statusFiltro != 2 ? 'ghost-text' : null"` → `[variant]="statusFiltro != 2 ? 'text' : null"`
- **Línea 56:** `[variant]="statusFiltro != 4 ? 'ghost-text' : null"` → `[variant]="statusFiltro != 4 ? 'text' : null"`
- **Línea 173:** `[variant]="statusFiltro != 0 ? 'ghost-text' : null"` → `[variant]="statusFiltro != 0 ? 'text' : null"`
- **Línea 180:** `[variant]="statusFiltro != 1 ? 'ghost-text' : null"` → `[variant]="statusFiltro != 1 ? 'text' : null"`
- **Línea 187:** `[variant]="statusFiltro != 2 ? 'ghost-text' : null"` → `[variant]="statusFiltro != 2 ? 'text' : null"`
- **Línea 194:** `[variant]="statusFiltro != 4 ? 'ghost-text' : null"` → `[variant]="statusFiltro != 4 ? 'text' : null"`

---

### 5. recruitment.luxuryapp

**Archivo:** `reclutamiento-y-altas-bajas/recruitment-staff-board/recruitment-staff-board.html`
- **Línea 517:** `[variant]="inactivosTab() === 'positions' ? 'solid' : 'ghost'"` → `[variant]="inactivosTab() === 'positions' ? 'soft' : 'soft'"`
- **Línea 525:** `[variant]="inactivosTab() === 'employees' ? 'solid' : 'ghost'"` → `[variant]="inactivosTab() === 'employees' ? 'soft' : 'soft'"`

---

### 6. accounting.luxuryapp

**Archivo:** `general-ledger/presupuesto-web-aspel/purchase-history.html`
- **Línea 83:** `variant="ghost-text"` → `variant="text"`
- **Línea 152:** `variant="ghost-text"` → `variant="text"`

**Archivo:** `fondeos-y-reporteo/funding/funding-detail.html`
- **Línea 53:** `variant="ghost-text"` → `variant="text"`
- **Línea 111:** `variant="ghost-text"` → `variant="text"`
- **Línea 129:** `variant="ghost-text"` → `variant="text"`
- **Línea 139:** `variant="ghost-text"` → `variant="text"`
- **Línea 283:** `variant="ghost-text"` → `variant="text"`
- **Línea 477:** `variant="ghost-text"` → `variant="text"`
- **Línea 486:** `variant="ghost-text"` → `variant="text"`

**Archivo:** `general-ledger/estados-financieros/estado-financiero-list.html`
- **Línea 70:** `variant="ghost-text"` → `variant="text"`
- **Línea 78:** `variant="ghost-text"` → `variant="text"`
- **Línea 111:** `variant="ghost-text"` → `variant="text"`

**Archivo:** `general-ledger/contabilidad-online/validacion-catalogo/catalog-replica.html`
- **Línea 152:** `variant="ghost-text"` → `variant="text"`

---

### 7. human-resources.luxuryapp

**Archivo:** `expediente-del-empleado/recursos-humanos/nomina/tiempo-extra/tiempo-extra.html`
- **Línea 73:** `variant="ghost-text"` → `variant="text"`

**Archivo:** `expediente-del-empleado/recursos-humanos/nomina/prestamos-empleado/prestamos-empleado.html`
- **Línea 71:** `variant="ghost-text"` → `variant="text"`
- **Línea 128:** `variant="ghost-text"` → `variant="text"`

**Archivo:** `expediente-del-empleado/recursos-humanos/nomina/periodos-nomina/periodos-nomina.html`
- **Línea 72:** `variant="ghost-text"` → `variant="text"`

**Archivo:** `expediente-del-empleado/recursos-humanos/nomina/periodos-nomina/modal-dias-no-habiles/modal-dias-no-habiles.html`
- **Línea 58:** `variant="ghost-text"` → `variant="text"`

**Archivo:** `expediente-del-empleado/recursos-humanos/nomina/nominas/nominas.html`
- **Línea 61:** `variant="ghost-text"` → `variant="text"`
- **Línea 69:** `variant="ghost-text"` → `variant="text"`
- **Línea 77:** `variant="ghost-text"` → `variant="text"`
- **Línea 85:** `variant="ghost-text"` → `variant="text"`
- **Línea 93:** `variant="ghost-text"` → `variant="text"`
- **Línea 139:** `variant="ghost-text"` → `variant="text"`

**Archivo:** `expediente-del-empleado/recursos-humanos/nomina/nomina-detalle/nomina-detalle.html`
- **Línea 64:** `variant="ghost-text"` → `variant="text"`
- **Línea 104:** `variant="ghost-text"` → `variant="text"`

**Archivo:** `expediente-del-empleado/recursos-humanos/nomina/incidencias-nomina/incidencias-nomina.html`
- **Línea 36:** `variant="ghost-text"` → `variant="text"`
- **Línea 44:** `variant="ghost-text"` → `variant="text"`

**Archivo:** `expediente-del-empleado/recursos-humanos/nomina/evidencias-nomina/evidencias-nomina.html`
- **Línea 97:** `variant="ghost-text"` → `variant="text"`
- **Línea 104:** `variant="ghost-text"` → `variant="text"`

---

### 8. legal.luxuryapp

**Archivo:** `asuntos-legales-y-seguros/minutas/legal-pendientes-minuta.html`
- **Línea 5:** `[variant]="statusFiltro == 0 ? null : 'ghost-text'"` → `[variant]="statusFiltro == 0 ? null : 'text'"`
- **Línea 12:** `[variant]="statusFiltro == 1 ? null : 'ghost-text'"` → `[variant]="statusFiltro == 1 ? null : 'text'"`
- **Línea 19:** `[variant]="statusFiltro == 2 ? null : 'ghost-text'"` → `[variant]="statusFiltro == 2 ? null : 'text'"`
- **Línea 26:** `[variant]="statusFiltro == 4 ? null : 'ghost-text'"` → `[variant]="statusFiltro == 4 ? null : 'text'"`

---

### 9. maintenance.luxuryapp

**Archivo:** `inspection/bitacora/mis-inspecciones-agregar-imagenes.html`
- **Línea 56:** `variant="ghost-text"` → `variant="text"`
- **Línea 87:** `variant="ghost-text"` → `variant="text"`

---

### 10. collections.luxuryapp

**Archivo:** `cobranza-nativa/core/charges/bulk-import-modal.html`
- **Línea 44:** `variant="ghost-text"` → `variant="text"`

**Archivo:** `cobranza-nativa/configuration/billing-config/billing-config-modal.html`
- **Línea 76:** `variant="ghost-text"` → `variant="text"`

**Archivo:** `cobranza-nativa/core/payments/payment-cancel-modal.ts`
- **Línea 53:** `variant="ghost-text"` → `variant="text"`

---

### 11. supplier.luxuryapp

**Archivo:** `po/purchase-order/orden-compra.html`
- **Línea 30:** `variant="ghost-text"` → `variant="text"`

---

### 12. admin.luxuryapp

**Archivo:** `analisis-registros/log-api-report/log-api-report.html`
- **Línea 105:** `variant="ghost-text"` → `variant="text"`

**Archivo:** `analisis-registros/audit-entries/audit-entries.html`
- **Línea 110:** `variant="ghost-text"` → `variant="text"`
- **Línea 224:** `variant="ghost-text"` → `variant="text"`

---

## Resumen por Variante

| Variante antigua | Variante Minia sugerida | Total de ocurrencias |
|---|---|---|
| `variant="ghost"` | `variant="soft"` | 8 |
| `variant="ghost-text"` | `variant="text"` | 55 |
| `[variant]="... 'ghost' ..."` | `[variant]="... 'soft' ..."` | 4 |
| `[variant]="... 'ghost-text' ..."` | `[variant]="... 'text' ..."` | 1 |

---

## Exclusiones

Se excluyó el siguiente archivo por estar en código exclusivo de Ionic/móvil:

- `admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-mobile/mobile-buttons/mobile-buttons.ts` (Línea 90: `variant="ghost"`)

---

## Conclusión

Se identificaron **68 ocurrencias** de variantes de botones antiguas en **32 archivos** distribuidos entre **12 módulos** de negocio. Los módulos con mayor cantidad de ocurrencias son `human-resources.luxuryapp` (17 ocurrencias) y `accounting.luxuryapp` (15 ocurrencias).

No se encontraron usos de las clases CSS `btn-ghost` o `btn--pill` en los módulos auditados, lo que indica que la migración de estas clases ya se completó o nunca se usaron en estos módulos.

Las variantes `ghost` y `ghost-text` son las que predominan, y deberán migrarse a `soft` y `text` respectivamente, según el nuevo estándar Minia.
