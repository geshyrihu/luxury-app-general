# 03 — Riesgos y Dependencias

**Módulo:** Alertas de Tareas Recurrentes · **Tipo:** B (ampliación de `TaskEngine`)
**Paso:** 3 de `skills/planeacion-modulos/SKILL.md` · **Fecha:** 2026-08-20
**Insumo:** `02-business-rules-analysis.md` (FASE 0 aprobada) y `01b-entidad-estructura.md`
**Destino:** alimenta las secciones 9 (Riesgos) y 10 (Dependencias) del plan del PASO 4

> **Nota de nomenclatura:** la skill declara dos salidas distintas para el slot `03-`
> (`../../../docs/SystemLuxuryApp/Logs/20260818-analisis-system-logs-riesgos.md` en el flujo, `03-preliminary-architecture.md` en la estructura
> de documentos). Se resuelve así: este documento es el del flujo operativo, y las decisiones
> de arquitectura se redactan como sección 3 del plan (PASO 4), sin archivo aparte. Al ser una
> ampliación, la arquitectura ya existe: se documenta lo que cambia, no una propuesta nueva.

---

## Cómo leer estas matrices

| Escala | Significado |
| --- | --- |
| **Probabilidad** | Alta = pasará salvo que se actúe · Media = plausible · Baja = requiere concurrencia de factores |
| **Impacto** | Crítico = el módulo no cumple su propósito (la multa llega igual) · Alto = degrada la confianza en el sistema · Medio = costo o retrabajo · Bajo = molestia |
| **Exposición** | 🔴 Atender antes de codificar · 🟠 Atender dentro de la fase que la toca · 🟡 Vigilar |

Los *owners* son **roles**, no personas: el plan del PASO 4 asigna nombres.

Criterio rector de todo el documento: **un riesgo que produce silencio es peor que uno que
produce un error visible.** Este módulo existe porque un olvido silencioso terminó en multa.
Cualquier falla que el sistema no reporte reproduce exactamente ese fracaso.

---

## 1. Riesgos técnicos

