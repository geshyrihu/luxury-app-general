# Prompt: Landing Page Publicitaria - Luxury Building Group (LuxuryApp)

## Contexto del Producto
**LuxuryApp** es una plataforma SaaS multi-tenant (B2B2C) para la **administración integral de condominios y residenciales premium** en México. Desarrollada por **Luxury Building Group** con 15+ años de experiencia y 120+ residenciales administrados.

**Target Audience:**
- **Primario:** Administradores de condominios, gestores inmobiliarios, consejos de administración
- **Secundario:** Condóminos (portales públicos), proveedores de servicios, comités de vigilancia
- **Geografía:** México (integración nativa con Aspel COI, SAT, CFDI)

**Value Props Clave:**
1. **Todo-en-uno:** Legal + Operaciones + Mantenimiento + Contabilidad + RR.HH. + Cobranza en una sola plataforma
2. **Cobranza nativa propietaria:** Motor de cargos recurrentes, mora automática, libro mayor, conciliación bancaria
3. **Integración fiscal mexicana:** Aspel COI, catálogos SAT (CFDI, forma/método pago, unidades medida), timbrado
4. **Multi-tenant real:** Aislamiento de datos por cliente, roles granulares (SuperUsuario, Administrador, Contador, Cobranza, Legal, Comité, Condómino, Proveedor)
5. **Tiempo real:** SignalR para alertas, paneles vivos, notificaciones push
6. **Auditoría total:** Trazabilidad de cada cambio, bitácoras inmutables

---

## Estructura de la Landing Page

### 1. HERO (Above the fold)
- **Headline:** "Transformamos la administración de tu residencial en una experiencia de confianza"
- **Subhead:** "Legal, financiero, operativo y humano en una sola plataforma. 120+ residenciales confían en Luxury Building Group."
- **CTA Primario:** "Solicitar Demo" → `/contacto` o `/demo`
- **CTA Secundario:** "Ver cómo funciona" → scroll a features
- **Trust signals:** Logos de 3-4 clientes reconocibles (difuminados), badges: "Aspel Certified", "SAT Compliant", "ISO 27001"
- **Visual:** Dashboard interactivo mockup (laptop/tablet/phone) mostrando módulos clave

### 2. BARRA DE CONFIANZA (Sticky o bajo hero)
- **Stats animados:** +120 Residenciales | 15+ Años | 98% Satisfacción | 50+ Profesionales | 99.9% Uptime
- **Certificaciones:** Aspel Partner, SAT PAC Autorizado, AWS Well-Architected

### 3. PROBLEMA / SOLUCIÓN (2 columnas)
| Antes (Dolor) | Después (LuxuryApp) |
|---------------|---------------------|
| 5+ sistemas desconectados | 1 plataforma unificada |
| Cobranza manual en Excel | Motor automático + mora + facturación |
| Legal externo costoso | Módulo legal integrado + plantillas |
| Mantenimiento reactivo | Calendarios preventivos + bitácoras |
| Contabilidad en Aspel aislada | Sync bidireccional tiempo real |
| Sin visibilidad para condóminos | Portal público + app móvil |

### 4. MÓDULOS PRINCIPALES (Grid 3x2 o 2x3 con cards interactivas)
Cada card: Icono + Título + 1-liner + "Ver módulo" → anchor a sección detalle

