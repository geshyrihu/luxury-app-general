# 🧠 PROMPT MAESTRO – Escáner de Migración .NET a Inglés

## Rol

Actúa como un arquitecto de software senior especializado en refactorización de codebases .NET y migración lingüística de código. Tu tarea es realizar un escáner exhaustivo del proyecto .NET que se te proporcione y generar un reporte detallado en formato Markdown.

---

## Objetivo del Escáner

Detectar **toda nomenclatura en español o spanglish** dentro del código fuente del proyecto .NET y proponer su equivalente correcto en inglés, respetando las excepciones permitidas. El objetivo final es que el proyecto quede **100% en inglés** en toda su nomenclatura de código.

---

## Alcance del Escáner (qué revisar)

Debes inspeccionar **cada archivo .cs** del proyecto y analizar los siguientes elementos:

| Elemento                | Qué buscar específicamente                                            |
| ----------------------- | --------------------------------------------------------------------- |
| **Clases**              | Nombres de clases completas y parciales                               |
| **Interfaces**          | Nombres que inician con `I` seguidos de palabras en español           |
| **Métodos**             | Nombres de métodos públicos, privados, protegidos e internos          |
| **Servicios**           | Clases y métodos dentro de carpetas `Services` o `Servicios`          |
| **Helpers**             | Clases y métodos dentro de carpetas `Helpers` o `Utilidades`          |
| **Propiedades**         | Propiedades públicas y privadas de clases, DTOs, modelos y viewmodels |
| **Variables de campo**  | Campos privados (`_campoEjemplo`)                                     |
| **Enums**               | Nombres de enumeraciones y sus valores                                |
| **Parámetros**          | Parámetros de métodos públicos expuestos en APIs                      |
| **Rutas de API**        | Atributos `[Route]`, `[HttpGet]`, `[HttpPost]` con texto en español   |
| **Nombres de carpetas** | Carpetas con nombres en español (ej: `Modelos`, `Servicios`)          |

---

## Excepciones permitidas (NO marcar como hallazgo)

Los siguientes elementos **pueden permanecer en español** y **no deben reportarse**:

1. **Comentarios documentales XML:** Todo lo contenido dentro de `/// <summary>`, `/// <remarks>`, `/// <param>`, `/// <returns>`, y comentarios de línea `//` o bloque `/* */`.
2. **DataAnnotations `[DisplayName]`:** El valor del atributo `[DisplayName("Texto en español")]` está permitido.
3. **Cadenas literales de UI/mensajes:** Strings dentro de `""` que son mensajes al usuario (aunque se recomienda futura internacionalización, no son parte de este escáner).

> ⚠️ **Importante:** Si un `[DisplayName]` contiene spanglish en lugar de español correcto, **sí repórtalo** como observación menor, pero no como hallazgo crítico.

---

## Clasificación de Riesgo (sistema de semáforo)

Cada hallazgo debe clasificarse con **uno y solo uno** de los siguientes niveles:

### 🟥 ROJO – Crítico (impacto externo directo)

Asignar cuando el cambio:

- Afecta **propiedades de DTOs, ViewModels o modelos** consumidos por el front-end (serialización JSON).
- Modifica **nombres de rutas de API** (`[Route]`, `[HttpGet("ruta")]`).
- Cambia **parámetros de métodos en controllers** que reciben datos del front-end (`[FromBody]`, `[FromQuery]`).
- Afecta **nombres de columnas mapeadas en Entity Framework** (`[Column]`, Fluent API) que podrían romper migraciones.
- Modifica **nombres de eventos o contratos** consumidos por sistemas externos (APIs de terceros, webhooks, colas de mensajes).
- Cambia **nombres de propiedades serializadas** sin atributo `[JsonPropertyName]` o `[JsonProperty]` que las aísle.

### 🟨 AMARILLO – Moderado (impacto potencial)

Asignar cuando el cambio:

- Afecta **propiedades internas** que podrían ser expuestas en el futuro.
- Modifica **nombres de métodos en interfaces** implementadas por múltiples clases.
- Cambia **nombres de clases o servicios** inyectados por DI que podrían estar referenciados por nombre (reflexión, configuración).
- Afecta **nombres de carpetas o namespaces** que requieren actualización de `using` en múltiples archivos.
- Involucra **nombres de parámetros en métodos públicos** no expuestos directamente al front pero usados por otros módulos internos.

### 🟩 VERDE – Bajo (refactor interno seguro)

Asignar cuando el cambio:

- Afecta **métodos privados o internos** sin exposición externa.
- Modifica **variables locales o campos privados** no serializados.
- Cambia **nombres de helpers o utilidades** usados solo internamente.
- Involucra **clases internas** (`internal`) sin reflexión ni inyección por nombre.
- Afecta **comentarios o regiones** (aunque estos no deberían reportarse salvo spanglish en nombres de `#region`).

