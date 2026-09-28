# Guía de Arquitectura Headless (PrimeNG 22 Unstyled)

En el Design System de LuxuryApp priorizamos el control total de la interfaz, la accesibilidad (WCAG) y el rendimiento. Por defecto, PrimeNG 22 utiliza el modo `Unstyled`, lo que significa que provee la lógica interna de los componentes (Focus management, ARIA, accesibilidad por teclado) pero nos permite inyectar el CSS de Tailwind o nuestras variables CSS Custom Properties sin sobreescribir estilos base `p-*`.

## Principios Fundamentales

1. **Separación Lógica/Vista:** Usa las directivas o componentes de PrimeNG, pero provéele las clases o usa Signals para manejar el estado visual en un wrapper.
2. **Preset como Fuente de Verdad:** Si usas componentes completos (ej. `<p-button>`), asegúrate de que respondan a los tokens definidos en `luxury-preset.ts`.
3. **Hooks (Angular Signals):** Para comportamientos hiper-personalizados que no encajan en el Preset, envuelve la lógica en funciones que retornen *Signals* (`useButton`, `useTable`, etc.).

## Ejemplo Práctico: `useButton` (Angular 22)

En lugar de depender exclusivamente de la API de PrimeNG para todos los botones del ecosistema, podemos crear un *hook* funcional que encapsule estados de UI (loading, disabled) e interactúe fluidamente con la lógica de negocio usando el API de Signals.

Revisa la implementación base en: `src/app/shared/ui/headless/use-button.ts`
