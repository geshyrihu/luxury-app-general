# 🔐 Reglas de Gobernanza Anti-Spanglish para Auditorías Futuras

**Versión:** 1.0  
**Vigente desde:** 2026-09-13  
**Basado en:** Auditoria Migración Inglés 20260912 (2,196 hallazgos rojos)

---

## 1. Lenguaje por Capa

| Capa | Idioma | Por qué |
|------|--------|--------|
| HTTP API (rutas, verbos) | 🇬🇧 100% Inglés | Estándar internacional |
| DTO/Record (propiedades públicas) | 🇬🇧 100% Inglés | JSON serialization, contrato frontend |
| Entidad EF Core | 🇬🇧 100% Inglés | Mapeada a tabla SQL |
| Interfaz/Clase pública | 🇬🇧 100% Inglés | Contrato entre módulos |
| Privados/métodos privados | 🟡 Español permitido (transitoriamente) | Bajo valor de refactor |
| Namespace/Carpeta | 🇬🇧 100% Inglés | Path-based del repo |
| Comentarios | 🇬🇧 Preferido + 🇪🇸 Permitido | Flexibilidad |

**Regla crítica:** No mezclar idiomas dentro del mismo contexto (DTO no puede tener `CompanyName` y `NumeroCuenta`).

---

## 2. Patrones de Spanglish Prohibidos

### 2.1 Prefijos de compuestos nominales (cabeza al final en inglés)

| Español | ❌ Spanglish | ✅ Inglés |
|---------|--|--|
| `FechaCreacion` | `CreationFecha` | `CreationDate` |
| `NumeroCuenta` | `AccountNumero` | `AccountNumber` |
| `TipoPoliza` | `PolicyTipo` | `PolicyType` |
| `NombreEmpresa` | `CompanyNombre` | `CompanyName` |
| `CodigoCuenta` | `AccountCodigo` | `AccountCode` |
| `NivelCuenta` | `AccountNivel` | `AccountLevel` |

### 2.2 Preposiciones compuestas

| Español | ❌ Spanglish | ✅ Inglés |
|---------|--|--|
| `MetodoDePago` | `PaymentMetodo` | `PaymentMethod` |
| `DiasDeTrabajo` | `WorkDias` | `WorkDays` |
| `CuentaPadre` | `ParentCuenta` | `ParentAccount` |

### 2.3 Adjetivos españoles + sustantivo inglés

| ❌ No usar | ✅ Usar |
|---|---|
| `TotalCuentasActivas` | `TotalActiveAccounts` |
| `CuentasCompartidas` | `SharedAccounts` |
| `CuentasFaltantes` | `MissingAccounts` |

---

## 3. Prioridad de Migración (Risk-Based)

| Fase | Categoría | Riesgo | Esfuerzo | Prioridad |
|---|---|---|---|---|
| **0** | Vestigios namespace Recruitment | 🟨 Bajo | 2h | 🔴 ALTA |
| **1** | Privados/métodos privados | 🟩 Verde | S/M | 🟡 Media |
| **2** | Namespaces/Carpetas módulos | 🟨 Moderado | 1-2d | 🔴 ALTA |
| **3a** | Entidades EF Core | 🟥 Crítico | 2-3d | 🔴 CRÍTICA |
| **3b** | DTOs públicos (frontend) | 🟥 Crítico | 1-2d | 🔴 CRÍTICA |
| **3c** | Integraciones Aspel | 🟥 Crítico | 1-2d | 🟠 ALTA |

---

## 4. CI Gates Anti-Spanglish

Agregar a pipeline:

```bash
# Verificar prefijos nominales en public
grep -r "public.*Fecha[A-Z]\|public.*Numero[A-Z]" api/ | grep -v Date | grep -v Number && exit 1

# Verificar namespaces en español
grep -r "namespace.*ReclutamientoLuxuryApp\|namespace.*MantenimientoLuxuryApp" api/ && exit 1

# Verificar DTOs con propiedades españolas (warning)
grep -r "class.*DTO.*{" -A20 api/ | grep "Fecha[A-Z]\|Numero[A-Z]"
```

---

## 5. Decisión: Aspel & Terceros

**NO renombrar** si:
- Campo se mapea 1:1 contra BD de Aspel
- Existe `[JsonPropertyName(...)]` explícito (contrato viejo)
- DTO se deserializa desde tercero

**Estrategia segura:**
```csharp
// Opción: Preservar contrato viejo + C# inglés
[JsonPropertyName("Poliza")]  // Mantiene compatibilidad Aspel
public string Policy { get; init; }
```

---

## 6. Diccionario de 200+ Términos

### Contabilidad
| ES | EN |
|---|---|
| Cuenta | Account |
| Presupuesto | Budget |
| Poliza | Policy |
| Saldo | Balance |
| Código de Cuenta | AccountCode |

### Compras
| ES | EN |
|---|---|
| Orden de Compra | PurchaseOrder |
| Cotización | Quote |
| Proveedor | Supplier |
| Línea | LineItem |

### RRHH
| ES | EN |
|---|---|
| Recursos Humanos | HumanResources |
| Solicitud de Alta | EmployeeRegisterRequest |
| Solicitud de Baja | DismissalRequest |
| Puesto de Trabajo | WorkPosition |
| Nómina | Payroll |

### Cobranza
| ES | EN |
|---|---|
| Cobranza | Collections |
| Cuenta de Cobranza | CollectionsAccount |
| Estado de Cuenta | AccountStatement |

### Mantenimiento
| ES | EN |
|---|---|
| Detector de Humo | SmokeDetector |
| Extintor | FireExtinguisher |
| Estación Manual | ManualCallPoint |

---

## 7. Auditoría de Coherencia Mensual

```bash
# Ejecutar cada mes
node scripts/anti-spanglish-check.mjs --report docs/SharedLuxuryApp/Conventions/$(date +%Y%m%d)-auditoria-shared-spanglish.md

# Métricas objetivo
# 2026-09-13: 30% módulos 100% inglés, 2196 hallazgos rojos
# 2026-12-31: 70% módulos, <500 hallazgos rojos  
# 2027-03-31: 100% módulos, 0 hallazgos rojos
```

---

## 8. Decisiones Bloqueantes (Tech Lead)

Antes de Fase 2+, resolver:

1. **Opción A (Pure English) u Opción B (Transición)?**  
   → Recomendación: Opción A para nuevos módulos

2. **¿Integra Aspel?**  
   → Sí: Validar contrato antes de tocar DTOs

3. **¿Migraciones de BD?**  
   → Usar `[Column("nombreViejo")]` para zero-downtime

4. **¿Sync con Frontend?**  
   → Usar `[JsonPropertyName]` para overlap 2-sprint

Documentar decisión en CONVENTIONS.md §5.3 (nuevo).

---

## 9. Cambios a CONVENTIONS.md

Agregar **§5.3 "Idiom Governance & Anti-Spanglish"**:
- Link a este documento
- Tabla de decisiones por fase
- Diccionario de términos (200+)
- CI gates obligatorios
- Leyenda de riesgos 🟥🟨🟩

---

**Vigente desde:** 2026-09-13  
**Próxima revisión:** 2026-10-13
