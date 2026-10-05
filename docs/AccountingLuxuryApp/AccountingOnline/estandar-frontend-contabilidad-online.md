# 🎨 Estándar de Diseño Frontend: Reportes Contables

Este documento estandariza la estructura de los reportes listados en esta carpeta (`contabilidad-online`), garantizando que se alineen visual y funcionalmente al **Design System de LuxuryApp** (definido en `catalog-component-ui.html` y `GEMINI.md`).

> [!IMPORTANT]
> Todo nuevo componente de reporte o modificación debe respetar estrictamente estas directrices. No se permite el uso de estilos inline ad-hoc que rompan la paleta.

---

## 📱 1. Tecnologías y Componentes Base

- **Angular Signals:** Obligatorio para el manejo de estado reactivo. Uso de `signal()`, `computed()` y `effect()`. (Prohibido `@Input()` y `@Output()` clásicos).
- **Tabla (catálogo `@ui/web/table`):** Todas las tablas de datos financieros deben usar `<app-table>` (componente propio del catálogo, ver `@ui/web/table/table`) con las clases base del Design System.
- **Flexbox y Spacing:** Utilizar exclusivamente las clases de utilidad de Bootstrap 5 (ej. `d-flex`, `gap-2`, `mb-3`, `p-4`).

---

## 📐 2. Patrón de Layout de los Reportes

Cada reporte debe encapsularse visualmente dentro de tarjetas usando la clase `.rf-card`.

### 2.1 Encabezado (Header)
```html
<div class="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
  <div>
    <div class="text-lg font-semibold">Título del Reporte</div>
    <div class="text-color-secondary text-sm">
      Descripción o instrucción breve de auditoría.
    </div>
  </div>
  <!-- Controles (Filtros, Selects): usar el componente de select del catálogo @ui/* vigente -->
</div>
```

### 2.2 Configuración de Tablas (Data Tables)
- **Cuentas y Conceptos:** Mostrarse en tipografía monoespaciada o sutilmente distinta (`font-mono text-xs text-500`).
- **Alineación:** Las columnas que representan montos de dinero **siempre** deben alinearse a la derecha (`text-right`).
- **Anchos Fijos:** Para prevenir que la tabla "brinque" al cambiar los datos o filtros, los montos financieros deben tener un ancho estricto.
  ```html
  <td class="text-right" style="width: 140px; min-width: 140px;">...</td>
  ```
- **Formateo de Moneda:** Utilizar siempre el pipe `accountingNumber`.
- **Saldos Negativos:** Aplicar dinámicamente la clase de alerta `[class.rf-neg]="saldo < 0"` a la celda (`<td>`) para pintar el texto en rojo premium.
- **Totales (Filas de suma):** Usar siempre la clase `.rf-row-total` en el `<tr>`. El fondo es `var(--ds-document-neutral)` (gris neutro documental) con texto blanco `var(--rf-total-ink)`. Esta variable se adapta automáticamente a modo oscuro.
- **Gran Total / Resultado Final:** Usar `.rf-row-result` para la fila de resultado final: fondo `#111827` (casi negro) y texto blanco. Crea la jerarquía visual: item (blanco) → sección (azul suave) → total (gris neutro) → resultado (negro).

---

## 🔍 3. Indicadores y UX Patterns

Cuando un reporte (como el de Análisis de Cobranza) requiera mostrar el estatus de morosidad o la categoría de un condómino:

1. **Uso de Badges:** Implementar `<app-status-badge [status]="condomino.status" />` referenciado en el catálogo.
2. **Jerarquía Visual:** No sature la vista. Los nombres de los condóminos pueden ir en negrita (`font-bold`) y agrupar el número de cuenta arriba en texto secundario, evitando así múltiples columnas innecesarias.

> [!TIP]
> **Checklist Visual Rápido:**
> - ¿Las cantidades de dinero están a la derecha?
> - ¿Se agruparon correctamente las columnas relacionadas en una sola celda (ej. ID + Nombre)?
> - ¿El footer del total destaca visualmente?
> - ¿Se implementó una vista móvil (`app-data-view-mobile`) si el reporte se consumirá en teléfonos?
