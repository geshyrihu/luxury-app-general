# Propuesta de Cambios - Presupuesto Web Aspel

## Objetivo del documento

Este documento servirá como bitácora funcional y técnica de los cambios solicitados para el módulo `Presupuesto Web Aspel`. La idea es documentar cada indicación, analizar su impacto y dejar una propuesta clara antes de implementar.

---

## Cambio 001

### Solicitud recibida

Actualmente en una sola tabla se visualiza junto:

- Presupuesto de mantenimiento
- Gastos extraordinarios
- Gastos de proyectos

La nueva regla solicitada es:

- En la tabla principal solo debe mostrarse el presupuesto de mantenimiento.
- Los gastos extraordinarios y los gastos de proyectos ya no deben mezclarse con mantenimiento.
- Debe existir un componente independiente para esos gastos especiales.
- Dentro de ese nuevo componente, la parte superior mostrará solo gastos extraordinarios.
- En la parte inferior del mismo componente se mostrarán solo gastos de proyectos.

### Análisis funcional

La solicitud cambia la intención actual de la pantalla. Hoy el usuario trabaja sobre una sola vista consolidada y usa filtros para incluir o excluir tipos de cuenta. Con la nueva regla, el módulo deja de ser una vista mixta y pasa a tener una separación explícita por naturaleza del gasto.

Esto es correcto desde negocio por varias razones:

- Reduce ambigüedad al revisar presupuesto base de mantenimiento.
- Evita que extraordinarios o proyectos contaminen totales visuales de mantenimiento.
- Hace más clara la lectura operativa para usuarios contables y administrativos.
- Permite que cada bloque evolucione con reglas distintas sin seguir forzando una sola tabla.

### Propuesta funcional

Propongo dividir la experiencia en dos bloques claramente separados:

1. Vista principal de `Presupuesto de Mantenimiento`
- Mostrar únicamente cuentas que pertenezcan al presupuesto base de mantenimiento.
- Excluir de forma nativa extraordinarios y proyectos.
- Ya no depender de botones para ocultarlos o mostrarlos dentro de la misma tabla.

2. Nuevo componente de `Gastos Especiales`
- Un solo componente contenedor para los dos subconjuntos.
- Sección superior: `Gastos Extraordinarios`.
- Sección inferior: `Gastos de Proyectos`.
- Cada sección con su propia tabla, totales y estado vacío.

### Propuesta técnica inicial

La implementación más sana sería separar la lógica en lugar de seguir filtrando todo desde una sola colección visual.

#### Opción recomendada

Mantener una fuente de datos común, pero derivar tres subconjuntos explícitos:

- `cuentasMantenimiento`
- `cuentasExtraordinarias`
- `cuentasProyectos`

Con esto:

- El componente actual de ejercicio fiscal se enfoca solo en mantenimiento.
- Se crea un nuevo componente para gastos especiales.
- Se reutiliza la lógica de clasificación de cuentas, pero ya no como toggle visual sino como partición fija del dataset.

### Beneficios de esta propuesta

- Menor confusión para el usuario.
- Menos acoplamiento visual.
- Totales más confiables por categoría.
- Mejor base para futuras reglas particulares de extraordinarios y proyectos.
- Más mantenible que seguir agregando condiciones dentro de una sola tabla gigante.

### Riesgos o puntos de atención

- La clasificación actual depende de prefijos hardcodeados por cliente. Si esa lógica no se estabiliza, la nueva separación puede seguir heredando inconsistencias.
- Si mantenimiento hoy se define solo por descarte, conviene formalizarlo mejor para evitar que cuentas nuevas queden mal ubicadas.
- Si hay exportaciones, resúmenes o análisis con IA, habrá que decidir si trabajan solo con mantenimiento o también con gastos especiales.

### Recomendación experta

Sí recomiendo hacer este cambio.

No recomendaría resolverlo solo escondiendo filas dentro de la misma pantalla actual. Lo más sano es separar la visualización y también separar el cálculo de totales por bloque. Eso evita errores funcionales y deja una base mucho más clara para los siguientes cambios que vayas pidiendo.

### Definiciones confirmadas

1. La vista principal de mantenimiento debe conservar el mismo diseño actual y las mismas reglas existentes, eliminando únicamente la mezcla visual de extraordinarios y proyectos.
2. Los gastos especiales vivirán en otra pestaña.
3. En esa pestaña se creará un componente wrapper y dos componentes hijos:
   - `espejo-aspel-presupuesto`
   - `espejo-aspel-extraordinarios`
4. El objetivo es separar responsabilidades y compartir lógica común entre componentes.

### Ajuste de propuesta técnica

Con tu definición, la propuesta recomendada queda así:

#### 1. Mantener el componente actual como base de mantenimiento

El componente actual de ejercicio fiscal se conserva como referencia visual y funcional del presupuesto de mantenimiento:

- mismo diseño
- mismas reglas actuales
- mismos cálculos
- misma interacción de meses, búsqueda, historial y análisis aplicable

El cambio principal será que este componente ya no debe renderizar cuentas extraordinarias ni de proyectos.

