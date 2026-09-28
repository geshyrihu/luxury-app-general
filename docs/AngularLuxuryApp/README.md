# LuxuryApp — Angular Design System

**v5.0.1** · Angular 22 · Standalone components · PrimeNG + Ionic

## Stack

| Capa | Tecnología |
|------|------------|
| Framework | Angular 22.0.5 |
| UI Web | PrimeNG 22 |
| UI Mobile | Ionic 8 |
| Design Tokens | SCSS vars → CSS custom properties (`--ds-*`) |
| Charts | ECharts + ngx-echarts 22 |
| State | Signals |

## Estado actual

- Migrado a Angular 22 (standalone, sin NgModules)
- Paquetes ngx (translate, drag-drop, echarts, markdown, mask, pdfjs) todos en latest major
- Sin errores de compilación — solo warnings de budget (5.25 MB / 4 MB) y 3 dependencias CommonJS (`qrcode`, `heic2any`, `localforage`)
- Design System con tokens de color, sombras, tipografía unificados en `core/_colors.scss` y `theme/_variables.scss`

## Scripts

```bash
npm start         # ng serve
npm run build     # ng build
npm test          # vitest
npm run lint      # audits de encoding, emojis, CSS classes, UI boundaries
npm run watch     # ng build --watch --configuration development
```

## Arquitectura de estilos

Ver `AGENTS.md` para reglas estrictas de jerarquía de colores.

- `core/_colors.scss` — única fuente de valores de color (hex/rgba)
- `theme/_variables.scss` — expone `--ds-*` CSS vars en `:root` / `.theme-dark`
- Componentes consumen solo `var(--ds-*)`, nunca hex/rgba directo

Excepciones documentadas: `_auth.scss` (glassmorphism), `_print.scss`, `_utilities.scss`.

## Convenciones clave

- Iconos: `<app-icon icon="mdi:xxx">` o `pi pi-xxx` — prohibido `icon-pi-*`
- Botones de acción: `iw-*`/`il-*`/`<app-action-menu>` fuera de mobile; `ii-*`/`ili-*`/`<ili-action-menu>` dentro de `<app-data-view-mobile>`
- Sombras de foco: `var(--ds-shadow-focus)`
- Overlays: `var(--ds-bg-overlay)`
