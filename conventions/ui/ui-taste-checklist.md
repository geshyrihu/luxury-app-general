# Checklist de Criterio Visual ("Taste") para UI/UX

**Última revisión:** 2026-09-30
**Origen:** traducido directamente del contenido fuente (no de resúmenes) de [anthropics/skills](https://github.com/anthropics/skills) (skill `frontend-design`, 71 líneas) y [leonxlnx/taste-skill](https://github.com/leonxlnx/taste-skill) (skill principal `taste-skill`, 1206 líneas, + `redesign-skill`, 178 líneas). Ver decisión completa en memoria `decision-ui-taste-skills-20260930`.

**Qué se descartó explícitamente** (no aplica a Angular + Bootstrap/shared UI + Ionic 9, un stack de administración/ERP, no landing pages de marketing con scroll-hijack): todo lo específico a React/Next/RSC, Tailwind v4, Motion/GSAP/ScrollTrigger, shadcn/ui, y el vocabulario de patrones de scroll cinematográfico (bento grids animados, horizontal-pan, sticky-stack, parallax). Si algún día se construye contenido de marketing (`luxury-app.com`) con ese tipo de interacción, revisar los repos originales de nuevo — aquí no se tradujo esa parte.

**Qué SÍ se tradujo**: todo lo que es agnóstico de framework — tipografía, color, estados, voz de copy, catálogo de "AI tells", omisiones estratégicas, y el proceso de trabajo plan→revisión→build→autocrítica.

---

## 0. Proceso recomendado antes de construir una pantalla nueva

Esto viene de `frontend-design` y aplica igual a un módulo Angular que a una landing page:

1. **Fundamenta el diseño en el dominio real.** Antes de elegir tipografía/color/layout, identifica el sujeto real: ¿quién usa esta pantalla (guardia de seguridad en un control de acceso vs. administrador de nómina vs. residente en el portal) y cuál es su tarea principal? Las decisiones visuales deben derivarse de eso, no de un default genérico de "app empresarial".
2. **Plan en dos pasos:** primero un plan compacto (color: 4-6 tokens con nombre; tipografía: familias y roles; layout: alineación y estructura en una frase; principios: qué hace única a esta pantalla). Luego revisa ese plan contra el brief — si cualquier parte se ve como el default genérico que producirías para cualquier pantalla similar, corrígela y anota qué cambiaste y por qué. Solo después de eso, construir.
3. **Autocrítica antes de dar por terminado:** toma una captura de pantalla si tu entorno lo permite y revísala como lo haría un tercero. "Antes de salir de casa, mírate al espejo y quítate un accesorio" (Chanel) — recorta una cosa decorativa que no sirva al contenido.

---

## 1. Nombrar las cosas como las entiende el usuario, no como las construimos

Esto es una fuente de deuda real en un ERP con mucha jerga interna de dominio. Antes de etiquetar un campo, botón o sección:

- [ ] ¿El nombre describe lo que el usuario entiende (ej. "Notificaciones"), no cómo está construido el sistema (ej. "Configuración de Webhooks")?
- [ ] ¿Describe qué hace la cosa en términos simples, en vez de "vendérsela" al usuario?
- [ ] ¿El mismo concepto se llama igual en todo el flujo? (un botón "Publicar" debe producir un toast "Publicado", nunca "Enviado" ni "Guardado exitosamente")

---

## 2. 🔴 CRÍTICA: Estados obligatorios por componente

El error más frecuente de "funciona pero se ve a medias": un componente que solo contempla su estado feliz.

Todo componente que haga una petición de red o dependa de datos externos **debe** contemplar explícitamente:

| Estado | ❌ Incorrecto | ✅ Correcto |
|---|---|---|
| **Loading** | Spinner genérico centrado que reemplaza todo el layout | Skeleton que respeta la forma final del contenido (`shared/ui` ya tiene `skeleton`) |
| **Empty** | "No hay datos" sin más | Invita a actuar: *"Aún no hay clientes — Crear el primero"* + CTA |
| **Error** | `alert()`/`confirm()` nativo, "¡Oops!", o silencio total | Mensaje inline explicando qué pasó y cómo corregirlo. Directo: *"No se pudo guardar. Verifica tu conexión e intenta de nuevo."* |

Además, de `redesign-skill` (señales concretas de que a un componente le falta terminar):

- [ ] ¿Todo botón tiene estado `:hover` y feedback de `:active`/presionado (no transición instantánea de 0ms)?
- [ ] ¿Hay focus ring visible para navegación por teclado? (no opcional, es requisito de accesibilidad)
- [ ] ¿Ningún link apunta a `#` o queda "muerto"? O se desactiva visualmente, o lleva a un destino real.
- [ ] ¿La navegación indica en qué página/sección está el usuario actualmente (estado activo distinto)?
- [ ] ¿Los anclajes/saltos internos usan transición suave, no salto instantáneo?

---

## 3. 🔴 CRÍTICA: Anti-clichés visuales genéricos de IA

Organizado por categoría — revisar antes de aprobar cualquier pantalla nueva o rediseño:

### Tipografía
- [ ] ¿Evita acentuar una sola palabra del título con cursiva/color distinto solo por "verse interesante"?
- [ ] ¿Evita mayúsculas (`UPPERCASE`) para labels/eyebrows por defecto?
- [ ] ¿Evita labels tipográficos innecesarios agregados solo para "decorar" un título?
- [ ] ¿El encabezado no usa guion largo (`—`) como separador o muletilla de diseño? (ver §5, es ban total de em-dash)
- [ ] ¿Evita fuente monoespaciada para datos pequeños solo por estética, sin que el contenido sea tabular?

### Color
- [ ] ¿Evita fondo negro puro (`#000`) o negro casi puro (`#0B0B0B`, `#111`) en vez de un tono con matiz (ya cubierto por tokens del DS — ver `design-tokens-rule.md`)?
- [ ] ¿Evita el acento verde ácido/vermillion sobre fondo casi-negro (el segundo cliché más común de IA después del morado)?
- [ ] ¿Evita mezclar grises cálidos y fríos en la misma vista?

### Layout y estructura
- [ ] ¿Evita 3 tarjetas idénticas en fila como "feature row" genérico cuando el contenido no tiene esa simetría natural?
- [ ] ¿Evita el mismo `border-radius` y la misma sombra gris genérica para contenido de naturaleza distinta (el "kit de tarjetas SaaS")?
- [ ] ¿Evita layout tipo "broadsheet" (líneas finas + cero radio + columnas densas de periódico) sin que el contenido sea editorial real?
- [ ] ¿Los botones dentro de un grupo de tarjetas están alineados al fondo (no flotando a distinta altura según el largo del contenido)?
- [ ] ¿Los elementos compartidos entre columnas/tarjetas (títulos, precios, botones) arrancan en la misma posición vertical?
- [ ] ¿Las secciones alternan de familia de layout? (si 8 secciones usan la misma estructura, se ve templado)

### "Chrome" de plantilla (lo que aparece sin importar el contenido)
- [ ] ¿Evita eyebrows en mayúsculas espaciadas sobre cada encabezado de sección (máximo 1 cada 3 secciones)?
- [ ] ¿Evita separar metadatos con punto medio (`·`) como separador universal?
- [ ] ¿Evita labels tipo "PALABRA — fragmento" con guion largo espaciado?
- [ ] ¿Evita flechas (`→`) al final de links/botones solo por estética, sin indicar navegación real?
- [ ] ¿Evita marcadores numerados (01/02/03) cuando el contenido no es una secuencia real (proceso, línea de tiempo)?
- [ ] ¿Evita labels de pasos genéricos ("Paso 1", "Fase 01", "Etapa 2") cuando el contenido mismo ya identifica el paso ("Instalar", "Configurar", "Publicar")?
- [ ] ¿Evita puntos de color decorativos antes de cada ítem de lista/nav/badge sin que transmitan un estado real?

### Componentes
- [ ] ¿Evita tarjeta genérica (borde + sombra + fondo blanco) cuando la elevación no comunica jerarquía real?
- [ ] ¿Evita badges tipo pill genéricos ("Nuevo"/"Beta") sin lógica de negocio detrás?
- [ ] ¿Evita modal para acciones simples que podrían ser edición inline o panel deslizante?
- [ ] ¿Evita barras de progreso/comparación con track de fondo relleno cuando un número + ícono pequeño comunica lo mismo más limpio?

### Iconografía
- [ ] ¿Evita metáforas de ícono obvias/cliché (cohete para "lanzar", escudo para "seguridad") cuando hay una opción menos trillada?
- [ ] ¿Los íconos usados mantienen un solo grosor de trazo consistente en toda la vista?

---

## 4. Contenido y datos ("efecto Jane/John Doe")

- [ ] ¿Evita nombres genéricos ("Juan Pérez", "John Doe") — usa nombres realistas y diversos?
- [ ] ¿Evita números "perfectos" (`99.99%`, `50%`, cifras redondas) — usa datos orgánicos (`47.2%`)?
- [ ] ¿Evita nombres de empresa/marca de relleno tipo startup ("Acme", "Nexus")?
- [ ] ¿Evita Lorem Ipsum en cualquier entregable, incluso de prueba?
- [ ] ¿Las fechas de ejemplo (si las hay) no son todas idénticas?
- [ ] ¿Cada usuario de ejemplo tiene su propio avatar, no uno repetido para todos?
- [ ] ¿Títulos usan sentence case, no Title Case En Cada Palabra?

---

## 5. Voz de UI (copy) — reglas obligatorias

- [ ] **Ban total de guion largo (`—`) y guion medio como separador (`–`).** Es la muletilla estilística más delatora de un LLM. Usar coma, punto, paréntesis o dos puntos en su lugar. Esto aplica a títulos, labels, botones, mensajes de error, captions — en cualquier texto visible al usuario.
- [ ] Voz activa por defecto: un botón "Guardar" dice exactamente qué pasa cuando se usa, no "Enviar" genérico.
- [ ] Una acción mantiene el mismo verbo en todo el flujo: si el botón dice "Publicar", el toast resultante dice "Publicado", nunca "Guardado exitosamente".
- [ ] Los estados vacíos invitan a actuar, no describen la ausencia (ver §2).
- [ ] Los errores nunca se disculpan ni son vagos — explican qué pasó y qué hacer, en la voz de la interfaz, no de una persona ("Oops! Algo salió mal" está prohibido).
- [ ] Evitar muletillas de copywriting de IA: "Eleva", "Sin esfuerzo", "Impulsa", "Próxima generación", "Revoluciona", "En el mundo de...". Usar lenguaje plano y específico.
- [ ] Evitar signos de exclamación en mensajes de éxito — ser directo, no "entusiasta".
- [ ] Tono conversacional: verbos simples, sentence case, sin relleno, ajustado a la marca y la audiencia.

---

## 6. Color-Lock y Shape-Lock por vista

- **Color-Lock:** una vez elegido el color de acento/estado de una vista, se usa consistentemente en toda esa vista — nunca un botón primario azul en una sección y un badge verde para la misma semántica en otra parte de la misma pantalla.
- **Shape-Lock:** un solo sistema de `border-radius` por vista (todo recto, o todo suave 12-16px, o todo pill en elementos interactivos). Mezclar sistemas solo si hay una regla documentada y se sigue en todas partes (ej. "botones son pill, tarjetas son 16px, inputs son 8px").

**Auditoría:** grep de clases/tokens de color y radio usados dentro de un mismo módulo; 2+ tokens de "acento" cumpliendo el mismo rol semántico en la misma vista es una violación.

---

## 7. Contraste WCAG AA — verificación mecánica obligatoria

No basta con que los **tokens** estén validados — hay que verificar los **pares reales** que efectivamente se renderizan. La auditoría FASE 1 del design system (`appsweb/angular/design-system/auditoria-DS-FASE1.md`, 2026-09-18) encontró exactamente este caso: los tokens semánticos pasan la auditoría automática, pero los badges de estado (`.bg-status-pending`, `.bg-status-success`) usan una combinación que falla AA en la práctica (2.23:1 y 3.52:1 contra el mínimo de 4.5:1).

**Checklist por componente nuevo o modificado:**
- [ ] ¿Calculé el ratio de contraste del texto/icono contra su fondo **real** (no solo contra el token aislado)?
- [ ] ¿Texto normal ≥ 4.5:1? ¿Texto grande (≥18px o ≥14px bold) ≥ 3:1?
- [ ] ¿Verifiqué botones, placeholders, focus rings y mensajes de error, no solo el texto principal?
- [ ] ¿El texto del botón nunca queda invisible contra su propio fondo (botón blanco + texto blanco, fondo transparente sobre fondo de página sin borde)?
- [ ] Si el componente es un badge/chip de estado con fondo sólido, ¿confirmé el ratio exacto en vez de asumir que el token "ya está validado"?

---

## 8. Omisiones estratégicas (lo que un agente de IA suele olvidar)

- [ ] ¿Hay enlaces legales (política de privacidad, términos) en el footer cuando corresponde?
- [ ] ¿Todo flujo tiene una forma de "volver atrás" — no hay callejones sin salida?
- [ ] ¿Existe una página 404 propia de la marca, no la del framework?
- [ ] ¿Los formularios validan en el cliente (campos requeridos, formato de email, etc.) además del backend?
- [ ] ¿Existe un skip-link ("saltar al contenido principal") para usuarios de teclado?
- [ ] ¿Si la jurisdicción lo requiere, hay aviso de cookies?

---

## 9. Calidad de código relacionada con UI (complementa, no repite, reglas backend/frontend existentes)

- [ ] HTML semántico (`<nav>`, `<main>`, `<article>`, `<aside>`, `<section>`) en vez de "div soup".
- [ ] Sin anchos en píxeles fijos cuando una unidad relativa (`%`, `rem`, `max-width`) sirve igual.
- [ ] Sin `alt=""` ni `alt="image"` en imágenes con significado — describir el contenido real.
- [ ] Sin valores de `z-index` arbitrarios (`9999`) — usar la escala de tokens existente (`--z-*`, ver hallazgo B-05 de la auditoría FASE1 sobre escalas duplicadas).
- [ ] Sin código muerto comentado ni artefactos de debug antes de dar por terminado.
- [ ] Meta tags básicos presentes (`title`, `description`) cuando la pantalla es pública.

---

## 10. Orden de remediación para pantallas legacy con deuda visual

Cuando se audita o retoca una pantalla existente que acumula deuda visual (no una pantalla nueva), seguir este orden — corregir en otro orden suele romper más de lo que arregla:

1. **Tipografía** — fuente con carácter en vez de la fuente por defecto del navegador, escala de tokens en vez de tamaños sueltos.
2. **Color** — limpiar colores que chocan u oversaturados; aplicar Color-Lock (§6) y corregir contraste (§7).
3. **Hover/active/focus** — estados interactivos antes que el layout, porque a menudo el layout ya está bien y lo que falta es feedback.
4. **Layout y espaciado** — grid consistente, max-width, padding uniforme, según `ui-ux-composition-rules.md`.
5. **Reemplazar componentes genéricos** — cambiar patrones cliché por alternativas de `shared/ui`.
6. **Estados** — loading/empty/error completos (§2).
7. **Pulir tipografía y espaciado** — el toque final, ya con todo lo estructural resuelto.

---

## Checklist resumen para agentes (antes de dar por terminada una pantalla)

- [ ] §0 Diseño fundamentado en el dominio real, no en un default genérico
- [ ] §1 Nombres desde la perspectiva del usuario, verbo consistente en todo el flujo
- [ ] §2 Estados obligatorios (loading/empty/error + hover/active/focus) completos
- [ ] §3 Sin anti-clichés visuales genéricos de IA (tipografía/color/layout/chrome/componentes/iconografía)
- [ ] §4 Sin datos de ejemplo genéricos (nombres, números perfectos, Lorem Ipsum)
- [ ] §5 Voz de UI consistente, cero guion largo (`—`) en texto visible
- [ ] §6 Color-Lock y Shape-Lock respetados dentro de la vista
- [ ] §7 Contraste WCAG AA verificado sobre pares reales, no solo tokens aislados
- [ ] §8 Sin omisiones estratégicas (legal, 404, back-nav, skip-link, validación)
- [ ] Si es remediación de pantalla legacy: seguido el orden de §10

---

## Referencias

- [UI/UX Composition Rules](./ui-ux-composition-rules.md) — mecánica de grid/flex/jerarquía de botones
- [Design Tokens Rule](./design-tokens-rule.md) — tokens CSS obligatorios
- [UI Audit Protocol](./ui-audit-protocol.md) — este documento es su STEP 5
- [Auditoría FASE 1 del Design System](../../appsweb/angular/design-system/auditoria-DS-FASE1.md) — evidencia real de los gaps de contraste y gobernanza que motivaron §7
- Repos externos evaluados (no instalados, solo origen de las ideas traducidas): [anthropics/skills](https://github.com/anthropics/skills) (`frontend-design`), [leonxlnx/taste-skill](https://github.com/leonxlnx/taste-skill) (`taste-skill`, `redesign-skill`)
