# FASE 0 - ANÁLISIS DE REGLAS DE NEGOCIO
# COBRANZA NATIVA

**Fecha:** 2026-08-15
**Versión:** 1.0
**Estado:** EN REVISIÓN

---

## 📌 PROBLEMA QUE RESUELVE
Actualmente los procesos de cobranza (cargos, descuentos, penalizaciones, avisos y conciliación) son manuales y desconectados, lo que genera carga operativa, posibles errores humanos y falta de transparencia para el condómino. Se necesita un motor de cobranza automatizado, que prepare la conciliación contable (exportación de layouts para Aspel), notifique proactivamente y prepare la arquitectura para pasarelas de pago (Stripe) a futuro, enfocado estrictamente en Cuentas por Cobrar.

---

## 📊 QUÉ ESPERAMOS LOGRAR (KPIs)
| Métrica | Estado actual (baseline) | Meta (target) | Plazo | Cómo se mide |
| --- | --- | --- | --- | --- |
| Morosidad del edificio | [Por definir %] | Reducción del 20% | 3 meses | Reporte de saldos vencidos |
| Errores de cálculo (cargos/recargos) | [Por definir] | Bajar a cero (0) | Inmediato | Auditoría de recargos mensuales |
| Tiempo de conciliación contable | [Días] | [Horas] | 1 mes | Entrevista con área contable |

---

## 👤 USUARIOS Y ROLES
| Rol | Qué puede hacer (acciones) | Lo que NO puede hacer | Se basa en rol existente |
| --- | --- | --- | --- |
| SuperUsuario | Acceso total a todas las tareas de cobranza | N/A | ✅ |
| Administrador / Dirección / GerenteOperaciones / GerenteAtencion | Consultar, auditar y ver reportes de cobranza | No configuran cargos ni registran pagos | ✅ |
| Contador / Cobranza / Asistente | Configurar cargos, propiedades, reglas moratorias y descuentos. Aplicar abonos y cargos manuales. Ejecutar reportes. | No pueden modificar movimientos sin dejar trazabilidad. | ✅ |
| Condomino | Consultar su estado de cuenta y descargar facturas. | Solo ven datos propios. No modifican cargos. | ✅ |

---

## 📋 REGLAS DE NEGOCIO (4 NIVELES JERÁRQUICOS)

### Nivel 1: Invariantes de Dominio (NUNCA pueden cambiar)
| ID | Regla | Justificación |
| --- | --- | --- |
| RN-COB-001 | Nunca se puede borrar un cargo que ya tiene un abono aplicado. | Solo se permite cancelar/reversar con nota de crédito o movimiento espejo. |
| RN-COB-002 | Nunca se puede modificar retroactivamente un saldo ya conciliado. | Rompe la integridad contable de cierres financieros y exportaciones. |
| RN-COB-003 | Nunca se puede registrar un cargo sin concepto definido. | Provoca inconsistencia contable ("cargo genérico" prohibido). |
| RN-COB-004 | Nunca se puede aplicar un abono a un condómino distinto al del cargo original. | Corrompe el estado de cuenta y cruce de referencias. |
| RN-COB-005 | Las referencias únicas no se pueden reutilizar en dos pagos distintos ni estar duplicadas. | Genera colisión y caos en conciliación bancaria. |
| RN-COB-006 | Nunca se pueden acumular descuentos incompatibles (Pronto pago + Especial). | Protege los ingresos del edificio ante errores manuales. |

### Nivel 2: Flujo y Estados (Ciclo de vida)
| ID | Estado | Transición válida a | Quién la ejecuta |
| --- | --- | --- | --- |
| RN-COB-010 | Generado | → Vigente (Pronto Pago) / Vencido | Sistema (Auto) / Contador |
| RN-COB-011 | Vigente | → Vencido / Pagado Parcial / Pagado Total | Sistema (Tiempo) / Condómino (Pago) |
| RN-COB-012 | Vencido | → Pagado Parcial / Pagado Total | Sistema / Condómino (Pago) |
| RN-COB-013 | Pagado Parcial | → Pagado Total / Cancelado (Reverso) | Sistema / Condómino |
| RN-COB-014 | Pagado Total | → Cancelado (Reverso) | Contador (vía movimiento espejo) |

