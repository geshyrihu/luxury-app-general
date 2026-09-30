# Accessibility (A11Y) Rules for Web & Mobile

**Última revisión:** 2026-08-06  
**Derivado de:** CONVENTIONS.md §5 (UI Rules) + exploración codebase  
**Severidad:** 🟡 MEDIA — Obligatorio en UI sensible y renovaciones

---

## Propósito


---

## Regla de Oro

```
Accesibilidad = WCAG 2.1 Level AA mínimo

❌ NO: Ignorar screen readers, focus invisible, contraste bajo
✅ SÍ: aria-label, focus visible, contraste 4.5:1 texto, 3:1 gráficos
```

---

## 1. ARIA Labels (Screen Reader Support)

### Icon-Only Buttons (Obligatorio)

**Ubicación real:** Encontrado en múltiples componentes (`shared/ui/buttons/`)

```html
<!-- ✅ CORRECTO: aria-label en botones solo icono -->
<button aria-label="Cerrar diálogo" class="close-btn">
  <app-icon icon="mdi:close" />
</button>

<button aria-label="Editar registro" class="edit-btn">
  <app-icon icon="mdi:pencil" />
</button>

<button aria-label="Descargar PDF" class="download-btn">
  <app-icon icon="mdi:download" />
</button>

<!-- ❌ INCORRECTO: Sin aria-label, inaccesible para screen readers -->
<button class="close-btn">
  <app-icon icon="mdi:close" />
</button>
```

### Botones con Texto Visible

```html
<!-- ✅ CORRECTO: Texto visible, sin aria-label necesario -->
<button>Guardar</button>

<!-- ✅ TAMBIÉN CORRECTO: Redundancia para énfasis (opcional) -->
<button aria-label="Guardar formulario">
  <app-icon icon="mdi:check" /> Guardar
</button>
```

### Elementos Complejos

```html
<!-- ✅ CORRECTO: aria-label para secciones -->
<div aria-label="Panel de filtros">
  <input type="checkbox" id="filter-active" />
  <label for="filter-active">Activo</label>
</div>

<!-- ✅ CORRECTO: aria-describedby para descripción adicional -->
<input type="password" aria-describedby="pwd-hint" />
<small id="pwd-hint">Mínimo 8 caracteres, 1 mayúscula</small>

<!-- ✅ CORRECTO: aria-live para actualizaciones dinámicas -->
<div aria-live="polite" aria-label="Errores de validación">
  <span *ngIf="form.invalid">Por favor completa todos los campos</span>
</div>
```

---

## 2. Focus Management

### Focus Visible (Obligatorio)

```css
/* ✅ CORRECTO: Focus visible en todos los elementos interactivos */
button:focus,
input:focus,
[tabindex]:focus {
  outline: 2px solid var(--ds-primary-500);
  outline-offset: 2px;
}

/* ❌ INCORRECTO: Remover outline sin reemplazo */
button:focus {
  outline: none; /* NUNCA sin alternativa */
}
```

### Orden de Tabulación

```html
<!-- ✅ CORRECTO: Orden lógico de tabs (izquierda → derecha, arriba → abajo) -->
<input placeholder="Nombre" />
<input placeholder="Apellido" />
<input placeholder="Email" />
<button>Guardar</button>

<!-- ✅ CORRECTO: tabindex solo si necesario reordenar -->
<button tabindex="1">Submit</button>
<input tabindex="2" placeholder="Nombre" />
<!-- NOTA: Evitar tabindex > 0, puede confundir screen readers -->

<!-- ❌ INCORRECTO: Orden visual ≠ orden DOM -->
<button style="position: absolute; left: 0;">Submit</button>
<input placeholder="Nombre" style="position: absolute; left: 200px;" />
<!-- Usuario vería Nombre primero, pero tabindex va a Submit -->
```

### Skip Navigation (Recomendado para grandes layouts)

