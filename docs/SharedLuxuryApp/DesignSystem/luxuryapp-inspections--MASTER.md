# Design System Master File — LuxuryApp Inspections

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** LuxuryApp Inspections (ERP Premium · Deep Navy)
**Generated:** 2026-07-30 21:37:54 | **Updated:** 2026-09-18
**Category:** Enterprise B2B Service (Maintenance/Inspection)
**Stack:** Angular 22 + Ionic (mobile) + Bootstrap/native/shared UI (web)
**Design Dials:** Density 8/10 (Dense / Dashboard) | Motion 5/10 (Standard)
**Reference Docs:** `src/styles/DESIGN.md` | `src/styles/estandar-hoja-estilos.md`

**Current Shared UI Runtime:**

- Web primitives: Bootstrap 5 + native HTML + `shared/ui` components.
- Mobile primitives: Ionic components under `shared/ui/mobile`.
- Editor: `ngx-editor` with `ngx-editor-menu`.
- Charts: Chart.js through `ng2-charts`; headless report capture preserves
  synchronous rendering with `animation: false`.
- Rating: `ngx-bar-rating`.
- Carousel: `ngx-owl-carousel-o`.
- Gallery/lightbox: `ng-gallery` on web; Ionic preview on mobile.
- Dialogs: `DialogHandlerService` over `NgbModal` on web and `ion-modal` on
  mobile.

---

## Global Rules

### Color Palette (Authoritative)

**⚠️ SINGLE SOURCE OF TRUTH:** `src/styles/core/_colors.scss`
All color values defined there. CSS vars exposed in `src/styles/theme/_variables.scss`.

| Role               | Brand Token            | Hex                   | CSS Variable             | Usage                                         |
| ------------------ | ---------------------- | --------------------- | ------------------------ | --------------------------------------------- |
| **Primary**        | `primary-700`          | `#003152`             | `--primary-700`          | Headers, navs, primary buttons, active states |
| **On Primary**     | `contrast-0`           | `#FFFFFF`             | `--ds-primary-text`      | Text/icons on primary bg                      |
| **Secondary**      | `secondary-600`        | `#5A6878`             | `--secondary-600`        | Secondary text, disabled states               |
| **Report Gold**    | `report-gold-600`      | `#D4A74A`             | `--ds-luxury-gold`       | Reports and documentary premium elements      |
| **Success**        | `success-600`          | `#1E9B6D`             | `--success-600`          | Save/confirm/positive actions                 |
| **Danger**         | `danger-600`           | `#D34B4B`             | `--danger-600`           | Delete/reject/critical errors                 |
| **Info**           | `info-600`             | `#3678C2`             | `--info-600`             | Informational, help, links                    |
| **Surface**        | `surface`              | `#F8F9FC`             | `--ds-bg-surface`        | Main app background                           |
| **Surface Card**   | `surface-card`         | `#FFFFFF`             | (native)                 | Cards, modals, elevated                       |
| **Border**         | `outline`              | `#E2E8F0`             | `--ds-border-default`    | Dividers, card borders                        |
| **Text Primary**   | `on-surface`           | `#1A2634`             | `--on-surface`           | Body text, headlines                          |
| **Text Secondary** | `on-surface-secondary` | `#5A6878`             | `--on-surface-secondary` | Subtitles, captions                           |
| **Text Tertiary**  | `on-surface-tertiary`  | `#9AACBB`             | `--on-surface-tertiary`  | Disabled, non-essential                       |
| **Overlay (dark)** | `shadow`               | `rgba(27,54,93,0.15)` | `--ds-bg-overlay`        | Modal backdrops, overlays                     |

**Contrast Ratios (WCAG AAA):**

- Primary and report-gold contrast: validate with `npm run audit:contrast`
- Report gold is not an operational warning color
- Text `#1A2634` on `#F8F9FC` (surface): **15.1:1** ✓

### Typography

**Font Stack:** Inter (body), Hanken Grotesk (headings) — as per `src/styles/core/_typography.scss`

