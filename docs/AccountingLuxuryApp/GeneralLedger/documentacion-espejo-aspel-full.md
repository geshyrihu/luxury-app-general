# Guía del Módulo: Espejo Aspel Full

> [!NOTE]
> Esta guía técnica documenta el módulo **Espejo Aspel Full** y proporciona referencia rápida para desarrolladores que necesitan entender su arquitectura, componentes y flujos de datos.

---

## 🎯 Propósito

El módulo **Espejo Aspel Full** visualiza el plan de cuentas completo de Aspel COI (hasta Nivel 4) con saldos iniciales, movimientos mensuales (Cargo/Abono) y presupuestos por ejercicio fiscal. Permite a los usuarios consultar empresas Contabilidad y Cobranza de forma jerárquica.

---

## 📊 Ruta de Navegación Principal

```bash
# La guía se carga vía la habilidad flow-analyzer con:
# RUTA_DEL_MÓDULO = client/angular/src/app/modules/accounting.luxuryapp/general-ledger/espejo-aspel-full
# OUTPUT = src/assets/flow-analysis/espejo-aspel-full.json

# El usuario accede desde:
/app/contabilidad/espejo-aspel-full (o similar)
```

---

## 🏗️ Arquitectura del Módulo

### Backend (.NET 10)

```
api/
├── LuxuryApp.Application/
│   └── Moduls/
│       └── ContabilidadLuxuryApp/
│           └── EspejoAspelFull/
│               ├── EndPoints/          # EspejoAspelFullEndPoints.cs
│               ├── Services/          # EspejoAspelFullService.cs
│               ├── Interfaces/       # IEspejoAspelFullService.cs
│               ├── DTOs/            # EspejoAspelFullResponseDTO, EspejoGrupoDTO, etc.
│               └── Docs/             # analisis-espejo-aspel-full.md
```

### Frontend (Angular 22)

```
src/app/
└── apps/
    └── contabilidad.luxuryapp/
        └── general-ledger/
            └── espejo-aspel-full/
                ├── espejo-aspel-full.ts            # Componente principal
                ├── espejo-aspel-full.html           # Template
                ├── interfaces/                   # Interfaces TypeScript
                │   └── espejo-aspel-full.interface.ts
                ├── financial-report-filter.service.ts # Servicio de filtros compartido
                └── shared/                        # Componentes UI reutilizables
                    └── ui/
                        └── module-guide/          # Nueva guía visual
                            ├── module-guide.ts
                            ├── module-guide.html
                            ├── module-guide.css
                            └── models/
                                └── flow-analysis.model.ts
```

---

## 🔌 Servicios HTTP Públicos

### Espejo Aspel Full API

```http
GET /api/espejo-aspel-full?customerId={guid}&year={int}&empresa={string}

Auth: Roles requeridos
Headers: Authorization: Bearer <token>

Parámetros:
- customerId: Guid del cliente en LuxuryApp
- year: Año fiscal (ej: 2026)
- empresa: "Contabilidad" | "Cobranza" (enum AspelEmpresa)
```

### Request/Response

```typescript
// Request: query parameters en la URL
GET /api/espejo-aspel-full?customerId=123e4567-e89b-12d3-a456-426614174000&year=2026&empresa=Contabilidad

// Response (EspejoAspelFullResponseDTO):
{
  "ejercicio": 2026,
  "empresa": "Contabilidad",
  "grupos": [
    {
      "codigo": "1",
      "nombre": "ACTIVO",
      "cuentasNivel1": [...],
      "saldoInicial": 1500000,
      "totalesCargo": [12 arrays mensuales],
      "totalesAbono": [12 arrays mensuales],
      "totalesPresupuesto": [12 arrays mensuales]
    }
  ]
}
```

---

## 📋 Listado Completo de Endpoints

| Método | Ruta                     | DESCRIPCIÓN                                 | Auth                                                                                        | Request                   | Response                                   | Grupo        |
| ------ | ------------------------ | ------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------- | ------------------------------------------ | ------------ |
| GET    | `/api/espejo-aspel-full` | Obtener espejo completo del plan de cuentas | RequireAuthorization + Roles: Administrador,SuperUsuario,Contador,AsistenteFiscal,Asistente | customerId, year, empresa | ApiResponseDTO<EspejoAspelFullResponseDTO> | Contabilidad |