```html
<!-- ✅ CORRECTO: Skip link oculto, visible al tab -->
<a href="#main-content" class="skip-link">
  Ir al contenido principal
</a>

<style>
  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--ds-primary-500);
    color: white;
    padding: 8px;
    text-decoration: none;
  }
  
  .skip-link:focus {
    top: 0; /* Visible al tabbing */
  }
</style>

<main id="main-content">
  <!-- Contenido principal aquí -->
</main>
```

---

## 3. Color Contrast

### WCAG 2.1 AA Mínimos

```
Texto sobre fondo: 4.5:1
Gráficos/iconos: 3:1
Texto grande (18pt+): 3:1
```

### Validación CSS

```typescript
// Verificar contraste en tiempo de compilación
// Usar herramienta: WebAIM Contrast Checker (https://webaim.org/resources/contrastchecker/)

// ✅ CORRECTO: Contraste suficiente
// Texto #1F2937 sobre fondo #FFFFFF = 17.86:1 (AAA)

// ❌ INCORRECTO: Contraste insuficiente
// Texto #999999 sobre fondo #FFFFFF = 3.1:1 (Falla)
```

### En Templates

```html
<!-- ✅ CORRECTO: Usar tokens CSS con contraste validado -->
<button style="color: var(--ds-text-primary); background: var(--ds-bg-primary);">
  Click
</button>

<!-- ❌ INCORRECTO: Hardcoding de colores sin validación -->
<button style="color: #666; background: #f0f0f0;">
  Click
</button>
```

---

## 4. Semantic HTML

### Usar Elementos Correctos

```html
<!-- ✅ CORRECTO: Elementos semánticos -->
<button>Submit</button>
<a href="/about">Acerca de</a>
<h1>Título Principal</h1>
<nav> ... </nav>
<main> ... </main>
<section> ... </section>
<form> ... </form>

<!-- ❌ INCORRECTO: Div/span con rol simulado -->
<div role="button">Submit</div>
<div role="link">Acerca de</div>
<div role="heading" aria-level="1">Título Principal</div>
```

### Labels Explícitos para Inputs

```html
<!-- ✅ CORRECTO: label vinculado a input -->
<label for="email-input">Email:</label>
<input id="email-input" type="email" />

<!-- ✅ TAMBIÉN CORRECTO: label envuelve input -->
<label>
  Email:
  <input type="email" />
</label>

<!-- ❌ INCORRECTO: Sin label o placeholder solo -->
<input type="email" placeholder="Email" />
```

---

## 5. Mobile Touch Targets (48x48px mínimo)

### Tamaño de Botones

```html
<!-- ✅ CORRECTO: 48x48px mínimo para touch -->
<button style="width: 48px; height: 48px; padding: 12px;">
  <app-icon icon="mdi:plus" />
</button>

<!-- ✅ TAMBIÉN CORRECTO: Padding interno para área tacto -->
<button style="padding: 12px 16px;">
  Agregar
</button>
<!-- Calcula: padding 12+12 (vertical) = 24px min, + texto ~24px = 48px -->

<!-- ❌ INCORRECTO: Botón muy pequeño para touch -->
<button style="padding: 2px 4px; font-size: 8px;">
  ×
</button>
```

### Espaciado Entre Elementos

```html
<!-- ✅ CORRECTO: Espaciado suficiente entre botones -->
<div style="display: flex; gap: 12px;">
  <button>Cancelar</button>
  <button>Guardar</button>
</div>

<!-- ❌ INCORRECTO: Botones pegados -->
<div>
  <button style="margin-right: 2px;">Cancelar</button>
  <button>Guardar</button>
</div>
```

---

## 6. Keyboard Navigation

### Soporte de Teclas Comunes

```typescript
// ✅ CORRECTO: Permitir navegación con teclado
@Component({
  template: `
    <input 
      #searchInput
      (keydown.enter)="search()"
      (keydown.escape)="clear()" />
  `
})
export class SearchComponent {
  @ViewChild('searchInput') searchInput!: ElementRef;
  
  search(): void {
    // Handle search
  }
  
  clear(): void {
    this.searchInput.nativeElement.value = '';
  }
}
```

