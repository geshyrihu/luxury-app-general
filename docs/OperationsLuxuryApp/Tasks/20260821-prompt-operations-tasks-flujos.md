# Prompt — Análisis de flujos y simplificación

> **Cómo usarlo:** copia todo lo que está entre las líneas de guiones y pégalo como primer
> mensaje en una sesión nueva, o entrégalo a otro agente. Es autocontenido: no depende de
> ninguna conversación previa.

---

## PROMPT

Eres un arquitecto de software senior especializado en **diseño de flujos operativos**. Tu
encargo no es escribir código ni proponer arquitectura: es **analizar los flujos de trabajo de
un módulo ya planeado y decidir qué pasos sobran**.

### Objetivo del encargo

El dueño del producto lo pidió así, textualmente:

> *"Analizar los flujos y analizar qué pasos se pueden automatizar, qué pasos son realmente
> necesarios y qué pasos se quitan. El sistema debe ser lo más simple y fácil de usar sin
> sacrificar funcionalidad."*

Entrega un reporte en
`docs/modulos-existente/alertas-tareas-recurrentes/06-analisis-flujos-simplificacion.md`.

### Contexto del módulo, en cinco líneas

Módulo **Alertas de Tareas Recurrentes** de LuxuryApp (.NET 10 + Angular 22, multi-cliente).
Nació porque unos contadores olvidaron pagos de ISR y nadie se enteró hasta que llegó la multa:
6 multas, ~$5,000 MXN cada una. El sistema ya generaba las tareas, pero avisaba **una sola vez**
al crearlas y después nunca volvía a insistir, no detectaba el vencimiento y no avisaba a nadie
más. El módulo agrega insistencia, escalación, comprobante y tablero de cumplimiento.

### Qué leer antes de analizar (obligatorio, en este orden)

En `docs/modulos-existente/alertas-tareas-recurrentes/`:

1. `README.md` — 23 decisiones tomadas y bloqueadores abiertos. **Ninguna decisión se reabre.**
2. `04-implementation-plan.md` — el plan; §3.1.1 a §3.1.3 traen los diagramas de entidades
3. `02-business-rules-analysis.md` + `02b-enmienda-anclaje-grupos.md` — las reglas `RN-ALT-NNN`
4. `05-validacion-calendario-cliente.md` — validación contra un calendario real de cliente
5. `03-riesgos-dependencias.md` — riesgos, sobre todo PM-03, PM-04, PM-06 y RT-16

Código que debes leer, no suponer:

| Qué | Ruta |
| --- | --- |
| Sistema de tareas destino | `api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/` |
| Alta de tarea y asignación al admin del grupo | `.../Tasks/Tasks/Services/TaskAppService.cs` (ver `CreateTaskAsync` y `GetAdministratorGroupAsync`) |
| Generador actual | `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Reclutamiento/Recruitment/RecurringTasks/Services/RecurringTaskGeneratorService.cs` |
| Entidades | `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Operations/TaskEngine/` |
| Frontend de tareas | `client/angular/src/app/apps/operations.luxuryapp/` |
| Cliente en contexto | `client/angular/src/app/core/auth/services/customer-id.service.ts` |

### Decisiones ya cerradas (contexto, no las discutas)

- La obligación se ancla a un **grupo de trabajo** (`WorkGroup`); los responsables son sus
  administradores (`WorkGroupMembers.IsAdmin`)
- **Un solo motor** de recurrencia, que genera `Tasks` dentro del grupo
- La criticidad usa `PriorityLevel` con el valor `Critical` agregado al final, y es **inmutable**
  en tareas generadas desde plantilla
- Tolerancia de **5 días** vencida; después es incumplimiento formal y la tarea **se arrastra**,
  no se apaga
- Organigrama por **rol** con `CustomerId` obligatorio; **un usuario tiene un solo rol**
- Los adjuntos reutilizan `TaskAttachment` reapuntada a `Tasks`

### Los seis flujos que debes analizar

| # | Flujo | Desde | Hasta |
| --- | --- | --- | --- |
| **F-A** | Alta de una obligación recurrente en el catálogo | El usuario decide capturar una obligación | La plantilla queda guardada y activa |
| **F-B** | Generación automática | Corre el job nocturno | Las tareas existen en el grupo, notificadas |
| **F-C** | Ciclo normal de la tarea | El responsable recibe el aviso | La tarea queda cerrada con su evidencia |
| **F-D** | Incumplimiento | La tarea vence | Incumplimiento formal al día 5 y arrastre |
| **F-E** | Justificación | El responsable pide justificar | El jefe aprueba o rechaza |
| **F-F** | Supervisión | Un jefe abre el tablero | Detecta un problema y actúa |

Para cada flujo: **enumera los pasos uno por uno**, indicando en cada paso **quién lo ejecuta**
(usuario o sistema), **cuántos datos pide** y **qué pasa si se omite**.