*Nota Excepción (RN-COB-015): Si la fecha límite de descuento cae en Sábado (o inhábil), la vigencia se extiende automáticamente hasta el siguiente Lunes.*

### Nivel 3: Seguridad y Autorización (RBAC)
| ID | Regla | Roles autorizados | Restricciones adicionales |
| --- | --- | --- | --- |
| RN-COB-020 | Cancelar cargos o registrar pagos | Contador, Cobranza, Asistente, SuperUsuario | Requiere trazabilidad en bitácora de auditoría. |
| RN-COB-021 | Ver estado de cuenta global | Administrador, Dirección, GerenteOperaciones, GerenteAtencion, Contador, Cobranza, Asistente, SuperUsuario | Ninguna. |
| RN-COB-022 | Ver estado de cuenta individual | Condómino | **Solo datos propios**. |

### Nivel 4: Validaciones de Datos
| Campo | Obligatorio | Formato / Regla | Ejemplo válido |
| --- | --- | --- | --- |
| Referencia / Comprobante | Sí | Para pagos manuales, siempre anexado | "REF-12345" + PDF adjunto |
| Fecha de Pago | Sí | Nunca cambiar fecha para "ajustar" mora | 2026-08-15 |

---

## 🔄 FLUJOS PRINCIPALES

### Camino Feliz (Todo sale bien)
1. Sistema genera cargos automáticos (ej. cuota mantenimiento) el día 1 del mes.
2. Sistema genera referencia de pago y notifica al condómino (Email/SMS/WhatsApp).
3. Condómino paga antes del día 10 (aplica descuento pronto pago).
4. El pago se registra y se habilita para ser incluido en la siguiente exportación de pólizas (Layout Aspel).
5. El sistema emite recibo y el cargo pasa a "Pagado Totalmente".

### Casos Borde (Situaciones Raras)
- **Caso 1:** Fecha de vencimiento de pronto pago cae en Sábado.
  - *Cómo se maneja:* El sistema automáticamente traslada el vencimiento al Lunes inmediato posterior (RN-COB-015).
- **Caso 2:** Condómino paga parcialmente una deuda vencida.
  - *Cómo se maneja:* El saldo restante mantiene los recargos proporcionales.

---

## ⚠️ PRE-MORTEM: ¿QUÉ PODRÍA SALIR MAL?
| Supuesto fallido | Impacto | Mitigación |
| --- | --- | --- |
| Exportación Aspel corrupta | Descuadre contable manual | El sistema bloquea exportar registros ya exportados previamente; se maneja por lote y periodo cerrado. |
| Recargos aplicados a quien sí pagó | Reclamos masivos, desgaste admin | Tiempo de gracia o confirmación humana antes de ejecutar el Job automático de morosidad. |
| Duplicidad de pagos | Saldos inflados, falsos negativos | Restricción UNIQUE en BD por Referencia y control de idempotencia en la API. |
| Descuento fuera de regla | Dinero perdido | Validación cruzada obligatoria en Backend antes de aplicar el abono. |

---

## 🔗 INTEGRACIONES CON OTROS MÓDULOS
| Módulo | Qué datos intercambia | Qué pasa si falla |
| --- | --- | --- |
| Sistema ASPEL | Pólizas contables, saldos (Vía Exportación) | Generación de layouts (Excel/TXT/XML) para importación manual o semi-automática en Aspel. |
| Notificaciones Dispatcher | Avisos Email/SMS/WhatsApp | Se encola y reintenta. Usa el estándar oficial de notificaciones. |

---

## ✅ VALIDACIÓN DE CONVENCIONES
| Convención | Estado |
| --- | --- |
| CONVENTIONS.md validado | ✅ |
| Roles existen en catálogo (ApplicationRoleEnum) | ✅ |
| Integración usa INotificationDispatcher | ✅ |
| Evitar "modificar SelectItems" | ✅ |
