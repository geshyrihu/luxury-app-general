# TICKET FH-01c — Corrección: 1 ocurrencia de `DateTime.Now` que faltó en FH-01

Continuación de FH-01/FH-01b. Al auditar el resultado de FH-01, se confirmó que quedó **una
ocurrencia sin corregir** — error de conteo en el prompt original de FH-01, no del ejecutor: el
punto 4 de ese ticket listaba para `CobranzaOnlineDashboardAppService.cs` las líneas "265, 790,
994, 1638, 1912" y se omitió una sexta.

## Tarea

Archivo: `api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline/Services/CobranzaOnlineDashboardAppService.cs:1269`

```csharp
syncMetadata.SyncMessage = $"Aspel no respondio para Analisis de Cobranza. Estas viendo respaldo local al {DateTime.Now:dd-MMM-yy HH:mm}.";
```

Cambia `DateTime.Now` por `DateTime.UtcNow` en esa línea — mismo tratamiento que las otras 4
ocurrencias de `SyncMessage` en este archivo (líneas 790, 994, 1638, 1912), que ya se corrigieron
en FH-01 y tienen un comentario `// TODO(FH-01)` compartido en la línea 790 señalando que ese texto
ahora muestra hora UTC.

Esta línea 1269 es del mismo tipo (texto de estado mostrado al usuario), así que **actualiza el
`TODO(FH-01)` existente en la línea 790** para que también mencione la línea 1269 en su lista, en
vez de crear un comentario nuevo — mantiene una sola referencia por archivo, como ya se hizo con
las otras 4.

## Lo que NO debes hacer

- No toques ninguna otra línea de este archivo ni de ningún otro.
- No agregues manejo de zona horaria — sigue fuera de alcance, igual que en FH-01.

## Verificación obligatoria

```bash
grep -n "DateTime\.Now\b" api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline/Services/CobranzaOnlineDashboardAppService.cs
# Resultado esperado: 0 líneas

grep -n "TODO(FH-01)" api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline/Services/CobranzaOnlineDashboardAppService.cs
# Resultado esperado: 1 línea, mencionando también 1269

dotnet build api/LuxuryApp.Application/LuxuryApp.Application.csproj
```

## Criterio de PASO

- 0 ocurrencias de `DateTime.Now` en el archivo.
- El `TODO(FH-01)` de la línea 790 menciona ahora la línea 1269.
- Build sin errores nuevos.

## Reporte de finalización

1. Diff exacto de la línea 1269 y del `TODO(FH-01)` actualizado.
2. Salida literal de los 3 comandos de verificación.

Con esto se cierra FH-01 por completo (13 de 13 puntos). No avances a FH-02 todavía — confírmalo
primero.