| Scale           | Size | Weight | Line-Height | CSS Class           | Usage                         |
| --------------- | ---- | ------ | ----------- | ------------------- | ----------------------------- |
| **Display LG**  | 48px | 700    | 56px        | `.text-display-lg`  | Hero titles (rare in ERP)     |
| **Display MD**  | 40px | 700    | 48px        | `.text-display-md`  | Page titles (rare)            |
| **Headline LG** | 32px | 600    | 40px        | `.text-headline-lg` | Major sections                |
| **Headline MD** | 24px | 600    | 32px        | `.text-headline-md` | Modal titles, section headers |
| **Title LG**    | 20px | 600    | 28px        | `.text-title-lg`    | Subsection headers            |
| **Title MD**    | 18px | 600    | 24px        | `.text-title-md`    | Card headers                  |
| **Body LG**     | 16px | 400    | 24px        | `.text-body-lg`     | Primary body text             |
| **Body MD**     | 14px | 400    | 20px        | `.text-body-md`     | Standard body, table text     |
| **Body SM**     | 13px | 400    | 18px        | `.text-body-sm`     | Secondary text, captions      |
| **Label LG**    | 14px | 500    | 20px        | `.text-label-lg`    | Form labels, badges           |
| **Label MD**    | 12px | 500    | 16px        | `.text-label-md`    | Small labels, tags            |
| **Label SM**    | 10px | 600    | 14px        | `.text-label-sm`    | UPPERCASE micro labels        |

**Min body size:** 14px (WCAG Level AAA target)

### Spacing System

**Base unit:** 8px grid (all values multiples of 8)
**Density:** 8/10 (dashboard-optimized: tight for data-dense interfaces)

| Token            | Value | rem     | Usage                                             |
| ---------------- | ----- | ------- | ------------------------------------------------- |
| `--ds-space-xs`  | 4px   | 0.25rem | Icon gaps, tight inline spacing                   |
| `--ds-space-sm`  | 8px   | 0.5rem  | Default padding (buttons, inputs), icon-text gaps |
| `--ds-space-md`  | 12px  | 0.75rem | Section padding, form group spacing               |
| `--ds-space-lg`  | 16px  | 1rem    | Large gaps, card padding                          |
| `--ds-space-xl`  | 24px  | 1.5rem  | Section margins, list item spacing                |
| `--ds-space-2xl` | 32px  | 2rem    | Hero/page-level padding                           |
| `--ds-space-3xl` | 48px  | 3rem    | Largest containers                                |

**Semantic spacing:**

- Button padding: `12px 24px` (vertical × horizontal) → `--ds-space-md --ds-space-lg`
- Input padding: `12px 16px` → same
- Card padding: `--ds-space-lg` (16px) standard, `--ds-space-xl` (24px) spacious
- Form label → field gap: `--ds-space-md` (12px)

### Shadow & Elevation

From `src/styles/core/_shadows.scss`:

| Level          | Value                             | CSS Variable           | Usage                       |
| -------------- | --------------------------------- | ---------------------- | --------------------------- |
| **None**       | `none`                            | `--ds-shadow-none`     | Flat surfaces               |
| **Level 1**    | `0 1px 2px rgba(27,54,93,0.06)`   | `--ds-shadow-1`        | Subtle lift (active states) |
| **Level 2**    | `0 2px 8px rgba(27,54,93,0.08)`   | `--ds-shadow-2`        | Cards, inputs (default)     |
| **Level 3**    | `0 4px 16px rgba(27,54,93,0.10)`  | `--ds-shadow-3`        | Modals, popovers, dropdowns |
| **Level 4**    | `0 8px 32px rgba(27,54,93,0.12)`  | `--ds-shadow-4`        | Hero images, featured cards |
| **Focus Ring** | `0 0 0 3px var(--ds-color-focus)` | `--ds-shadow-focus-md` | Focus states (keyboard nav) |

### Border Radius

From `src/styles/core/_borders.scss`:

