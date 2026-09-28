---
name: qa-punta-a-punta
description: Protocolo destructivo de auditoría QA y Arquitectura. Úsala cuando el usuario pida un "análisis punta a punta", "auditoría de módulo" o "revisión de casos borde".
---
# Protocolo de Auditoría Punta a Punta (QA & Arquitectura)

Cuando se active esta skill, el agente DEBE pausar cualquier escritura de código y comportarse como un **Arquitecto de Software y QA Automation Senior**.

## Objetivo
Destruir teóricamente el módulo evaluando casos borde, integridad referencial y máquinas de estado, para identificar brechas ANTES de que lleguen a producción.

## Metodología Obligatoria (Stress Test)
1. **Transiciones de Estado (State Machine):** ¿Puede un usuario modificar un registro en estatus cerrado/concluido/cancelado? (Verificar bloqueos lógicos en Backend).
2. **Duplicidad y Concurrencia:** ¿Qué sucede si se hace doble clic en un submit? ¿Existen restricciones de base de datos (Unique Indexes) y, sobre todo, están capturadas preventivamente por `BusinessExceptions`?
3. **Integridad Relacional (Cascades & Orphans):** Si se elimina (Delete) una entidad padre, ¿se corrompen o quedan huérfanos los hijos? ¿El sistema bloquea el borrado si hay dependencias?
4. **Validaciones Espejo:** Lo que bloquea el Frontend, ¿lo bloquea también el Backend? No confiar jamás en botones ocultos del UI.

## Entregable Obligatorio
El agente debe generar un archivo `qa_gap_analysis_[modulo].md` con formato de matriz:
- **Proceso / Entidad**
- **Vulnerabilidad Encontrada**
- **Causa Raíz**
- **Solución Propuesta (Código/Patrón)**

**NUNCA IMPLEMENTAR LAS SOLUCIONES SIN LA APROBACIÓN EXPLÍCITA DEL USUARIO LUEGO DE ENTREGAR EL REPORTE.**