### Menús Accesibles

```html
<!-- ✅ CORRECTO: Menú con keyboard navigation -->
<button 
  [attr.aria-haspopup]="true"
  [attr.aria-expanded]="menuOpen()"
  (keydown.escape)="menuOpen.set(false)">
  Opciones
</button>

<ul *ngIf="menuOpen()" role="menu">
  <li role="menuitem" (click)="action1()" (keydown.enter)="action1()">
    Opción 1
  </li>
  <li role="menuitem" (click)="action2()" (keydown.enter)="action2()">
    Opción 2
  </li>
</ul>
```

---

## 7. Verificaciones de Auditoría

### Checklist de Accesibilidad

- [ ] ¿Botones icon-only tienen `aria-label`?
- [ ] ¿Focus outline visible en todos los elementos interactivos?
- [ ] ¿Orden de tabulación es lógico (DOM order)?
- [ ] ¿Contraste texto/fondo ≥ 4.5:1 (o 3:1 si texto grande)?
- [ ] ¿Inputs tienen `<label>` vinculada?
- [ ] ¿Botones táctiles ≥ 48x48px?
- [ ] ¿Sin elementos `outline: none` sin alternativa?
- [ ] ¿Elementos dinámicos tienen `aria-live`?
- [ ] ¿Formularios tienen validación accesible (mensajes ARIA)?
- [ ] ¿Imágenes tienen `alt` (o `aria-hidden` si decorativas)?

### Herramientas de Validación

```bash
# Axe DevTools (Browser Extension)
# Lighthouse (Chrome DevTools)
# WAVE Browser Extension
# WebAIM Contrast Checker

# CLI: pa11y
npm install -g pa11y
pa11y http://localhost:4200
```

### Comandos de Validación

```bash
# Buscar botones sin aria-label
grep -r "<button>" appsweb/angular/src/app --include="*.html" | \
  grep -v "aria-label" | grep -v ">.*<" # Permitir texto dentro

# Validar inputs sin labels
grep -r "<input" appsweb/angular/src/app --include="*.html" | \
  grep -v "aria-label" | grep -v "<label"

# Buscar outline: none sin alternativa
grep -r "outline: none" appsweb/angular/src/app --include="*.css" --include="*.scss"

# Verificar contraste en archivos SCSS (búsqueda manual)
grep -r "color.*#" appsweb/angular/src/app/shared/styles --include="*.scss"
```

---

## 8. Anti-patrones

| ❌ Incorrecto | ✅ Correcto | Razón |
|---|---|---|
| Botón sin aria-label si solo icono | aria-label obligatorio | Screen readers necesitan descripción |
| Remover outline sin alternativa | Mantener outline o `outline: 2px solid` | Usuarios keyboard necesitan ver foco |
| Contraste < 4.5:1 en texto | Validar contraste antes de push | WCAG AA mínimo |
| Inputs sin label | label explícito vinculado | Screen readers necesitan asociación |
| Botones táctiles < 48px | Mínimo 48x48px en mobile | Dificultad táctil para usuarios |
| Órdenes de tabulación confusas | DOM order = visual order | Keyboard users esperan orden lógico |
| Imágenes sin alt | alt="" si decorativa, alt="desc" si información | Screen readers no pueden interpretar |
| Colores solo para significado | Usar colores + iconos + texto | Usuarios daltónicos no ven diferencia |

---

## 9. Referencias y Documentos Relacionados

- [CONVENTIONS.md §5 — UI Rules](../CONVENTIONS.md#5-ui-rules)
- [ui-desktop-rules.md](./ui-desktop-rules.md) — Desktop accessibility
- [ui-mobile-rules.md](./ui-mobile-rules.md) — Mobile touch targets
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Resources](https://webaim.org/)

---

**Última actualización:** 2026-08-06  
**Vigencia:** WCAG 2.1 Level AA (permanente)  
**Aplicable a:** Todos los componentes web y mobile con UI interactiva
