# Modulo: PresupuestoWebAspel

## 1. Estado actual

Este modulo ya no vive de forma aislada dentro de `Features\PresupuestoWebAspel`.
La carpeta contiene el controlador HTTP, algunos DTOs de apoyo y documentacion,
pero la logica principal de negocio y de integracion con Aspel se ejecuta hoy en:

- `Features\PresupuestoShared\Services\AspelQuotationService.cs`
- `Features\PresupuestoShared\Services\HelperAspel.cs`
- `Features\PresupuestoShared\Interfaces\IAspelQuotationService.cs`

Tambien depende de:

- `AspelCustomerEmpresa` en base de datos para traducir `customerId -> empresaId Aspel`
- `BudgetAccountRule` para exclusiones dinamicas y cuentas extras
- `FundingController` para historial de compras por cuenta
- `AiAssistantService` para el analisis financiero asistido por IA

En otras palabras: `PresupuestoWebAspel` es la cara web del flujo, pero no es el
unico lugar donde vive el dominio.

---

## 2. Alcance funcional real

La experiencia actual del usuario se divide en 2 vistas dentro del wrapper Angular:

1. `Presupuesto`
2. `Extraordinarios y Proyectos`

Ambas consumen la misma familia de endpoints del controlador `PresupuestoController`,
pero no usan exactamente la misma estrategia de carga ni de filtrado.

### Vista 1: Presupuesto

Componente:

- `client\angular\src\app\features\contabilidad\presupuesto-web-aspel\espejo-aspel-presupuesto.ts`

Objetivo:

- Mostrar cuentas de mantenimiento
- Permitir cambiar anio
- Permitir ocultar/mostrar meses a nivel UI
- Abrir historial de compras por cuenta
- Administrar reglas de cuentas
- Lanzar un resumen ejecutivo con IA

Endpoints usados:

- `GET /api/Presupuesto/aspel`
- `GET /api/Presupuesto/aspel-full`
- `POST /api/Presupuesto/analyze`
- `GET /api/Funding/purchase-history/{customerId}/{fiscalYear}/{accountNumber}`

### Vista 2: Extraordinarios y Proyectos

Componente:

- `client\angular\src\app\features\contabilidad\presupuesto-web-aspel\espejo-aspel-extraordinarios.ts`

Objetivo:

- Separar cuentas especiales
- Aplicar exclusiones dinamicas por reglas
- Mostrar solo cuentas con gasto visible y su jerarquia necesaria

Endpoints usados:

- `GET /api/Presupuesto/presupuesto-limpio-ejercicio-fiscal`
- `GET /api/BudgetAccountRules/{customerId}`
- `GET /api/Funding/purchase-history/{customerId}/{fiscalYear}/{accountNumber}`

---

## 3. Arquitectura actual

### Backend

#### `PresupuestoController`

Responsabilidad actual:

- Exponer endpoints HTTP
- Aplicar autorizacion y auditoria
- Delegar toda la logica real a `IAspelQuotationService`
- Delegar el resumen ejecutivo a `IAiAssistantService`

No contiene logica fuerte de transformacion ni de jerarquia.

#### `AspelQuotationService`

Responsabilidad actual:

- Resolver `empresaId` de Aspel desde `customerId`
- Llamar la API externa de Aspel
- Parsear el JSON recibido
- Convertir cuentas a `CuentaAspelTercerNivelDTO`
- Calcular montos y presupuestos por mes y anio
- Filtrar cuentas visibles para la vista "curada"
- Generar vistas completas, resumenes y datos de apoyo para compras

#### `HelperAspel`

Responsabilidad actual:

- Validar si una cuenta hoja debe ser visible
- Excluir cuentas definidas en `BudgetAccountRule`
- Agregar cuentas extras para flujos de compras

### Frontend

#### `wrapper.ts`

Responsabilidad:

- Presentar tabs de escritorio y segment de movil
- Alternar entre vista de presupuesto y vista de especiales

#### `espejo-aspel-presupuesto.ts`

Responsabilidad:

