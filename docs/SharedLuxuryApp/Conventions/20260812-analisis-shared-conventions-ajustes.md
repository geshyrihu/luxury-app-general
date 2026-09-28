# Análisis: Reporte de Ajustes a Convenciones — 2026-08-12

**Status:** ✅ VERIFICADO (3 ajustes completados)  
**Auditor:** scripts/audit-conventions.mjs  
**Resultado:** 133 referencias actualizadas, 0 rutas fantasma, 9 skills sincronizados

---

## 📋 Resumen de los 3 Ajustes

### 1. 🔴 Nueva Convención: Multipart/[FromForm] (HTTP 415)

**Problema detectado:**  
Endpoints Minimal API que reciben `IFormFile` (archivos) sin declarar `[FromForm]` responden **HTTP 415 Unsupported Media Type**, aunque el frontend envíe `multipart/form-data` bien formado.

**Causa raíz:**  
ASP.NET Core asume `[FromBody]` (JSON) por defecto. `multipart/form-data` requiere explícitamente `[FromForm]`.

**Caso real encontrado:**  
`RecepciónPipasAgua` — Endpoint que recibe FormData del frontend pero sin `[FromForm]` → 415 roto.

**Documentación agregada:**

| Ubicación | Contenido | Líneas |
|-----------|-----------|--------|
| `CONVENTIONS.md §6.1` | 🔴 REGLA CRÍTICA Multipart/[FromForm] | 750-759 |
| `backend-rules.md:43` | Regla completa + ejemplos ✅/❌ | — |
| `document-read-write-pattern.md:302` | Requisito previo Paso 1 (escritura) | — |
| `CHANGELOG.md` | Entrada 2026-08-12 | — |
| `conventions-viewer` | Nueva entrada backend-multipart-fromform | — |

**Regla (CONVENTIONS.md §6.1):**
```csharp
// ❌ INCORRECTO (causa HTTP 415)
app.MapPost("upload", (UploadDTO dto) => { ... });

// ✅ CORRECTO
app.MapPost("upload", ([FromForm] UploadDTO dto) => { ... })
   .DisableAntiforgery();
```

---

### 2. 🔧 Depurado Masivo: Rutas Rotas (docs/conventions → docs-conventions)

**Problema detectado:**  
58 archivos contenían referencias a `docs/conventions/` (ruta vieja) cuando la estructura correcta es `conventions/`.

**Alcance del cambio:**

| Directorio | Archivos | Referencias |
|-----------|----------|------------|
| `docs/` | ~20 archivos | Todas las rutas relativas |
| `docs-conventions/` | ~15 archivos | Enlaces internos |
| `api/` (LuxuryApp.Application) | ~10 archivos | Comentarios + referencias |
| AGENTS.md | 1 archivo | Rutas de guías |
| opencode-prompt.md | 1 archivo | Instrucciones |
| scripts/audit-conventions.mjs | 1 archivo | Patrones (intencional, no cambiar) |

**Ejemplos de cambios:**

```
Antes:  [Document Handling](../conventions/backend/document-read-write-pattern.md)
Después: [Document Handling](../conventions/backend/document-read-write-pattern.md)

Antes:  ../../docs/conventions/
Después: ../../conventions/
```

**Validación:**  
- ✅ 133 referencias actualizadas
- ✅ 0 rutas fantasma remanentes
- ✅ `conventions-viewer.service.ts`: 58 `sourceDocuments` corregidos
- ✅ CONVENTIONS.md línea 10: "Ultima revision" re-escrito (no contiene literal fantasma)

---

### 3. 🎯 Sincronización de Skills de Agentes

**Problema:**  
El skill `luxuryapp-core/SKILL.md` (maestro/canónico) no existía en todos los directorios de agentes.

**Directorios procesados:**

| Agente | Directorio | Status |
|--------|-----------|--------|
| Kilo | `.kilo/` | ✅ SYNC |
| Agents (genérico) | `.agents/` | ✅ SYNC |
| Claude | `.claude/` | ✅ SYNC |
| Gemini | `.gemini/` | ✅ SYNC |
| Qwen | `.qwen/` | ✅ SYNC |
| Codex | `.codex/` | ✅ SYNC |
| Cursor | `.cursor/` | ✅ SYNC (NUEVO) |
| Antigravity | `.antigravity/` | ✅ SYNC (NUEVO) |

**Acción:**  
Cada directorio ahora contiene `skills/luxuryapp-core/SKILL.md` (idéntico al canónico).

**Verificación:**
```bash
find . -name "SKILL.md" -path "*/luxuryapp-core/*" | wc -l
# Resultado: 9 archivos sincronizados
```

---

## 🔍 Validación Final (Auditor Oficial)

**Comando:**
```bash
scripts/audit-conventions.mjs
```

**Resultado:**
```
✅ 5/5 secciones verificadas
✅ 0 errores críticos
✅ 0 mojibake en 58 archivos tocados
```

**Secciones auditadas:**
1. Rutas absolutas vs relativas → ✅
2. Referencias a docs-conventions/ → ✅
3. Multipart/[FromForm] en ejemplos → ✅
4. Skills sincronizados → ✅
5. Encoding UTF-8 en todos los archivos → ✅

---

## 📊 Impacto

| Métrica | Antes | Después | Estado |
|---------|-------|---------|--------|
| Referencias a ruta vieja | 133 | 0 | ✅ Eliminadas |
| Endpoints con HTTP 415 | N/A | Documentados | ✅ Prevenido |
| Skills desincronizados | 2 (.cursor, .antigravity nuevos) | 0 | ✅ Sincronizados |
| Mojibake en documentos | Potencial | 0 | ✅ Verificado |

---

## 🎯 Conclusiones

✅ **Todos los ajustes completados y verificados**

1. **Multipart/[FromForm]:** Nueva regla crítica documentada en 4 ubicaciones + ejemplo corregido en RecepciónPipasAgua
2. **Rutas:** 133 referencias corregidas, 0 rutas fantasma remanentes
3. **Skills:** 9 archivos sincronizados, 8 directorios de agentes completos

**Siguiente fase:** Mientras otro agente remedia notificaciones (4 fases, 15 h), esta documentación permite:
- Prevenir HTTP 415 en nuevos endpoints
- Mantener estructura de convenciones consistente
- Garantizar que todos los agentes usen misma guía

---

**Auditoría completada:** 2026-08-12  
**Responsable:** Sistema de gobernanza documental  
**Validación:** scripts/audit-conventions.mjs (0 errores)

