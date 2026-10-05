# 📅 Modulo: JuntasMensuales (`LuxuryApp.Application/Modules/JuntasMensuales`)

> **Area funcional:** Gestion de Juntas, Reuniones y Asambleas del Condominio  
> **Tag de version:** `v1.0`  
> **Owner tecnico:** `@equipo-juntas`  
> **Ultima actualizacion:** `2026-06-10`

---

## 🎯 Vision General

El modulo **JuntasMensuales** administra la programacion, convocatoria, seguimiento y actas de las juntas mensuales y asambleas del condominio.

---

## 🏗️ Submodulos

| Submodulo | Descripcion |
|---|---|
| 📅 **JuntaMensual** | CRUD de juntas mensuales. |
| 📋 **Actas** | Generacion y firma de actas de asamblea. |
| 🗓️ **Calendario** | Integracion con calendario de eventos. |

---

## 🗺️ Mapa de Endpoints

| Metodo | Ruta | Request | Response | Auth | Descripcion |
|---|---|---|---|---|---|
| `GET` | `/api/juntas-mensuales` | `Query` | `ApiResponseDTO<PaginatedResponseDTO<JuntaDTO>>` | Admin | Listado de juntas. |
| `POST` | `/api/juntas-mensuales` | `CreateJuntaDTO` | `ApiResponseDTO<bool>` | Admin | Crear nueva junta. |
| `PUT` | `/api/juntas-mensuales/{id}` | `UpdateJuntaDTO` | `ApiResponseDTO<bool>` | Admin | Actualizar junta. |

---

## 🧠 Reglas de Negocio

### R001 — Convocatoria con Antelacion
- **Descripcion:** Las juntas mensuales deben programarse con al menos 5 dias habiles de anticipacion.
- **Impacto:** Entidad `JuntaMensual`.

### R002 — Quorum para Asambleas
- **Descripcion:** Las asambleas requieren un quorum minimo del 50%+1 de los propietarios.
- **Impacto:** Logica de quorum en `JuntaMensualAppService`.

---

## ✅ Checklist de Entrega

- [ ] Documentacion `.md` creada.
- [ ] Interfaz documentada con XML Comments en espanol.
- [ ] DTOs con `[Display(Name = "...")]`.
- [ ] Controladores thin (sin logica de negocio).
- [ ] Endpoints retornan `ApiResponseDTO<T>`.

---

_📚 Para mas informacion sobre la estructura de modulos, consultar `GEMINI.md`._