- Cargar presupuesto principal cuando cambia el cliente
- Mantener estado de meses visibles
- Calcular totales en cliente
- Filtrar visualmente a "mantenimiento"
- Abrir modales de reglas e historial
- Generar contexto de texto para analisis por IA

#### `espejo-aspel-extraordinarios.ts`

Responsabilidad:

- Cargar espejo completo
- Consultar reglas de cuentas
- Clasificar cuentas en extraordinarias y proyectos
- Mostrar solo las cuentas con gasto y sus padres necesarios

#### `purchase-history.ts`

Responsabilidad:

- Consultar historial de compras por cuenta contable
- Abrir orden de compra relacionada
- Abrir PDF de factura

---

## 4. Contratos HTTP vigentes

### Controlador de presupuesto

Ruta base:

- `api/Presupuesto`

Endpoints:

- `POST /api/Presupuesto/analyze`
- `GET /api/Presupuesto/aspel?customerId={guid}&intYear={year}`
- `GET /api/Presupuesto/aspel-full?customerId={guid}&intYear={year}`
- `GET /api/Presupuesto/aspel-summary?customerId={guid}&intYear={year}`
- `GET /api/Presupuesto/to-purchase-order/{customerId}/{ordenCompraId}/{year}`
- `GET /api/Presupuesto/fixed-expenses-catalog/{customerId}/{year}`
- `GET /api/Presupuesto/presupuesto-limpio-ejercicio-fiscal?customerId={guid}&intYear={year}`
- `GET /api/Presupuesto/presupuesto-limpio-cobranza?customerId={guid}&intYear={year}`

### Controlador de reglas

Ruta base:

- `api/BudgetAccountRules`

Endpoints:

- `GET /api/BudgetAccountRules/{customerId}`
- `POST /api/BudgetAccountRules`
- `PUT /api/BudgetAccountRules/{id}`
- `DELETE /api/BudgetAccountRules/{id}`

### Historial de compras

Ruta base:

- `api/Funding`

Endpoint usado por este modulo:

- `GET /api/Funding/purchase-history/{customerId}/{fiscalYear}/{accountNumber}`

---

## 5. Flujo backend real

### 5.1 Consulta a Aspel

`AspelQuotationService.GetRawDataFromApiAsync(...)`:

1. Construye `GET {AspelApiSettings.Url}?intEmpresa={empresaId}&intYear={year}`
2. Agrega headers `username` y `password`
3. Ejecuta la llamada con `HttpClient`
4. Si hay timeout, lanza `BusinessException` con status `504`
5. Si la API externa responde con error, lanza `BusinessException` con status `502`
6. Si el JSON trae `data.Cuentas`, devuelve:
   - datos de empresa
   - arreglo completo de cuentas

### 5.2 Mapeo de cuentas

`MapToTercerNivelDTO(...)`:

- Copia codigo, descripcion, nivel y padre
- Carga montos y presupuestos mensuales
- Usa `Presup_Enero` como fallback para meses faltantes
- Calcula:
  - presupuesto anual
  - gasto anual acumulado calculado
  - presupuesto restante

### 5.3 Vista curada: `GetAspelQuotation(...)`

Este es el endpoint principal de la vista `Presupuesto`.

Hace lo siguiente:

1. Obtiene todas las cuentas crudas
2. Filtra solo raices de nivel 1 en rango:
   - `600-699`
   - `6000-6999`
3. Recorre jerarquia N1 -> N2 -> N3 -> N4
4. Conserva solo hojas validas por `HelperAspel.HojaTienePresupuestoValido(...)`
5. Inserta padres como filas agrupadoras solo cuando tienen descendientes visibles
6. Calcula totales generales

Resultado:

- una lista "curada"
- con jerarquia visible
- lista para que el frontend separe mantenimiento, extraordinarios y proyectos

### 5.4 Vista resumen: `GetAspelQuotationSummaryAsync(...)`

Hace lo siguiente:

1. Toma las cuentas raiz validas
2. Localiza todas las hojas descendientes
3. Suma sus montos y presupuestos en el padre
4. Regresa una vista consolidada por cuenta raiz

### 5.5 Vista espejo: `GetAspelMirrorAsync(...)`

