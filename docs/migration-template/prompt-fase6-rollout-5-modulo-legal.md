# Prompt 5 — Fase 6: rollout completo de `legal.luxuryapp` (15 archivos)

Segundo lote real del codemod, ahora un módulo completo. Ya se
verificó que ninguno de estos 15 archivos está en la lista de 27 casos
especiales (`pTemplate=`, inputs no soportados, `p-sorticon` sin
`field`) — todos califican para el patrón estándar, con una sola
excepción puntual (punto 1).

## 1. Fix puntual antes de correr el script

En `src/app/modules/legal.luxuryapp/comite-vigilancia/comites-list.html`,
mismo markup muerto ya visto en `ai-knowledge-base-list.html` (sin
`[virtualScroll]="true"` que lo acompañe, nunca tuvo efecto bajo

## 2. Lote completo (15 archivos)

```
src/app/modules/legal.luxuryapp/asuntos-legales-y-seguros/asunto-legal/asunto-legal-lista.html
src/app/modules/legal.luxuryapp/asuntos-legales-y-seguros/documento-personalizado/documento-personalizado-lista.html
src/app/modules/legal.luxuryapp/asuntos-legales-y-seguros/minutas/legal-pendientes-minuta.html
src/app/modules/legal.luxuryapp/asuntos-legales-y-seguros/ticket-legal/ticket-legal-lista-cliente.html
src/app/modules/legal.luxuryapp/asuntos-legales-y-seguros/ticket-legal/ticket-legal-lista.html
src/app/modules/legal.luxuryapp/asuntos-legales-y-seguros/ticket-legal/ticket-legal-reportes-externos.html
src/app/modules/legal.luxuryapp/asuntos-legales-y-seguros/ticket-legal/ticket-legal-reportes-internos.html
src/app/modules/legal.luxuryapp/asuntos-legales-y-seguros/ticket-legal/ticket-legal-reportes-pendientes.html
src/app/modules/legal.luxuryapp/comite-vigilancia/comite-vigilancia-list.html
src/app/modules/legal.luxuryapp/comite-vigilancia/comites-list.html
src/app/modules/legal.luxuryapp/employees-contracts/addendum-template/addendum-template-list.html
src/app/modules/legal.luxuryapp/employees-contracts/contract-addendum/contract-addendum-list.html
src/app/modules/legal.luxuryapp/employees-contracts/contract-template/contract-template-list.html
src/app/modules/legal.luxuryapp/employees-contracts/legal-staff-board.html
src/app/modules/legal.luxuryapp/employees-contracts/work-contract/work-contract-list.html
```

## 3. Procedimiento (ya validado en la ronda anterior, mismo orden)

1. `node scripts/migrate-p-table-standard.mjs --dry-run <los 15 archivos>`.
2. Revisa el reporte generado (`dry-run-lote-piloto-script.md` — se
   sobreescribe, está bien): **deberían salir los 15 transformados, 0
   excluidos, 0 advertencias** (ya se descartó `pTemplate`/sorticon
   raro/inputs no soportados de antemano). Si sale algo distinto —
   cualquier exclusión o advertencia no esperada — **detente y
   repórtalo tal cual antes de escribir nada.**
3. Si el dry-run da exactamente lo esperado, corre el mismo comando
   con `--write`.
4. `npx tsc --noEmit` → limpio (ya no debería haber ningún error
   preexistente ajeno, esos ya se resolvieron).
5. `ng build` o `ng serve` compilando sin `NG8002`/similares — no te
   quedes solo con `tsc`.
   los 15 archivos → 0 resultados reales.

## 4. Verificación visual

Elige **4 pantallas** representativas de los 3 sub-módulos
(`asuntos-legales-y-seguros`, `comite-vigilancia`,
`employees-contracts`) — por ejemplo `ticket-legal-lista.html`,
`comites-list.html` (la que tenía el fix del punto 1),
`contract-template-list.html`, `legal-staff-board.html`. Navega cada
una, confirma que carga, ordena, pagina, y el caption (buscar/agregar)
funciona. Capturas reales guardadas como archivo
(`docs/migration-template/fase6-rollout-5-<nombre>.png`), no solo
descritas.

## Listo cuando

- 15 archivos migrados, diff coherente con el dry-run ya revisado.
- Fix del punto 1 aplicado.
- `tsc` y `ng build`/`ng serve` limpios.
- 4 capturas reales guardadas y reportadas con su ruta.
- Reporta `git diff --stat` completo del lote.

Con esto cerrado, `legal.luxuryapp` queda 100% migrado (15/15) y el
total sube a 27/334. Seguimos con el siguiente módulo después de
auditar este.
