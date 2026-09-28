# TICKET FH-12b — Corrección: 2 líneas de `PropertyMemberService.cs` con la variante `?? DateTime.UtcNow`

Continuación de FH-12. El ticket original buscaba la subcadena exacta
`DateOnly.FromDateTime(DateTime.UtcNow)` y reemplazó 35 ocurrencias en 25 archivos. Quedaron fuera
2 líneas con una variante textualmente distinta pero con el mismo bug de fondo.

## Qué pasó

`api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaNativa/Core/Members/Services/PropertyMemberService.cs`,
líneas 117 y 136:

```csharp
var refDate = DateOnly.FromDateTime(asOf ?? DateTime.UtcNow);
```

`asOf` es un parámetro opcional (`DateTime? asOf = null`) que representa "fecha de referencia,
por defecto ahora" — usado para saber quién es el responsable financiero de una propiedad, o los
destinatarios de una notificación, "a partir de" cierta fecha. Cuando el llamador no especifica
`asOf` (el caso común: "¿quién es el responsable **ahora**?"), cae en el mismo patrón que el resto
de FH-12: da el día calendario **UTC**, no el de México — 6 horas de diferencia real todos los días.

El grep de FH-12 buscaba la subcadena exacta `DateOnly.FromDateTime(DateTime.UtcNow)` y no
coincide aquí porque `DateTime.UtcNow` está dentro de un `??`, no como único argumento — el
ejecutor de FH-12 lo notó correctamente y no lo tocó (comportamiento correcto: no forzar un cambio
fuera del patrón exacto pedido). Esta es la corrección de ese punto ciego.

## Tarea

Cambia ambas líneas:

```csharp
// Línea 117
var refDate = DateOnly.FromDateTime(asOf ?? DateTime.UtcNow);
```
→
```csharp
var refDate = DateOnly.FromDateTime(asOf ?? DateTimeExtension.GetMexicoDateOnly());
```

```csharp
// Línea 136
var refDate = DateOnly.FromDateTime(asOf ?? DateTime.UtcNow);
```
→
```csharp
var refDate = DateOnly.FromDateTime(asOf ?? DateTimeExtension.GetMexicoDateOnly());
```

`DateTimeExtension` ya resuelve en este archivo vía el global using del proyecto
(`LuxuryApp.Application.csproj`, `<Using Include="LuxuryApp.Shared.Extensions" />` — confirmado en
la auditoría de FH-12) — no hace falta agregar ningún `using`.

## Lo que NO debes hacer

- No toques ninguna otra línea de `PropertyMemberService.cs` (las 7 líneas de FH-12 ya están
  corregidas; no las toques de nuevo).
- No cambies la firma de `GetFinancialResponsibleAsync` ni `GetNotificationRecipientsAsync`, ni el
  tipo de `asOf` (`DateTime?`).
- No busques ni corrijas otras variantes de este patrón en otros archivos — si existieran, se
  cubrirían en un ticket aparte, no aquí.

## Verificación obligatoria

```bash
grep -n "DateOnly.FromDateTime(asOf ?? DateTime.UtcNow)" api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaNativa/Core/Members/Services/PropertyMemberService.cs
# Resultado esperado: 0 líneas

grep -n "DateOnly.FromDateTime(asOf ?? DateTimeExtension.GetMexicoDateOnly())" api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaNativa/Core/Members/Services/PropertyMemberService.cs
# Resultado esperado: 2 líneas (117 y 136)

dotnet build api/LuxuryApp.Application/LuxuryApp.Application.csproj
```

## Criterio de PASO

- Las 2 líneas usan `DateTimeExtension.GetMexicoDateOnly()`.
- Ningún otro punto del archivo fue tocado.
- Build sin errores nuevos.

## Reporte de finalización

1. Diff exacto de las 2 líneas.
2. Salida literal de los 3 comandos de verificación.

Con esto se cierra FH-12 por completo. No avances a ningún otro ticket. Espera la auditoría.