| Token              | Value  | Usage                                |
| ------------------ | ------ | ------------------------------------ |
| `--ds-radius-xs`   | 4px    | Buttons, small inputs                |
| `--ds-radius-sm`   | 6px    | — (rare)                             |
| `--ds-radius-md`   | 8px    | Cards, modals, standard components   |
| `--ds-radius-lg`   | 12px   | Large cards, tall modals             |
| `--ds-radius-xl`   | 16px   | Hero sections, featured cards        |
| `--ds-radius-full` | 9999px | Chips, badges, fully rounded buttons |

**Rule:** Never hardcode border-radius; always use `--ds-radius-*` variables.

---

## Component Specs (Angular + Bootstrap/shared UI + Ionic)

### Buttons — Web (Bootstrap/shared UI)

**Reference:** `src/styles/web/_buttons.scss` + `src/styles/web/_prime-button.scss`

```scss
// Primary button (CTA)
.btn {
  padding: 12px 24px;
  border-radius: var(--ds-radius-md);
  font-weight: 600;
  font-size: 14px;
  transition: all 200ms ease;
  cursor: pointer;

  background: var(--primary-700); // #1B365D
  color: var(--ds-primary-text); // #FFFFFF
  border: 2px solid var(--primary-700);

  &:hover {
    background: var(--primary-800); // #12243D
    box-shadow: var(--ds-shadow-2);
    transform: translateY(-1px);
  }

  &:active {
    background: var(--primary-900);
    transform: translateY(0);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--ds-shadow-focus-md);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

// Report accent button (gold reserved for reports)
.btn-report-accent {
  background: var(--ds-luxury-gold); // #D4A74A
  color: var(--primary-700); // Navy text on gold
  border: 2px solid var(--ds-luxury-gold);

  &:hover {
    background: var(--ds-luxury-gold-hover);
    opacity: 0.9;
  }
}

// Danger button (delete/reject)
.btn-danger {
  background: var(--danger-600);
  color: white;

  &:hover {
    background: var(--danger-700);
  }
}

// Secondary button (outlined)
.btn-secondary {
  background: transparent;
  color: var(--primary-700);
  border: 2px solid var(--primary-700);

  &:hover {
    background: var(--primary-50);
  }

  &:focus-visible {
    box-shadow: var(--ds-shadow-focus-md);
  }
}

// Success button (confirm/save)
.btn-success {
  background: var(--success-600);
  color: white;

  &:hover {
    background: var(--success-700);
  }
}

// Icon button
.btn-icon {
  padding: 8px;
  min-width: 44px; // Touch target min
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
```

**Angular/Ionic custom components:**

- `<iw-button>` (web wrapper)
- `<ili-button-item>` (Ionic list button)
- `<il-button-edit>`, `<il-button-delete>` (semantic buttons)

### Cards & List Items

```scss
.card,
.p-card {
  background: var(--surface-card); // #FFFFFF
  border: 1px solid var(--outline); // #E2E8F0
  border-radius: var(--ds-radius-md);
  padding: var(--ds-space-lg); // 16px
  box-shadow: var(--ds-shadow-2);
  transition: all 200ms ease;

  &:hover {
    box-shadow: var(--ds-shadow-3);
    transform: translateY(-2px);
  }
}

// List item (inspection row)
.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--ds-space-md); // 12px
  border: 1px solid var(--outline);
  border-radius: var(--ds-radius-md);
  background: var(--surface-card);
  gap: var(--ds-space-md);

  &:hover {
    background: var(--primary-50); // #F8F9FC
  }

  &:focus-visible {
    box-shadow: var(--ds-shadow-focus-md);
  }
}

// Group header (department section)
.group-header {
  background: var(--primary-100); // #E8EEF6
  padding: var(--ds-space-lg);
  border-radius: var(--ds-radius-md);
  font-weight: 600;
  color: var(--primary-700);
  margin-bottom: var(--ds-space-md);
}
```

### Inputs & Forms

