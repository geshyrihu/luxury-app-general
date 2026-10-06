# Prompt para Agente externo — Fase 1: actualizar demos legacy del catálogo Admin

Eres implementador Angular senior. Migra ejemplos interactivos de botones retirados en catálogo Admin a API actual; no refactorices biblioteca ni consumidores fuera del archivo autorizado.

## Baseline / evidencia

- Repo Angular `D:\repos\luxuryapp-api\appsweb\angular`, `main` en `4b66d24e3`, limpio al inicio.
- Build fresco posterior al cierre warnings: bundle generado, cero warnings/errores.
- Componente está en ruta lazy viva `src/app/modules/admin.luxuryapp/admin.routes.ts:585-588`.
- 47 usos activos legacy `<il-button*>`/`<iw-button*>` en `src/app/modules/admin.luxuryapp/infrastructure/catalog-component-ui/catalog-web-item/catalog-web-item.ts`; el componente ya importa `ButtonWeb`.
- La auditoría source encontró que ButtonWeb no acepta `ticketId` ni `state`; `view-pdf` usa bridge `PdfViewerTrigger` si se quiere abrir visor.

## Scope autorizado

- Editar únicamente `src/app/modules/admin.luxuryapp/infrastructure/catalog-component-ui/catalog-web-item/catalog-web-item.ts`.
- Si pruebas demuestran necesidad de ajuste de test, detener y reportar antes de editar archivo adicional.
- No editar `shared/ui`, `admin.routes.ts`, `ui-dictionary.ts`, otros demos o módulos.

## Trabajo

1. Revisa cada uno de los 47 tags dentro del template real; clasifica control genérico, `kind` legacy, icon-only o acción especial.
2. Sustituye elementos runtime por `<lux-button-web>` y usa exclusivamente props/tipos verificados en `buttons/web/button.ts`, `buttons/base/base-button.ts` y `buttons/web/index.ts`.
3. Mapea acciones soportadas a `kind` (`add`, `edit`, `delete`, `save`, `download`, `confirm`, `send-email`, `view-pdf`, `tracking`, `active-desactive`, `item`) con `displayMode="icon"` para ejemplos que eran `iw-*`; personaliza clase/label/icon cuando el caso lo requiera.
4. `ticketId` no es input soportado por ButtonWeb: no inventarlo. Mostrar `badgeCount` solo como badge visual y dejar claro en copy que la lógica de tracking pertenece al consumidor.
5. `state` no es input de ButtonWeb: reemplazar el ejemplo active/desactive por un ejemplo custom válido, explicando que el consumidor deriva label/icon del estado.
6. Para PDF, inspecciona `PdfViewerTrigger`; úsalo solo con API/import válidos y datos demo que no abran una URL externa. Si el ejemplo no puede ejecutar acción segura localmente, muestra la API como texto escapado `<code>`, no como elemento custom desconocido.
7. Renueva títulos/descripciones para explicar API actual `kind` + `displayMode`. Código legacy histórico puede aparecer como texto HTML escapado (`&lt;...&gt;`), nunca como elemento compilable.
8. Preserva las demás demos del catálogo y layout.

## Límites / coordinación

- No reemplazos globales, regex sobre repo, cambios en otros templates ni schemas para silenciar Angular.
- Antes de stage, inspecciona `git diff`; stagea solo el path autorizado. Prohibido `git add .`, `commit -a`.
- Si el diff requerido excede el archivo autorizado, pausa y solicita nueva fase.

## Verificación y entrega

- `npm run build` y `npm run audit:ui`; reporta salida/código de ambas.
- `git grep -n -E '<(il|iw)-button' -- <archivo>` debe encontrar cero tags runtime; referencias escapadas como documentación se explican.
- QA de la ruta del catálogo en navegador si entorno autenticado/API está disponible. Si bloqueado, reporta límite; no guardar credenciales/cookies/screenshots sensibles en repo.
- Entrega diff, conteo de usos migrados por kind, cualquier caso no soportado y commit limitado al archivo, o explica por qué no commitaste.
