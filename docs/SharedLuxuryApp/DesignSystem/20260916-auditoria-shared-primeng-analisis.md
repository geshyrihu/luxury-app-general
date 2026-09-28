# Reporte de Análisis - PrimeNG / PrimeIcons / PrimeFlex
## Proyecto: luxuryapp-api/appsweb/angular

### 1. Resumen Ejecutivo
- **Total de archivos analizados**: ~4,109 archivos bajo `src/`
- **Archivos `.ts`**: 3,205 con imports de PrimeNG
- **Archivos `.html`**: 885 conteniendo selectores de PrimeNG
- **Archivos `.scss`**: 64 con estilos de PrimeNG/PrimeFlex
- **Total de hallazgos PrimeNG**: ~2,500+ ocurrencias combinadas
- **Total de hallazgos PrimeIcons**: 6 iconos únicos, < 50 líneas HTML
- **Total de hallazgos PrimeFlex**: 80 clases únicas, ~5,000+ usos en HTML

### 2. Estructura del Proyecto Analizado
```
src/
├── app/
│   ├── shared/
│   │   └── ui/
│   │       └── web/
│   │           └── primeng-*/           # 45 directorios wrapper
│   │               ├── primeng-api/
│   │               ├── primeng-button/
│   │               ├── primeng-table/
│   │               ├── primeng-dialog/
│   │               └── ... (39 más)
├── styles/
│   ├── web/
│   │   ├── _prime-*.scss              # 9 archivos override
│   │   ├── _prime-tokens.scss
│   │   └── _prime-button.scss
└── environments/
└── stories/
└── test-shims/
```

### 3. Hallazgos PrimeNG

#### 3.1 Componentes utilizados (en templates HTML)
| Componente | Selector | Ocurrencias | Archivos únicos |
|------------|----------|-------------|----------------|
| `p-table` | `<p-table>` | 833 | 45 |
| `p-sorticon` | `<p-sorticon>` | 734 | 178 |
| `p-button` | `<p-button>` | 105 | 35 |
| `p-dialog` | `<p-dialog>` | 18 | 2 |
| `p-skeleton` | `<p-skeleton>` | 17 | 8 |
| `p-select` | `<p-select>` | 12 | 5 |
| `p-datepicker` | `<p-datepicker>` | 8 | 4 |
| `p-inputtext` | `<p-inputtext>` | 7 | 4 |
| `p-dropdown` | `<p-dropdown>` | 6 | 3 |
| `p-checkbox` | `<p-checkbox>` | 5 | 3 |

#### 3.2 Directivas
| Directiva | Ocurrencias | Archivos únicos |
|-----------|-------------|----------------|
| `pSortableColumn` | 678 | 178 |
| `pFrozenColumn` | 71 | 25 |
| `pInputText` | 25 | 8 |
| `pReorderableRowHandle` | 9 | 5 |
| `pTemplate` | 8 | 3 |

#### 3.3 Módulos importados (Top 10)
| Módulo | Archivos |
|---------|---------|
| `ButtonModule` | 37 |
| `InputTextModule` | 13 |
| `DialogModule` | 8 |
| `TableModule` | 8 |
| `SelectModule` | 7 |
| `InputGroupModule` | 5 |
| `InputGroupAddonModule` | 5 |
| `TagModule` | 4 |
| `IconFieldModule` | 4 |
| `CheckboxModule` | 4 |

#### 3.4 Servicios
| Servicio | Usos |
|----------|------|
| `ConfirmationService` | 25+ archivos |
| `DialogService` | 72+ archivos |
| `MessageService` | 80+ archivos (producción y tests) |

#### 3.5 Re-export Wrappers (45 directorios)
El proyecto utiliza una capa de abstracción con 45 componentes wrapper:
- `primeng-table`: 350 imports, 833 usos HTML
- `primeng-button`: 24 imports
- `primeng-inputtext`: 20 imports
- `primeng-dialog`: 4 imports
- Otros: 1-3 imports cada uno

### 4. Hallazgos PrimeIcons

#### 4.1 Iconos utilizados en templates HTML
**Hallazgo clave:** PrimeIcons está **prácticamente migrado a Iconify**