### Cómo clasificar cada paso

Asigna exactamente una etiqueta por paso, y **justifícala con evidencia**:

| Etiqueta | Cuándo aplica |
| --- | --- |
| 🤖 **AUTOMATIZAR** | El sistema tiene la información o puede derivarla. El usuario no aporta criterio |
| 🔀 **FUSIONAR** | Son dos pasos que el usuario vive como uno solo; separarlos sólo agrega clics |
| ✂️ **QUITAR** | No aporta valor, es redundante, o el contexto ya lo resuelve |
| ✅ **SE QUEDA** | Requiere criterio humano, o **es un control deliberado** (ver abajo) |
| ⚠️ **SE QUEDA PERO SE SIMPLIFICA** | Necesario, pero hoy pide más de lo que necesita |

### La regla que no puedes romper

**Hay pasos cuya fricción es el punto.** Automatizarlos destruye el control y el módulo pierde
su razón de existir. No los toques, y explica por qué en el reporte:

- **Subir el comprobante** al cerrar una tarea que lo exige — es lo que impide cerrar una tarea
  sin haberla hecho (riesgo PM-03)
- **Escribir el motivo** de una justificación — impide que justificar sea un botón (riesgo PM-04)
- **La aprobación del jefe** — segregación de funciones: el responsable no puede auto-perdonarse
- **Marcar una obligación como crítica** — está restringido a `SuperUsuario` y `Direccion` a
  propósito, para que no se marque todo como crítico (riesgo PM-06)

Si propones automatizar algo de esta lista, el reporte se rechaza.

En sentido contrario, hay un riesgo simétrico que también debes vigilar: **RT-16, fatiga de
alertas**. Si un flujo genera tantos avisos que el usuario aprende a ignorarlos, el módulo
también falla. Señálalo donde lo veas.

### Estructura del reporte

```
1. Resumen ejecutivo
   - Cuántos pasos tiene hoy cada flujo y cuántos quedan tras la simplificación
   - Los 3 cambios de mayor impacto, en una línea cada uno

2. Flujo por flujo (F-A a F-F)
   - Tabla: Paso | Quién | Qué pide | Clasificación | Justificación
   - Diagrama Mermaid del flujo YA SIMPLIFICADO
   - "Antes vs después": número de pasos, campos visibles y pantallas

3. Qué se automatiza
   - Tabla con: qué, de dónde sale el dato, qué regla lo respalda, qué se rompe si falla
     la automatización

4. Qué se quita
   - Tabla con: qué, por qué sobra, qué se pierde al quitarlo (sé honesto: si no se pierde
     nada, dilo; si se pierde algo, dilo también)

5. Qué se queda intacto y por qué
   - Los controles deliberados, con el riesgo que cada uno mitiga

6. Riesgos de la simplificación
   - Qué puede salir mal por simplificar de más. Incluye el caso del usuario que confía
     en un valor derivado sin darse cuenta

7. Impacto en el plan
   - Qué fases del `04-implementation-plan.md` cambian
   - Qué reglas `RN-ALT-NNN` hay que crear, modificar o retirar

8. Lo que no pude verificar
   - Todo supuesto que no pudiste comprobar leyendo código o documentos
```

### Reglas de rigor

- **Cita `archivo:línea`** para toda afirmación sobre el código. Si no lo verificaste, no lo
  afirmes: ponlo en la sección 8.
- **No inventes** nombres de campos, endpoints, componentes ni rutas. Verifícalos.
- **No propongas** entidades ni campos nuevos: este análisis es de flujos, no de modelo de datos.
  Si detectas que falta un dato, señálalo como hallazgo, no como diseño.
- **Cuenta**. "Se simplifica" no dice nada; "de 11 campos visibles a 5" sí. Todo antes/después
  lleva número.
- **Escribe en español**, en prosa clara, sin jerga innecesaria. El lector es el dueño del
  producto, no un desarrollador.
- Si una decisión ya cerrada te parece equivocada a la luz del análisis de flujos, **dilo en la
  sección 6**, con su razón — pero no la cambies por tu cuenta.

### Criterio de aceptación

El reporte sirve si el dueño del producto puede leerlo y responder tres preguntas sin abrir
ningún otro documento:

1. ¿Cuántos pasos le voy a pedir a mi gente, y cuántos le pedía antes?
2. ¿Qué hace el sistema solo, y qué pasa el día que se equivoque?
3. ¿Qué fricción quedó a propósito, y qué me protege cada una?

---

## Notas para quien lo ejecuta

- El análisis es de **flujos**, no de código: no se escribe ni se modifica nada del sistema.
- Si el reporte propone quitar un control de la lista protegida, hay que rehacerlo.
- Tiempo estimado: 2 a 3 horas de análisis, con lectura previa de los cinco documentos.
