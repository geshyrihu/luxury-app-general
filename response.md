I see what happened: while I was on the detached baseline 500211248, someone/something committed 9a3857dfd (an unrelated feature: "captura modalidad interna en mantenimiento") and there are many working-tree changes. This is a shared repo with concurrent work. I must not disturb it.
My Fase 0 commits are safe at 7c853d068 (reflog HEAD@{2}). Let me stop making changes and verify my commits are intact, then report. Let me check without touching the working tree.

# Running in appsweb\angular

$ Write-Output "=== my fase0 commits intact? ==="; git log --oneline -1 7c853d068; git log --oneline -1 de7db55e2; Write-Output "=== does 7c853d068 contain my changes? ==="; git show --stat 7c853d068 2>&1 | Select-Object -First 3; Write-Output "=== count working tree changes (concurrent work, NOT mine) ==="; (git status --short | Measure-Object -Line).Lines
=== my fase0 commits intact? ===
7c853d068 refactor(ui): migrar selectores embebidos de negocio de tag a clase (grupo C)
de7db55e2 refactor(ui): migrar CSS por nombre de tag a clases de host (grupo A)
=== does 7c853d068 contain my changes? ===
commit 7c853d068ad6b08d1f952384db5f46ebb0104e79
Author: geshyrihu <geshyrihu@users.noreply.github.com>
Date: Sat Oct 3 08:18:40 2026 -0600
=== count working tree changes (concurrent work, NOT mine) ===
695
Critical situation. There's active concurrent work in this repo (695 uncommitted files + a new commit 9a3857dfd made while I was on the detached baseline). My Fase 0 commits are safe at 7c853d068, but I must not run destructive git ops (checkout/stash) that could clobber someone else's in-progress work.
Let me stop and confirm with you before proceeding, because this is an irreversible-risk situation.

# Questions

Diagnóstico del 850px ya resuelto: es DEUDA UX PREEXISTENTE, no un fallo de Fase 0 (captura baseline en commit 500211248 muestra exactamente el mismo layout roto: columnas colapsadas a 1 carácter 'D i a s', '8 7 d i a s'). La tabla no tiene manejo responsive en la zona muerta 768–992px. PERO durante el diagnóstico detecté que el repo tiene trabajo concurrente activo: 695 archivos sin commitear + un commit nuevo (9a3857dfd 'captura modalidad interna en mantenimiento') que apareció mientras estaba en el baseline detached. Mis 3 commits de Fase 0 están intactos en 7c853d068. ¿Cómo procedo?
Espero a que el usuario cierre su trabajo
Entendido. Me detengo por completo.
Estado actual — NO toco nada más
Rama: appsweb/angular está en HEAD detached (desde 500211248), con:

- 695 archivos modificados sin commitear (trabajo concurrente, no mío)
- Un commit nuevo 9a3857dfd que apareció durante mi diagnóstico
  Mis commits de Fase 0 están intactos (reflog HEAD@{2}):
- de7db55e2 grupo A
- ca7457cd1 grupo B
- 7c853d068 grupo C
  No ejecutaré checkout, stash, reset ni ningún comando que pueda pisar el trabajo en curso.
  Diagnóstico 850px — concluido
  Es deuda UX preexistente, no una regresión de Fase 0. Prueba:
- Captura baseline (500211248, sin Fase 0) a 850px → layout roto idéntico: columnas colapsadas a 1 carácter (D i a s, 8 7 d i a s), celdas estiradas verticalmente.
- Captura post-Fase 0 a 850px → exactamente el mismo break.
- Causa raíz: la tabla (app-table) no tiene manejo responsive en la zona muerta 768–992px. PlatformService solo cambia a móvil por debajo de 768px; entre 768 y ~1000px la app sigue renderizando la tabla desktop, que no cabe y colapsa.
  No hay regla que revertir. Mi afirmación previa "sin regresiones visibles a 850px" fue errónea por optimismo — la corrijo: a 850px la tabla ya estaba rota antes de Fase 0.
  Pendiente cuando cierres tu trabajo

1. Avísame cuando el working tree esté limpio y pueda volver a main/7c853d068.
2. Repetiré la verificación visual en 1400 / 850 / 600 sobre el estado Fase 0 real (sin overlay de TS ni ediciones ajenas).
3. Escribiré el reporte de diagnóstico con la comparación baseline vs post-Fase 0 y la deuda UX 768–992px documentada (propuesta: regla min-width responsive en app-table o cambio de breakpoint, a decidir fuera de Fase 0).
   ¿Confirmo que espero tu señal para retomar?
