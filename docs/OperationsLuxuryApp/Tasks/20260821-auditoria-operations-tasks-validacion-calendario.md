# 05 — Validación contra un calendario real de cliente

**Fuente:** `Royal_entregables 2026.pdf` — Residencial Royal Reforma
**Fecha:** 2026-08-20 · **Propósito:** contrastar el plan del PASO 4 con un caso real antes de implementar
**Veredicto general:** el modelo encaja en lo esencial, **pero el manejo de fechas se queda corto** y falta una pieza que el propio cliente declara como objetivo

---

## 1. Qué es el documento

Un cuadro de **24 actividades recurrentes** de un solo cliente, con cinco columnas:

| Columna del cliente | Equivalente en nuestro modelo |
| --- | --- |
| **Área** (10 distintas) | `WorkGroup` |
| **Actividad** | Título y descripción de la plantilla |
| **Fecha de entrega o revisión** | Recurrencia y fecha límite |
| **Qué entrego** | Comprobante documental (`TaskAttachment` reapuntada) |
| **Seguimiento** | Pasos de confirmación (`TaskChecklistItem`) |

Su objetivo declarado: *"llevar un mejor control de los procesos mensuales y **detectar cualquier
diferencia antes de realizar el cierre**"*.

Las áreas son Contabilidad, Nóminas, Fiscal, Cobranza, Operación, Proveedores, Presupuesto,
Archivo, Revisión mensual y Seguimiento.

---

## 2. Lo que valida el plan

