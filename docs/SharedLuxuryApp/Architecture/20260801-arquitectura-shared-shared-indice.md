# 🔗 Contratos Compartidos — Backend + Frontend

**DTOs y contratos que AMBAS capas (Angular 22 + .NET 10) implementan y respetan.**

---

## 📋 Documentos

| Documento | Qué es | Backend | Frontend |
|:---|:---|:---:|:---:|
| **[../../../docs/SharedLuxuryApp/Architecture/20260801-arquitectura-shared-paginacion.md](../../../docs/SharedLuxuryApp/Architecture/20260801-arquitectura-shared-paginacion.md)** | Contrato canónico de paginación (PaginationCommonDTO) | ✅ Implementa | ✅ Usa |
| **[../../../docs/SystemLuxuryApp/Notifications/20260801-arquitectura-system-notificaciones.md](../../../docs/SystemLuxuryApp/Notifications/20260801-arquitectura-system-notificaciones.md)** | Esquema completo de notificaciones: dispatcher, 4 canales, resolución de URLs, guarda de destinatarios en pruebas | ✅ Implementa | ✅ Consume |

---

## 📖 Próximos Contratos (Planificado)

| Contrato | Descripción | Estado |
|:---|:---|:---|
| **API_RESPONSE_DTO.md** | Envelope de respuesta: `ApiResponseDTO<T>` | ⏳ Planificado |
| **ERROR_CONTRACTS.md** | Formato de errores: `BusinessException`, `ErrorDTO` | ⏳ Planificado |
| **AUTH_TOKENS.md** | Estructura de JWT, claims, refresh tokens | ⏳ Planificado |

---

## 🎯 Principio

> **Un contrato, una implementación compartida.**
> 
> Si frontend y backend hablan del mismo DTO, está aquí documentado. No hay versiones duplicadas, no hay desincronización.

---

## 📝 Cómo Agregar un Nuevo Contrato

1. **Crea el archivo:** `docs/architecture/shared/NOMBRE_CONTRATO.md`
2. **Estructura:**
   ```markdown
   # 📋 Nombre del Contrato
   
   **Ubicación Backend:** `LuxuryApp.Shared/DTOs/NombreDTO.cs`
   **Ubicación Frontend:** `client/angular/src/app/shared/models/nombre.interface.ts`
   **Status:** ✅ Implementado / ⏳ En desarrollo
   
   ## Definición
   
   ### C# (.NET 10)
   ```csharp
   public class NombreDTO { ... }
   ```
   
   ### TypeScript (Angular 22)
   ```typescript
   export interface NombreDTO { ... }
   ```
   
   ## Uso
   
   **Backend:** Dónde se usa...
   **Frontend:** Dónde se usa...
   ```

3. **Actualiza:** Este README.md con nueva entrada en tabla

---

## 🔗 Relacionados

- **CONVENTIONS.md §9** — Cita contratos compartidos obligatorios
- **[docs/architecture/backend/](../backend/)** — Implementación backend
- **[docs/architecture/frontend/](../frontend/)** — Implementación frontend

---

**Última actualización:** 2026-07-28  
**Responsable:** Tech Lead / Architecture Team