```scss
.input,
.form-control {
  padding: 12px 16px;
  border: 1px solid var(--outline);
  border-radius: var(--ds-radius-md);
  font-size: 14px;
  line-height: 1.5;
  background: var(--surface-card);
  color: var(--on-surface);
  transition: border-color 200ms ease;

  &:focus {
    border-color: var(--primary-600);
    outline: none;
    box-shadow: 0 0 0 3px rgba(42, 77, 124, 0.1);
  }

  &:disabled {
    background: var(--surface-dim);
    color: var(--on-surface-tertiary);
    cursor: not-allowed;
  }

  &.ng-invalid.ng-touched {
    border-color: var(--danger-600);

    &:focus {
      box-shadow: 0 0 0 3px rgba(211, 75, 75, 0.1);
    }
  }
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--on-surface);
  margin-bottom: var(--ds-space-sm);

  &.required::after {
    content: " *";
    color: var(--danger-600);
  }
}

.form-error {
  font-size: 12px;
  color: var(--danger-600);
  margin-top: 4px;
}

.form-hint {
  font-size: 12px;
  color: var(--on-surface-secondary);
  margin-top: 4px;
}

.form-group {
  margin-bottom: var(--ds-space-xl);
}
```

### Modals & Dialogs

```scss
// Bootstrap/shared dialog
.modal-content {
  border-radius: var(--ds-radius-lg); // 12px
  box-shadow: var(--ds-shadow-4);
  backdrop-filter: blur(8px);

  .modal-header {
    background: var(--primary-50);
    border-bottom: 1px solid var(--outline);
    padding: var(--ds-space-lg);
  }

  .modal-body {
    padding: var(--ds-space-xl);
  }

  .modal-footer {
    border-top: 1px solid var(--outline);
    padding: var(--ds-space-lg);
    display: flex;
    justify-content: flex-end;
    gap: var(--ds-space-md);
  }
}

// Modal overlay
.modal-backdrop {
  background: var(--ds-bg-overlay); // rgba(27,54,93,0.15)
}
```

### Tables (Data-Dense Dashboard)

```scss
.custom-table {
  font-size: 14px;

  thead > tr > th {
    background: var(--primary-700);
    color: white;
    font-weight: 600;
    padding: var(--ds-space-md);
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 0.5px;
    border: none;
  }

  tbody > tr {
    border-bottom: 1px solid var(--outline);

    &:hover {
      background: var(--primary-50);
    }

    td {
      padding: var(--ds-space-md);
      color: var(--on-surface);
    }
  }

  // Numeric columns (right-aligned)
  .text-right {
    text-align: right;
    font-family: "JetBrains Mono", monospace;
  }
}
```

---

## Accessibility (WCAG AAA)

**Status:** Full WCAG AAA compliance required. Reference: `src/styles/theme/_global.scss` and shared Bootstrap/native component styles.

### Color Contrast (Priority 1)

| Element                   | Background          | Foreground         | Contrast            | WCAG                      |
| ------------------------- | ------------------- | ------------------ | ------------------- | ------------------------- |
| Body text                 | `#F8F9FC`           | `#1A2634`          | 15.1:1              | AAA ✓                     |
| Headline                  | `#FFFFFF`           | `#1B365D`          | 14.8:1              | AAA ✓                     |
| Secondary text            | `#FFFFFF`           | `#5A6878`          | 8.2:1               | AA ✓                      |
| Tertiary text             | `#FFFFFF`           | `#9AACBB`          | 5.4:1               | AA ✓                      |
| Report gold on navy       | `--ds-document-ink` | `--ds-luxury-gold` | validate with audit | Report-only               |
| Report gold text on white | `#FFFFFF`           | `#D4A74A`          | insufficient        | Do not use as normal text |

**Dark Mode Overrides:**

- All ratios maintained via `src/styles/base/_dark-mode.scss`
- Neon glow effect for dark cards (visual enhancement, not contrast dep.)

### Keyboard Navigation

