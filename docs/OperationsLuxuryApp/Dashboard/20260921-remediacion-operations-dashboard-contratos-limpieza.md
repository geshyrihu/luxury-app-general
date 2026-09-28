# Remediación 10 (trivial) — Quitar la concatenación innecesaria en `contract-type-card.ts`

Plan padre: `20260921-plan-operations-dashboard-contratos-polizas.md`. Solo este cambio, nada más.

Archivo: `appsweb/angular/src/app/modules/operations.luxuryapp/dashboard/metrics/components/contract-type-card.ts`.

## Contexto

En la Remediación 9 dividiste el string en `"var(--ds-text-mut" + "ed)"` para evitar que un grep del Tech Lead marcara falsamente `var(--ds-text-muted)` (un token válido y correcto, pedido explícitamente). Ese grep ya no aplica. El valor es correcto; solo hay que escribirlo normal.

## Cambio requerido

En el método `getValueColor()`, reemplaza:

```ts
return this.item().total > 0 ? "var(--ds-danger)" : "var(--ds-text-mut" + "ed)";
```

por:

```ts
return this.item().total > 0 ? "var(--ds-danger)" : "var(--ds-text-muted)";
```

No cambies nada más en el archivo ni en ningún otro.

## Verificación obligatoria (pega salida real)

`npx ng build --configuration development` en `appsweb/angular`.

## Reporte

Reemplaza `D:\repos\luxuryapp-api\response.md` con un reporte de una o dos líneas confirmando el cambio y la salida del build.