Hace lo siguiente:

1. Trae todas las cuentas de Aspel
2. Las convierte una por una a DTO
3. No aplica jerarquia visual
4. No filtra por helper
5. Regresa la coleccion completa

Se usa como base para especiales y para exploracion interna.

### 5.6 Vista full: `GetAspelFullQuotation(...)`

En el estado actual su implementacion es practicamente equivalente a
`GetAspelMirrorAsync(...)`:

- recorre todas las cuentas
- las mapea sin agrupar
- calcula totales

Esto significa que hoy `aspel-full` y `presupuesto-limpio-ejercicio-fiscal`
tienen una diferencia semantica en nombre, pero no una diferencia fuerte
de comportamiento en codigo.

---

## 6. Flujo frontend real

### 6.1 Carga inicial

En ambos componentes principales hay un `effect(...)` que observa el
`customerId` activo. Cuando existe un cliente:

- la vista `Presupuesto` llama `cargarPresupuesto(customerId)`
- la vista `Especiales` llama `cargarDatos(customerId)`

### 6.2 Normalizacion local

El frontend no recibe `esFilaAgrupadora` desde backend porque el DTO backend
lo tiene marcado con `JsonIgnore`.

Por eso `presupuesto-web-aspel.shared.ts` reconstruye localmente:

- `nivel_Cuenta`
- `esFilaAgrupadora`
- jerarquia visible
- clasificacion por tipo

Funciones clave:

- `normalizeAspelAccounts(...)`
- `splitAspelAccounts(...)`
- `filterVisibleAccounts(...)`

### 6.3 Clasificacion de cuentas

Reglas actuales en frontend:

- `605-*` y `607-*` => extraordinarias
- `606-*` => proyectos
- todo lo demas => mantenimiento

Esto esta implementado en cliente, no en backend.

### 6.4 Regla especial para extraordinarios y proyectos

La vista de especiales ademas:

- consulta reglas dinamicas desde `BudgetAccountRules`
- elimina cuentas excluidas
- conserva solo hojas con gasto
- vuelve a agregar padres necesarios para no romper el arbol visual

### 6.5 Historial de compras

Al hacer click en una cuenta hoja:

1. Se abre `PurchaseHistory`
2. El modal consulta `Funding/purchase-history/...`
3. Muestra compras relacionadas con la cuenta
4. Permite abrir la orden de compra
5. Permite visualizar factura PDF si existe URL

### 6.6 Analisis con IA

La vista principal:

1. Calcula totales solo con los meses visibles
2. Detecta top 5 cuentas con sobregasto
3. Construye un string de contexto
4. Llama `POST /api/Presupuesto/analyze`
5. Muestra el resultado en modal

No envia el dataset completo; envia un resumen textual preprocesado por frontend.

---

## 7. DTOs y serializacion relevantes

### `AspelBudgetDTO`

Lleva:

- datos de empresa
- lista `Cuentas`
- totales por mes
- totales anuales calculados

### `CuentaAspelTercerNivelDTO`

Backend serializa:

- `Codigo_Cuenta`
- `Descripcion_Cuenta`
- `Nivel_Cuenta`
- `Cuenta_Padre`
- montos y presupuestos mensuales
- `Acumulado_Anual`

Backend no serializa actualmente:

- `EsFilaAgrupadora`
- `AnualAcumuladoMontoPresupuesto`
- `PresupuestoAnual`
- `PresupuestoRestante`

Por eso el frontend depende de calculos y normalizacion local.

---

## 8. Hallazgos vigentes

### Hallazgo 1: dependencia real fuera de la carpeta

Aunque este modulo parece autocontenido por nombre, la logica central esta en
`PresupuestoShared`. Cualquier cambio funcional real del presupuesto debe
considerar ambas carpetas.

### Hallazgo 2: `aspel-full` y `presupuesto-limpio-*` estan muy cerca

Hoy ambas rutas devuelven practicamente la misma forma de datos. Esto complica
la semantica del frontend y la documentacion.

### Hallazgo 3: clasificacion de especiales en frontend