| ID | Riesgo | Evidencia en código | P | I | Exp. | Mitigación | Owner |
| --- | --- | --- | :-: | :-: | :-: | --- | --- |
| **RT-01** | **La ventana de generación es de 7 días.** Las instancias se crean apenas una semana antes, así que un aviso previo configurable de hasta 30 días (`RN-ALT-032`) es imposible: la tarea todavía no existe cuando tocaría avisar | `RecurringTaskGeneratorService.cs:62` — `maxFutureDate = today.AddDays(7)` | **Alta** | **Crítico** | 🔴 | Separar horizonte de generación del de aviso. Ampliar la ventana a ≥ 35 días o disparar el aviso desde la plantilla y no desde la instancia. **Decisión de arquitectura obligatoria en el PASO 4** | Backend |
| **RT-02** | **Un festivo elimina la obligación, no la recorre.** Si la ocurrencia cae en día festivo el generador hace `continue`: la tarea nunca se crea. Un pago de IMSS que caiga en festivo desaparece del radar | `RecurringTaskGeneratorService.cs:120-124` | **Alta** | **Crítico** | 🔴 | Recorrer al siguiente día hábil en lugar de omitir. **Obliga a revisar `RN-ALT-039`**, que hoy dice "no se emiten alertas en festivos" — correcto para el aviso, incorrecto para la generación | Backend + Dueño del módulo |
| **RT-03** | **Rol vacante = omisión silenciosa.** Si ningún usuario del cliente tiene el rol, el generador registra un `LogWarning` y salta. Nadie se entera: es el fracaso exacto que el módulo combate | `RecurringTaskGeneratorService.cs:83-86` | **Alta** | **Crítico** | 🔴 | Implementar la cadena de `RN-ALT-018` (rol → jefe → respaldo) y el aviso de `RN-ALT-019`. El log no cuenta como aviso | Backend |
| **RT-04** | **El fan-out por rol multiplica las tareas.** Se crea una instancia por CADA usuario con el rol. Un rol con 8 personas genera 8 tareas idénticas, 8 responsables y 8 hilos de alertas para una sola obligación fiscal | `RecurringTaskGeneratorService.cs:126` | **Alta** | **Alto** | 🔴 | **RESUELTO 2026-08-20:** una obligación = **una tarea con responsable principal + corresponsables**, no N copias. Requiere entidad de asignación nueva y cambia el fan-out del generador. Ver decisión #13 y `RN-ALT-040` | Dueño del módulo + Backend |
| **RT-05** | **`TaskInstances` no tiene índice en `DueDate` ni en `Status`.** El motor de alertas barrerá esa tabla varias veces al día filtrando justo por esas dos columnas | `TaskInstance.cs` — sin atributos `[Index]`; sólo índices de FK | **Alta** | **Alto** | 🟠 | Índice compuesto `(CustomerId, Status, DueDate)` en la misma migración que agrega los campos nuevos. Migración reversible | Backend |
| **RT-06** | **`DueDate` es `DateTime?`.** La detección de vencidos (`RN-ALT-011`) compara contra un campo que admite nulo: una tarea sin fecha límite nunca vence y nunca alerta | `TaskInstance.cs:71` | **Media** | **Alto** | 🟠 | El barrido debe tratar `DueDate IS NULL` como anomalía reportable, no ignorarla. Validar en la plantilla que siempre resulte una fecha | Backend |
| **RT-07** | **Mezcla de husos horarios.** `ScheduledDate` y `DueDate` se calculan desde `DateTime.Today` (hora del servidor) mientras `CreatedAt` usa `DateTime.UtcNow`. En México son 6 horas de diferencia: una tarea puede figurar vencida antes de tiempo, o al revés | `RecurringTaskGeneratorService.cs:61` vs `:151` | **Alta** | **Alto** | 🟠 | Fijar criterio único antes de construir el barrido de vencidos. Un módulo cuyo eje es "¿ya venció?" no puede tener ambigüedad horaria | Backend + Tech Lead |
| **RT-08** | **El error de un cliente se traga.** El `catch` por cliente registra y continúa: un cliente puede pasar días sin generación sin que nadie lo note | `RecurringTaskGeneratorService.cs:33` | **Media** | **Crítico** | 🔴 | Contador de clientes procesados vs fallidos y alerta al equipo si alguno falla. Cumple el criterio rector | Backend + DevOps |
| **RT-09** | **Un job de Hangfire por cada instancia notificada.** Con reintentos y varios canales, el volumen crece rápido al sumar avisos previos, re-alertas y escalación | `RecurringTaskGeneratorService.cs:167` | **Media** | **Medio** | 🟡 | Agrupar por destinatario (digest) en lugar de un envío por tarea. Medir en la fase de motor de alertas | Backend |
| **RT-10** | **`INotificationDispatcher` lanza excepción con WhatsApp.** Cualquier envío que incluya ese canal falla en tiempo de ejecución | `NotificationDispatcher.cs:34-38` | **Alta** | **Alto** | 🔴 | Bloqueador B1. Habilitar el canal en el dispatcher o aislar WhatsApp tras una interfaz propia. **Nunca** capturar la excepción y seguir: violaría `RN-ALT-006` | Backend |
| **RT-11** | **Dos motores de recurrencia conviviendo.** El legado (`RecurringTaskTemplate` → `Tasks`) sigue registrado en Hangfire, no notifica nada y no tiene aislamiento por cliente | `HangfireJobCatalog.cs:101`; `01b` §Segundo motor | **Media** | **Alto** | 🟠 | Verificar B6 antes del PASO 4. Si tiene plantillas activas: migrar o cubrirlo. Si no: apagarlo explícitamente | Tech Lead |
| **RT-21** | **Agregar `Critical` rompe tres lecturas que asumen "`High` = lo importante".** El *toggle* de prioridad lo degradaría en silencio; el tablero de Dirección no lo ordenaría primero; y el reporte de supervisión **lo excluiría**, dejando fuera justo las tareas que más importa vigilar | `TaskAppService.cs:962`; `TareasLegalAppService.cs:48,57`; `SupervisionReportsAppService.cs:119` | **Alta** | **Alto** | 🔴 | Corregir los tres puntos en la misma entrega que agrega el valor, e inmutabilidad en tareas generadas (`RN-ALT-056`). Son 4 archivos: acotado y verificable | Backend |
| **RT-12** | ~~`PriorityLevel` sólo tiene Alta/Baja~~ | `Shared/Enums/PriorityLevel.cs` | — | — | ✅ | **RESUELTO 2026-08-20:** se le agrega `Critical` al final en vez de crear un enum paralelo. El riesgo se traslada a RT-21 | Backend |
| **RT-13** | **`Status` global no contempla `Vencida` ni `Abandonada`.** Modificarlo rompería consumidores ajenos al módulo | `Shared/Enums/Status.cs`; `TaskInstance.cs:61` | **Alta** | **Medio** | 🟠 | `Vencida` derivado (`RN-ALT-011`). Para `Abandonada`, definir en el PASO 4 estado propio del módulo sin tocar el enum global | Backend + Tech Lead |
| **RT-14** | **Mover la capa de aplicación fuera de `ReclutamientoLuxuryApp` rompe rutas e imports.** Es correcto hacerlo, pero mezclarlo con la funcionalidad nueva vuelve el diff ilegible y la auditoría inútil | `01b` §Ubicación real | **Alta** | **Medio** | 🟠 | Fase separada, sólo mudanza, sin cambios de comportamiento. Nunca en el mismo commit que la lógica de alertas | Tech Lead |
| **RT-15** | **`HolidayService` sólo conoce 8 festivos de ley.** No incluye asuetos de empresa ni el calendario real de vencimientos SAT/IMSS, que no siempre coincide con días hábiles comunes | `Shared/Services/IHolidayService.cs` | **Media** | **Medio** | 🟡 | Documentar la limitación. El aviso previo (`RN-ALT-032`) amortigua el desfase de un día. No ampliar el catálogo dentro de este módulo | Backend |
| **RT-16** | **Fatiga de alertas.** La insistencia ya no se apaga (`RN-ALT-051`): con la escalera comprimida a 5 días y varios canales, el riesgo de saturación sube, no baja | Diseño; ver PM-06 | **Alta** | **Alto** | 🟠 | Tope de alertas por tarea y día, cadencia decreciente, digest para no críticas (`RN-ALT-022` limita quién marca crítico). Medir con K6 | Dueño del módulo |

