# 📋 BITÁCORA DE CAMBIOS - MÓDULO PRESUPUESTO PROPUESTA

**Propósito:** Registro de instrucciones, cambios y mejoras a realizar en el módulo.
**Estado:** ABIERTA PARA NUEVAS INSTRUCCIONES
**Última Actualización:** 2026-09-03

---

## 📌 PLANTILLA DE INSTRUCCIÓN

Cuando agregues una instrucción nueva, usa este formato:

```markdown
## [NÚMERO]. [CATEGORÍA] - [TÍTULO CORTO]

**Fecha Agregada:** 2026-09-03
**Prioridad:** 🔴 CRÍTICA | 🟠 ALTA | 🟡 MEDIA | 🟢 BAJA
**Autor de Instrucción:** [Tu nombre]
**Agente Asignado:** [Si aplica]
**Estado:** ⏳ PENDIENTE | 🔄 EN PROGRESO | ✅ COMPLETADO

### DESCRIPCIÓN

[Explicar qué se debe hacer y por qué]

### Archivos Afectados

- `archivo1.ts` (línea X-Y)
- `archivo2.cs` (línea X-Y)

### Detalles Técnicos

[Especificaciones técnicas, reglas a considerar, edge cases]

### Criterios de Éxito

- [ ] Criterio 1
- [ ] Criterio 2
- [ ] Criterio 3

### Notas

[Cualquier observación adicional]

---
```

---

## 📊 RESUMEN DE INSTRUCCIONES

| #   | Categoría | Título | Prioridad | Estado |
| --- | --------- | ------ | --------- | ------ |
| —   | —         | —      | —         | —      |

**Total:** 0 instrucciones registradas
**Pendientes:** 0 | **En Progreso:** 0 | **Completadas:** 0

---

## 🔍 INSTRUCCIONES INGRESADAS

_(Las nuevas instrucciones irán aquí)_

---

## 📂 CATEGORÍAS DISPONIBLES

Para clasificar instrucciones:

- **Frontend** - Cambios en Angular (componentes, templates, servicios)
- **Backend** - Cambios en .NET (servicios, endpoints, DTOs)
- **API** - Nuevos endpoints, cambios en contratos
- **BD** - Cambios en entidades, migraciones
- **Validación** - Nuevas reglas de negocio, validaciones
- **UI/UX** - Estilos, colores, mensajes, diálogos
- **Integración** - Aspel, SignalR, terceros
- **Performance** - Optimizaciones, cuellos de botella
- **Seguridad** - Validaciones, autenticación, autorización
- **Testing** - Tests unitarios, integración
- **Documentación** - README, comentarios, wikis

---

## 🎯 PUNTOS DE ENTRADA PRINCIPALES PARA CAMBIOS

### Frontend (presupuesto-propuesta.ts)

**Gancho:** Constructor y ngOnInit

```typescript
constructor() {
    effect(() => {
        this.customerId = this.customerIdS.customerId();
        if (this.customerId) this.onLoadData();  // 👈 AQUÍ se carga
    });
}

ngOnInit() {
    this.signalRService.start();                // 👈 Inicializa tiempo real
    // ... suscripciones
}
```

**Para agregar lógica personalizada:**

- ❌ NO modificar onLoadData() (sincronización crítica)
- ✅ Extender en nuevo método que se llame DESPUÉS de onLoadData()

**Gancho:** onProposedAmountChange(item)

```typescript
onProposedAmountChange(item: BudgetProposalItemDTO): void {
    // ... cálculos
    this.recalculateTotals();  // 👈 Llamar después
    // ✅ Aquí se pueden agregar validaciones adicionales
}
```

### Backend (BudgetProposalService.cs)

**Gancho:** GetProposalsAsync() - Paso 5 (Enriquecimiento)

```csharp
// Línea ~240-273: Enriquecimiento con gastos mensuales
foreach (var item in resultDTO.Items) {
    if (monthlyExpensesDict.TryGetValue(item.AccountNumber, out var aspelData)) {
        // ✅ Aquí se pueden agregar campos adicionales
        item.GastoEnero = aspelData.EneroMonto;
        // ...
    }
}
```

**Gancho:** UpdateProposalItemAsync() - Antes de SaveChanges

```csharp
// Línea ~468-478: Actualizar item
item.ProposedAmount = DTO.ProposedAmount;
// ✅ Aquí se pueden agregar validaciones/cálculos
await dbContext.SaveChangesAsync();
```

**Gancho:** GetFeeComparisonAsync() - Antes de retornar

```csharp
// Línea ~831-843: Calcular cuota
var result = new UniformFeeComparisonDTO { ... };
// ✅ Aquí se pueden agregar campos adicionales
return ApiResponseDTO<UniformFeeComparisonDTO>.SuccessResult(result, ...);
```

---

## 🚀 FLUJO DE INSTRUCCIÓN → EJECUCIÓN

