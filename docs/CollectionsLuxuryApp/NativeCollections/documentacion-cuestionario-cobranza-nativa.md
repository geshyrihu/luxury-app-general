# Cuestionario: Dashboard Modulo Cobranza Nativa

Fecha: 16 de abril de 2026
Para: Director del modulo
De: Asistente de desarrollo

Este cuestionario define con precision el alcance del dashboard antes de ejecutar.
Responde directamente en este archivo, debajo de cada pregunta.

---

## Bloque 1: Usuario objetivo

**P1.** El dashboard que vamos a construir esta dirigido principalmente a:

- [ ] A) El administrador del condominio (operativo, no tecnico)
- [ ] B) El area financiera/contable (revisa numeros, aprueba operaciones)
- [ ] C) El equipo de desarrollo (visibilidad de todo el modulo, incluyendo internos)
- [ ] D) Todos los anteriores, con el mismo nivel de detalle
      por el momento va dirigido al super usuario con la finalidad de comprender todas las fuciones y procesos del sistema, en un futuro
      crearemos modulos para cada rol

**Respuesta:**

---

**P2.** Las opciones deben mostrarse todas siempre, o deben filtrarse por rol del usuario autenticado?

- [ ] A) Mostrar todas, sin filtro (modo "desarrollo / visibilidad total")
- [ ] B) Filtrar por rol (Admin ve todo, Cobranza ve lo operativo, Condomino ve solo su estado de cuenta)
- [x] C) Por ahora mostrar todas, pero con indicador visual de que rol las usa (si coloca una propuesta de rol, mas adeltane se definira)

**Respuesta:**

---

## Bloque 2: Estado de cada seccion

El modulo tiene funcionalidades con paginas Angular ya implementadas y otras que solo tienen backend.
Necesito saber como tratar las segundas.

**P3.** Para funcionalidades con backend completo pero sin pagina Angular todavia
(Casos de Cobranza, Facturas CFDI, Conciliacion/Bolsa de pagos, Auditoria Financiera),
que debe mostrarse en el dashboard?
la respuesta aqui es que si debe de tener pagina en angular se debe crear de una vez.

- [ ] A) Tarjeta visible con badge "En desarrollo" y sin navegacion
- [ ] B) Tarjeta visible con boton deshabilitado (usuario ve que existe pero no puede entrar)
- [ ] C) No mostrarlas hasta tener la pagina Angular completa
- [ ] D) Mostrarlas con documentacion inline de lo que hara cuando este lista

**Respuesta:**

---

**P4.** La pagina de "Dashboard de Metricas" (`/cobranza-nativa/dashboard`) actualmente muestra
datos reales del API o es un stub/placeholder?

no lo se, no recuerdo si deje data de ejemplo , pero debe mostrar datos reales

**Respuesta:**

---

**P5.** La pagina de "Demo Interactivo" (`/cobranza-nativa/demo`) sigue siendo relevante o
puede retirarse/ocultarse ahora que el modulo tiene funcionalidad real?

demo interactivo es un modulo que por el momento esta en stanby, mas adelatne vemos si lo actualizamos por el momento ignoralo

- [ ] A) Mantener, sigue siendo util para onboarding
- [ ] B) Ocultar del dashboard principal, pero dejar la ruta
- [ ] C) Eliminar completamente

**Respuesta:**

---

## Bloque 3: Servicios exclusivos del API (sin UI)

Estos servicios se ejecutan solo en el backend. Necesito saber si deben ser disparables desde la UI o solo documentados.

**P6.** `ChargesGeneratorService` - Genera cargos mensuales desde plantillas para todas las propiedades.
Actualmente, como se activa en produccion?

- [x] A) Job automatico nocturno (Hangfire/cron), SE DEBE DE EXPLICAR EN EL (HTML UI QUE EXPLICA TODO EL MODULO)
- [ ] B) Se llama manualmente desde algun otro modulo
- [ ] C) No esta activo todavia, es un servicio pendiente de activar

crea un html(HTML UI QUE EXPLICA TODO EL MODULO) que simule como funciona el sistema incluyendo esta seccion del api, recuerda yo no soy experto programador ni contador entonces
crea una pag html o componente dode se vizualiza el paso a paso de como funcionaa el sistema desde que se crear una propiedad seagregan habitates tipos etc, se registra cargos vigentes se aplicana cada propiedad, en fn todo lo necesario para que yo que no soy experto y cualquier otro con quien yo quiera explicar nuestro sistema se entienda, que tenga bonita ui sea clara y facil de entender, al final de est pagina un resumen de todas las bondades que el sistema ofrece y los lineamientos de seguridad implementados ,ya sabes para una buena explicacion y venta en caso de ser necesario

**Respuesta:**

---

**P7.** `LateFeeCalculatorService` - Calcula y genera recargos por mora sobre cargos vencidos.
Mismo contexto que P6. Como se activa actualmente?

- [x] A) Job automatico SE DEBE DE EXPLICAR EN EL (HTML UI QUE EXPLICA TODO EL MODULO)
- [ ] B) Manual desde el modulo
- [ ] C) No activado todavia

**Respuesta:**

---

**P8.** `NotificationEngineService` - Envia notificaciones push/email por cargos proximos a vencer.
Mismo contexto.

**Respuesta:**

---

**P9.** Para los tres servicios anteriores (generador de cargos, recargos mora, notificaciones),
quieres que el dashboard tenga botones para dispararlos manualmente desde la UI?

