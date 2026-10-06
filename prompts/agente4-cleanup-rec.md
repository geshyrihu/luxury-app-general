# Agente 4 - Limpieza de Imports y TS Error (Recruitment, Maintenance)

**Misión:** Eliminar referencias huérfanas en los arreglos `imports: [...]` de `@Component` y reparar un par de errores de tipado de TypeScript.

**Dominio ESTRICTO:**
- `appsweb/angular/src/app/modules/recruitment.luxuryapp`
- `appsweb/angular/src/app/modules/maintenance.luxuryapp`

## Tareas

1. **Limpiar `imports: []` muertos:**
   - En tu dominio (especialmente en `recruitment`), hay docenas de componentes que todavía tienen `WebButtonLabel`, `WebButtonIcon`, etc., en su decorador `@Component({ imports: [ ... ] })`.
   - Búscalos y **elimínalos** del arreglo.

2. **Fix TS2339 (Destructuring de FormControls):**
   - El compilador arroja: `Property 'invalid' does not exist on type 'string'` en dos archivos:
     - `candidate-process-hiring-modal.ts` (aprox línea 423)
     - `employee-unified-profile-form.ts` (aprox línea 478)
   - El error está en: `.filter(([ control]) => control.invalid)`
   - El destructuring de `Object.entries` está mal escrito. `[ control]` asigna la *llave* (string) a la variable `control`.
   - **Arréglarlo:** Cámbialo a `.filter(([key, control]) => control.invalid)`

3. **Guardado y Commit:**
   - Usa `git add` explícito para tus rutas.
   - Commit: `fix(recruitment,maintenance): remueve imports huerfanos y corrige TS2339 en destructuring`