1. **Tú escribes instrucción** en este documento
   - Sección "INSTRUCCIONES INGRESADAS"
   - Copias plantilla de arriba
   - Llenando: DESCRIPCIÓN, Archivos, Detalles, Criterios de Éxito

2. **Asignas a agente externo**
   - Envías instrucción + enlace a ANALISIS_EXHAUSTIVO.md
   - Agente lee análisis para contexto completo
   - Agente confirma que entiende

3. **Agente ejecuta**
   - Implementa cambios
   - Ejecuta tests (si hay)
   - Reporta resultado

4. **Tú verificas**
   - Revisa que criterios de éxito se cumplan
   - Cambia Estado a ✅ COMPLETADO

---

## 📝 EJEMPLO: CÓMO AGREGAR UNA INSTRUCCIÓN

Supongamos que quieres agregar una validación:

````markdown
## 1. VALIDACIÓN - Restringir monto máximo por partida

**Fecha Agregada:** 2026-09-03
**Prioridad:** 🟡 MEDIA
**Autor de Instrucción:** [Tu nombre]
**Estado:** ⏳ PENDIENTE

### DESCRIPCIÓN

El sistema debe validar que ninguna partida tenga un monto propuesto mayor a $1,000,000.
Si el usuario intenta editar a $1,000,001, debe mostrar error:
"Monto máximo permitido es $1,000,000".

### Archivos Afectados

- `presupuesto-propuesta.ts` (método onProposedAmountChange, ~línea 849)
- `BudgetProposalService.cs` (método UpdateProposalItemAsync, ~línea 430)

### Detalles Técnicos

- Validación Frontend (toast de error antes de enviar)
- Validación Backend (BusinessException si supera $1,000,000)
- Código validación:
  ```typescript
  if (proposedAmount > 1000000) {
    this.customToastService.showError(
      "Monto Inválido",
      "Monto máximo permitido es $1,000,000",
    );
    return;
  }
  ```
````

### Criterios de Éxito

- [ ] Frontend valida y muestra error
- [ ] Backend valida y lanza BusinessException
- [ ] Toast muestra mensaje correcto
- [ ] Tabla no se actualiza si monto es inválido

### Notas

- Esta validación no debe aplicar a cuentas agrupadoras (EsFilaAgrupadora = true)
- Considerar campos decimales con redondeo

````

---

## ⚙️ CAMBIOS COMUNES Y CÓMO HACERLOS

### Agregar Campo Nuevo a Partida

**Si es solo Frontend:**
1. Agregar propiedad a `BudgetProposalItemDTO` en interfaces/budget-proposal.model.ts
2. Usar en template presupuesto-propuesta.html
3. No requiere backend

**Si es Frontend + Backend:**
1. Agregar propiedad en Backend (BudgetProposalItemDTO.cs)
2. Actualizar servicio BudgetProposalService para llenar el campo
3. Crear migración de BD (si es en entidad)
4. Agregar propiedad en interfaces/ Frontend
5. Usar en template
6. Actualizar AutoMapper profile

### Agregar Validación Nueva

**Frontend:**
1. En onProposedAmountChange() o método específico
2. Verificar condición
3. Si falla: customToastService.showError() y return
4. Si OK: continuar

**Backend:**
1. En UpdateProposalItemAsync() ANTES de SaveChanges
2. if (condición no válida) throw new BusinessException(...)
3. Incluir código de error (ej. "INVALID_AMOUNT")

### Agregar Nuevo Modal/Diálogo

**Pasos:**
1. Crear archivo componente-dialog.ts
2. Crear componente-dialog.html
3. Inyectar DialogHandlerService
4. En componente principal:
   ```typescript
   showDialogNuevo() {
       this.dialogHandlerS.openDialog(
           ComponenteDialog,
           { data: this.selectedItem },
           "Título Modal",
           this.dialogHandlerS.sizeXl
       );
   }
````

---

## 🔗 REFERENCIAS ÚTILES

- **Análisis Completo:** [ANALISIS_EXHAUSTIVO.md](./ANALISIS_EXHAUSTIVO.md)
- **Reglas Negocio:** [../Docs/reglas-negocio-presupuesto-propuesta.md](../../../api/LuxuryApp.Application/Modules/ContabilidadLuxuryApp/PresupuestoPropuesta/Docs/reglas-negocio-presupuesto-propuesta.md)
- **Convenciones:** CONVENTIONS.md (en raíz)
- **Endpoints API:** Consultar BudgetProposalEndPoints.cs

---

## 📊 HISTORIAL DE CAMBIOS

| Versión | Fecha      | Cambios          |
| ------- | ---------- | ---------------- |
| 1.0     | 2026-09-03 | Creación inicial |

---

**Estado General:** 🟢 LISTO PARA RECIBIR INSTRUCCIONES

_Próximo paso: Agrega tus instrucciones debajo en la sección "INSTRUCCIONES INGRESADAS"_
