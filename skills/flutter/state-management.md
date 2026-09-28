# Flutter — State Management (paridad Angular Signals / OnPush)

## Regla obligatoria
- Estado con el paquete `signals` (`signal()`, `computed()`, `effect()`) o **Riverpod** (`ref.watch`, `ref.read`).
- NO `setState` masivo en widgets grandes; actualizar solo el subtree que observa la señal/provider.
- Equivalente a Angular: `signal()` ↔ `signal()`, `computed()` ↔ `computed()`, `effect()` ↔ `effect()`.

## Rebuild selectivo (equivalente OnPush, Angular §2.4)
- `const` constructors en TODOS los `StatelessWidget` que no dependen de estado mutable.
- Dividir la UI en widgets pequeños; usar `Consumer`/`Watch`/`AnimatedBuilder`/`ValueListenableBuilder` para rebuilds locales.
- Prohibido llamar `setState` en un widget padre que reconstruya hijos pesados.

## Control flow (equivalente @if/@for/@switch, Angular §2.2)
- Usar colecciones con control de flujo dentro del `build`:
  ```dart
  Column(children: [
    if (loading) const CircularProgressIndicator(),
    for (final item in items) ItemTile(item),
    switch (state) {
      ErrorState() => const ErrorView(),
      _ => const SizedBox.shrink(),
    },
  ]);
  ```
- NO `ListView(... children: [for ...])` sobre datos grandes; usar `ListView.builder`.

## Lazy loading (equivalente @defer, Angular §2.5)
- Módulos pesados (gráficos, PDF) con `deferred as` import:
  ```dart
  import 'package:luxury/heavy_chart.dart' deferred as heavy;
  ```
- Listas grandes con `ListView.builder` + paginación/infinite scroll.
