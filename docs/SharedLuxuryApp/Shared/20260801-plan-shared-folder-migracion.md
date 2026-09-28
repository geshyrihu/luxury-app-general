# 📋 Plan de Migración: docs/shared → shared (Raíz)

**Fecha**: 3 de septiembre de 2026  
**Status**: 🔍 ANÁLISIS EN PROGRESO  
**Objetivo**: Mover `D:\repos\luxuryapp-api\docs\shared` a `D:\repos\luxuryapp-api\shared`

---

## 📊 Análisis de Referencias

### 1. Referencias Encontradas en Markdown (3 documentos)

| Documento | Referencias | Líneas |
|-----------|-------------|--------|
| `docs/AMENDMENT-APP-WEB-DEV-ONESIGNAL.md` | `docs/shared/notifications/one_signal.md` | 2 referencias |
| `docs/ONESIGNAL-MIGRACION-RESUMEN.md` | `docs/shared/notifications/one_signal.md` | 1 referencia |
| `docs/audit/20260903-AUDITORIA-ONESIGNAL-MIGRACION.md` | `docs/shared/notifications/one_signal.md` | 1 referencia |

**Total**: 4 referencias en 3 archivos

### 2. Referencias en Código Fuente

**Búsqueda**: `shared/notifications`, `shared\notifications` en `.cs` y `.ts`  
**Resultado**: ❌ NO ENCONTRADAS

**Conclusión**: El código backend y frontend NO referencia `docs/shared` directamente.

### 3. Referencias en Configuración

**Búsqueda**: `docs/shared` en `.json`, `.yaml`, `.yml`  
**Resultado**: ⏳ ANÁLISIS EN PROGRESO

---

## 📁 Contenido Actual de docs/shared

```
docs/shared/
├── notifications/
│   ├── one_signal.md
│   ├── GUIA_MIGRACION_ONESIGNAL_FIREBASE.md
│   ├── android/
│   │   ├── google-services.json
│   │   └── luxuryapp-notifications-b6b53b2c9245.json
│   ├── web/
│   │   └── OneSignalSDK-v16-ServiceWorker/
│   │       └── OneSignalSDKWorker.js
│   └── web__MACOSX/
└── logos_files/
    ├── padded_logo.png
    ├── Favicons/
    ├── pdf/
    ├── png/
    ├── svg/
    └── icon-compliance-report.*
```

**Tipo**: Documentación estática + activos de branding (no código ejecutable)

---

## 🎯 Impacto por Categoría

### ✅ BAJO RIESGO (No necesita cambios)
- Archivos de branding (logos)
- Documentos PDF/PNG/SVG
- SDKs y utilidades descargadas

### ⚠️ REQUIERE ACTUALIZACIÓN
- Referencias en Markdown (4 lugares)
- Posibles referencias en configuración

### ❌ ALTO RIESGO (Si existen)
- Scripts de CI/CD que apunten a path
- Documentación de README que la gente lea
- Links en GitHub issues/PRs

---

## 📝 Plan de Migración Seguro

### Fase 1: Verificación Completa (30 min)
- [x] Buscar referencias en `.md` → 4 encontradas
- [x] Buscar referencias en `.cs` → 0 encontradas
- [x] Buscar referencias en `.ts` → 0 encontradas
- [ ] Buscar referencias en `.json`, `.yaml`, `.yml`
- [ ] Buscar referencias en scripts (`.sh`, `.ps1`, `.bat`)
- [ ] Buscar referencias en `.github/workflows`
- [ ] Buscar referencias en Dockerfile, docker-compose
- [ ] Verificar en README.md raíz

### Fase 2: Documentación de Referencias
- [ ] Crear lista de todos los archivos a actualizar
- [ ] Crear mapa de cambios (viejo → nuevo)
- [ ] Verificar que no hay referencias dinámicas

### Fase 3: Ejecución de Migración
- [ ] Crear carpeta `shared` en raíz
- [ ] Copiar `docs/shared/*` a `shared/`
- [ ] Actualizar referencias en 4 archivos Markdown
- [ ] Actualizar referencias en scripts/CI/CD (si existen)
- [ ] Actualizar README si lo contiene
- [ ] Verificar compilación (backend + frontend)