---

## 🔄 Diagrama de Secuencia del Flujo Principal

```mermaid
sequenceDiagram
    participant U as 👤 Usuario (Contador/AsistenteFiscal)
    participant F as 🌐 Frontend (Angular 22)
    participant C as 💻 Controlador (Minimal API)
    participant S as 🔧 Servicio (EspejoAspelFullService)
    participant M as 🗺️ Mapeador (AspelMappingService)
    participant A as 📡 API Aspel COI

    U->>F: Selecciona empresa, año, cliente
    F->>C: GET /api/espejo-aspel-full?customerId&year&empresa
    C->>M: GetEmpresaIdAsync(customerId, empresa)
    M-->>C: empresaId (int)
    C->>S: GetEspejoAsync(empresaId, intYear)
    S->>A: GetDatosConsolidadosAsync(empresaId, intYear)
    A-->>S: Cuentas[], Saldos[], Presupuestos[]
    note over S
        Ensambla árbol jerárquico:
        1. Grupo (primer dígito del NumCta)
        2. Nivel1 (prefijo XXX-000-000)
        3. Nivel2 (prefijo XXX-YYY-000)
        4. Nivel3 (prefijo XXX-YYY-ZZZ)
        5. Nivel4 (prefijo XXX-YYY-ZZZ-WWW)

        Aplicación lógica de agregación:
        - SaldoInicial: hijos → padre
        - TotalesCargo/Abono/Presupuesto: hijos → padre (12 meses)
    end note
    S-->>C: EspejoAspelFullResponseDTO
    C-->>F: JSON estructurado
    F->>F: setea rawData signal
    F->>F: filasPorGrupo computed: aplanar árbol
    F->>F: filasFiltradasPorGrupo computed: filtros aplicados
    F->>F: Render p-table (65vh scroll, 14 cols)
```

---

## 🧩 Componentes Principales

### 1. EspejoAspelFullComponent

- **Ubicación**: `client/angular/src/app/modules/accounting.luxuryapp/general-ledger/espejo-aspel-full/espejo-aspel-full.ts`
- **Propósito**: Componente principal standalone para visualización del espejo

#### Características Clave:

```typescript
// Estado reactivo via Signals
loading = signal(false);
rawData = signal<IEspejoAspelFullResponseDTO | null>(null);
// ... más signals

// Datos derivados via Computed
filasPorGrupo = computed(() => {
  // aplanar jerarquía a Map<grupoCodigo, IEspejoFilaTabla[]>
});

filasFiltradasPorGrupo = computed(() => {
  // aplicar filtros: nivel visible, búsqueda, ocultar sin datos
});
```

### 2. ReportFilterService

- **Ubicación**: `client/angular/src/app/modules/accounting.luxuryapp/general-ledger/espejo-aspel-full/financial-report-filter.service.ts`
- **Propósito**: Estado global de filtros compartido por componentes de contabilidad
- **Signals**: `year`, `mesIdx`, `currentReportName`, `currentReportContext`

---

## 🔌 Servicios HTTP Detallados

### 1. EspejoAspelFullService (Backend)

```csharp
// Servicio principal que orquesta la lógica de negocio
public class EspejoAspelFullService(
    IAspelMappingService aspelMappingService,
    IAspelCoiApiClient aspelCoiApiClient) : IEspejoAspelFullService

// Flujo principal
public async Task<ApiResponseDTO<EspejoAspelFullResponseDTO>> GetEspejoAsync(
    Guid customerId, int intYear, Shared.Enums.AspelEmpresa empresa)
```

### 2. EspejoAspelFullComponent (Frontend)

```typescript
// Inyección de dependencias
private readonly http = inject(HttpClient);
private readonly router = inject(Router);
private readonly route = inject(ActivatedRoute);

// Cargar datos desde assets JSON
loadAnalysis(): void {
  const moduleName = this.route.snapshot.paramMap.get('module') || 'espejo-aspel-full';
  this.http.get<ModuleFlowAnalysis>(`/assets/flow-analysis/${moduleName}.json`)
    => this.analysis.set(data);
}
```