| Decisión del plan | Cómo la confirma el calendario |
| --- | --- |
| **Anclaje al grupo de trabajo** (decisión #14) | La primera columna del cliente **es el área**. No hay una sola actividad anclada a una persona. La estructura del documento es exactamente la del modelo elegido |
| **Comprobante documental** (G-15, `TaskAttachment`) | Cada actividad tiene una columna *"Qué entrego"* con un entregable nombrado: balanza, acuses, líneas de captura, opinión de cumplimiento |
| **Checklist de confirmación** (G-16) | La columna *"Seguimiento"* son literalmente pasos: *"validar factura, autorización, servicio y presupuesto"*, *"confirmar que todos los pagos estén autorizados"* |
| **Criticidad diferenciada** | *"Presentar y pagar impuestos, IMSS e INFONAVIT — a más tardar el día 17"* es, palabra por palabra, el caso que originó las multas |
| **Insistencia y escalación** | *"Actualizar avances y reportar los casos que no tengan respuesta"* es lo que hoy nadie hace |

El anclaje al grupo queda confirmado por un documento que el cliente escribió sin conocer
nuestro diseño. Eso es la mejor validación que podía tener la enmienda `02b`.

---

## 3. Dónde NO encaja

### 3.1 Las fechas no son fechas: son ventanas

De las 24 actividades, **sólo 11 se expresan con una recurrencia simple**. Las otras 13 no.

| Forma de la fecha | Ejemplos | Cuántas | ¿La cubre el plan? |
| --- | --- | :-: | --- |
| Diario | *"Registrar movimientos de bancos"* | 2 | ✅ Sí |
| Día fijo del mes | *"Día 10"*, *"Día 15"* | 2 | ✅ Sí |
| Dos días fijos al mes | *"Días 5 y 20"*, *"Días 7 y 22"*, *"Días 10 y 25"* | 5 | ✅ Sí, con `BYMONTHDAY` |
| Cada quincena | *"Control de préstamos"* | 1 | ✅ Sí |
| Fecha límite explícita | *"A más tardar el día 17"* | 1 | ✅ Sí |
| **Rango de días** | *"Días 1 al 5"*, *"Días 11 al 14"*, *"Días 20 al 25"* | **8** | ⚠️ **Parcial** |
| **Último día hábil** | *"Día 15 y último día hábil"*, *"Días 26 al último día hábil"* | **2** | ❌ **No** |
| **Compuestas** | *"Reporte día 5; seguimiento semanal"*, *"Durante el mes; revisión final días 20 al 22"* | **2** | ❌ **No** |

**Los rangos (8 actividades).** Un *"Días 1 al 5"* no es un vencimiento: es una ventana que abre
el día 1 y cierra el día 5. La buena noticia es que `Tasks` **ya tiene los dos campos**:
`ScheduledDate` para la apertura y `PlannedEndDate` para el cierre. No hace falta cambiar el
esquema. Lo que falta es que **el catálogo capture la ventana** y que el generador calcule
ambos extremos, en vez de derivar una sola fecha de la RRULE.

**El último día hábil (2 actividades).** Aquí sí hay un error en el plan. La decisión **A7 dice
que en festivo la tarea se recorre al siguiente día hábil**. Para *"último día hábil del mes"* el
recorrido debe ser **hacia atrás**: si el 31 cae en domingo, la fecha es el viernes 29, no el
lunes 1 del mes siguiente — que además ya sería otro periodo contable. **A7 está incompleta.**

**Las compuestas (2 actividades).** *"Reporte día 5; seguimiento semanal"* son dos cadencias en
una misma actividad. Se resuelve con dos plantillas, pero el catálogo debe permitir relacionarlas
para que no se vean como obligaciones distintas.

### 3.2 Falta el encadenamiento, que es el objetivo declarado del cliente

El calendario **no es una lista: es una cadena**.

```text
Contabilidad días 1-5  →  días 5-9  →  cierre día 10
                                          ↓
                        Fiscal días 11-14 (cálculo de impuestos)
                                          ↓
                              día 15 (envío a autorización)
                                          ↓
                              día 17 (pago IMSS/INFONAVIT)  ← aquí llega la multa
```

El propio documento lo dice: *"Revisar los gastos enviados por Operación **antes** de registrarlos"*,
*"Solicitar corrección **antes** de que se timbre la nómina"*, *"Dar seguimiento con cada área
**antes** del cierre"*.

**Si el cierre contable del día 10 se atrasa, el pago del día 17 ya está condenado** — y hoy nadie
se entera hasta que se vence. El objetivo textual del cliente es *"detectar cualquier diferencia
antes de realizar el cierre"*: eso es precisamente vigilancia **río arriba**, no aviso de vencimiento.

Nuestro plan **no contempla dependencias entre tareas**. Y lo irónico es que `Tasks` **ya tiene el
campo**: `DependsOnTaskId` (`Tasks.cs:178`). Está ahí, sin usar.

**Esta es la brecha más importante de las cuatro.** Alertar el día 17 de que no se pagó es llegar
tarde; alertar el día 11 de que el cierre no salió es llegar a tiempo.

### 3.3 Los pendientes no se abandonan: se arrastran

La última actividad dice: *"Los asuntos no resueltos pasan al mes siguiente con una explicación"*.

Nuestra regla `RN-ALT-014` hacía lo contrario: a los 30 días marcaba la tarea como **abandonada y
dejaba de alertar**. El cliente quiere que el pendiente **sobreviva al corte del mes** y siga vivo
con su explicación.

> ✅ **RESUELTO el 2026-08-20.** El dueño redujo la tolerancia a **5 días** y la insistencia dejó
> de apagarse. `RN-ALT-014` ahora marca incumplimiento formal, `RN-ALT-051` arrastra el pendiente
> al periodo siguiente y `RN-ALT-053` comprime la escalera. El calendario del cliente y el módulo
> quedaron alineados.

No son incompatibles, pero hay que distinguirlos:

- **Abandonada** = nadie hizo nada y nadie justificó. Se cierra como incumplimiento y se avisa a
  Dirección.
- **Arrastrada** = sigue pendiente, con explicación registrada, y se traslada al periodo siguiente
  conservando su antigüedad.

El plan ya tiene ambos casos.

### 3.4 El entregable tiene nombre, y el comprobante no siempre es opcional

Dos ajustes menores pero de alto valor:

**El entregable se llama de algún modo.** El cliente no pide "un comprobante": pide *"Balanza
mensual cerrada"*, *"Cálculo y línea de captura del ISN"*, *"Opinión de cumplimiento"*. La
plantilla debería declarar el nombre esperado, para que la alerta diga *"falta: Opinión de
cumplimiento"* y no *"falta comprobante"*. Es la diferencia entre un recordatorio útil y uno
genérico.

**La decisión #7 se queda corta.** Habíamos limitado el comprobante obligatorio a las tareas
críticas, para no generar fricción. En este calendario **las 24 actividades tienen entregable**.
La obligatoriedad debe ser configurable por plantilla, con el nombre del entregable, y no
depender sólo de la criticidad.

---

## 4. Cambios que esto obliga

| # | Cambio | Dónde impacta | Tamaño |
| --- | --- | --- | --- |
| C1 | **Ventana de entrega** (apertura y cierre), no fecha única | Catálogo + generador. `Tasks` ya tiene `ScheduledDate` y `PlannedEndDate`: **sin cambio de esquema** | S |
| C2 | **Corregir A7**: el ajuste por día hábil va hacia adelante o hacia atrás según el caso; *"último día hábil"* siempre hacia atrás | Generador | S |
| C3 | **Dependencias entre plantillas**, materializadas en `DependsOnTaskId` al generar, con alerta río arriba | Catálogo + generador + motor de alertas. Campo ya existe | **M** |
| C4 | ~~Arrastre de pendientes~~ | ✅ **Resuelto 2026-08-20** con `RN-ALT-051` | — |
| C5 | **Nombre del entregable** en la plantilla y en el texto de la alerta | Campo nuevo en la plantilla | S |
| C6 | **Comprobante obligatorio configurable** por plantilla, no sólo por criticidad | Revisa la decisión #7 y `RN-ALT-034` | S |
| C7 | **Cadencias compuestas**: relacionar dos plantillas de una misma actividad | Catálogo | S |

**Reglas nuevas que se derivan:** `RN-ALT-048` (ventana de entrega), `RN-ALT-049` (ajuste por día
hábil bidireccional), `RN-ALT-050` (dependencia entre obligaciones y alerta río arriba),
`RN-ALT-051` (arrastre con explicación), `RN-ALT-052` (entregable nombrado).

**Impacto en las fases:** C1, C2, C5 y C7 caben en F1 y F2 sin alterar la secuencia. C3 es una
fase nueva o una ampliación de F3, y **es la que más valor agrega**. C4 y C6 ajustan F4 y F5.

---

## 5. Lo que el calendario dice sobre el volumen

24 actividades, con un promedio cercano a 1.5 ocurrencias mensuales cada una, dan del orden de
**36 tareas al mes para un solo cliente**. Multiplicado por la cartera, el motor de alertas
maneja miles de tareas vivas.

Refuerza dos cosas que el plan ya contempla: los índices de RT-05 y el tope de alertas de RT-16.
Con 36 tareas mensuales por cliente, notificar cada una por separado y por varios canales satura
al responsable en la primera semana. El digest deja de ser un lujo.

---

## 6. Veredicto

**Encaja en la estructura y falla en el calendario.**

Lo que se decidió sobre *quién* es responsable —el grupo, sus administradores, la escalación—
queda confirmado por un documento que el cliente redactó por su cuenta. Ese fue el riesgo grande
del diseño y quedó despejado.

Lo que hay que corregir es *cuándo*: el modelo asume que una obligación recurrente tiene una
fecha, y en la realidad tiene una **ventana**, a veces un **día hábil calculado hacia atrás**, y
casi siempre una **dependencia con la obligación anterior**.

De los cuatro huecos, tres son ajustes acotados. El cuarto —las dependencias— no es un detalle:
es la diferencia entre avisar el día 17 que no se pagó, y avisar el día 11 que el cierre no salió.
El cliente ya lo escribió como su objetivo. Vale la pena entrar al plan antes de codificar.
