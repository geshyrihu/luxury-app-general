# 🧪 PLAN: Refactorización de Namespaces — LuxuryApp.Tests (Path-Based)

**Fecha:** 2026-09-11  
**Ejecutor:** Agente Externo (OpenCode/Chalán)  
**Status:** 📋 PENDIENTE EJECUCIÓN  
**Impacto:** 76 archivos `.cs`, 0 errores de build esperados

---

## 📋 Resumen Ejecutivo

Sincronizar namespaces de `LuxuryApp.Tests` con patrón path-based de `LuxuryApp.Application`:

- **Actual:** `LuxuryApp.Tests.Application.ModuleApps.AdminLuxuryApp.Banks`
- **Nuevo:** `AdminLuxuryApp.Banks.Tests`
- **Cambios:** 76 archivos `.cs`, reescritura de línea `namespace`
- **Estructura:** NO cambiar (Modules/ se mantiene), solo actualizar declaraciones de namespace

---

## 🎯 Objetivo

Alinear naming convention de Tests con Application, eliminando prefijo de proyecto y agregando sufijo `.Tests` obligatorio.

**Razón:** Consistencia arquitectónica. Application eliminó `LuxuryApp.Application.` prefix el 2026-09-11. Tests debe aplicar la misma regla.

---

## 📐 Regla de Transformación

### Fórmula

```
Ruta física:      api/LuxuryApp.Tests/Application/Modules/AdminLuxuryApp/Banks/BankAppServiceTests.cs
Namespace actual: namespace LuxuryApp.Tests.Application.ModuleApps.AdminLuxuryApp.Banks;
Namespace nuevo:  namespace AdminLuxuryApp.Banks.Tests;

Pasos:
1. Eliminar: LuxuryApp.Tests.Application.ModuleApps.
2. Agregar: .Tests
```

### Excepciones

**Infrastructure (sin sufijo Tests):**
```
Ruta:            api/LuxuryApp.Tests/Application/Infrastructure/InMemoryDbContextFactory.cs
Namespace nuevo: namespace Infrastructure;
```

---

## 🔧 Fases de Ejecución

### Fase 1: Auditoría Previa (5 min)

**Comandos a ejecutar (read-only):**

```bash
# Contar archivos .cs
find api/LuxuryApp.Tests/Application -name "*.cs" -type f | wc -l
# Esperado: ~76

# Listar patrones actuales
grep -r "^namespace LuxuryApp.Tests.Application.ModuleApps\." api/LuxuryApp.Tests --include="*.cs" | wc -l
# Esperado: ~70

# Listar Infrastructure
grep -r "^namespace LuxuryApp.Tests.Application.Infrastructure" api/LuxuryApp.Tests --include="*.cs" | wc -l
# Esperado: ~6
```

**Entregar al ejecutor:** Resultado de auditoría (números esperados).

---

### Fase 2: Transformación de Namespaces (15 min)

**Script a ejecutar:**

```bash
#!/bin/bash
set -e

cd api/LuxuryApp.Tests/Application

echo "📝 Transformando namespaces en 76 archivos..."

# 1. Pattern: LuxuryApp.Tests.Application.ModuleApps.* → *.Tests
#    Ejemplo: LuxuryApp.Tests.Application.ModuleApps.AdminLuxuryApp.Banks 
#    → AdminLuxuryApp.Banks.Tests

find . -name "*.cs" -type f | while read file; do
    # Extraer ruta relativa y convertir a namespace
    path=$(echo "$file" | sed 's|^\./||' | sed 's|/[^/]*\.cs$||')
    
    # Convertir ruta a namespace (reemplazar / por .)
    ns=$(echo "$path" | sed 's|/|.|g')
    
    # Si es Infrastructure, no agregar .Tests
    if echo "$ns" | grep -q "^Infrastructure"; then
        new_ns="Infrastructure"
    else
        new_ns="$ns.Tests"
    fi
    
    # Buscar namespace actual en archivo
    old_ns=$(grep "^namespace " "$file" | head -1 | sed 's/namespace //;s/;//')
    
    # Si encontró, reemplazar
    if [ ! -z "$old_ns" ]; then
        sed -i "s/^namespace $old_ns;/namespace $new_ns;/" "$file"
        echo "  ✅ $file"
        echo "     $old_ns → $new_ns"
    fi
done

echo ""
echo "✅ Transformación completada"
```