se DEBEN TENER LA OPCIONA DE DISPARARLOS MANUELMENTE PERO TAMBIEN MEDIANTE UN JOB, SE DEBE DE EXPLICAR EN EL (HTML UI QUE EXPLICA TODO EL MODULO)

- [x] A) Si, con confirmacion antes de ejecutar
- [ ] B) Solo mostrar documentacion de lo que hacen, sin boton de ejecucion
- [ ] C) Mostrar el ultimo resultado de ejecucion (cuando corrio, cuantos registros proceso), sin boton

**Respuesta:**

---

**P10.** `WebhooksController` - Recibe notificaciones de pasarelas de pago externas (Conekta, Stripe, STP).
Este endpoint ya esta recibiendo llamadas reales en produccion, o es infraestructura futura?

- [ ] A) Recibiendo llamadas reales ya
- [ ] B) Infraestructura lista pero no conectada a ninguna pasarela todavia
- [x] C) Es un placeholder para el futuroSE DEBE DE EXPLICAR EN EL (HTML UI QUE EXPLICA TODO EL MODULO)

**Respuesta:**

---

**P11.** `ReconciliationService` - Bolsa de pagos no identificados (pagos registrados sin aplicar a cargos).
El boton "Disparar auto-conciliacion" que dispararia este servicio, quien tiene permiso de usarlo?

por el momento ntp dejame en este dasboardh y mas adelante definiremos los roles para cada seccion y funcion

- [ ] A) Solo rol Finanzas
- [ ] B) Cualquier administrador del condominio
- [ ] C) Solo el equipo interno de LuxuryApp

**Respuesta:**

---

## Bloque 4: Estructura visual del dashboard

**P12.** Prefieres que el nuevo dashboard sea:

- [x] A) Una sola pagina con todos los grupos (como el actual pero mas completo)
- [ ] B) Pestanas/tabs por area funcional (Operacion | Gobierno | API-Backend | Configuracion)
- [ ] C) Un panel lateral con categorias y contenido central con la documentacion expandible

**Respuesta:**

---

**P13.** La seccion de "servicios exclusivos del API" debe mostrarse:

- [x] A) Integrada en el mismo dashboard, como un grupo mas al final
- [ ] B) En una pagina separada accesible desde el dashboard
- [ ] C) Solo visible si el usuario tiene rol de administrador o desarrollador

**Respuesta:**

---

**P14.** Para cada tarjeta del dashboard, que nivel de documentacion necesitas?

- [ ] A) Solo titulo + descripcion de 2 lineas (como el actual)
- [ ] B) Titulo + descripcion + lista de que acciones permite hacer
- [ ] C) Titulo + descripcion + acciones + endpoints del API que consume
- [x] D) Lo mas completo posible (acciones, endpoints, permisos requeridos, estados posibles)

**Respuesta:**

---

## Bloque 5: Configuracion de Facturacion

**P15.** El modal de "Configuracion de Facturacion" (`BillingConfigModal`) actualmente se abre
desde que parte del sistema? No lo encuentro referenciado como ruta en el routing.

honestamente no se donde esta ni como se abre ni como se deberia de abrir hay que basasrse en el reporte gemini y en las convenciones por sistema profesional para definir donde se debe abrir, pero de momento se debe dejar en el dachboard sino esa por ningun lado

**Respuesta:**

---

## Bloque 6: Cobertura de Casos de Cobranza (Gestoria)

**P16.** `CollectionCasesController` expone un listado de casos de cobranza legal
(morosidad grave, escalada a gestoria). Actualmente hay datos reales en esta tabla
o es funcionalidad futura?

- [ ] A) Hay datos reales, el proceso ya esta activo
- [ ] B) La entidad existe en BD pero el proceso de escalada no corre todavia
- [ ] C) Es infraestructura futura

en este caso si esta en bbdd apenas estamos en proceso de creacion del sistema, no hay datos pero los habra y no debe seruna isnfraestrucutra futura debe ser vigente y estar funcional.
**Respuesta:**

---

## Bloque 7: Prioridades

**P17.** Dado que algunas secciones tienen mas trabajo pendiente que otras,
cual es el orden de prioridad para que aparezcan en el dashboard?

Ordena del 1 (mas urgente) al N (puede esperar):

- [ ] Operacion diaria (Cargos, Pagos, Plantillas)
- [ ] Gobierno financiero (Ledger, Aprobaciones, Cierres de Periodo)
- [ ] Identidad (Miembros de Propiedad)
- [ ] Cobranza legal (Casos de Gestoria)
- [ ] Facturacion CFDI
- [ ] Conciliacion bancaria
- [ ] Auditoria interna
- [ ] Configuracion (Politicas de mora, Billing config)
- [ ] Servicios backend automaticos

la respuesta aqui es que todos deben de estar, yo debo de tener claro loque este modulo al 100% provee se servicios y funcionalidades por esto estamos actualizando este dashboard
**Respuesta:**

---

_Con las respuestas a este cuestionario se generara un plan de ejecucion detallado y se construira el dashboard._
# Estado de Vigencia

- Insumo historico de descubrimiento funcional.
- Util para entender decisiones iniciales del dashboard.
- No es contrato tecnico vigente del modulo.
- La referencia actual del frontend es `appsweb/angular/src/app/modules/cobranza.luxuryapp/cobranza-nativa/docs/ORGANIZACION-FRONTAL-CNATIVA-2026-07-26.md`.
