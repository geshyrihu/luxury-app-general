# 🤖 Resumen de Estado y Estrategia de IA - LuxuryApp

Este documento centraliza la situación actual de los servicios de IA, agentes y recomendaciones estratégicas, consolidando los análisis previos (`ai_opportunities_analysis.md`, `informe.md`) y la realidad técnica del código.

---

## 🏗️ Situación Actual (Auditoría v2026.4)

El ecosistema de IA en **LuxuryApp** está construido sobre **.NET 10** utilizando **Microsoft Semantic Kernel**. La arquitectura es **Cloud-First** con resiliencia local.

### 1. Servicios Activos

| Servicio | Responsabilidad | Estado Técnico |
| :--- | :--- | :--- |
| **`AiAssistantService`** | Tareas especializadas (Redacción, Finanzas, Auditoría, Visión). | **Producción.** Usa métodos dedicados por tarea con perfiles específicos. |
| **`AiChatAppService`** | Agente conversacional "Conserje de Lujo". | **Producción.** Implementa RAG (Búsqueda Aumentada) basada en keywords. |
| **`AiKnowledgeBase`** | Base de conocimiento para el RAG del Chat. | **Infraestructura.** CRUD de instrucciones y palabras clave. |

### 2. Infraestructura y Proveedores

*   **Orquestador:** Microsoft Semantic Kernel.
*   **Proveedores Cloud (Primario):** Google Gemini (Modelos `gemini-2.5-flash`).
*   **Proveedores Cloud (Backup):** Abacus AI (API compatible con OpenAI para `gpt-4o`).
*   **Proveedor Local:** Ollama (`gemma`, `llama3`, `qwen3.5`) para tareas offline o ahorro de costos.

---

## 🎯 Recomendaciones de Uso por Perfil

Se recomienda la siguiente matriz para optimizar costos y calidad de respuesta:

| Perfil | Proveedor | Modelo Sugerido | Uso Recomendado |
| :--- | :--- | :--- | :--- |
| **`GeminiPro`** | Google / Abacus | `gemini-pro` / `gpt-4o` | Razonamiento complejo, auditoría financiera, análisis de puestos. |
| **`GeminiFlash`** | Google | `gemini-2.5-flash` | Chat cotidiano, resúmenes de dashboard, análisis de imágenes (Visión). |
| **`Local`** | Ollama | `gemma:2b` | Borradores de comunicados, tareas simples, entornos sin internet. |

---

## 🚀 Matriz de Oportunidades por Módulo

| Módulo | Oportunidad | Tipo de IA | Impacto | Complejidad | Notas Técnicas |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Operaciones** | Resumen de `TaskFollowUp` | Generación | **Alto** | Baja | Botón "Resumir Hilo" usando LLM. |
| **Finanzas** | Auditoría de Presupuestos | Análisis | **Alto** | Media | Detección de anomalías en gastos. |
| **RRHH** | Análisis de Incidentes | Visión | **Medio** | Media | Validación de fotos de evidencia (OCR/Clasificación). |
| **Inventario** | Forecasting de Stock | Predictivo | **Alto** | Alta | Requiere 6-12 meses de data histórica. |
| **Compras** | Extracción de Facturas | OCR / NLP | **Alto** | Baja | Integración con Azure Form Recognizer. |

---

## 🛠️ Roadmap de Mejora Técnica (Fases)

### Fase 1: Optimización de Arquitectura (Inmediato)
*   **Desacoplamiento:** Eliminar perfiles hardcoded en `AiAssistantService`.
*   **Configuración Dinámica:** Implementar tabla `AiTaskProfile` para mapear Tarea ↔ Perfil.
*   **Resiliencia:** Implementar fallback automático (si falla Cloud, usar Local).

### Fase 2: Inteligencia RAG Avanzada (Próximo Trimestre)
*   **Búsqueda Semántica:** Migrar de Keywords a **Embeddings** (Vectores) usando `pgvector`.
*   **Streaming:** Implementar respuestas en tiempo real (tipo ChatGPT) en el UI de Angular.
*   **Memoria a Largo Plazo:** Persistencia de preferencias del usuario en el chat.

### Fase 3: Automatización de Procesos (Largo Plazo)
*   **Agentes Autónomos:** Agentes que pueden ejecutar acciones (ej. "Crea un ticket de mantenimiento").
*   **Modelos Propios:** Fine-tuning de modelos pequeños (Gemma) con reglamentos específicos del condominio.

---

## ⚠️ Riesgos y Mitigaciones

1.  **Privacidad (LFPDPPP):** Anonimizar datos sensibles (nombres, RFC) antes de enviarlos a APIs externas.
2.  **Alucinaciones:** Siempre presentar las salidas de la IA como "Sugerencia/Borrador" requiriendo aprobación humana (_Human-in-the-Loop_).
3.  **Costos:** Implementar *Rate Limiting* por usuario y monitoreo de tokens consumidos.

---
*Este reporte centraliza la información de: `ai_opportunities_analysis.md`, `informe.md` y los requerimientos de `promtp.txt`.*