#### 2. Crear una nueva pestaña de tipo contenedor

La nueva pestaña funcionará como orquestador visual. Su responsabilidad será:

- recibir el contexto común del cliente y año
- resolver la carga compartida del dataset
- distribuir los subconjuntos correctos a los componentes hijos
- mantener una navegación clara entre mantenimiento y espejo

#### 3. Crear un componente wrapper

Este wrapper será el punto de composición de la pestaña nueva.

Responsabilidades sugeridas:

- centralizar carga de datos compartidos
- encapsular filtros base comunes
- exponer estados reutilizables como `loading`, `error`, `customerId`, `intYear`
- derivar subconjuntos para cada vista hija

Nombre conceptual:

- `espejo-aspel-wrapper` o equivalente según convención del proyecto

#### 4. Crear `espejo-aspel-presupuesto`

Este componente queda definido para representar el presupuesto espejo sin filtro.

Implicaciones funcionales:

- mostrará la vista espejo del presupuesto
- no separará mantenimiento contra extraordinarios/proyectos dentro de sí mismo
- vivirá dentro de la nueva pestaña controlada por el wrapper
- debe reutilizar lógica compartida y no duplicar toda la implementación del componente principal

#### 5. Crear `espejo-aspel-extraordinarios`

Aunque el nombre habla de extraordinarios, por tu regla este componente debe cubrir ambos bloques especiales dentro de la misma vista:

- bloque superior: extraordinarios
- bloque inferior: proyectos

Eso significa que este componente puede ser el especializado en gastos no ordinarios, con dos datasets derivados:

- `cuentasExtraordinarias`
- `cuentasProyectos`

### Propuesta de arquitectura de reutilización

Para no repetir lógica, recomiendo separar lo común en una capa reutilizable y dejar cada componente solo con su intención visual.

#### Lógica común reutilizable

Conviene extraer y compartir:

- carga de presupuesto por cliente y año
- postproceso de cuentas
- clasificación por tipo de cuenta
- cálculo de montos por mes
- cálculo de acumulados, porcentajes y restante
- helpers para meses visibles
- definición de campos de búsqueda global

#### Dónde debería vivir esa lógica

Opciones sanas:

1. Un servicio/facade específico del módulo
- recomendado si varios componentes van a consumir el mismo dataset y mismas reglas

2. Una clase base o conjunto de helpers puros
- útil para cálculos y transformaciones sin acoplarlos a Angular

3. Ambos
- facade para estado y carga
- helpers puros para clasificación y cálculos

Mi recomendación es usar ambos.

### Propuesta concreta de división de responsabilidades

#### Componente actual

- muestra solo mantenimiento
- conserva diseño y reglas actuales
- elimina por completo los toggles/filtros de `Extraordinarios` y `Proyectos`, porque ya no serán necesarios en esta vista

#### Wrapper de nueva pestaña

- carga datos comunes
- divide subconjuntos
- compone la vista espejo
- navega entre `espejo-aspel-presupuesto` y `espejo-aspel-extraordinarios`

#### `espejo-aspel-presupuesto`

- muestra presupuesto espejo sin filtro
- reutiliza lógica común sin clonar implementación

#### `espejo-aspel-extraordinarios`

- renderiza extraordinarios arriba
- renderiza proyectos abajo
- maneja totales independientes por bloque

### Riesgos detectados con esta nueva dirección

- Será importante diferenciar visualmente la vista principal de mantenimiento contra `espejo-aspel-presupuesto`, porque una representa mantenimiento limpio y la otra presupuesto espejo sin filtro.
- Si la clasificación sigue basada en prefijos hardcodeados, ahora esa dependencia se propagará a más componentes.
- Si el wrapper centraliza demasiado, puede convertirse en un componente demasiado grande; conviene que coordine, no que haga toda la lógica visual.

### Recomendación experta refinada

La dirección que propusiste es buena y más escalable que solo partir una tabla.

Mi recomendación final en este punto es:

- mantener la pantalla actual como vista canónica de mantenimiento
- crear una pestaña separada para la vista espejo
- usar un wrapper para composición y coordinación
- extraer la lógica común a utilidades/facade del módulo
- evitar copiar-pegar el componente actual en los nuevos componentes

### Aclaración confirmada

Queda confirmado que los filtros/toggles actuales de:

- `Extraordinarios`
- `Proyectos`

ya no serán necesarios en la vista principal, porque esa tabla deberá mostrar solo mantenimiento desde origen visual y funcional.

### Definición adicional confirmada

- `espejo-aspel-presupuesto` representará el presupuesto espejo sin filtro.
- En el wrapper se navegará entre:
- `espejo-aspel-presupuesto`
- `espejo-aspel-extraordinarios`

### Implementación ejecutada

- La entrada de la ruta de presupuesto ahora apunta a un `wrapper`.
- Se creó `espejo-aspel-extraordinarios` para mostrar:
  - extraordinarios en la parte superior
  - proyectos en la parte inferior
- Se creó un archivo compartido para centralizar:
  - clasificación de cuentas
  - normalización de jerarquía Aspel
  - meses y años reutilizables
  - helpers de presupuesto y montos por mes