- All interactive elements **must** be reachable via Tab
- Tab order must follow logical reading order (use `tabindex` sparingly, only `-1` for decorative)
- Buttons, inputs, links, modals all keyboard-accessible
- Modals must trap focus through the shared dialog/modal implementation.

### Focus States (Priority 1)

```scss
// All interactive elements MUST have visible focus
button,
a,
input,
select,
textarea {
  &:focus-visible {
    outline: none;
    box-shadow: var(--ds-shadow-focus-md); // 3px blue ring
  }
}
```

**Testing:** Tab through the entire app; all clickable elements must show a 3px focus ring.

### Screen Readers & ARIA

- Form labels **must** use `<label for="input-id">` or wrapping
- Buttons with icons only **must** have `aria-label="..."` (not placeholder text)
- Alert/status messages: `role="status"` + `aria-live="polite"`
- Dialog titles: `aria-labelledby="dialog-title"`
- Required fields: `aria-required="true"` + visual `*` indicator

### Touch Targets (Mobile — Priority 1)

- **Minimum size:** 44×44px (iOS) / 48×48dp (Android)
- **Spacing:** ≥ 8px between touch targets
- All buttons, links, form controls must meet this

**Current violations to fix:**

- `.btn-icon` currently 32px — needs padding to 44px
- `.icon-button` in action menus — needs wrapper

### Low Vision / Dyslexia

- Line height ≥ 1.5 (we use 1.5 for body ✓)
- Letter spacing not < normal (we use 0.02em on labels ✓)
- Font size ≥ 12px for body (we use 14px min ✓)
- Color is never the only distinguisher (always add text/icon labels)

---

## Micro-Interactions & Motion

**Default timing:** 150–300ms (standard), 100–150ms (subtle), 300–500ms (emphasis)

### Hover States

```scss
// Smooth opacity + shadow lift (NO scale transforms to avoid layout shift)
button:hover {
  opacity: 0.95;
  box-shadow: var(--ds-shadow-3);
}

// Cards: lift + shadow
.card:hover {
  box-shadow: var(--ds-shadow-3);
  transform: translateY(-2px);
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

// Table rows: background only
tr:hover {
  background: var(--primary-50);
  transition: background 150ms ease;
}
```

### Loading States

Use `<app-loader>` component (spinny animation from `src/styles/styles.scss`):

```html
<div *ngIf="isLoading" class="ds-animate-spin">
  <app-icon icon="mdi:loading" class="text-2xl"></app-icon>
</div>
```

**Duration:** 1.5–2s per rotation (non-jittery, calm)

### Focus & Active States

```scss
button:active {
  transform: translateY(0);
  box-shadow: var(--ds-shadow-1); // reduce shadow on press
  transition: all 100ms ease;
}

input:focus {
  border-color: var(--primary-600);
  box-shadow: 0 0 0 3px rgba(42, 77, 124, 0.1);
  transition: all 150ms ease;
}
```

### Reduced Motion Respect

```scss
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Dark Mode (Optional but Must Match Light)

**Reference:** `src/styles/base/_dark-mode.scss`

When active (`body.theme-dark`):

- All `--ds-*` tokens automatically swap to dark values
- Surfaces invert (white → near-black)
- Text inverts (dark → light)
- All contrast ratios maintained AAA

**Neon effects in dark mode** (visual only):

```scss
.card {
  &.theme-dark {
    background: var(--surface-dark-100);
    border: 1px solid rgba(212, 167, 74, 0.3); // gold glow
    box-shadow:
      0 0 20px rgba(212, 167, 74, 0.15),
      var(--ds-shadow-2);
  }
}
```

---

## Angular + Ionic Specifics

### Directive Usage

**Web (Bootstrap/shared UI):**

- `<iw-button>` — Wrapper component for `.btn`
- `<il-button>` / `<iw-button>` — Shared semantic web buttons
- `<lux-table>` — Shared data table with client-side and lazy/server-side modes

**Mobile (Ionic):**

- `<app-data-view-mobile>` — List view with grouping
- `<ili-button-item>` — Ionic-styled button
- `<ili-action-menu>` — Dropdown actions (Ionic positioning)
- `<ion-content>` — Scrollable area (safe-area padding auto)

### Safe Area Layout (iOS Notch)

```html
<!-- Mobile layout auto-respects notch/home indicator -->
<ion-content>
  <div class="ion-safe-area">
    <!-- Content here won't be hidden under notch -->
  </div>