La separacion entre mantenimiento, extraordinarios y proyectos esta basada en
prefijos de cuenta dentro de Angular. Eso vuelve fragil el comportamiento si
cambian reglas contables o excepciones.

### Hallazgo 4: tipado parcial en historial de compras

El backend devuelve `OrdenCompraId`, pero la interfaz TS local no lo declara.
La plantilla y el componente lo usan de todos modos en runtime.

### Hallazgo 5: manejo de errores inconsistente

No todos los flujos de carga apagan `loading` o reportan error de la misma forma.
Esto puede generar estados silenciosos o UI incompleta.

### Hallazgo 6: README anterior desfasado

La version anterior explicaba correctamente la intencion historica, pero no el
acoplamiento real con `PresupuestoShared`, `HelperAspel`, `BudgetAccountRules`
y `Funding`.

---

## 9. Plan de mejora propuesto

Los siguientes puntos son sugerencias. Estan pensados para ser revisados y
autorizados uno por uno antes de tocar codigo.

- [ ] A01. Alinear semantica de endpoints `aspel-full` vs `presupuesto-limpio-*` y decidir si uno debe eliminarse, renombrarse o diferenciarse funcionalmente.
- [ ] A02. Mover o exponer la clasificacion de cuentas especiales desde backend para que Angular no dependa de prefijos codificados (`605`, `606`, `607`).
- [ ] A03. Serializar explicitamente `EsFilaAgrupadora`, `PresupuestoAnual` y `PresupuestoRestante` desde backend para reducir logica duplicada en frontend.
- [ ] A04. Unificar manejo de errores y `loading` en `cargarPresupuesto`, `onApelFull`, `sinFiltro` y `PurchaseHistory.onLoadData`.
- [ ] A05. Corregir el tipado TS de `PurchaseHistoryDTO` agregando `ordenCompraId`.
- [ ] A06. Revisar si `sinFiltro()` sigue siendo una accion activa de producto o si debe eliminarse por deuda tecnica.
- [ ] A07. Evaluar si `AspelMappingService` debe integrarse al flujo principal o si su existencia actual solo agrega duplicacion conceptual.
- [ ] A08. Documentar formalmente que `PresupuestoWebAspel` depende de `PresupuestoShared`, `Funding` y `BudgetAccountRules`.
- [ ] A09. Agregar pruebas unitarias del algoritmo de normalizacion del frontend (`normalizeAspelAccounts`, `splitAspelAccounts`, `filterVisibleAccounts`).
- [ ] A10. Agregar pruebas backend para:
  - mapeo mensual con fallback de `Presup_Enero`
  - filtrado por rango 600-699
  - exclusiones por `BudgetAccountRule`
  - equivalencia actual entre `aspel-full` y mirror
- [ ] A11. Revisar si la regla especial del cliente `00000000-0000-0000-0000-000000000064` debe externalizarse a configuracion o reglas de negocio persistidas.
- [ ] A12. Evaluar cache temporal o estrategia de reduccion de llamadas a Aspel si el modulo presenta lentitud en clientes grandes.

### Prioridad sugerida

Prioridad alta:

- A01
- A03
- A04
- A05

Prioridad media:

- A02
- A09
- A10
- A11

Prioridad baja:

- A06
- A07
- A08
- A12

---

## 10. Recomendacion de trabajo

Si se va a intervenir el modulo, el orden mas seguro seria:

1. Corregir documentacion y contratos visibles
2. Corregir tipados y manejo de errores
3. Agregar pruebas
4. Solo despues refactorizar endpoints o mover logica entre frontend y backend

Ese orden reduce riesgo porque primero vuelve observable el comportamiento
actual antes de modificar reglas de negocio.

---

## 11. Plan de ejecucion conservador

Este plan parte de una restriccion explicita:

- evitar cambios tempranos en `PresupuestoShared` porque es consumido por otros modulos
- preferir primero ajustes locales en `PresupuestoWebAspel`
- no cambiar contratos backend compartidos sin inventario previo de consumidores

### Fase 0. Baseline y proteccion

