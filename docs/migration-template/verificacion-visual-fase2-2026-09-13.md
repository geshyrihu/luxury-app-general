# Verificación visual fase 2 — 2026-09-13

Se repitió la revisión con Playwright sobre la aplicación local levantada con `ng serve`. Antes de cada captura se confirmó la sesión de `admin`; no se conservaron capturas del formulario de login. Para cada tema se comprobó `document.body.classList.toggle('theme-dark')` y que el sidebar cambiara a fondo oscuro (`rgb(0, 37, 61)`).

| Componente | Pantalla y ruta cuyo contenido aparece en la imagen | Screenshot claro | Screenshot oscuro | Hallazgos |
|---|---|---|---|---|
| `app-progress-bar` | Solicitud de Compra — `/purchases/solicitud-compra/1`. `/committee/cobranza` redirigió a login incluso tras reautenticar, por lo que se dejó como ruta bloqueada y se usó la alternativa accesible. | [solicitud-compra-claro.png](solicitud-compra-claro.png) | [solicitud-compra-oscuro.png](solicitud-compra-oscuro.png) | La barra horizontal superior sí es visible. En claro usa el azul de marca cercano a `--ds-primary` (`#003152`); en oscuro cambia a azul claro. No hay solapamientos de la barra. En oscuro se aprecia contraste débil en algunos controles y etiquetas sobre fondos oscuros. |
| `app-spinner` | Minutas pendientes — `/report/pending-minutes`. | [spinner-claro.png](spinner-claro.png) | [spinner-oscuro.png](spinner-oscuro.png) | Spinner visible en la vista de pendientes. El sidebar cambia a oscuro y el contenido conserva su estructura; no se observan textos sin estilo, bordes rotos ni solapamientos. |
| `app-badge` vía `iw-button-tracking` | Listado de Tickets Legales — `/legal/list-ticket-legal`. `/recurring-tasks/my-tasks` cargó vacío, sin tabs con contador; por eso la evidencia corresponde a la alternativa legal con datos reales. | [badge-legal-claro.png](badge-legal-claro.png) | [badge-legal-oscuro.png](badge-legal-oscuro.png) | Se observan estados `PENDIENTE` y controles de seguimiento/comentario. Los encabezados de la tabla se parten en varias líneas por el ancho disponible, pero no se solapan. El azul de marca aparece en navegación y controles; el tema oscuro cambia correctamente el sidebar y la tabla. |
| `app-avatar` | Dashboard unificado — `/dashboard` (ruta que representa el dashboard solicitado). | [avatar-dashboard-claro.png](avatar-dashboard-claro.png) | [avatar-dashboard-oscuro.png](avatar-dashboard-oscuro.png) | Hay datos reales y avatares circulares con iniciales de responsables (`J`, `T`, `R`, etc.) dentro de las filas. No se observan solapamientos ni tamaños rotos del avatar. Se ve además un icono de imagen ausente en el perfil del shell, ajeno al componente verificado. |

## Resultado de sesión y tema

- Las ocho capturas referenciadas fueron tomadas con `admin` autenticado; no se guardó ninguna pantalla de login.
- Las cuatro parejas claro/oscuro son visualmente distintas: el sidebar oscuro aparece con fondo azul marino y se confirmó por estilo computado.
- La ruta de comité para `app-progress-bar` queda documentada como bloqueada para `admin`; la evidencia del componente proviene de la ruta alternativa accesible de Solicitud de Compra.
