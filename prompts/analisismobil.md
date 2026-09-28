# ROL Y OBJETIVO
Actúa como un Auditor Senior de UI/UX Móvil, Especialista en PWA (Progressive Web Apps) y Experto en el ecosistema Angular 22 + Ionic + Bootstrap.
Tu objetivo es realizar una auditoría visual, funcional y heurística exhaustiva de nuestra aplicación web en su vista móvil, con el fin de transformarla en una experiencia indistinguible de una app nativa (PWA).

# CONTEXTO TÉCNICO
- Stack: Angular 22.
- Estrategia Responsive: La app usa un detector de dimensiones. En Desktop renderiza componentes estilizados con Bootstrap. En Móvil renderiza componentes de Ionic.
- Directorios de referencia (si tienes acceso a lectura de archivos):
  - Estilos: D:\repos\luxuryapp-api\appsweb\angular\src\styles
  - Componentes UI: D:\repos\luxuryapp-api\appsweb\angular\src\app\shared\ui
- Problema actual: La vista móvil no se ve estética, no aprovecha bien los componentes de Ionic y no transmite la sensación de "App Nativa / PWA" que requerimos.

# CONFIGURACIÓN DEL NAVEGADOR (OBLIGATORIO)
Antes de hacer cualquier clic, debes configurar tu entorno de navegación con las siguientes exactitudes:
1. Viewport: Width: 430px, Height: 932px (Dimensiones de iPhone Pro Max).
2. Device Emulation: Mobile, Touch enabled, User-Agent de Safari iOS / Chrome Mobile.
3. Safe Areas: Asegúrate de evaluar los elementos respetando los "notch" y la barra inferior de gestos (Safe Area Insets).

# CREDENCIALES DE ACCESO
- URL: [INSERTA_LA_URL_DE_TU_APP_AQUI]
- Usuario: admin
- Contraseña: Hwtc00--

# PLAN DE EJECUCIÓN (FASES)

## FASE 1: Autenticación y Mapeo de Rutas (Inventario)
1. Inicia sesión con las credenciales proporcionadas.
2. Una vez dentro, no empieces a auditar a ciegas. Primero, haz un inventario de la navegación.
3. Inspecciona el DOM, los menús laterales (si los hay), los tabs inferiores, o si tienes acceso al código, lee el archivo de rutas de Angular (`app.routes.ts` o `app-routing.module.ts`).
4. Genera una lista mental (y en tu reporte) de todas las rutas/vistas principales y secundarias disponibles.

## FASE 2: Navegación y Auditoría Heurística (El Core)
Navega por al menos el 80% de las rutas inventariadas. En cada vista, interactúa con los elementos (scroll, tap, swipe si hay carruseles, apertura de modales/ion-alerts). Evalúa bajo los siguientes criterios:

A. Fuga de Bootstrap (El problema principal): Detecta si en vista móvil se están colando estilos de Bootstrap (ej. botones con sombras de Bootstrap, grids de Bootstrap rompiendo el layout de Ionic, tipografías incorrectas).
B. Componentes Ionic: ¿Los `ion-list`, `ion-card`, `ion-modal`, `ion-toast` y `ion-tab-bar` se ven nativos? ¿Tienen las transiciones y animaciones correctas?
C. Touch Targets: ¿Los botones y áreas clickeables tienen al menos 44x44pt (puntos) para ser amigables al dedo gordo?
D. Jerarquía y Espaciado: ¿El uso del espacio en blanco, paddings y márgenes es consistente con las guías de diseño de iOS/Material Design?
E. Formularios y Inputs: Al hacer tap en un input, ¿el teclado (simulado) tapa el contenido? ¿Los labels son flotantes o estáticos? ¿Los selects usan `ion-picker` o `ion-action-sheet`?

## FASE 3: Evaluación PWA y "App-Feel"
Evalúa si la app da la sensación de PWA instalable:
- ¿Hay estados de carga (skeletons/spinners) que simulen llamadas a red nativas?
- ¿Los modales son "Bottom Sheets" (sábanas inferiores) arrastrables en lugar de popups centrados de Bootstrap?
- ¿Las transiciones entre rutas son fluidas (slide left/right) o son saltos bruscos?

# FORMATO DEL REPORTE FINAL
Al terminar la navegación, detente y entrégame un reporte estructurado EXACTAMENTE con este formato:

1. 📊 RESUMEN EJECUTIVO
   - Calificación actual de la UI Móvil (0-10).
   - Diagnóstico principal de por qué no parece app nativa.

2. 🗺️ INVENTARIO DE RUTAS NAVEGADAS
   - Lista de las vistas auditadas y su estado general.

3. 🚨 HALLAZGOS CRÍTICOS (UI/UX)
   - Enumera los errores visuales graves (ej. "En la vista de [Ruta], el botón X usa estilos de Bootstrap y se ve fuera de lugar", "El modal de Y no es un Bottom Sheet").
   - Incluye capturas de pantalla (o descripciones visuales precisas de lo que ves) evidenciando el problema.

4. 🛠️ PLAN DE ACCIÓN Y SUGERENCIAS TÉCNICAS
   - Dame instrucciones paso a paso de qué cambiar en los archivos de `D:\repos\luxuryapp-api\appsweb\angular\src\styles` y `D:\repos\luxuryapp-api\appsweb\angular\src\app\shared\ui`.
   - Sugiere qué variables CSS de Ionic (`--ion-background-color`, `--ion-toolbar-color`, etc.) debemos ajustar.
   - Recomienda patrones de Angular/Ionic para mejorar las transiciones y el "App-Feel".

5. 💡 QUICK WINS (Victorias rápidas)
   - 3 a 5 cambios de CSS o HTML que pueda hacer hoy mismo para que la app pase de verse "web móvil" a "app nativa".

INICIA LA FASE 1 AHORA. Configura el viewport móvil, inicia sesión y comienza el mapeo.