| Icono | Veces usado |
|--------|-------------|
| `pi` (clase base) | 12 |
| `pi-spin` | 5 |
| `pi-spinner` | 1 |

**Archivos con iconos PrimeIcons:**
- `core/layout/unauthorized.html`: 2 usos
- `core/layout/page500.html`: 4 usos
- `core/layout/page404.html`: 4 usos
- `shared/ui/web/agenda-semanal-card/agenda-semanal-card.html`: 1 uso

#### 4.2 Sistema de iconos alternativo (Iconify)
- **2,337 referencias** usando `material-symbols-light`
- Componente wrapper: `<app-icon>` (shared/utils/icon-mapping.ts)
- Mapeo personalizado: PrimeIcons → Iconify

### 5. Hallazgos PrimeFlex

#### 5.1 Clases de Flexbox (Top 10)
| Clase | Ocurrencias |
|--------|-------------|
| `d-flex` | 3,536 |
| `flex-column` | 853 |
| `flex-shrink-0` | 326 |
| `flex-wrap` | 252 |
| `flex-fill` | 175 |
| `flex-grow-1` | 123 |
| `flex-row` | 3 |
| `justify-content-between` | 590 |
| `justify-content-center` | 586 |
| `justify-content-end` | 198 |

#### 5.2 Clases de Grid
| Clase | Ocurrencias |
|--------|-------------|
| `col-12` | 1,638 |
| `col-md-6` | 488 |
| `col-md-4` | 274 |
| `col-lg-3` | 119 |
| `col-sm-6` | 107 |
| `col-5` | 130 |
| `col-6` | 116 |
| `grid` | 41 |
| `row` | Presente (integrado) |
| `col-offset-*` | 0 (no usado) |

#### 5.3 Clases de Spacing
| Clase | Ocurrencias |
|--------|-------------|
| `gap-2` | 364 |
| `gap-3` | 201 |
| `gap-1` | 112 |
| `gap-4` | 36 |
| `p-3` | 387 |
| `p-2` | 155 |
| `p-4` | 141 |
| `py-*` | 404 |
| `m-0` | 335 |
| `m-*` | 1,117 |

#### 5.4 Clases de Tipografía
| Clase | Ocurrencias |
|--------|-------------|
| `text-body-secondary` | 1,331 |
| `text-sm` | 688 |
| `text-uppercase` | 321 |
| `text-primary` | 286 |
| `font-mono` | 78 |
| `font-semibold` | 14 |
| `text-xs` | 423 |
| `text-center` | 395 |
| `text-xl` | 153 |
| `text-lg` | 138 |

### 6. Estadísticas y Métricas

#### 6.1 Top 10 componentes PrimeNG más usados
| # | Componente | Ocurrencias |
|---|------------|-------------|
| 1 | `<p-sorticon>` | 734 |
| 2 | `<p-table>` | 833 |
| 3 | `<p-button>` | 105 |
| 4 | `<p-dialog>` | 18 |
| 5 | `<p-skeleton>` | 17 |
| 6 | `<p-datepicker>` | 8 |
| 7 | `<p-inputtext>` | 7 |
| 8 | `<p-dropdown>` | 6 |
| 9 | `<p-checkbox>` | 5 |
| 10 | `<p-select>` | 12 |

#### 6.2 Distribución por tipo de archivo
| Tipo | Hallazgos |
|-------|------------|
| `.ts` | 434 imports, 65+ módulos, 3 servicios globales |
| `.html` | 1,095 selectores, 678 directivas, ~25,000 clases utility |
| `.scss` | 201 referencias a clases PrimeNG, 9 archivos override dedicados |
| `.json` | 3 dependencias (primeng, primeflex, primeicons) |

### 7. Archivos Afectados

#### 7.1 Archivos TS con imports PrimeNG (producción)
| Sub-paquete | Cantidad |
|-------------|---------|
| `primeng/dynamicdialog` | 10+ |
| `primeng/api` | 15+ |
| `primeng/button` | 35+ |
| `primeng/inputtext` | 12 |
| `primeng/table` | 7 |
| `primeng/dialog` | 7 |
| `primeng/select` | 6 |