---

## 🏗️ Procesamiento Jerárquico del Backend

### Esquema de Niveles NumCta

```
Formato de cuenta: XXX-YYYY-ZZZ-WWW
                │ │ │ └─ Nivel 4: W ≠ 0
                │ │ └─ Nivel 3: Z ≠ 0 (puede ser 000)
                │ └─ Nivel 2: Y ≠ 0 (puede ser 000)
                └─ Nivel 1: X (primer dígito)
```

### Lógica de Clasificación (C#)

```csharp
private static bool EsNivel1(string numCta) {
  // segundo y tercer segmento son ceros
  var p = numCta.Split('-');
  return p.Length == 3 && EsCero(p[1]) && EsCero(p[2]);
}

private static bool EsNivel2(string numCta) {
  // el segundo segmento no es cero, los demas si
  var p = numCta.Split('-');
  return p.Length == 3 && !EsCero(p[1]) && EsCero(p[2]);
}
```

### Agregación de Datos

```typescript
// Ejemplo de estructura de salida
{
  "ejercicio": 2026,
  "empresa": "Contabilidad",
  "grupos": [
    {
      "codigo": "1",
      "nombre": "ACTIVO",
      "cuentasNivel1": [
        {
          "numCta": "101-000-000",
          "nombre": "EFECTIVO",
          "nivel": 1,
          "naturaleza": "D",
          "subCuentas": [Nivel2DTOs...],
          "saldoInicial": 5000000,
          "totalesCargo": [ ... 12 meses ... ],
          "totalesAbono": [ ... 12 meses ... ],
          "totalesPresupuesto": [ ... 12 meses ... ]
        }
      ],
      "saldoInicial": 5000000,
      "totalesCargo": [ ... agregados de hijos ... ],
      "totalesAbono": [ ... agregados de hijos ... ],
      "totalesPresupuesto": [ ... agregados de hijos ... ]
    }
  ]
}
```

---

## 🎨 Diseño UI/UX

### 1. Barras Superiores Fijas

```html
<!-- Empresa, Ejercicio (controles de year), Navegación rápida -->
<div class="rf-card border-bottom-1 surface-border">
  <!-- Controles de empresa (select) -->
  <!-- Controles de año (chevrons) -->
  <!-- Navegación rápida por grupo (scroll) -->
  <!-- Filtros (mostrar/ocultar sin datos) -->
</div>
```


```typescript
<p-table
  [value]="filasDe(grupo.codigo)"
  class="rf-prime-table p-datatable-sm"
  [scrollable]="true"
  scrollHeight="65vh"
  [rowHover]="true">
```

#### Columnas (14 total):

1. No. Cuenta
2. DESCRIPCIÓN
3. Saldo Inicial
   4-15. Meses (Ene-Dic)
4. Resultado

#### Color Coding:

