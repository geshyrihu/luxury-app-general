# Flutter — Acceso a API (paridad Angular §4 / .NET §9)

## Regla obligatoria
- **PROHIBIDO** `http`/`dio` directo en features. Todas las llamadas pasan por `ApiResponseService`
  (loader, toasts, logging y errores centralizados).
- Endpoint relativo kebab-case idéntico al backend:

  ```dart
  final dto = await apiResponseS.post<PanicAlertDto>("panic-alerts", body);
  ```

## Nomenclatura de endpoints (OBLIGATORIA, idéntica front/back)
- Siempre `api/<recurso-plural-kebab>` en minúsculas (`api/banks`, `api/payment-methods`).
- El string del front debe coincidir **carácter a carácter** con `MapGroup("api/panic-alerts")` del backend (.NET §9).
- PROHIBIDO PascalCase, guiones bajos y token `[controller]`.

## Cliente HTTP y resilientcia
- Usar `dio` como cliente subyacente detrás de `ApiResponseService`.
- Retry / circuit-breaker con interceptores: `dio_smart_retry` (equivalente Polly v8 .NET §9). No paquetes legacy.
- Cancelar peticiones con `CancelToken` (equivalente `CancellationToken`). NO `.wait` bloqueante.

## Respuestas
- Siempre envolver en `ApiResponseDTO<T>` para éxitos y errores (NO `ProblemDetails`, .NET §9).
- Manejo centralizado de errores y toasts en `ApiResponseService`.
