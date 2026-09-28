# Guía de Composición UI/UX (Alineación y Formularios)

**Última revisión:** 2026-08-17
**Propósito:** Establecer reglas estrictas de composición visual, espaciado y uso de componentes en `shared/ui` para erradicar las interfaces rotas, formularios desalineados y márgenes improvisados generados por desarrolladores y agentes de IA.

---

## 1. El Problema (Anti-patrones actuales)

Actualmente, el principal problema visual en la aplicación no es la falta de componentes, sino **su mala composición**. Las desalineaciones ocurren frecuentemente por:
- ❌ Uso de márgenes improvisados (`mt-2`, `margin-top: 15px`, `pb-3`) para separar campos.
- ❌ Toggles (switches) y checkboxes flotando sin alineación vertical con su etiqueta.
- ❌ Inputs de distinto tamaño que rompen la armonía visual de la cuadrícula.
- ❌ Falta de jerarquía en botones (múltiples botones primarios en la misma vista).

## 2. Regla de Oro: Layouts Basados en Grid y Flexbox (Cero Márgenes Mágicos)

Para alinear formularios y vistas de datos, **está estrictamente prohibido usar márgenes individuales** en los controles para separarlos.

✅ **Obligatorio:** Todo formulario debe vivir dentro de un contenedor Grid o Flex con un `gap` dictado por nuestros Design Tokens.

### Formulario a 1, 2 o 3 columnas (Grid)
```html
<!-- ✅ CORRECTO: Uso de grid layout con gap controlado por tokens -->
<form class="app-form-grid">
  <!-- El CSS de .app-form-grid usa: display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--ds-space-lg); -->
  
  <custom-input-text-signal label="Banco" formControlName="banco"></custom-input-text-signal>
  <custom-input-text-signal label="Cuenta bancaria" formControlName="cuenta"></custom-input-text-signal>
</form>
```

## 3. Composición de Toggles, Checkboxes y Elementos Inline

El mayor causante de formularios visualmente rotos es intentar tratar un Toggle o Checkbox como si fuera un Input de texto estándar apilado.

✅ **Regla:** Los Toggles y Checkboxes **nunca** deben llevar un `<label>` encima de ellos rompiendo la cuadrícula. Deben alinearse horizontalmente y centrados verticalmente con su texto usando Flexbox.

```html
<!-- ❌ INCORRECTO: Label suelto y toggle flotando debajo -->
<div>
  <label>Medicación controlada</label>
  <custom-toggle></custom-toggle>
</div>

<!-- ✅ CORRECTO: Flexbox inline center -->
<div class="flex items-center gap-md">
  <custom-toggle-signal formControlName="hasMedication"></custom-toggle-signal>
  <span class="text-ds-body text-ds-neutral-900">Medicación controlada</span>
</div>
```

*Nota: Si el Toggle habilita un Input adyacente (ej: "Detalle de medicación"), deben ir en la misma fila del Grid para mantener contexto semántico.*

## 4. ¿Qué componente usar y cuándo?

La decisión de qué componente usar en `shared/ui` obedece a las siguientes reglas inmutables:

### Formularios e Inputs
- **Input Texto Normal:** `custom-input-text-signal`. Úsalo para datos cortos.
- **Select/Dropdown:** `custom-input-select-signal`. **OBLIGATORIO** para diccionarios y enums.
- **Fechas:** `custom-input-date-signal`.
- **Búsquedas complejas:** Autocompletes solo si la lista supera los 50 elementos.

### Botones y Jerarquía de Acción
Toda pantalla o modal debe tener **un solo botón primario**.
- **Acción Principal (Guardar, Enviar):** `il-button-primary` (Web) / `ili-button-primary` (Mobile). Siempre alineado a la derecha en modales.
- **Acción Secundaria (Cancelar, Atrás):** `il-button-secondary`. Nunca debe competir visualmente con el primario (suele ser outline o ghost).
- **Acción Destructiva (Eliminar):** `il-button-danger`.
- **Botón Icono (Acciones en tablas):** `<iw-button-icon icon="material-symbols-light:edit">`. OBLIGATORIO añadir `aria-label`.

## 5. Alineación y Espaciados Críticos (Design Tokens)

Si tienes que escribir `16px`, `24px` o clases de utilidad genéricas como `mt-3` en un formulario, **estás rompiendo las reglas**.

- **Separación de secciones en un formulario:** `var(--ds-space-xl)`
- **Separación entre inputs (gap):** `var(--ds-space-lg)`
- **Separación entre un icono y su texto:** `var(--ds-space-sm)`
- **Padding interno de Cards o Modales:** `var(--ds-space-xl)`

## 6. Check-list de Validación para Agentes y Desarrolladores

Antes de dar por terminado un componente UI, el desarrollador o agente debe validar lo siguiente:
1. [ ] ¿Eliminé todos los márgenes sueltos (ej. `margin-top`) y usé `gap` en el contenedor Grid/Flex?
2. [ ] ¿Los toggles y checkboxes están centrados verticalmente (`align-items: center`) con su respectiva etiqueta?
3. [ ] ¿Hay un solo botón primario que guíe la acción del usuario en la pantalla/modal?
4. [ ] ¿Usé exclusivamente wrappers de `shared/ui` (ej. `custom-input-*-signal`) en lugar de etiquetas HTML nativas?
5. [ ] ¿Usé `var(--ds-*)` para dictar los espacios en lugar de valores fijos en píxeles?
