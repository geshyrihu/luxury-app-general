# Modulo: AiAssistant (Asistente de IA)

> **Area funcional:** Sistema / Inteligencia Artificial
> **Tag de version:** `v1.0`
> **Owner tecnico:** `@equipo-arquitectura`
> **Ultima actualizacion:** `2026-06-25`

---

## Vision General

Asistente de IA potenciado por Microsoft Semantic Kernel con soporte multi-provider (Google Gemini, Nvidia, OpenAI-compatible). Proporciona generacion de texto, generacion de imagenes (Nvidia FLUX.2), analisis multimodal de imagenes (Gemini Vision), y resumenes de dashboard financiero/operativo.

---

## Endpoints

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| `POST` | `api/AiAssistant/GenerateImage` | Authorize | Genera imagen desde prompt, retorna PNG |
| `GET` | `api/AiAssistant/TestProfile` | AllowAnonymous | Prueba un perfil de IA con prompt personalizado |
| `POST` | `api/TicketAnalysis/AnalyzeImage` | Authorize | Analiza imagen subida (incidencia de mantenimiento) |

---

## Proveedores Soportados

| Perfil | Provider | Modelo | Uso |
|--------|----------|--------|-----|
| `Local` | Ollama | `llama3` | Tareas locales sin latencia de red |
| `Nvidia` | Nvidia NIM | `meta/llama-3.1-8b-instruct` | Procesamiento de texto principal |
| `GeminiFlash_Backup` | Google Gemini | `gemini-2.5-flash` | Fallback primario + analisis de imagenes |
| `GeminiPro_Backup` | Google Gemini | `gemini-2.5-pro` | Fallback para tareas complejas |
| `Gemini3Flash_Backup` | Google Gemini | `gemini-3-flash-preview` | Fallback experimental |
| `Abacus` | OpenAI-compatible | Abacus AI | Fallback secundario |

---

## Funcionalidades de IA

1. **Redaccion:** Anuncios oficiales, comunicados en HTML con formato de lujo.
2. **Finanzas:** Resumen de dashboard, auditoria de presupuesto mensual, proyecciones de gastos, analisis de reportes contables.
3. **Operaciones:** Descripcion de puestos de trabajo, analisis de CV candidatos, consulta de documentos de base de conocimiento.
4. **Vision:** Analisis multimodal de imagenes de incidencias via Gemini Vision.
5. **Imagenes:** Generacion de imagenes via Nvidia FLUX.2 Klein 4B.

---

## Reglas de Negocio

1. **Sanitizacion de entrada:** Todo input se sanitiza removiendo etiquetas HTML para prevenir XSS/prompt injection.
2. **Fallback automatico:** Si el perfil principal falla, se intenta `GeminiFlash_Backup` y luego `Abacus` antes de retornar error.
3. **Idioma:** Todas las respuestas son en Espanol (Mexico) con formato HTML seguro para incrustar en UI.
4. **Content Filtering:** En generacion de imagenes, si el modelo detecta contenido filtrado se retorna error 400.
5. **Vault de API keys:** Las claves de API se resuelven desde `ISecretProvider` mediante un diccionario de mapeo perfil -> vault key.
