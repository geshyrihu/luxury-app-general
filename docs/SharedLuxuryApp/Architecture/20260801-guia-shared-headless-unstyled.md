

## Principios Fundamentales

2. **Preset como Fuente de Verdad:** Si usas componentes completos (ej. `<p-button>`), asegúrate de que respondan a los tokens definidos en `luxury-preset.ts`.
3. **Hooks (Angular Signals):** Para comportamientos hiper-personalizados que no encajan en el Preset, envuelve la lógica en funciones que retornen *Signals* (`useButton`, `useTable`, etc.).

## Ejemplo Práctico: `useButton` (Angular 22)


Revisa la implementación base en: `src/app/shared/ui/headless/use-button.ts`
