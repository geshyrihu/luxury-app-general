# Informe del Módulo Cobranza Online

**Ruta:** `client/angular/src/app/apps/cobranza.luxuryapp/cobranza-online`  
**Fecha:** 2026-08-06

---

## 1. Visión General

El módulo **Cobranza Online** es una aplicación standalone de Angular (v20+) diseñada para la gestión y análisis de cobranza de condominios. Utiliza **señales (signals)** para reactividad, **OnPush** change detection, y carga perezosa (lazy loading) para cada reporte.

### 1.1 Arquitectura de Rutas

El módulo expone **9 reportes/vistas consolidadas** accesibles mediante rutas hijas bajo `/cobranza-online`:

| Ruta | Componente | Título | Descripción Breve |
|------|-----------|--------|-------------------|
| `""` | `CobranzaOnlineResumen` | Dashboard | Resumen ejecutivo con métricas puras de recaudación mensual (001 y 003). |
| `"analysis"` | `CobranzaOnlineAnalysis` | Análisis de Cobranza | Layout superior con tablas de análisis mensual, deuda EF y gráfico de dona. |
| `"detalle-condominos"` | `CobranzaOnlineDetalleCondominos`| Detalle por Condómino | Listado detallado de toda la cartera agrupada y ordenada por clasificación. |
| `"otros-cargos"` | `CobranzaOnlineOtrosCargos` | Otros Cargos | Cargos, abonos y saldos pendientes de conceptos distintos a Mtto (001) y Extra (003). |
| `"movimientos"` | `CobranzaOnlineMovimientos` | Movimientos del Mes | Tabla unificada de cargos (+) y abonos (-) aplicados por concepto en el mes. |
| `"advances"` | `CobranzaOnlineAdvances` | Adelantos | Listado de departamentos con saldo a favor, con desglose de Mtto (001) y Extra (003). |
| `"towers"` | `CobranzaOnlineTowers` | Resumen por Torres | Agregados por torre (saldos, conteos). |
| `"exclusions"` | `CobranzaOnlineExclusions` | Exclusiones | Gestión de cuentas omitidas del universo de cobranza. |
| `"inspection"` | `CobranzaOnlineInspection` | Listado Base (Inspección) | Historial histórico y buscador de pólizas contables (401 vs 104). |

### 1.2 Estado Compartido (Filter State)

Archivo: `state/cobranza-online-filter.state.ts`

```typescript
// Señales globales de filtro compartidas por la mayoría de reportes
export const cobranzaOnlineFilterState = {
  year: signal(new Date().getFullYear()),
  month: signal(new Date().getMonth() + 1),
  day: signal(new Date().getDate()),
};
```

---

## 2. Detalle de Cada Reporte

---

### 2.1 Dashboard (Resumen) (`/`)

**Archivos:** `resumen/cobranza-online-resumen.ts`, `resumen/cobranza-online-resumen.html`

**Enfoque Actual:** Vista ejecutiva puramente orientada a lo que se debe cobrar **en el mes consultado** por conceptos base (001 y 003).
Se han eliminado las tablas complejas y los ingresos adicionales de esta vista para evitar contaminación visual.

**Composición Visual:**
- **Mantenimiento Neto del Mes:** Total a recaudar, Abonado, Faltante por cobrar + Gráfico de Pie (Cobrado vs Pendiente).
- **Cuotas Extraordinarias del Mes:** (Si aplica) Igual estructura que mantenimiento.
- **Cuota Mensual Total:** Suma de 001 + 003 a recaudar.

---

### 2.2 Análisis de Cobranza (`/analysis`)

**Archivos:** `analysis/cobranza-online-analysis.ts`, `analysis/cobranza-online-analysis.html`

**Filtro:** `cutoffDateInput` (fecha completa, independiente del estado global).

**Composición Visual (Layout Superior 3 Columnas):**
1. **Columna 1: Análisis de Cobranza Mensual (Tabla)** 
   - Filas: COBRANZA PERFECTA, MOROSOS, DEUDA CORRIENTE, COBRADO / SIN ADEUDO.
2. **Columna 2: Deuda Condóminos EF (Tabla)**
   - Filas: COBRANZA JUDICIAL, MOROSOS, DEUDA CORRIENTE, TOTAL DEUDA, SALDO BALANZA.
3. **Columna 3: Composición de Cobranza (Gráfico de Dona)**
   - Visualiza la distribución de la cartera, forzando la renderización de slices incluso si la cobranza perfecta o el cobrado están en ceros.

---

### 2.3 Detalle por Condómino (`/detalle-condominos`)

**Enfoque:** Reemplaza al antiguo tab "Morosidad" y a la tabla inferior de "Análisis".

