# Arquitectura Monolítica Unificada (Vertical Slices)

**Fecha de adopción:** 2026-09-02
**Aplica a:** Todo el código backend de `LuxuryApp.Application`

## 1. Filosofía Central
Todo el código de dominio, aplicación e infraestructura externa del negocio vive EXCLUSIVAMENTE dentro del proyecto `LuxuryApp.Application`. 
Se prohíbe estrictamente la creación de proyectos `.csproj` satélite para separar capas de negocio. El aislamiento se logra mediante **Carpetas y Namespaces**, no mediante ensamblados.

## 2. Regla Anti-Anidamiento (Estándar 4 Niveles / Máximo 5 Niveles)
Para mantener la cordura, facilitar la navegación en el IDE y evitar namespaces kilométricos, se establece una regla estricta de anidamiento de carpetas:

* **Estándar (4 Niveles):** La inmensa mayoría de los módulos debe usar 4 niveles lógicos.
  `Modules/` (1) -> `[NombreModulo]/` (2) -> `[SubModulo]/` (3) -> `[CarpetasTipo (Entities, DTOs)]/` (4)

* **Excepción (5 Niveles Máximo):** Únicamente permitido en módulos con categorías amplias (ej. Catálogos Generales).
  `Modules/` (1) -> `[NombreModulo]/` (2) -> `[CategoriaSubModulo]/` (3) -> `[SubModuloInterno]/` (4) -> `[CarpetasTipo]/` (5)

Bajo **NINGUNA CIRCUNSTANCIA** se permite un sexto nivel. Está **PROHIBIDO** crear sub-carpetas dentro de las carpetas de tipo (ej. no crear `DTOs/Requests/`, usa nombres descriptivos como `CreateIssueRequestDTO.cs`).

## 3. Estructura Estándar de Carpetas

```text
LuxuryApp.Application/
├── Infrastructure/               ← Configuraciones globales (Program.cs extensions) y Proveedores
├── Shared/                       ← NIVEL 1 (Shared Global Técnico)
│   ├── Utils/                    
│   └── Exceptions/               
└── Modules/
    ├── SharedLuxuryApp/          ← NIVEL 2 (Shared Kernel de Negocio)
    │   ├── Entities/             ← Entidades core que TODO el sistema usa
    │   └── DTOs/                 
    │
    └── [NombreModulo]/           ← MÓDULO DE NEGOCIO (Ej. ProjectManagement)
        ├── Shared/               ← NIVEL 3 (Shared Intra-Módulo)
        │   └── Enums/            
        │
        └── [SubModulo]/          ← CORTE VERTICAL PURO (Ej. Issues)
            ├── Entities/         
            ├── Enums/            
            ├── DTOs/             
            ├── Services/         
            ├── Mappings/         
            ├── Persistence/      ← Configuraciones EF Core (Fluent API)
            └── EndPoints/        
```

## 4. Reglas de Dependencia y Compartición (Tránsito)

Para evitar el "Código Espagueti", el aislamiento debe respetarse. Cuando dos piezas de código necesitan interactuar, se aplican las reglas de las **3 Fronteras Shared**:

1. **Aislamiento Vertical (Sub-Módulos):** Un Sub-módulo (ej. `Issues`) **NUNCA** debe instanciar ni hacer `using` de otro Sub-módulo (ej. `Sprints`). Son islas.
2. **Nivel 3 (Shared Intra-Módulo):** Si `Issues` y `Sprints` necesitan la misma entidad/enum, se extrae a `Modules/[NombreModulo]/Shared/`.
3. **Aislamiento de Módulos (Amnesia):** El módulo `ProjectManagement` tiene PROHIBIDO hacer un `using` directo al módulo `RecursosHumanosLuxuryApp`. 
4. **Nivel 2 (Shared Kernel):** Si un módulo necesita leer datos originados en otro módulo (ej. `Employee`), esa entidad debe promoverse a `Modules/SharedLuxuryApp/`. Todos los módulos tienen permiso de lectura aquí.
5. **Nivel 1 (Shared Global):** Herramientas genéricas (extensiones, paginación, constantes de sistema). Todos pueden leer de `LuxuryApp.Application/Shared/`.
