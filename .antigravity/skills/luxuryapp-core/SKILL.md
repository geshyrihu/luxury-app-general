---
name: luxuryapp-core
description: Guía de arquitectura y patrones LuxuryApp (v2026.8). Úsala para consultas de backend (.NET 10), frontend (Angular 22) y servicios compartidos.
---

# 🧠 LuxuryApp Master Skill

Esta skill orquesta el conocimiento técnico del proyecto LuxuryApp. No contiene todas las reglas, sino que sirve como enrutador hacia los micro-skills atómicos.

## 📂 Directorio de Conocimiento Atómico
Cuando necesites información específica, lee el archivo correspondiente en el disco:

### ⚙️ Backend (.NET 10)
- **Arquitectura y Controllers**: `skills/backend-dotnet/architecture.md`
- **EF Core & Performance**: `skills/backend-dotnet/ef-core-performance.md`
- **Transacciones**: `skills/backend-dotnet/transactions.md`
- **Logs y Serilog**: `skills/backend-dotnet/logging-tracing.md`

### 🎨 Frontend (Angular 22)
- **Signals y Componentes**: `skills/frontend-angular/signals-components.md`
- **Forms y Validación**: `skills/frontend-angular/forms-validation.md`
- **Tablas y Móvil**: `skills/frontend-angular/tables-mobile.md`
- **API y Diálogos**: `skills/frontend-angular/api-dialogs.md`
- **Utilidades y Pipes**: `skills/frontend-angular/utilities-pipes.md`

### 🌐 Global y Shared
- **Estándares de Datos e IDs**: `skills/core/data-standards.md`
- **Encoding y Documentación**: `skills/core/documentation-encoding.md`
- **Git y Workflow**: `skills/core/git-workflow.md`
- **Notificaciones (Push, Email)**: `skills/shared-infra/notifications.md`
- **Identity (CurrentUser)**: `skills/shared-infra/identity-context.md`

## 🤖 Regla de Oro para el Agente
Antes de proponer cualquier cambio de código, **identifica el área** y **lee el archivo markdown específico** de la lista anterior. No asumas que conoces los patrones; LuxuryApp tiene estándares muy estrictos de rendimiento y nomenclatura.
