# Propuesta de estructura — `core/layout/committee`

## Estado actual

```
committee-view/
├── layout-committee.html
├── layout-committee.ts
└── monitor/
    ├── header-committee-monitor/
    │   ├── header-committee-monitor.html
    │   ├── header-committee-monitor.scss
    │   ├── header-committee-monitor.spec.ts
    │   └── header-committee-monitor.ts
    └── components/
        ├── customer-header-data-committee/
        │   ├── customer-header-data-committee.html
        │   ├── customer-header-data-committee.spec.ts
        │   └── customer-header-data-committee.ts
        ├── footer-committee-monitor/
        │   ├── footer-committee-monitor.html
        │   ├── footer-committee-monitor.spec.ts
        │   └── footer-committee-monitor.ts
        └── profile-committee-monitor/
            ├── profile-committee-monitor.html
            ├── profile-committee-monitor.spec.ts
            └── profile-committee-monitor.ts
```

**Problemas detectados:**
- `committee-view` mezcla inglés (`committee`) con `-view`
- `monitor/` es inglés pero suena a "monitor de pantalla"; dentro hay `components/` como subcarpeta adicional innecesaria
- Redundancia: `header-committee-monitor` ya está dentro de `committee-view/monitor/`, sobra repetir `committee` y `monitor` en el nombre del archivo
- `customer-header-data-committee` está dentro de `components/` pero su nombre no refleja el contexto de monitor
- Asimetría: `header-committee-monitor` está fuera de `components/` pero los otros tres están dentro

---

## Propuesta A — Limpieza minimalista (cambios quirúrgicos)

```
committee-view/
├── layout-committee.ts
├── layout-committee.html
├── monitor/
│   ├── header-monitor.ts
│   ├── header-monitor.html
│   ├── header-monitor.scss
│   ├── footer-monitor.ts
│   ├── footer-monitor.html
│   ├── profile-monitor.ts
│   ├── profile-monitor.html
│   └── customer-header-data.ts
│       └── customer-header-data.html
```

**Cambios:**
- Se elimina la carpeta `components/` — todo lo de monitor queda plano dentro de `monitor/`
- Se elimina la redundancia: `header-committee-monitor` → `header-monitor` (ya está dentro de `committee-view/monitor/`)
- `customer-header-data-committee` → `customer-header-data`
- Se mantiene `committee-view` como nombre del rol (coherente con `direccion-view`, `employee-view`)
- Archivos `.spec.ts` y `.scss` mantienen el mismo patrón

---

## Propuesta B — Renombre completo (español, dominio de negocio)

```
comite/
├── layout-comite.ts
├── layout-comite.html
├── monitor/
│   ├── cabecera.ts
│   ├── cabecera.scss
│   ├── pie.ts
│   ├── perfil.ts
│   └── datos-cliente.ts
│       └── datos-cliente.html
```

**Cambios:**
- `committee-view/` → `comite/` (español, dominio del negocio)
- `layout-committee` → `layout-comite`
- `header-committee-monitor` → `cabecera` (pluralizarían si hubiera varias: `cabeceras/`)
- `footer-committee-monitor` → `pie`
- `profile-committee-monitor` → `perfil`
- `customer-header-data-committee` → `datos-cliente`
- Se elimina `components/` — todo plano en `monitor/`
- Se elimina sufijo `-monitor` de cada archivo porque ya están dentro de `monitor/`

---

## Conclusión

| Aspecto | Propuesta A (minimalista) | Propuesta B (español) |
|---|---|---|
| Riesgo de refactor | Bajo — solo renombra archivos internos | Medio — cambia ruta y nombre del layout |
| Coherencia con otros roles (`direccion-view`, `employee-view`) | Alta — conserva el mismo patrón | Media — rompe simetría si no se migran los otros |
| Legibilidad del dominio | Baja — nombres genéricos en inglés | Alta — vocabulario del negocio en español |
| Archivos a tocar fuera del layout | Ninguno | `app.routes.ts` (cambiar import de `LayoutCommittee` a `LayoutComite`) |
