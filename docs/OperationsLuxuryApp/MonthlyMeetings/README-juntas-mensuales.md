# Módulo de Juntas Mensuales y Asamblea

Este módulo coordina el proceso integral de reuniones de gestión (`JCM` - Junta de Comité Mensual) y reuniones magnas (`ASAM` - Asamblea). Su diseño se basa en un patrón de **Sesión Coordinadora** que vincula la agenda, la presentación documental y la minuta formal.

---

## Estructura del Módulo

```
JuntasMensuales/
  Agenda/        (GoogleCalendarEvent - El disparador del proceso)
  Session/       (JuntaMensualSession - El coordinador raíz)
  Presentacion/  (Paquete documental para la junta)
  Minuta/        (Registro formal de acuerdos y seguimientos)
  Asamblea/      (Planeación operativa y checklist de asambleas)
```

---

## El Patrón de Sesión Coordinadora

La arquitectura del módulo ha evolucionado para evitar registros huérfanos. La **Sesión** (`JuntaMensualSession`) actúa como el centro del agregado:

1.  **Punto de Entrada:** Todo proceso debe iniciar en la **Agenda**.
2.  **Disparador:** Al crear un evento de agenda tipo `JCM` o `ASAM`, el sistema siembra automáticamente los registros base de Sesión, Presentación y Minuta.
3.  **Fuente de Verdad:** La fecha y hora maestras residen en la Sesión y se sincronizan hacia los satélites (Presentación y Minuta).

---

## Subdominios Críticos

### 1. Gestión de Asambleas (`AsambleaPlan`)
Específico para reuniones tipo `ASAM`. Incluye:
- **Planeación Operativa:** Invitados especiales y requerimientos de soporte (paddles, audiovisual).
- **Checklist Operativo:** Generado a partir de plantillas (`AsambleaChecklistTemplate`), gestiona tareas obligatorias con vencimientos relativos a la fecha de la asamblea.

### 2. Minutas y Acuerdos (`Meeting`)
- Registro de asistentes (Administración, Comité e Invitados).
- Gestión de Acuerdos (`MeetingDetails`) y su seguimiento histórico.
- **Regla:** Ya no se permiten minutas creadas de forma aislada; deben estar vinculadas a una sesión.

### 3. Integración con Google Calendar
- Sincronización bidireccional de eventos y participantes técnicos.
- La reprogramación en la agenda debe impactar la sesión y sus documentos vinculados.

---

## Reglas de Negocio y Sincronización

| Acción | Regla de Oro |
| :--- | :--- |
| **Creación** | Prohibido crear presentaciones o minutas directamente. Se requiere una agenda previa. |
| **Fechas/Horas** | Se utiliza `DateOnly` para fechas y `TimeSpan?` para horas en satélites. La sesión usa `DateTime` (UTC/Mexico). |
| **Borrado** | El borrado de un componente debe alertar sobre el impacto en los otros (Agenda/Sesión/Minuta). |
| **Multi-tenant** | Filtrado obligatorio por `CustomerId`. |

---

## Integración con Frontend

- **Dashboard de Juntas:** Vista centralizada que muestra el estado de la sesión (¿Tiene presentación? ¿Tiene minuta? ¿Checklist completo?).
- **Angular Signals:** Uso obligatorio para el manejo del estado de la sesión y formularios dinámicos.
- **Vistas Móviles:** Implementación de `app-data-view-mobile` para el seguimiento de acuerdos en campo.

---

_Documentación consolidada en Junio 2026_
