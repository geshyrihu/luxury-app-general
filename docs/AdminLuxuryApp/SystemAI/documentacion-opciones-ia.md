# Opciones de Inteligencia Artificial (IA) Disponibles

Este documento detalla las opciones de IA configuradas en `appsettings.json`, ordenadas según el modelo, sus capacidades y el coste aproximado.

## 1. Modelos Locales (Ollama)
**Perfil:** `Local`
*   **Modelo:** `llama3`
*   **Capacidades:** Procesamiento de texto general, tareas de instrucción, respuestas rápidas sin latencia de red. Al ejecutarse en red local, garantiza máxima privacidad.
*   **Coste:** **Gratuito** (solo requiere recursos computacionales de tu hardware local).

## 2. Llama 3.1 8B Instruct (Nvidia API)
**Perfil:** `Nvidia`
*   **Modelo:** `meta/llama-3.1-8b-instruct`
*   **Capacidades:** Procesamiento de texto de alto rendimiento para su tamaño, optimizado para seguir instrucciones. API alojada en la infraestructura de alta velocidad de Nvidia.
*   **Coste:** **Muy bajo / Gratuito** (dependiendo del tier de créditos gratuitos de Nvidia NIM).

## 3. Gemini 2.5 Flash y Gemini 3 Flash (Google)
**Perfiles:** `GeminiFlash_Backup`, `GeminiPro_Backup`, `Gemini3Flash_Backup`
*   **Modelos:** `gemini-2.5-flash`, `gemini-3-flash-preview`
*   **Capacidades:** Modelos multimodales rápidos y eficientes. Excelentes para tareas de razonamiento de texto a gran escala y análisis básico. La versión 3 Preview ofrece mejoras experimentales en razonamiento y velocidad.
*   **Coste:** **Bajo** (optimizados para bajo coste y alta velocidad por Google).

## 4. GPT-4o (Vía Abacus.ai / RouteLLM)
**Perfiles:** `GeminiFlash`, `GeminiPro`, `Gemini3Flash`, `Abacus` (Notar que los perfiles tienen nombres de Gemini pero apuntan a la API de OpenAI/Abacus con modelo GPT-4o).
*   **Modelo:** `gpt-4o`
*   **Capacidades:** Modelo multimodal de estado del arte. Máxima inteligencia, comprensión de contexto profundo, generación de código, traducción, razonamiento lógico complejo y visión.
*   **Coste:** **Alto** (el modelo más costoso de la lista, facturado por uso de tokens vía API).

## 5. Generación de Imágenes
**Configuración:** `ImageModelId`
*   **Modelo:** `gemini-2.5-flash-image`
*   **Capacidades:** Generación de imágenes a partir de descripciones de texto.
*   **Coste:** **Bajo**.

## 6. Text-to-Speech (ElevenLabs)
**Perfil:** `ElevenLabs`
*   **Modelos:** `eleven_multilingual_v2` (recomendado), `eleven_turbo_v2_5`, `eleven_flash_v2_5`
*   **Capacidades:** Síntesis de voz ultrarrealista, con soporte multilingüe (incluido español), entonación y clonación de voz.
*   **Coste:** **Variable según plan**
    *   Free: 10,000 caracteres/mes.
    *   Starter: $5/mes (30,000 caracteres/mes).
    *   Pro: $22/mes (100,000 caracteres/mes).
    *   Scale: $99+/mes (500,000+ caracteres/mes).