- **Cargo**: Azul (#1d4ed8)
- **Abono**: Rojo (#dc2626)
- **Presupuesto** (solo grupo 6=GASTOS): Verde (#16a34a)
- **Resultado**: Verde ≥0, Rojo <0

### 3. Filtros Reactivos

```typescript
// 1. Filtro de nivel visible por grupo
nivelVisiblePorGrupo = signal<Record<string, number>>({});

// 2. Búsqueda por grupo
busquedaPorGrupo = signal<Record<string, string>>({});

// 3. Ocultar cuentas sin datos
ocultarSinDatos = signal(false);
```

### 4. Heurística de Detección de Niveles

```typescript
getNivelesDisponibles(codigo: string): number[] {
  const filas = this.filasPorGrupo().get(codigo) ?? [];
  const niveles: number[] = [1];

  let hasN2 = filas.some(f => f.nivel === 2);
  let hasN3 = filas.some(f => f.nivel === 3);
  let hasN4 = filas.some(f => f.nivel === 4);

  // Si cualquier cuenta tiene 4 segmentos, habilitar N2-N4
  if (!hasN4 && filas.some(f => f.numCta && f.numCta.split('-').length === 4)) {
    hasN2 = hasN3 = hasN4 = true;
  }

  if (hasN2) niveles.push(2);
  if (hasN3) niveles.push(3);
  if (hasN4) niveles.push(4);

  return niveles;
}
```

---

## 🔧 Configuraciones y Adaptaciones


```html
<!-- CORRECTO (convención del repositorio) -->
<ng-template #header>
  <tr>
    <th>Cuenta</th>
  </tr>
</ng-template>

<!-- INCORRECTO (causa UI en blanco) -->
<ng-template pTemplate="header">
  <tr>
    <th>Cuenta</th>
  </tr>
</ng-template>
```

### Formato de Monedas

```typescript
formatMoney(val: number): string {
  if (!val) return "-";
  return new Intl.NumberFormat('es-MX', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(val);
}
```

### Formato de Fechas

```typescript
// Ejemplo: 14-jun-26 (estándar de plataforma)
```

---

## 📈 Métricas y Estadísticas

| Métrica              | Calculada en                         | DESCRIPCIÓN                                      |
| -------------------- | ------------------------------------ | ------------------------------------------------ |
| Total de Grupos      | `analysis()?.groups?.length`         | Count de clases contables (ACTIVO, PASIVO, etc.) |
| Cuentas Nivel 1      | `sum(grupos[].cuentasNivel1.length)` | Cuentas raíz por grupo                           |
| Cuentas Nivel 4      | `sum(n4.detalle.length)`             | Cuentas hoja más detalladas                      |
| Año actual           | `filterS.year()`                     | Año fiscal seleccionado                          |
| Empresa seleccionada | `empresaSeleccionada()`              | "Contabilidad" o "Cobranza"                      |

---

## 🚀 Consideraciones de Rendimiento

### Optimizaciones Clave

1. **Virtual Scrolling**: `scrollHeight: '65vh'` limita la altura de scroll
2. **OnPush Change Detection**: `changeDetection: ChangeDetectionStrategy.OnPush`
3. **Computed Signals**: Derivan datos una sola vez, se actualizan reactivamente
4. **Effets Limitados**: Solo recarga cuando cambian filtros críticos
5. **Tratamiento de Errores**: Fallback graceful con alerta UI en computed signals

### Handlers Críticos

- `effect(() => {
const custId = this.customerIdS.customerId();
const yr = this.filterS.year();
const emp = this.empresaSeleccionada();
if (custId && yr && emp) {
this.cargarDatos(custId, yr, emp);
}
});`

---

## 🛠️ Pasos de Implementación

### 1. Ejecutar la Skill de Análisis

```bash
# Con agente CLI (Claude Code, Cursor, etc.)
"Analiza el módulo de Espejo Aspel Full siguiendo skill .kilo/skills/flow-analyzer/skill.md"

# Genera y valida
ajv validate -s .kilo/skills/flow-analyzer/output-schema.json -d src/assets/flow-analysis/espejo-aspel-full.json
```

### 2. Integrar JSON Validado

```typescript
// En module-guide.component.ts
loadAnalysis(): void {
  this.http.get<ModuleFlowAnalysis>('/assets/flow-analysis/espejo-aspel-full.json')
    .subscribe({
      next: (data) => this.analysis.set(data),
      error: (err) => this.loadError.set(err.message)
    });
}
```

### 3. Agregar Ruta en App Routes

```typescript
{
  path: 'guide/espejo-aspel-full',
  component: ModuleGuide
}
```

### 4. Configurar Assets en angular.json

```json
"assets": [
  "src/favicon.ico",
  "src/assets",
  {
    "glob": "**/*",
    "input": "src/assets/flow-analysis",
    "output": "/assets/flow-analysis"
  }
]
```

---

## 🎯 Beneficios

✅ **Documentación automática** con agente CLI
✅ **Documentación viva** que se actualiza con el código
✅ **Navegación interactiva** por flujos, endpoints, componentes
✅ **Búsqueda en tiempo real** con signals
✅ **Table análisis jerárquico** con 12 meses de datos
✅ **Extensible** para cualquier módulo LuxuryApp

---

¿Quieres que refine alguna parte específica o agregue funcionalidades como exportar a PDF o integrar diagramas Mermaid?
