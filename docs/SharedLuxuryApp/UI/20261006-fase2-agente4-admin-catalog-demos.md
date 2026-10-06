# Prompt para Agente externo 4 — reparar ejemplos de botones en catálogo Admin

Eres implementador Angular. Corrige la migración defectuosa de ejemplos de botones en dos demos activas del catálogo Admin; no toques el archivo `catalog-web-item.ts`, que tiene cambios locales concurrentes de limpieza.

## Scope exclusivo

- `src/app/modules/admin.luxuryapp/infrastructure/catalog-component-ui/catalog-patterns-item/catalog-patterns-item.ts`
- `src/app/modules/admin.luxuryapp/infrastructure/catalog-component-ui/foundations/catalog-guide-item/button-catalog/button-catalog.ts`

## Instrucciones

1. Inspecciona el API real de `ButtonWeb`/`ButtonMobile` y cada `displayMode="icon"-<suffix>` de los dos templates inline.
2. Traduce `<lux-button-web displayMode="icon"-edit>` a `<lux-button-web kind="edit" displayMode="icon">`; no dejes `-edit` como atributo HTML. Para un icon-only genérico conserva icon/ariaLabel del caso.
3. Para estados antiguos `[state]`, tracking con `ticketId` o confirmación interna, no inventes inputs/eventos; sustituye por demo válida de API actual y texto explicativo si no hay equivalencia.
4. Mantén valor didáctico del catálogo y su estructura responsive. No borres la sección ni reemplaces template por placeholder.
5. Asegura que clases importadas estén en `@Component.imports`; no añadir esquemas para silenciar.

## Coordinación y entrega

Usar worktree aislado desde `b01151c30`; solo stagear los dos paths listados. Revisar si hay cambios preexistentes antes de editar y detener si los paths ya están ocupados. Reportar cantidad de atributos/tags reparados, casos no soportados y commit.