### Fase 4: Limpieza
- [ ] Eliminar `docs/shared` original
- [ ] Actualizar `.gitignore` si es necesario
- [ ] Crear commit con cambios
- [ ] Documentar cambios en CHANGELOG

---

## 🔍 Checklist de Búsqueda Exhaustiva

Buscar en estos archivos/directorios:

- [ ] `docs/**/*.md` (✅ 3 encontrados)
- [ ] `api/**/*.cs` (✅ 0 encontrados)
- [ ] `appsweb/**/*.ts` (✅ 0 encontrados)
- [ ] `.github/workflows/**` 
- [ ] `docker-compose.yml`, `Dockerfile`
- [ ] `README.md`, `docs/README.md`
- [ ] Archivos de configuración en raíz (`.env`, `.env.example`)
- [ ] Scripts en `scripts/`, `tools/`
- [ ] `package.json`, `angular.json`, `.csproj`

---

## 📊 Referencias a Actualizar (Confirmadas)

### Archivos a Cambiar

1. **docs/AMENDMENT-APP-WEB-DEV-ONESIGNAL.md**
   ```diff
   - `docs/shared/notifications/one_signal.md`
   + `shared/notifications/one_signal.md`
   ```
   Líneas: 5, 188 (2 cambios)

2. **docs/ONESIGNAL-MIGRACION-RESUMEN.md**
   ```diff
   - `docs/shared/notifications/one_signal.md`
   + `shared/notifications/one_signal.md`
   ```
   Línea: 228 (1 cambio)

3. **docs/audit/20260903-AUDITORIA-ONESIGNAL-MIGRACION.md**
   ```diff
   - `docs/shared/notifications/one_signal.md`
   + `shared/notifications/one_signal.md`
   ```
   Línea: 402 (1 cambio)

**Total**: 4 cambios en 3 archivos

---

## 🚨 Posibles Impactos No Detectados

Si alguien está haciendo referencia:
- En comments de código no indexados
- En documentación externa (wikis, blogs)
- En scripts generados dinámicamente
- En URLs publicadas en GitHub issues

**Mitigación**: Mantener carpeta vieja por 1-2 semanas con redirection o symlink.

---

## 💾 Opción A: Migración Limpia (Recomendada)

```bash
# 1. Crear nueva carpeta
mkdir shared

# 2. Copiar contenido
cp -r docs/shared/* shared/

# 3. Actualizar referencias (4 cambios en Markdown)
# [Ejecutar ediciones en los 3 archivos]

# 4. Eliminar carpeta vieja
rm -r docs/shared

# 5. Commit
git add shared/
git rm -r docs/shared
git commit -m "refactor: move docs/shared to shared (root level)"
```

---

## 💾 Opción B: Migración Segura (Symlink)

```bash
# 1. Crear nueva carpeta
mkdir shared
cp -r docs/shared/* shared/

# 2. Actualizar referencias en Markdown (4 cambios)

# 3. Crear symlink para compatibilidad temporalmente
ln -s ../shared docs/shared

# 4. En 2-4 semanas, eliminar symlink y docs/shared
```

**Ventaja**: Si algo no se actualizó, seguirá funcionando.

---

## 📋 Checklist Final Pre-Migración

- [ ] Todas las referencias identificadas
- [ ] Todos los archivos a cambiar listados
- [ ] Cambios probados localmente
- [ ] Backend compila sin errores
- [ ] Frontend compila sin errores
- [ ] Documentación actualizada
- [ ] Commit message escrito
- [ ] Branch creado (opcional)

---

## 🎯 Recomendación

**Proceder con Opción A (Migración Limpia)**:
- Solo 4 cambios de referencias (muy manejable)
- No hay código que compile dependiendo de paths
- Activos estáticos que no se cargan en runtime
- Limpieza sin riesgos

**Tiempo estimado**: 15-20 minutos (incluyendo verificación)

---

## 📞 Próximos Pasos

1. ✅ Confirmar búsqueda exhaustiva (en progreso)
2. ⏳ Proceder con migración si análisis lo confirma
3. ⏳ Actualizar referencias (4 cambios)
4. ⏳ Verificar compilación
5. ⏳ Crear commit