| Módulo | Tagline | Icono | Color Theme |
|--------|---------|-------|-------------|
| **Legal & Cumplimiento** | "Contratos, asambleas, juicios y normatividad en un clic" | ⚖️ | Azul oscuro (#1b365d) |
| **Operaciones & Seguridad** | "Control de acceso, incidencias, alertas pánico 24/7" | ⚙️ | Verde azulado (#0f766e) |
| **Mantenimiento Inteligente** | "Preventivo, correctivo, inspecciones, equipos, bomberos" | 🔧 | Naranja (#c2410c) |
| **Contabilidad & Aspel** | "Catálogo, presupuestos, sync Aspel COI, estados financieros" | 📊 | Verde (#15803d) |
| **Cobranza Automatizada** | "Cargos recurrentes, mora, facturación, conciliación, ledger" | 💰 | Púrpura (#4338ca) |
| **Recursos Humanos** | "Nómina, reclutamiento, incidencias, vacaciones, clima" | 👥 | Índigo (#4338ca) |

**Hover/Tap:** Expande con 3 features clave + screenshot thumbnail

### 5. DEEP DIVE POR MÓDULO (Acordeones o tabs)
Para cada módulo: **Qué resuelve** + **Features clave (5-7)** + **Captura real** + **Rol objetivo**

**Ejemplo - Cobranza Nativa:**
- Plantillas de cargo recurrentes (cuotas, estacionamiento, bodegas)
- Políticas de mora configurables (días, %, intereses)
- Registro de pagos: efectivo, transferencia, terminal, link de pago
- Conciliación bancaria automática (API bancarias + Aspel)
- Libro mayor por propiedad + estado de cuenta PDF/email
- Aprobaciones multinivel (comité → administrador → legal)
- Auditoría inmutable de cada movimiento

### 6. ARQUITECTURA TÉCNICA (Para CTOs / IT)
- **Stack:** Angular 20+ (standalone, signals, OnPush) + .NET 10 / ASP.NET Core Minimal APIs
- **Auth:** Azure AD B2C / IdentityServer + JWT + roles claims
- **Real-time:** SignalR (hub por cliente)
- **DB:** SQL Server multi-tenant (schema compartido + tenant_id)
- **Integraciones:** Aspel COI (WS), PAC timbrado, WhatsApp Business, Email (Brevo), Google Calendar
- **Infra:** Azure AKS / Kubernetes, Helm, ArgoCD, Key Vault, Application Insights
- **Seguridad:** OWASP Top 10, pen-test anual, cifrado en reposo/tránsito, RBAC granular

### 7. CASOS DE USO / PERSONAS
| Persona | Pain Point | LuxuryApp Solution |
|---------|------------|---------------------|
| **Administrador General** | "Pierdo horas en Excel conciliando" | Dashboard unificado + auto-conciliación |
| **Contador** | "Aspel no habla con mi sistema de cobranza" | Sync bidireccional Aspel ↔ LuxuryApp |
| **Presidente de Comité** | "No tengo visibilidad financiera en tiempo real" | Portal comité + reportes ejecutivos automáticos |
| **Condómino** | "No sé qué debo ni cómo pagar" | Portal público + link de pago + estado de cuenta |
| **Jefe de Mantenimiento** | "Se me olvidan las inspecciones de extintores" | Calendario maestro + alertas automáticas |
| **Proveedor (Limpieza/Seguridad)** | "No sé qué tickets tengo asignados" | App móvil proveedor + checklists digitales |

### 8. TIMELINE DE IMPLEMENTACIÓN
```
Semana 1-2:  Kickoff + migración datos históricos + configuración catálogos
Semana 3-4:  Contabilidad + Aspel sync + cobranza plantillas
Semana 5-6:  Operaciones + control acceso + mantenimiento calendarios
Semana 7-8:  Legal + biblioteca + portal comité + capacitación
Semana 9:    Go-live + hipercuidado 30 días + CSM asignado
```

### 9. PRECIOS / PLANES (Transparent pricing)
| Plan | Incluye | Ideal para |
|------|---------|------------|
| **Essential** | Contabilidad + Cobranza + Directorio + Portal Condómino | Residenciales < 100 unidades |
| **Professional** | + Operaciones + Mantenimiento + Legal + Comité | Residenciales 100-500 unidades |
| **Enterprise** | + RR.HH. + IA Knowledge Base + Vault + API + SLA 99.9% | Desarrolladoras / Portafolios > 500 uds |
| **White-label** | Todo anterior + marca propia + dominio custom + apps nativas | Administradoras de terceros |

**CTA:** "Calculadora de ROI" → formulario corto → envía PDF personalizado

### 10. TESTIMONIOS / CASE STUDIES (Carousel)
- **Residencial Las Palmas (CDMX, 240 uds):** "Redujimos morosidad 40% en 6 meses"
- **Torres del Bosque (Querétaro, 180 uds):** "Ahorramos 20 hrs/semana en conciliación"
- **Administradora Grupo Habita (15 residenciales):** "Estandarizamos operación en todo el portafolio"

### 11. FAQ (Schema.org FAQPage)
- ¿Requiere migración de Aspel? → No, sync bidireccional
- ¿Cuánto tarda la implementación? → 8-9 semanas típicas
- ¿Hay app móvil nativa? → PWA + apps nativas iOS/Android (Enterprise)
- ¿Soporta múltiples monedas? → Solo MXN (México)
- ¿Cumple SAT/CFDI 4.0? → Sí, catálogos actualizados automáticamente

### 12. FOOTER CTA FINAL
- **Headline:** "¿Listo para dejar de apagar incendios y empezar a administrar?"
- **Formulario:** Nombre + Email + Teléfono + # Unidades + Mensaje
- **Links:** Demo guiada | Documentación API | Centro de ayuda | Blog | Legal / Privacidad
- **Contacto:** WhatsApp Business + Teléfono CDMX + Email ventas@luxurybuilding.com.mx

---

## Diseño & UX Guidelines

### Paleta de Colores (Derivada del sistema)
| Uso | Hex | Variable CSS |
|-----|-----|--------------|
| Primary (Legal/Trust) | #1b365d | `--color-primary` |
| Secondary (Ops/Security) | #0f766e | `--color-secondary` |
| Accent (Mantenimiento) | #c2410c | `--color-accent` |
| Success (Contabilidad) | #15803d | `--color-success` |
| Warning (Cobranza) | #a16207 | `--color-warning` |
| Info (RR.HH.) | #4338ca | `--color-info` |
| Background | #f8fafc | `--color-bg` |
| Surface | #ffffff | `--color-surface` |
| Text Primary | #0f172a | `--color-text` |
| Text Muted | #64748b | `--color-text-muted` |

### Tipografía
- **Display:** `Plus Jakarta Sans` / `Inter` (weights 700, 800)
- **Body:** `Inter` / `DM Sans` (400, 500, 600)
- **Mono (code/endpoints):** `JetBrains Mono` / `Fira Code`

### Componentes Reutilizables
- `ModuleCard` (hover lift, gradient icon bg, arrow)
- `FeatureList` (icon + title + desc, 3-col grid)
- `PersonaCard` (avatar, role, quote, metric)
- `PricingCard` (popular badge, feature checklist, CTA)
- `TimelineStep` (number, title, desc, icon)
- `StatCounter` (animated number, label, icon)
- `LogoCloud` (grayscale, hover color, stagger animation)

### Animaciones (Respeta `prefers-reduced-motion`)
- **Entrada:** IntersectionObserver + `opacity: 0 → 1`, `translateY(20px) → 0`, stagger 100ms
- **Hover cards:** `transform: translateY(-4px)`, `box-shadow: 0 20px 40px -12px rgba(0,0,0,0.15)`
- **CTAs:** `scale(1.02)` active, ripple effect
- **Counters:** `countUp` on scroll into view
- **Background:** Partículas sutiles / gradientes animados lentos (hero)

### Accesibilidad (WCAG 2.1 AA)
- Contraste ≥ 4.5:1 (text), 3:1 (UI)
- Focus visible: `outline: 3px solid var(--color-primary)`, `outline-offset: 2px`
- Semántica: `<header>`, `<main>`, `<section>`, `<article>`, `<footer>`
- ARIA: `aria-label` en iconos, `role="region"` en tabs/acordeones
- Skip link: "Saltar al contenido principal"
- Formularios: labels asociados, `aria-describedby` para errores, `autocomplete`

### Performance
- **LCP < 2.5s:** Hero image WebP/AVIF, preload critical CSS/fonts
- **CLS < 0.1:** Aspect-ratio en imágenes, font-display: swap
- **TBT < 200ms:** Code-splitting por ruta, lazy-load below-fold
- **Bundle:** < 150KB JS gzipped initial, < 50KB CSS
- **Imágenes:** `<picture>` con WebP/AVIF fallback, `loading="lazy"`

### SEO Technical
- JSON-LD: `SoftwareApplication`, `Organization`, `FAQPage`, `Review`, `Pricing`
- Open Graph + Twitter Cards completos
- Sitemap.xml + robots.txt
- Canonical URLs
- Hreflang: es-MX (principal), en-US (futuro)

---

## Entregables Esperados

1. **`index.html`** - Single page, semantic, accessible
2. **`styles.css`** - Design tokens (CSS custom properties), componentes, utilidades
3. **`app.js`** - IntersectionObserver, contadores, acordeones, tabs, form validation, smooth scroll
4. **`assets/`** - Imágenes optimizadas (WebP/AVIF), iconos SVG, fuentes (woff2 subset)
5. **`components/`** (opcional) - Web Components o partials para Netlify/Astro/Next si se usa framework
6. **`README.md`** - Cómo deployar, personalizar colores, agregar módulos

---

## Referencias Visuales (Moodboard)
- **Stripe.com** - Claridad, trust signals, developer-friendly
- **Linear.app** - Dark/light, animaciones sutiles, tipografía
- **Vercel.com** - Technical credibility + marketing balance
- **Ramp.com** - ROI calculator, enterprise feel
- **Notion.so** - Clean, modular, component-based

---

## Notas para el Desarrollador
- **No uses frameworks pesados** (React/Vue/Angular) para esta landing. Vanilla JS + CSS custom properties + opcional Alpine.js/Petite-Vue para interactividad ligera.
- **Mobile-first:** Breakpoints 640/768/1024/1280/1536
- **Modo oscuro:** Soporte nativo via `@media (prefers-color-scheme: dark)` + toggle manual
- **Internacionalización:** Estructura lista para i18n (data-i18n attributes)
- **Analytics:** GA4 + Microsoft Clarity + eventos custom (demo_request, pricing_click, module_expand)
- **Formulario:** Netlify Forms / Formspree / API propia → Slack + Email + CRM (HubSpot/Pipedrive)
