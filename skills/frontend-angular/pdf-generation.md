# 🎨 PDF Generation Architecture (Frontend)

> **Deep-dive:** las reglas generales están en CONVENTIONS.md §2 (PDF, §2.18). Este archivo contiene ejemplos detallados.

## 3.18. Librerías y Servicios
- **Librería**: `pdfmake`.
- **Servicio Core**: `PdfGeneratorService` (OBLIGATORIO).

## Arquitectura Desacoplada
1.  **Orquestador de Datos (Componente)**: `pdf-{modulo}.ts`.
    -   Carga datos vía `ApiResponseService`.
    -   Llama al servicio de PDF para obtener la definición.
2.  **Generador de Definición (Servicio del Módulo)**: `{modulo}-pdf.service.ts`.
    -   Lógica pura de construcción de `TDocumentDefinitions`.

## Reglas de Implementación
- **Estilos Globales**: El `PdfGeneratorService` provee estilos: `header`, `subheader`, `tableHeader`, `headerCompany`, `headerClient`. **Usarlos**.
- **Imágenes**: El logo del cliente se inyecta automáticamente.
- **Tablas**: Usar el helper `pdfGeneratorS.createTable()` para uniformidad.
- **Post-Generación**: Tras la descarga, redirigir al usuario: `router.navigate(..., { replaceUrl: true })`.
