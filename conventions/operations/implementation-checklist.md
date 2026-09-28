# Implementation Checklist

**Última revisión:** 2026-08-06 (consolidado de IMPLEMENTATION_CHECKLIST.md viejo)

## Propósito

Checklist obligatorio antes de empezar a escribir código. Validar dependencias reales, evitar supuestos falsos, y proteger convenciones del proyecto.

---

## Checklist Mínimo (Todos los stacks)

- [ ] Leí `CONVENTIONS.md` completamente
- [ ] Leí el workflow por tipo de tarea (§4 CONVENTIONS.md)
- [ ] Leí el documento especializado del stack
- [ ] Validé naming y estructura aplicable
- [ ] Revisé `available-features.md`
- [ ] Revisé si existe catálogo o protocolo adicional (auditoría, plan, guías, UI, styles)
- [ ] Confirmé que NO usaré dependencia o patrón prohibido
- [ ] Validé si el caso toca shared o contrato sensible
- [ ] Si el cambio es importante, existe análisis previo y plan por fases
- [ ] Si la ubicación no está clara, propuse y espere aprobación
- [ ] Si hay documento legacy relacionado, validé que no contradiga sistema rector vigente

---

## Validación por Stack

### 🔧 Backend

**Antes de empezar:**

- [ ] Arquitectura: ¿Dónde va el código? (módulo, carpeta, namespace correcto)
- [ ] Naming: ¿Sigue convenciones de naming del stack?
- [ ] DTOs y Contratos: ¿Reutilizar DTO existente o crear nuevo?
  - ❌ PROHIBIDO: múltiples DTOs en un archivo (1 DTO = 1 archivo)
  - ✅ CORRECTO: heredar de GuidIdEntityDTO si declara `Id`
- [ ] Validaciones: ¿FluentValidation, DataAnnotations o Business Logic?
- [ ] Logging: ¿Inyectar ILogger<T>, no Serilog.Log estático?
- [ ] Manejo de errores: ¿Usar BusinessException para errores esperados?
- [ ] Paginación: ¿Usar PaginationCommonDTO canónico?
- [ ] Queries: ¿Seguir QueryObject pattern?
- [ ] Pruebas: ¿Cobertura mínima 70%?

### 🎨 Frontend

**Antes de empezar:**

- [ ] Standalone: ¿Usar @Component({standalone: true})?
- [ ] Change Detection: ¿OnPush por defecto?
- [ ] Signals: ¿Usar signals en lugar de BehaviorSubject?
- [ ] Formularios: ¿Reactive Forms, NUNCA Template Forms?
- [ ] Control Flow: ¿@if/@for/@switch, NO *ngIf/*ngFor?
- [ ] UI Catálogo: ¿Usar shared/ui, NO librerías directas?
- [ ] Typing: ¿Fuerte, NO any?
- [ ] Servicios HTTP: ¿Usar ApiResponseService oficial?
- [ ] Estado: ¿Signals o servicios inyectables, NO subscriptions manuales?

### 📱 Mobile

**Antes de empezar:**

- [ ] Plataforma: ¿Ionic/Flutter separado de web?
- [ ] Touch UX: ¿Respetar patrones táctiles (48x48 px mínimo)?
- [ ] Layouts: ¿Verticales y espaciosos, NO densos como desktop?
- [ ] Bottom Sheets: ¿Usar en lugar de modales desktop?
- [ ] Gestos: ¿Swipe, long-press, item-sliding documentados?
- [ ] Accesibilidad: ¿aria-label en icon-only buttons?

### 🔗 Cross-Stack

**Antes de empezar:**

- [ ] Shared: ¿Validar impacto antes de tocar shared o Providers?
- [ ] Contratos: ¿Rutas públicas, DTOs serializados, cambios no rompen clientes?
- [ ] Compilación: ¿Backend compila? ¿Frontend compila?
- [ ] Pruebas: ¿Tests mínimos escritos?
- [ ] Alineación: ¿Backend y Frontend hablan el mismo contrato?

---

## Reglas Operativas Críticas

### 1. Validar dependencias reales ANTES de implementar
- ❌ NO asumir que una librería existe si no está en `available-features.md`
- ✅ CORRECTO: Verificar versión exacta y namespace en el documento

### 2. NO asumir librerías, helpers o patrones de otros proyectos
- ❌ NO: "En otro proyecto usamos MediatR, aquí también"
- ✅ CORRECTO: Leer backend-rules.md y available-features.md

### 3. Revisar reglas del stack ANTES de abrir implementación
- ❌ NO empezar sin leer documentos especializados del stack
- ✅ CORRECTO: Validar con checklist antes de escribir una línea

### 4. Si el cambio es sensible/transversal, validar con plan formal
- **Cambios sensibles:** shared, contratos públicos, DTOs serializados, seguridad, autorización
- **Cambios transversales:** afectan múltiples módulos o stacks
- ✅ CORRECTO: Crear plan con phases antes de ejecutar

---

## Severidad de Incumplimiento

| Hallazgo | Impacto | Acción |
|---|---|---|
| **Violación CRÍTICA** (contratos, shared, prohibiciones) | Bloquea merge | Debe corregirse ANTES |
| **Violación ALTA** (arquitectura, naming, testing) | Ralentiza review | Requiere corrección o plan |
| **Violación MEDIA** (estilo, documentación) | Deuda aceptable | Puede quedar documentada |

---

## Documentos Relacionados

- [CONVENTIONS.md](../CONVENTIONS.md)
- [available-features.md](./available-features.md)
- [Backend Rules](../backend/backend-rules.md)
- [Frontend Rules](../frontend/frontend-rules.md)
- [UI Desktop Rules](../ui/ui-desktop-rules.md)
- [UI Mobile Rules](../ui/ui-mobile-rules.md)
- [Governance by Role](../core/governance-by-role.md)

---

**Última actualización:** 2026-08-06  
**Consolidado de:** IMPLEMENTATION_CHECKLIST.md (eliminado 2026-08-06, contenido absorbido)