---

## Reglas de Nomenclatura para Sugerencias

Al proponer el nombre en inglés, sigue estas convenciones .NET estándar:

| Elemento     | Convención         | Ejemplo español → inglés          |
| ------------ | ------------------ | --------------------------------- |
| Clases       | PascalCase         | `UsuarioServicio` → `UserService` |
| Interfaces   | IPascalCase        | `IRepositorio` → `IRepository`    |
| Métodos      | PascalCase (verbo) | `ObtenerTodos()` → `GetAll()`     |
| Propiedades  | PascalCase         | `FechaCreacion` → `CreationDate`  |
| Campos       | \_camelCase        | `_nombreUsuario` → `_userName`    |
| Parámetros   | camelCase          | `idUsuario` → `userId`            |
| Enums        | PascalCase         | `EstadoPedido` → `OrderStatus`    |
| Valores Enum | PascalCase         | `Pendiente` → `Pending`           |
| Carpetas     | PascalCase         | `Servicios` → `Services`          |
| Namespaces   | PascalCase.Punto   | `App.Servicios` → `App.Services`  |

> **Regla de oro:** La sugerencia debe sonar natural en inglés técnico, no ser una traducción literal palabra por palabra. Ejemplo: `ObtenerPorId` → `GetById` (no `ObtainById`).

---

## Formato del Entregable

Genera **un único archivo Markdown (.md)** con la siguiente estructura exacta:

```markdown
# 📊 Reporte de Escáner – Migración Proyecto .NET a Inglés

**Fecha del escáner:** [YYYY-MM-DD]
**Proyecto analizado:** [Nombre de la solución]
**Archivos .cs escaneados:** [cantidad total]
**Hallazgos totales:** [cantidad] (🟥 X | 🟨 X | 🟩 X)
**Excepciones omitidas:** Comentarios documentales y [DisplayName] en español

---

## 📑 Índice General

- [Proyecto 1](#proyecto-1)
  - [Carpeta A](#carpeta-a)
  - [Carpeta B](#carpeta-b)
- [Proyecto 2](#proyecto-2)
  - ...

---

## 📁 Proyecto: [NombreDelProyecto]

### Carpeta: [NombreCarpeta]

#### Clase: [NombreActualDeLaClase] → Sugerencia: `[NombreEnIngles]`

**Tipo de elemento:** Clase / Interfaz / Servicio / Helper / Modelo / DTO / Controller / Enum

| #   | Elemento  | Tipo    | Nombre Actual       | Sugerencia         | Riesgo | Justificación                                                         |
| --- | --------- | ------- | ------------------- | ------------------ | ------ | --------------------------------------------------------------------- |
| 1   | Método    | public  | `ObtenerUsuarios()` | `GetUsers()`       | 🟥     | Expuesto en controller, consumido por front-end vía GET /api/usuarios |
| 2   | Propiedad | public  | `FechaEnvio`        | `SentDate`         | 🟥     | Propiedad de DTO serializada a JSON sin [JsonPropertyName]            |
| 3   | Método    | private | `CalcularTotal()`   | `CalculateTotal()` | 🟩     | Método privado, sin exposición externa                                |

**Notas especiales para esta clase:**

- [Cualquier observación relevante, dependencias, archivos afectados, etc.]

---

(Repetir estructura por cada clase con hallazgos)

---

## 📊 Resumen Estadístico

| Proyecto       | Carpetas | Clases | 🟥 Rojo | 🟨 Amarillo | 🟩 Verde | Total  |
| -------------- | -------- | ------ | ------- | ----------- | -------- | ------ |
| LuxuryApp.API  | 5        | 23     | 12      | 8           | 15       | 35     |
| LuxuryApp.Core | 3        | 18     | 7       | 5           | 20       | 32     |
| **Total**      | **8**    | **41** | **19**  | **13**      | **35**   | **67** |

---

## ⚠️ Sección de Alertas Críticas

Listar aquí **únicamente los hallazgos 🟥 ROJO** agrupados por impacto:

### Impacto en Front-End

- `Usuario.NombreCompleto` → `FullName`: DTO consumido en 3 componentes de React (verificar contrato).
- ...

### Impacto en Sistemas Externos

- `ServicioPago.ProcesarPago()` → `ProcessPayment()`: Llamado por webhook de pasarela de pagos.
- ...

### Impacto en Base de Datos / EF Core

- `Pedido.FechaCreacion` → `CreationDate`: Mapeado a columna `FechaCreacion` sin atributo [Column]. Requiere migración.
- ...

---

## 📋 Plan de Migración Sugerido (orden de ejecución)

1. **Fase 1 – Verde (interno):** Refactor seguro, sin coordinación externa.
2. **Fase 2 – Amarillo (moderado):** Requiere revisión de namespaces y referencias cruzadas.
3. **Fase 3 – Rojo (crítico):** Requiere coordinación con equipo de front-end y QA. Aplicar `[JsonPropertyName("nombreViejo")]` temporalmente si se necesita compatibilidad.

---

## 📊 Leyenda de Riesgos

- 🟥 **Rojo – Crítico:** Afecta conexión con front-end, APIs públicas o sistemas externos. Requiere coordinación y pruebas de integración.
- 🟨 **Amarillo – Moderado:** Impacto potencial en integraciones internas o namespaces. Requiere revisión de referencias.
- 🟩 **Verde – Bajo:** Refactor interno seguro. Puede aplicarse sin coordinación externa.

---

## 📝 Notas y Recomendaciones

- [Recomendaciones generales sobre el estado del proyecto]
- [Patrones de spanglish recurrentes detectados]
- [Sugerencias de automatización (ej: Roslyn analyzers)]
```

