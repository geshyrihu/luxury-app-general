# ⚙️ Logging & Tracing Standards

> **Deep-dive:** las reglas generales están en CONVENTIONS.md §9 (Logging). Este archivo contiene ejemplos detallados.

## 2.3. Trazabilidad y Logs
El proyecto usa **Serilog** con sink a SQL Server (tabla `Logs`).
- **Inyección**: Siempre via `ILogger<T>` inyectado en constructor. Prohibido usar `Serilog.Log` estático en servicios.

## Niveles de Logging

| Nivel            | Cuándo usarlo                                                                     |
| ---------------- | --------------------------------------------------------------------------------- |
| `LogInformation` | Hitos de negocio: inicio, éxito de operación.                                     |
| `LogWarning`     | Casos anómalos pero esperados: registro no encontrado, regla bloqueada.           |
| `LogError`       | Excepciones inesperadas en bloque `catch`.                                        |
| `LogDebug`       | Solo en desarrollo. No usar en producción.                                        |

## Reglas de Oro
- **Message Templates**: Usar `{NombreParam}` — **nunca** interpolación de strings (`$"..."`) en logs.
- **Seguridad**: No loguear contraseñas, tokens JWT ni datos personales sensibles.
- **Catch**: Loguear siempre el objeto `Exception ex` completo en `LogError(ex, "Mensaje")`.