#### 7.2 Archivos HTML con componentes PrimeNG
| Módulo | Archivos |
|---------|---------|
| `operations.luxuryapp` | ~40+ |
| `accounting.luxuryapp` | ~30+ |
| `maintenance.luxuryapp` | ~25+ |
| `recruitment.luxuryapp` | ~15+ |
| `collections.luxuryapp` | ~12+ |
| `admin.luxuryapp` | ~15+ |
| `human-resources.luxuryapp` | ~12+ |
| `supplier.luxuryapp` | ~8+ |
| `resident.luxuryapp` | ~5+ |
| `shared/ui/web` | ~10+ |
| `core/layout` | ~5+ |

### 8. Observaciones y Recomendaciones

#### 8.1 Dependencias detectadas en package.json
| Paquete | Versión | Estado |
|----------|--------|--------|
| `primeng` | `22.1.1` | Activo |
| `primeflex` | `^4.0.0` | Instalado pero **no cargado explícitamente** |
| `primeicons` | `8.0.1` | Cargado en angular.json, **migrado a Iconify** |
| `@primeuix/themes` | `3.0.0` | Activo (LuxuryPreset) |
| `@primeuix/utils` | `^0.8.2` | Activo |

#### 8.2 Observaciones críticas
1. **PrimeFlex fantasma**: PrimeFlex `^4.0.0` está en `package.json` pero no se carga como CSS. Las utilidades son proporcionadas por Bootstrap 5.3.8.
2. **PrimeIcons migrado**: Solo 6 iconos únicos, < 50 líneas con clases `pi`. El proyecto usa predominantemente Iconify (2,337 referencias).
3. **Dominancia de `<p-sorticon>` + `pSortableColumn`**: 1,357 ocurrencias combinadas en 178 archivos. Patrón repetitivo → posible candidato a abstracción.
4. **45 wrappers `primeng-*`**: Capa de abstracción bien estructurada. Facilita migración futura.
5. **Dualidad de temas**: Dos `mypreset.ts` (Lara y Aura) pero solo Aura (`LuxuryPreset`) está activo.
6. **Uso extensivo de Bootstrap**: Bootstrap 5.3.8 provee la mayoría de utilidades de layout, superponiéndose a PrimeFlex.

#### 8.3 Sugerencias para migración o refactorización
| Prioridad | Acción | Impacto |
|-----------|--------|---------|
| **Alta** | Evaluar eliminación de `primeflex` si Bootstrap cubre todas las utility classes | Reducción de bundle |
| **Alta** | Completar migración PrimeIcons → Iconify (quedan 8 archivos) | Consistencia de iconos |
| **Media** | Crear wrapper para `<p-sorticon>` + `pSortableColumn` (patrón repetido 678 veces) | Menos duplicación |
| **Media** | Reconciliar los dos `mypreset.ts` (eliminar legacy Lara-based) | Claridad |
| **Media** | Auditar `!important` en SCSS overrides para verificar si siguen siendo necesarios | Mantenibilidad |
| **Baja** | Evaluar si los 45 wrappers `primeng-*` todos son necesarios o si algunos son vacíos | Limpieza |
| **Baja** | Migrar `<p-dialog>` directo (2 usos) al wrapper `LxDialogService` | Consistencia |

### 9. Anexos

#### 9.1 Comandos útiles para futuras auditorías
```bash
# Contar imports PrimeNG en TypeScript
rg "from 'primeng/" --type ts src/ | wc -l

# Listar todos los sub-paquetes usados
rg "from 'primeng/(\w+)" --type ts src/ -o --replace '$1' | sort -u

# Contar selectores <p-*> en HTML
rg "<p-\w+" --type html src/ | wc -l

# Buscar clases pi-* residuales
rg "class=.*\mpi[\s-]" --type html src/

# Contar clases de layout flex
rg "d-flex" --type html src/ | wc -l

# Verificar que primeflex no se carga
rg "primeflex" angular.json

# Buscar !important en overrides PrimeNG
rg "!important" src/styles/web/_prime-*.scss
```

*Reporte actualizado el 2026-09-16. Angular 22.1.6 / PrimeNG 22.1.1 / PrimeFlex ^4.0.0 / PrimeIcons 8.0.1*

**📁 Archivo generado:** `reporte-primeng-analisis-2026-09-16.md`