Actúa como un Arquitecto de Software Senior y experto en optimización de código .NET. Tu objetivo es realizar una auditoría exhaustiva de las dependencias (paquetes NuGet) de nuestra API.

Necesito que analices el código fuente, los archivos `.csproj`, las configuraciones (`Program.cs`, `Startup.cs`, `appsettings.json`) y las implementaciones reales para generar un reporte detallado.

Por favor, sigue estos pasos de análisis y genera el reporte con la estructura solicitada al final:

### PASOS DE ANÁLISIS:

1. **Inventario y Rastreo de Uso Real:**
   - Identifica todos los paquetes NuGet en los archivos `.csproj`.
   - Rastrea cada paquete en el código. Busca directivas `using`, inyección de dependencias en `Program.cs`/`Startup.cs`, atributos, y configuraciones.
   - _Nota:_ Ten en cuenta que algunos paquetes no requieren un `using` explícito (ej. proveedores de EF Core, middlewares, o paquetes que se usan solo por reflexión/serialización). Si no encuentras uso real, márcalo como "Candidato a eliminar".

2. **Identificación de Solapamientos (Duplicados):**
   - Detecta si hay múltiples paquetes que cumplen la misma función (ej. `Newtonsoft.Json` vs `System.Text.Json`, `AutoMapper` vs `Mapster`, múltiples librerías de logging, validación, o manejo de HTTP).
   - Evalúa si podemos unificarlos bajo un solo estándar.

3. **Evaluación "Build vs. Buy" (Paquete vs. Servicio Propio):**
   - Analiza el "peso" y el alcance de cada paquete. Si estamos instalando un paquete pesado (con muchas dependencias transitivas) pero solo utilizamos el 1% de su funcionalidad (ej. una librería gigante de PDFs solo para extraer texto, o una librería de utilidades masiva para un solo método de strings), evalúa si sería más ligero, seguro y mantenible implementar esa funcionalidad específica con un servicio propio interno.

### FORMATO DEL REPORTE DE SALIDA:

Genera el reporte en Markdown con las siguientes secciones:

#### 1. Resumen Ejecutivo

Un breve párrafo con el estado general de las dependencias (ej. "Se encontraron 45 paquetes, 3 no se usan, 2 están duplicados y 1 es candidato a reemplazo por código propio").

#### 2. Tabla de Auditoría de Paquetes

Crea una tabla con las siguientes columnas:
| Paquete NuGet | Estado de Uso | Dónde se usa (Archivos/Claves) | Propósito / Para qué sirve | Recomendación |

_Estados posibles:_ ✅ Usado, ⚠️ Uso mínimo/Configuración, ❌ No usado / Fantasma.
_Recomendaciones:_ Mantener, Eliminar, Unificar, Reemplazar por servicio propio.

#### 3. Análisis de Solapamientos y Duplicados

Lista los paquetes que compiten por la misma funcionalidad. Explica cuál es la mejor opción para estandarizar y por qué (rendimiento, mantenimiento, soporte nativo de .NET).

#### 4. Candidatos a "Build vs. Buy" (Reemplazo por Servicio Propio)

Detalla los paquetes pesados o de un solo uso. Para cada uno, explica:

- Qué hace el paquete.
- Qué parte exacta estamos usando.
- Por qué conviene crear un servicio propio (ej. reducir tiempo de arranque, menor huella de memoria, evitar vulnerabilidades de terceros, simplificar el grafo de dependencias).
- Breve idea de cómo implementar el reemplazo.

#### 5. Plan de Acción (Paso a paso)

Ordena las tareas de limpieza de mayor a menor impacto/riesgo para que el equipo de desarrollo pueda ejecutar la refactorización de forma segura (incluyendo sugerencias de pruebas a realizar antes de eliminar un paquete).

---

**Instrucción final:** Analiza todo el contexto del proyecto que tienes disponible. Si necesitas que te proporcione el contenido de archivos específicos (como los `.csproj` o el `Program.cs`) porque tu ventana de contexto es limitada, dímelo antes de empezar. Si ya tienes acceso al código, procede directamente con el análisis.