- [ ] P00. Levantar inventario de consumidores de `IAspelQuotationService` y `HelperAspel`.
- [ ] P01. Confirmar que rutas usan hoy:
  - `aspel`
  - `aspel-full`
  - `aspel-summary`
  - `presupuesto-limpio-ejercicio-fiscal`
- [ ] P02. Documentar diferencias reales entre cada endpoint usando ejemplos de respuesta.
- [ ] P03. Identificar si existe cobertura automatizada actual sobre `PresupuestoShared`.

Objetivo:

- no tocar servicios compartidos sin saber exactamente quien depende de ellos

### Fase 1. Cambios seguros y locales

Esta fase no debe modificar `PresupuestoShared`.

- [ ] P10. Corregir `PurchaseHistoryDTO` en Angular agregando `ordenCompraId`.
- [ ] P11. Unificar manejo de `loading` y errores en:
  - `cargarPresupuesto`
  - `onApelFull`
  - `sinFiltro`
  - `PurchaseHistory.onLoadData`
- [ ] P12. Eliminar codigo muerto o marcar como legacy los flujos no visibles en UI, pero sin borrar endpoints.
- [ ] P13. Agregar comentarios tecnicos puntuales donde el frontend reconstruye jerarquia por ausencia de campos serializados.
- [ ] P14. Agregar pruebas unitarias para:
  - `normalizeAspelAccounts`
  - `splitAspelAccounts`
  - `filterVisibleAccounts`
  - `hasAnyExpense`

Objetivo:

- estabilizar el modulo sin impactar consumidores externos

### Fase 2. Observabilidad antes de refactor

Esta fase todavia evita cambiar contratos compartidos.

- [ ] P20. Comparar formalmente `aspel-full` vs `presupuesto-limpio-ejercicio-fiscal`.
- [ ] P21. Registrar si la equivalencia es total o solo parcial.
- [ ] P22. Detectar si otros modulos dependen de esa duplicidad semantica.
- [ ] P23. Preparar propuesta de consolidacion sin implementarla todavia.

Objetivo:

- decidir con evidencia si hay deuda tecnica real o si hay una dependencia historica que conservar

### Fase 3. Cambios en servicios compartidos solo si se autorizan

Esta fase si puede tocar `PresupuestoShared`, por lo que requiere autorizacion
expresa antes de implementarse.

- [ ] P30. Exponer desde backend campos hoy reconstruidos en frontend:
  - `EsFilaAgrupadora`
  - `PresupuestoAnual`
  - `PresupuestoRestante`
- [ ] P31. Evaluar mover clasificacion de especiales al backend, pero sin romper la salida actual.
- [ ] P32. Si se modifica `IAspelQuotationService`, hacer inventario de impacto y pruebas por consumidor:
  - `PresupuestoWebAspel`
  - `PresupuestoPropuesta`
  - `AccountingCatalog`
  - compras relacionadas con presupuesto
- [ ] P33. Mantener compatibilidad hacia atras o agregar version de endpoint si el contrato cambia.

Objetivo:

- evitar regresiones cross-module

### Fase 4. Limpieza estructural

Solo despues de pasar las fases anteriores:

- [ ] P40. Revisar si `AspelMappingService` debe integrarse, moverse o eliminarse.
- [ ] P41. Externalizar reglas especiales hardcodeadas, como la del cliente `00000000-0000-0000-0000-000000000064`.
- [ ] P42. Revisar posibilidad de cache o reduccion de llamadas a Aspel.

---

## 12. Recomendacion inicial autorizable

Si queremos empezar con el menor riesgo posible, recomiendo autorizar primero
solo esta primera tanda:

- [ ] R1. Ajuste de tipado `PurchaseHistoryDTO` en Angular
- [ ] R2. Unificacion de manejo de `loading` y errores en frontend
- [ ] R3. Pruebas unitarias de `presupuesto-web-aspel.shared.ts`
- [ ] R4. Documentar y etiquetar claramente `sinFiltro()` como activo o legacy

Estos 4 puntos son de bajo riesgo porque no requieren tocar `PresupuestoShared`
ni cambiar contratos usados por otros modulos.