---

## 2. Riesgos de seguridad y protección de datos

| ID | Riesgo | Evidencia | P | I | Exp. | Mitigación | Owner |
| --- | --- | --- | :-: | :-: | :-: | --- | --- |
| **RS-01** | ~~El organigrama no está aislado por cliente~~ | `OrgHierarchy.cs:8` | — | — | ✅ | **CERRADO 2026-08-20 por diseño:** el organigrama pasa a definirse por `ApplicationRole` con `CustomerId` **obligatorio**. Deja de ser un riesgo del módulo y se convierte en la dependencia D-11. La prueba de no fuga entre clientes se conserva como criterio de paso de F4 | Backend + Tech Lead |
| **RS-02** | **Auto-aprobación de justificaciones.** Si la validación vive sólo en la interfaz, basta una llamada directa al endpoint para perdonarse el incumplimiento | `RN-ALT-004`, `RN-ALT-023` | **Media** | **Alto** | 🔴 | Validar en el servidor que el aprobador ≠ responsable y que es su jefe según `OrgHierarchy`. Ocultar el botón no es control | Backend |
| **RS-03** | **Datos sensibles saliendo por WhatsApp y correo.** Ambos canales están fuera del perímetro y quedan en el teléfono personal del empleado y en servidores de terceros | `RN-ALT-037` | **Alta** | **Alto** | 🟠 | Mensajes con referencia mínima y enlace a la aplicación; nunca montos, RFC ni datos del cliente en el cuerpo. Aplica también a la plantilla que se registre ante Meta (B2) | Backend + Dueño del módulo |
| **RS-04** | **El enlace de la notificación no es autorización.** `ActionRoute` apunta a `/tasks/instances/{id}`: si el endpoint no valida quién consulta, cualquiera con el identificador ve la tarea | `RecurringTaskGeneratorService.cs:167-176` | **Media** | **Alto** | 🟠 | Autorización en el endpoint según `RN-ALT-027` (responsable) y `RN-ALT-026` (jefe de su rama). El destinatario de la notificación no define el permiso | Backend |
| **RS-05** | **La bitácora de alertas contiene datos personales.** Registrar a quién se notificó, por qué canal y a qué teléfono construye un historial laboral individual | `RN-ALT-028`; `NotificationLog.cs` | **Media** | **Medio** | 🟡 | Definir retención y quién puede consultarla. No guardar el número completo si basta el identificador de usuario | Tech Lead |
| **RS-06** | **El tablero expone desempeño individual.** El cumplimiento por persona puede usarse laboralmente sin que el empleado lo sepa | `RN-ALT-025`, `RN-ALT-026` | **Media** | **Medio** | 🟡 | Que cada quien vea su propio tablero (`RN-ALT-027`) y que el alcance de la medición sea explícito. Transparencia, no vigilancia oculta | Dueño del módulo |
| **RS-07** | **El motor legado no tiene aislamiento por cliente.** Ni `RecurringTaskTemplate` ni `Tasks` implementan `ITenantEntity` | `01b` §Segundo motor | **Baja** | **Crítico** | 🟠 | **Prohibido** colgar alertas del motor legado sin resolver antes su tenencia. Si se cubre, se migra primero | Tech Lead |
| **RS-10** | **Ciclos en el organigrama de roles.** Definir jerarquía entre roles es más propenso a ciclos que entre puestos: rol A jefe de B y B jefe de A deja la escalación girando | Diseño nuevo | **Media** | **Alto** | 🟠 | Validación anti-ciclo al guardar el organigrama, y tope de saltos en el motor de escalación. La segunda protege aunque falle la primera | Backend |
| **RT-20** | **Rol jefe sin ningún usuario en el cliente.** El organigrama lo define, pero nadie lo ocupa: la escalación de nivel 2 muere | `WorkPosition.EmployeeId` es nullable | **Media** | **Alto** | 🟠 | Mismo trato que el grupo sin administradores: aviso explícito y salto al respaldo. Nunca en silencio | Backend |
| **RS-08** | **La escalación revela ausencias.** Avisar al jefe que se asignó tarea a alguien de vacaciones expone información de recursos humanos por un canal que no es el suyo | Decisión de discovery; `G-13` | **Baja** | **Medio** | 🟡 | Avisar que hay una tarea en riesgo, sin detallar el motivo de la ausencia | Dueño del módulo |