</ion-content>
```

### Signals (Angular 19+)

Component state must use `Signal<T>` for reactive updates:

```typescript
selectedAreaSignal = signal<Area | null>(null);
inspeccionesFiltradasSignal = computed(() => {
  // Auto-recomputes when selectedAreaSignal changes
});
```

### Change Detection

For data-dense tables with frequent updates:

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListInspeccionesComponent {
  // Manually trigger with markForCheck() if needed
}
```

---

## Layout & Responsive

**Mobile-first breakpoints:**

| Breakpoint | Size   | Use Case                           |
| ---------- | ------ | ---------------------------------- |
| `xs`       | 320px  | Small phones                       |
| `sm`       | 640px  | Tablets (landscape)                |
| `md`       | 768px  | Tablets (portrait) / Small laptops |
| `lg`       | 1024px | Laptops                            |
| `xl`       | 1280px | Large desktops                     |

**Adaptive pattern (from lista-inspecciones.html):**

```html
<!-- Web version (≥ md) -->
<div class="hidden md:block"><!-- Web list --></div>

<!-- Mobile version (< md) -->
<app-data-view-mobile class="md:hidden"
  ><!-- Mobile list --></app-data-view-mobile
>
```

**Critical:**

- ❌ No horizontal scroll on any breakpoint
- ✓ Viewport meta: `<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">`
- ✓ Disable zoom **only** for forms (use `user-scalable=no` sparingly)

---

## Anti-Patterns (Do NOT Use)

### Visual & Brand

- ❌ **Emojis as icons** — Use MDI/Heroicons/Lucide SVG only
- ❌ **Mixing styles** — Don't blend flat + skeuomorphic; pick one
- ❌ **Playful design in ERP** — Stay professional; no gradients/glitter
- ❌ **Raw hex values in components** — Always use `var(--ds-*)`
- ❌ **Hardcoded colors** — If not a token, it's technical debt

### Interaction & UX

- ❌ **Instant state changes** — All transitions ≥ 150ms
- ❌ **Hover-only interactions** — Must work on touch/keyboard
- ❌ **Layout-shifting hovers** — Use `opacity` + `shadow`, not `scale`/`width` changes
- ❌ **Disabled buttons with low opacity** — Use `opacity: 0.5` + `cursor: not-allowed`
- ❌ **Tooltips without delays** — Min 500ms delay on hover; not on mobile
- ❌ **No loading states** — Always show feedback for async operations

### Accessibility

- ❌ **Color as only distinguisher** — Pair color with icon/text/pattern
- ❌ **Missing focus states** — Every interactive element **must** have `:focus-visible`
- ❌ **Icon-only buttons without labels** — Use `aria-label` or visible label
- ❌ **Placeholder-only form labels** — Use explicit `<label>` tags
- ❌ **Contrast < 4.5:1** — Minimum WCAG AA; prefer AAA (≥ 7:1)

### Performance & Responsiveness

- ❌ **Fixed-width containers** — Use `max-width: 100%; margin: 0 auto;`
- ❌ **No viewport meta tag** — Must have `viewport-fit=cover` for notches
- ❌ **Cumulative Layout Shift > 0.1** — Reserve space for images/ads
- ❌ **Unoptimized images** — Use WebP/AVIF + lazy loading
- ❌ **Blocking main thread** — Virtualize long lists; debounce searches

---

## Pre-Delivery Checklist (UX PRO)

Before shipping **any** UI feature, verify all items:

### Visual (5 min)