**Composición Visual:**
- **Tarjetas Superiores (Chips):** Muestran el número total de condóminos que cayeron en cada clasificación al corte (Judicial, Morosos, Corriente, Sin Adeudo, Anticipos).
- **Tabla:** Muestra a todos los condóminos ordenados dinámicamente **de mayor a menor deuda**. Incluye un `select` para aislar el listado a una sola clasificación.

---

### 2.4 Movimientos del Mes (`/movimientos`)

**Enfoque:** Unifica y reemplaza a los antiguos tabs separados de "Cargos" y "Abonos".

**Composición Visual:**
- **Tabla Pivote Unificada:** Renderiza columnas por cada concepto del catálogo (001, 003, 004...) y una columna de Totales Mensuales.
- **Celdas Visuales:** Cada celda muestra un tag rojo con los cargos (`+`) y un tag verde con los abonos (`-`) si existen, permitiendo auditar la vida contable del condómino en el mes en una sola mirada.

---

### 2.5 Otros Cargos (`/otros-cargos`)

**Enfoque Actual:** Aísla todos los ingresos y cargos (004 al 026) que no son cuotas regulares.

**Composición Visual:**
- **Métricas Top:** Total Cargado, Total Abonado, Pendiente por Cobrar.
- **Tabla:** Lista cada concepto con sus respectivos cargos, abonos y saldo pendiente del mes.

---

### 2.6 Adelantos (`/advances`)

**Composición:** Tabla paginada. Muestra únicamente departamentos con Saldo Final negativo (saldos a favor).
**Columnas Desglosadas:** Se agregó específicamente el desglose de cuánto de ese saldo a favor corresponde a **Mtto (001)** y cuánto a **Extraordinario (003)** (esta última solo se muestra si existen anticipos en el mes). Incluye totales al pie.

---

### 2.7 Exclusiones (`/exclusions`)

**Composición:** Tabla para gestionar qué cuentas Aspel se omiten intencionalmente del cálculo de cobranza (ej. cuentas puente, desarrolladora).

---

### 2.8 Resumen por Torres (`/towers`)

**Composición:** Agrupa los saldos (Mtto, Extra, Multas, Total) por nivel 2 contable (Torre o Bloque). Incluye un footer de totales sumando todas las torres.

---

### 2.9 Listado Base - Inspección (`/inspection`)

**Enfoque:** Muestra una tabla gigante con todos los departamentos y permite hacer click para ver el historial minucioso de **pólizas contables** de la cuenta 104 vs 401. Funciona como la herramienta final de auditoría/cuadre.

---

## 3. Reglas de Negocio Clave (Centralizadas en Backend)

La lógica de clasificación reside en el **backend** (`CobranzaOnlineDashboardAppService.cs`) para garantizar integridad:

1. **Morosidad (MOROSOS):** 
   - Cuenta morosa si tiene **≥ 2 cuotas de MTTO (001)** vencidas.
   - **O** si tiene **≥ 1 cuota Extraordinaria (003)** vencida.
2. **Cobranza Extrajudicial:** 
   - Ingresa si tiene **> 5 cuotas de MTTO (001)** vencidas.
   - **O** si tiene **≥ 5 cuotas Extraordinarias (003)** vencidas.
3. **Deuda Corriente:** 
   - El cargo actual está corriendo pero aún no acumula las cuotas necesarias para ser moroso.
4. **Cobranza Perfecta (Frontend):** 
   - Total a recaudar = Suma de todos los cargos 001 + 003 aplicados en el mes de consulta.
   - Cobrado Efectivo = `Cobranza Perfecta - Morosos - Deuda Corriente`.

---

## 4. Endpoints API Utilizados

| Reporte | Endpoint | Parámetros |
|---------|----------|------------|
| Dashboard (Resumen), Movimientos, Otros Cargos, Torres, Adelantos | `Dashboard.get` | `customerId, year, month, day` |
| Análisis, Detalle Condóminos | `Dashboard.analysis` | `customerId, year, month, day` |
| Inspección | `Dashboard.inspection` | `customerId, year, month` |
| Exclusiones | `Dashboard.excludedAccounts` | `customerId, year` |

---

## 5. Limpieza Realizada (Código Muerto Eliminado)

Los siguientes componentes y sus endpoints fueron **borrados del frontend** al consolidar su funcionalidad:
- `/reporte-financiero` (Reubicado conceptualmente al módulo Contabilidad Online).
- `/debtors` (Consolidado funcionalmente en el nuevo Detalle Condóminos).
- `/department-charges` y `/department-payments` (Fusionados y unificados en el nuevo Movimientos del Mes).

*(Para evitar romper deeplinks existentes, se mantuvieron redirecciones ocultas en el router principal de Cobranza).*