**Instrucciones:**
1. Copiar script a archivo `transform_tests.sh`
2. Hacer executable: `chmod +x transform_tests.sh`
3. Ejecutar: `./transform_tests.sh` (desde raíz del repo)
4. Capturar output completo

---

### Fase 3: Verificación Post-Cambio (10 min)

**Comandos (read-only):**

```bash
# ❌ Verificar que NO quedan prefijos viejos
echo "❌ Buscando prefijos viejos (debe retornar 0):"
grep -r "^namespace LuxuryApp.Tests\." api/LuxuryApp.Tests --include="*.cs" | wc -l

echo "❌ Buscando ModuleApps (debe retornar 0):"
grep -r "^namespace .*ModuleApps\." api/LuxuryApp.Tests --include="*.cs" | wc -l

# ✅ Verificar patrón nuevo
echo "✅ Archivos con .Tests (debe retornar ~70):"
grep -r "^namespace .*\.Tests$" api/LuxuryApp.Tests --include="*.cs" | wc -l

echo "✅ Infrastructure sin Tests (debe retornar ~6):"
grep -r "^namespace Infrastructure" api/LuxuryApp.Tests --include="*.cs" | wc -l

# 🧪 Build test
echo "🧪 Intentar compilar:"
dotnet build api/LuxuryApp.Tests.csproj 2>&1 | grep -E "Error|error|ERROR" || echo "✅ No errors"
```

---

## 📊 Checklist de Ejecución

| # | Tarea | Status | Notas |
|---|-------|--------|-------|
| 1 | ✅ Auditoría previa (contar archivos) | `[ ]` | Entregar números |
| 2 | ✅ Ejecutar script transform_tests.sh | `[ ]` | Capturar output |
| 3 | ✅ Verificar NO hay prefijos viejos | `[ ]` | grep retorna 0 |
| 4 | ✅ Verificar patrón .Tests existe | `[ ]` | grep retorna ~70 |
| 5 | ✅ Verificar Infrastructure | `[ ]` | grep retorna ~6 |
| 6 | ✅ dotnet build (opcional) | `[ ]` | Sin errores |
| 7 | ✅ Reportar resultado final | `[ ]` | Entregar resumen |

---

## 📤 Deliverables Esperados

### Del Ejecutor

1. **Auditoría Previa (Fase 1):**
   - Número de archivos .cs encontrados
   - Número de namespaces con patrón viejo

2. **Transformación (Fase 2):**
   - Output completo del script (76 líneas ✅)
   - Cualquier error o advertencia

3. **Verificación (Fase 3):**
   - Resultado de 4 comandos grep
   - Status de dotnet build (si aplica)

4. **Resumen Final:**
   ```
   ✅ COMPLETADA: 76 archivos transformados
   - Prefijos viejos: 0 encontrados
   - Patrón nuevo (.Tests): 70 encontrados
   - Infrastructure: 6 encontrados
   - Build status: [PASS/FAIL]
   ```

---

## 🔗 Referencias

- **Documento de convención:** `conventions/CONVENTIONS_TESTING.md`
- **Namespace rules:** `conventions/backend/testing-namespace-conventions.md`
- **Padre (Application):** `conventions/backend/namespace-conventions.md`

---

## ⚠️ Notas de Riesgo

- **Reversibilidad:** Con Git, reversible (commit nuevo o revert)
- **Build:** Se espera 0 errores (mismo patrón que Application)
- **Scope:** Solo namespaces, NO mover carpetas
- **Testing:** Tests deben pasar post-cambio (script no compila, solo modifica)

---

**Creado:** 2026-09-11  
**Vía:** Claude Haiku 4.5  
**Para:** Agente Externo (Chalán/OpenCode)

---

## Instrucciones para Agente Externo

**Eres el ejecutor (Chalán). Yo soy el planificador (Claude).**

1. **Lee este plan completo.**
2. **Ejecuta Fase 1, 2, 3 en orden.**
3. **Captura CADA output y CADA error.**
4. **Reporta checklist completado + deliverables.**
5. **Si error: DETÉN y reporta línea exacta + contexto.**

**Comando para iniciar:**
```bash
cd /path/to/luxuryapp-api
bash transform_tests.sh 2>&1 | tee /tmp/tests-refactor.log
```

**Reportar cuando termine** con link a `/tmp/tests-refactor.log` o paste del output.