- [ ] All colors reference `var(--ds-*)`, not hardcoded hex
- [ ] Typography matches scale (no outliers < 14px or > 48px)
- [ ] Spacing follows 8px grid (all values in `src/styles/core/_spacing.scss`)
- [ ] Border radius uses tokens only (`--ds-radius-*`)
- [ ] Shadows use token set (`--ds-shadow-*`)
- [ ] No emojis; only MDI/SVG icons from `<app-icon>`
- [ ] Icons consistent across page (size, style, color)

### Interaction (5 min)

- [ ] All buttons have hover state (opacity + shadow, no layout shift)
- [ ] All focusable elements have visible `:focus-visible` ring (3px)
- [ ] Loading states shown for all async operations
- [ ] Form validation errors clear and near field
- [ ] Modals have close button + keyboard Escape support
- [ ] Tables sortable headers show active state clearly
- [ ] Smooth transitions (150–300ms) on all state changes

### Accessibility (5 min)

- [ ] Button/link text is meaningful (not "Click here")
- [ ] Form labels paired with inputs (`<label for="">`)
- [ ] Icon-only buttons have `aria-label`
- [ ] Modal titles have `aria-labelledby`
- [ ] Status messages use `role="status"` + `aria-live="polite"`
- [ ] Keyboard navigation works (Tab → all controls → Tab back to first)
- [ ] No focus trap unless intentional (e.g., modal)
- [ ] Text contrast ≥ 4.5:1 (use WebAIM calculator if unsure)

### Responsive (5 min)

- [ ] Mobile layout tested at 375px, 425px, 768px
- [ ] **No horizontal scroll** at any breakpoint
- [ ] Touch targets ≥ 44×44px
- [ ] Adaptive layout switches at `md` breakpoint correctly
- [ ] Images/videos scale with viewport (no fixed width)
- [ ] Viewport meta present: `<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">`

### Compliance (5 min)

- [ ] Dark mode tested (if applicable)
- [ ] `prefers-reduced-motion` respected (animations off if set)
- [ ] Performance: no Cumulative Layout Shift > 0.1
- [ ] No console errors/warnings
- [ ] Lighthouse Accessibility score ≥ 90
- [ ] WAVE or axe DevTools find no critical errors

### Code Quality (5 min)

- [ ] No `!important` in new code (only `_dark-mode.scss` exception)
- [ ] No `::ng-deep` in styles
- [ ] TypeScript strict mode enabled
- [ ] Change detection strategy set to `OnPush` for lists
- [ ] Signals used for reactive state (no `@Input`/`@Output` for simple state)
- [ ] Components have unit tests (≥ 80% coverage for UI logic)

---

## File Structure & Imports

**Always import from canonical locations:**

```typescript
// ✓ Correct
import { ButtonComponent } from "@ui/adaptive/button";
import { CardComponent } from "@ui/adaptive/card";
import { DataViewMobileComponent } from "@ui/adaptive/data-view-mobile";

// ❌ Wrong
import { ButtonComponent } from "../../../shared/button";
import { Button } from "./local-button";
```

**Styles import order (in component file):**

```scss
// 1. Tokens & functions (core only)
@use "@angular/cdk" as cdk;

// 2. Component-specific styles
:host {
  --component-primary: var(--primary-700);
  --component-padding: var(--ds-space-lg);
}

.component {
  padding: var(--component-padding);
}
```

---

## References & Links

- **Source of Truth:** `src/styles/core/_colors.scss`
- **CSS Variables:** `src/styles/theme/_variables.scss`
- **Web UI:** `src/app/shared/ui/web/` and `src/app/shared/ui/adaptive/`
- **Mobile UI:** `src/app/shared/ui/mobile/`
- **Shared UI architecture:** `src/app/shared/ui/arquitectura-shared-ui.md`
- **Components:** `src/app/shared/ui/adaptive/`
- **Catalog:** `src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/`
- **Design Doc:** `src/styles/DESIGN.md`
- **Stylesheet Standards:** `src/styles/estandar-hoja-estilos.md`

---

_**Last Updated:** 2026-09-18 | **Next Review:** 2026-10-18_