- `espejo-aspel-presupuesto` dejó de mostrar toggles de extraordinarios y proyectos.
- `espejo-aspel-presupuesto` ahora muestra solo mantenimiento usando la lógica compartida de clasificación.

### Estado

`Ejecutado / listo para revisión funcional`

---

## Cambio 002

### Solicitud recibida

- Los encabezados de las tablas deben seguir los estilos base definidos en `_custom-table.scss`.
- La jerarquía visual debe respetar estas reglas:
  - `601-000-000` es primer nivel.
  - `601-001-000` es segundo nivel.
  - `601-001-001` es tercer nivel.
- Si una cuenta es de primer o segundo nivel, debe verse en una sola línea:
  - `601-000-000 | GASTOS DE PERSONAL`
- Si una cuenta de segundo nivel no tiene hijos de tercer nivel, no debe mostrarse.
- Si una cuenta es padre, no debe mostrar el emoji del carrito.
- Si una cuenta es de tercer nivel, debe mostrarse:
  - arriba el número de cuenta
  - abajo el nombre de la cuenta

### Implementación ejecutada

- Se aplicó `custom-table` como base visual a las tablas del presupuesto principal y de gastos especiales.
- Se reforzó la normalización compartida de jerarquía para cuentas de 3 segmentos.
- Se agregó un filtro compartido para ocultar cuentas de segundo nivel sin hijos de tercer nivel.
- Se extendió la regla para ocultar también cuentas de primer nivel que no tengan hijos visibles.
- Se actualizó el render de filas:
  - padres en línea `código | descripción`
  - hojas con código arriba y descripción abajo
  - sin emoji de carrito en cuentas padre

### Estado

`Ejecutado / listo para revisión visual y funcional`
## Ajuste 2026-05-01 - Datos vacíos en "Gastos extraordinarios y proyectos"

### Hallazgo
- La vista `espejo-aspel-extraordinarios` estaba consumiendo `GET /api/presupuesto/aspel`.
- Ese endpoint backend no es espejo: aplica reglas de visibilidad (`HojaTienePresupuestoValido`) y puede omitir cuentas hoja sin presupuesto ni gasto, además de respetar exclusiones.
- Como resultado, la pestaña de especiales podía quedarse sin cuentas visibles aunque sí existieran en el espejo crudo o estuvieran definidas por reglas de cuentas extra.

### Causa técnica
- Frontend:
  - El componente separaba extraordinarios y proyectos desde `getAspelQuotation(...)`.
  - La clasificación se hacía solo por prefijos (`605`, `606`, `609`, `6900`).
- Backend:
  - `GetAspelQuotation(...)` filtra cuentas antes de devolverlas.
  - `GetAspelMirrorAsync(...)` sí devuelve el espejo completo sin filtrar.
  - Las reglas `BudgetAccountRules` contienen `ExtraAccount` y `ExcludedAccount`, por lo que la clasificación no debe depender solo de prefijos.

### Corrección aplicada
- `espejo-aspel-extraordinarios` ahora consume `getPresupuestoLimpioEjercicioFiscal(...)`.
- Se agregó lectura de `BudgetAccountRules/{customerId}`.
- La separación compartida ahora:
  - respeta reglas `ExtraAccount`
  - excluye cuentas con regla `ExcludedAccount`
  - mantiene prefijos como respaldo para extraordinarios y proyectos

### Impacto esperado
- La pestaña de `Gastos extraordinarios y proyectos` ya no depende del presupuesto filtrado.
- Deben volver a mostrarse cuentas especiales aun cuando en el presupuesto normal no aparezcan por filtros del backend.

## Ajuste 2026-05-01 - Proyectos `606` ocultos por falsa jerarquía

### Hallazgo
- La respuesta del API sí trae cuentas de proyectos como `606-000-000` y `606-001-000`.
- El problema estaba en frontend: la normalización trataba cualquier cuenta terminada en `-000` como agrupadora.
- Después, la regla visual ocultaba niveles 2 sin hijos de nivel 3, por lo que `606-001-000` desaparecía aunque sí era una cuenta operativa visible.

### Corrección aplicada
- En la separación de categorías especiales (`605` extraordinarios, `606` proyectos), si una cuenta marcada como agrupadora no tiene hijos reales dentro de su categoría, se reclasifica como hoja.
- Esto permite mostrar correctamente casos como:
  - `605-001-000`
  - `606-001-000`

### Resultado esperado
- Extraordinarios sigue tomando cuentas que inician con `605`.
- Proyectos sigue tomando cuentas que inician con `606`.
- Las cuentas especiales de nivel 2 que no tienen descendencia ya no se esconden por error.

## Regla final de clasificación

- `Extraordinarios`: únicamente cuentas cuyo `codigo_Cuenta` inicia con `605`.
- `Mejoras y proyectos`: únicamente cuentas cuyo `codigo_Cuenta` inicia con `606`.
- Las reglas configurables no deben volver a mezclar cuentas `604`, `607`, `609` u otras categorías dentro de esta vista.