---

## 3. Matriz de dependencias

| ID | Dependencia | Tipo | Quién la controla | Si falla | Plan de contingencia |
| --- | --- | --- | --- | --- | --- |
| **D-01** | `INotificationDispatcher` | Interna | Equipo backend | Ninguna alerta sale por ningún canal | Es la columna vertebral: sin esto no hay módulo. Se valida en la primera fase, no al final |
| **D-02** | Plantillas de WhatsApp aprobadas por Meta | **Externa** | Meta / Twilio | WhatsApp no se puede usar aunque el código esté listo | **Arrancar el trámite ya** (B2). El módulo se libera con InApp, Push y Email; WhatsApp se activa por configuración cuando llegue la aprobación. No bloquea la salida |
| **D-03** | OneSignal (Push App y Push Web) | **Externa** | Proveedor | Se pierden dos canales | Ya está en producción para otros módulos. InApp y Email como respaldo. Aplica `RN-ALT-006`: si no entregó, no se reporta enviado |
| **D-04** | Hangfire y su catálogo de jobs | Interna | Equipo backend | Sin generación ni alertas: silencio total | El módulo agrega jobs nuevos al catálogo, que ya tiene ~30 registrados. Requiere monitoreo propio (ver RT-08) |
| **D-05** | **Organigrama de roles armado por cliente** | **Dato, no código** | Operación / RR.HH. del cliente | La escalación de nivel 2 no encuentra rol jefe (PM-02) | ⬇️ **Menos frágil desde el 2026-08-20:** son decenas de roles por cliente, no cientos de personas con expediente. El respaldo obligatorio en críticas la neutraliza. Reporte de roles sin jefe definido antes de liberar |
| **D-11** | **Refactor de `OrgHierarchy` a roles con `CustomerId`** | Interna | Otro equipo / Tech Lead | Sin él, el nivel 2 de escalación sigue dependiendo del expediente de empleado y puede cruzar clientes | **F4 depende de este refactor.** Si no está listo, F4 se libera con escalación de nivel 1 (dentro del grupo) y respaldo, documentando la limitación |
| **D-06** | `ApplicationRole` + `UserRoles` + `CustomerId` | Interna | Plataforma | Nadie recibe tareas | Es el anclaje de la asignación (decisión #9). Ya funciona en el generador actual |
| **D-07** | Módulo de vacaciones | Interna | Otro equipo | No se detecta al responsable ausente (`G-13`) | **La entidad de periodo vacacional aún no está identificada.** Si no se resuelve, se libera sin detección de vacaciones y se documenta como limitación conocida, no como pendiente silencioso |
| **D-08** | `IHolidayService` | Interna | Equipo backend | Se generan tareas en festivo | Implementación en memoria, sin servicio externo: no falla por red. Limitación real en RT-15 |
| **D-09** | `TaskAttachment` + servicio de archivos | Interna | Equipo backend | No se puede exigir comprobante en críticas (`RN-ALT-034`) | Ya existe y se reutiliza. Debe seguir el patrón documental del proyecto |
| **D-10** | Motor de recurrencia legado | Interna | Tech Lead | Obligaciones cargadas ahí quedan fuera de vigilancia | Verificar B6. Decidir migrar, cubrir o apagar **antes** de cerrar el PASO 4 |

---

## 4. Planes de contingencia de los riesgos críticos

### RT-01 — Ventana de 7 días vs aviso previo de hasta 30

El aviso previo es una de las razones de existir del módulo: avisar **antes** de la multa, no
después. Con la ventana actual, cualquier configuración mayor a 7 días se acepta en la interfaz
y **nunca se ejecuta**: el peor resultado posible, porque el usuario cree estar cubierto.

- **Preferido:** desacoplar. El aviso previo se calcula desde la plantilla y su RRULE, sin
  depender de que la instancia exista.
- **Alternativa:** ampliar el horizonte de generación a 35 días. Más simple, pero multiplica
  las instancias vivas y agrava RT-04 y RT-05.
- **Contención mínima si no se resuelve:** limitar el aviso previo a 5 días por validación, y
  decirlo en la interfaz. Inaceptable como estado final para obligaciones fiscales, cuyo
  horizonte útil es mensual.

### RT-02 — Festivos que borran la obligación

`RN-ALT-039` acertó en el aviso y se quedó corta en la generación. Son dos cosas distintas:
**no molestar en día festivo** es razonable; **no crear la obligación** es perderla.

- **Corrección:** recorrer al siguiente día hábil, conservando la fecha de recurrencia original
  para la trazabilidad.
- **Regla a ajustar:** `RN-ALT-039` debe distinguir generación de notificación. Queda como
  cambio propuesto a la FASE 0, sujeto a aprobación del dueño del módulo.
- **Verificación:** una tarea con recurrencia el 1 de mayo debe existir con vencimiento el 2.

### RT-03 y RT-08 — Los dos silencios del generador

Ambos comparten el mismo defecto: el sistema sabe que algo falló y sólo lo escribe en un log
que nadie lee. Un módulo de alertas que falla en silencio es una contradicción.

- Contador por corrida: clientes procesados, fallidos, tareas generadas, roles vacantes.
- Si hay fallos o vacantes, notificar al equipo por el mismo dispatcher del módulo.
- Criterio de paso de la fase: **provocar** un fallo de generación en un cliente y comprobar
  que alguien recibe el aviso.

### RS-01 — Organigrama sin aislamiento por cliente → cerrado por diseño

**Resuelto el 2026-08-20 fuera de este módulo.** `OrgHierarchy` pasa a definirse entre
`ApplicationRole` con `CustomerId` obligatorio, así que la jerarquía deja de poder cruzar
clientes por construcción. Lo que en el PASO 3 iba a ser una corrección nuestra ahora es la
dependencia **D-11**.

Lo que **sí se conserva**:

- La prueba antes de liberar: dos clientes con el mismo rol, escalar en uno y verificar que
  nadie del otro recibe nada. Un cambio de diseño no sustituye una prueba.
- El filtro explícito por `CustomerId` en toda consulta del módulo. Si el refactor llegara con
  una ruta sin filtrar, el módulo no debe confiar en ella.
- Si el refactor no está listo cuando toque F4, se libera con escalación de nivel 1 dentro del
  grupo más el respaldo, y se documenta la limitación.

### D-02 — Aprobación de Meta

- Se arranca ahora, en paralelo a la planeación.
- El módulo se libera sin WhatsApp si el trámite no ha concluido.
- El canal se activa por configuración, sin nueva liberación.
- **No** se simula el envío ni se marca como entregado mientras tanto (`RN-ALT-006`).

### D-05 — Organigrama incompleto

- Antes de liberar: reporte de responsables sin `WorkPosition` o sin jefe resoluble.
- Toda tarea crítica exige respaldo al guardarse (`RN-ALT-003`), así que una jerarquía
  incompleta degrada la escalación pero **no la anula**.
- Si el reporte muestra hoyos grandes, la carga del organigrama es prerrequisito de liberación
  para ese cliente, y se dice explícitamente.

---

## 5. Riesgos aceptados sin mitigación

Declararlos es parte del control: lo que no se mitiga debe verse.

| ID | Riesgo aceptado | Por qué se acepta |
| --- | --- | --- |
| RT-15 | El catálogo de festivos no cubre asuetos de empresa ni el calendario SAT/IMSS | Resolverlo es un módulo aparte. El aviso previo amortigua el desfase |
| RS-06 | El tablero permite lectura de desempeño individual | Es inseparable del propósito: medir cumplimiento. Se mitiga con transparencia, no ocultándolo |
| PM-08 | `SmsService` sigue reportando éxito falso | Fuera del alcance por decisión del dueño. **Queda vivo en el repositorio**: cualquier otro módulo que lo use hereda el problema. Deuda técnica de otro ticket |
| RT-14 | La capa de aplicación seguirá bajo `ReclutamientoLuxuryApp` hasta su fase de mudanza | Mezclarlo con la funcionalidad haría el diff inauditable |

---

## 6. Verificaciones pendientes antes de cerrar el PASO 4

Ninguna se puede responder leyendo el repositorio: requieren la base de datos de producción.

**B4 — Baseline del KPI K6 (tareas vencidas sin cerrar).** Sin este número, K6 no tiene meta
y el módulo no puede demostrar mejora.

```sql
SELECT COUNT(*) AS VencidasSinCerrar
FROM TaskInstances
WHERE DueDate < GETDATE() AND CompletedAt IS NULL;
```

**B6 — ¿El motor legado está vivo?** Define si RT-11 y RS-07 son teóricos o reales.

```sql
SELECT Status, COUNT(*) FROM TaskRecurringTemplates GROUP BY Status;
SELECT COUNT(*) FROM Tasks WHERE RecurringTemplateId IS NOT NULL;
```

Más la configuración del job `generar-instancias-tareas-recurrentes-legado` en la tabla de
jobs programados, que vive en base de datos y no en código.

**B1 — WhatsApp en el dispatcher.** Decisión técnica del equipo backend, no requiere datos.

---

## 7. Trazabilidad: riesgo → regla de negocio

| Riesgo | Reglas que lo cubren | ¿La regla alcanza? |
| --- | --- | --- |
| RT-01 | `RN-ALT-032` | ❌ No. La regla define el campo; el motor no puede cumplirla. **Requiere decisión de arquitectura** |
| RT-02 | `RN-ALT-039` | ⚠️ Parcial. Cubre el aviso, no la generación. **Requiere ajuste de la regla** |
| RT-03 | `RN-ALT-018`, `RN-ALT-019` | ✅ Sí, si se implementan completas |
| RT-04 | — → `RN-ALT-040` (nueva) | ✅ Resuelto: una tarea, varios responsables. Se formaliza como regla nueva en el PASO 4 |
| RT-06 | `RN-ALT-011` | ⚠️ Parcial. No contempla `DueDate` nulo |
| RT-07 | — | ❌ Ninguna regla fija el criterio horario. **Hueco de la FASE 0** |
| RT-10 | `RN-ALT-006`, `RN-ALT-037` | ✅ Sí. Prohíben reportar entrega falsa |
| RT-16 | `RN-ALT-022` | ⚠️ Parcial. Limita quién marca crítico, no el volumen total |
| RS-01 | `RN-ALT-027` + diseño de `OrgHierarchy` por rol | ✅ Cerrado por diseño (2026-08-20). La prueba de no fuga sigue siendo criterio de paso |
| RS-02 | `RN-ALT-004`, `RN-ALT-023` | ✅ Sí, si se valida en el servidor |
| RS-04 | `RN-ALT-026`, `RN-ALT-027` | ✅ Sí, si se aplica en el endpoint |

**Tres huecos de la FASE 0 detectados en este paso** (RT-04, RT-07, y el ajuste de RT-02).
No invalidan la FASE 0 aprobada: se resuelven como reglas nuevas o corregidas en el PASO 4,
que es donde toca decidirlos.

---

## 8. Resumen para decidir

- **3 riesgos críticos abiertos antes de codificar:** RT-01, RT-02 y RT-03. Los tres hacen que
  el módulo falle exactamente como falló el proceso manual que reemplaza. RS-01 se cerró por
  diseño el 2026-08-20.
- **La dependencia más frágil no es técnica:** que el organigrama de roles esté armado por
  cliente (D-05) y que su refactor llegue a tiempo (D-11).
- **Ninguna dependencia externa bloquea la liberación:** WhatsApp se activa después.
- **Preguntas de diseño resueltas tras este documento:** una obligación con varios responsables
  es **una sola tarea** (decisión #13, RT-04); los vencimientos se calculan en hora de México y
  las marcas de auditoría en UTC (RT-07); en festivo la tarea **se recorre** al siguiente día
  hábil conservando la fecha de recurrencia original (RT-02).

**Siguiente paso:** PASO 4 — `04-implementation-plan.md`, 11 secciones, con tabla de
reutilización, migraciones clasificadas y secuenciación por dependencias sin fechas inventadas.