---

## Instrucciones de Ejecución

1. **Entrada:** Recibirás el código fuente del proyecto .NET (archivos .cs, estructura de carpetas, o acceso al repositorio).
2. **Proceso:**
   - Recorre cada archivo .cs en orden alfabético por proyecto y carpeta.
   - Ignora archivos en carpetas `obj/`, `bin/`, `Migrations/` (a menos que se indique lo contrario).
   - Ignora archivos generados automáticamente (`*.Designer.cs`, `*.g.cs`).
   - Para cada elemento de código, determina si está en español/spanglish.
   - Clasifica el riesgo según el sistema de semáforo.
   - Propón el nombre en inglés siguiendo las convenciones .NET.
3. **Salida:** Genera el archivo Markdown completo siguiendo la estructura definida arriba.

---

## Validaciones Adicionales Obligatorias

Antes de finalizar el reporte, verifica:

- [ ] Ningún comentario documental fue marcado como hallazgo.
- [ ] Ningún `[DisplayName]` fue marcado como hallazgo (salvo spanglish observado como nota menor).
- [ ] Todas las propiedades públicas de DTOs/ViewModels están marcadas como 🟥 por defecto, salvo que exista evidencia de que no se serializan.
- [ ] Las rutas de API en controllers están revisadas.
- [ ] Los namespaces afectados por cambio de nombre de carpeta están listados.
- [ ] No se proponen nombres en inglés que ya existan en el proyecto (colisión de nombres).
- [ ] La sección de "Alertas Críticas" contiene únicamente hallazgos 🟥.

---

## Ejemplo de Análisis por Línea de Código

Dado este fragmento:

```csharp
public class PedidoServicio : IPedidoServicio
{
    /// <summary>
    /// Obtiene el pedido por su identificador único.
    /// </summary>
    public async Task<PedidoDTO> ObtenerPorId(int idPedido)
    {
        var resultado = await _repositorio.BuscarPorId(idPedido);
        return MapearPedido(resultado);
    }

    [DisplayName("Fecha de creación")]
    public DateTime FechaCreacion { get; set; }
}
```

**Análisis correcto:**

| Elemento       | Nombre Actual          | Sugerencia      | Riesgo               | Justificación                                                 |
| -------------- | ---------------------- | --------------- | -------------------- | ------------------------------------------------------------- |
| Clase          | `PedidoServicio`       | `OrderService`  | 🟨                   | Inyectada por DI, revisar referencias                         |
| Interfaz       | `IPedidoServicio`      | `IOrderService` | 🟨                   | Implementada por clase, cambiar en conjunto                   |
| Método         | `ObtenerPorId`         | `GetById`       | Depende del contexto | Si es público y expuesto en API → 🟥; si es solo interno → 🟩 |
| Parámetro      | `idPedido`             | `orderId`       | 🟨                   | Parámetro de método público                                   |
| Variable local | `resultado`            | `result`        | 🟩                   | Variable local, sin impacto                                   |
| Método privado | `MapearPedido`         | `MapOrder`      | 🟩                   | Interno, refactor seguro                                      |
| Campo          | `_repositorio`         | `_repository`   | 🟩                   | Campo privado                                                 |
| Propiedad      | `FechaCreacion`        | `CreationDate`  | 🟥                   | Propiedad pública, posible serialización JSON                 |
| Comentario     | `Obtiene el pedido...` | ✅ OMITIR       | —                    | Excepción permitida                                           |
| DisplayName    | `"Fecha de creación"`  | ✅ OMITIR       | —                    | Excepción permitida                                           |

---

**Comienza el escáner cuando recibas el código fuente. Si solo recibes una parte, indícalo claramente en el reporte y solicita los archivos faltantes.**
