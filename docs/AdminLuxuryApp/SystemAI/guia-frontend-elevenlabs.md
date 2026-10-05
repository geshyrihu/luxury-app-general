# Implementación Frontend ElevenLabs

## Objetivo

Conectar el módulo backend de ElevenLabs con el frontend Angular para:

- Configurar una voz predeterminada desde el menú de configuración.
- Probar audio directamente desde una pantalla operativa.
- Reproducir automáticamente la respuesta del Auditor IA en reportes financieros.
- Permitir releer o detener el audio generado dentro del panel `ai-agent`.

## Archivos modificados

### Frontend Angular

- `client/angular/src/app/core/services/eleven-labs-settings.service.ts`
- `client/angular/src/app/core/services/eleven-labs.service.ts`
- `client/angular/src/app/features/configuration/eleven-labs/eleven-labs-settings.ts`
- `client/angular/src/app/features/configuration/eleven-labs/eleven-labs-settings.html`
- `client/angular/src/app/features/configuration/configuration-menu/settings-menu.ts`
- `client/angular/src/app/routing/settings.routing.ts`
- `client/angular/src/app/features/contabilidad/contabilidad-online/components/ai-agent/ai-agent.ts`
- `client/angular/src/app/features/contabilidad/contabilidad-online/components/ai-agent/ai-agent.html`
- `client/angular/src/app/features/contabilidad/contabilidad-online/pages/financial-reports-wrapper.html`

## Flujo implementado

### 1. Configuración de voz en Settings

Se agregó la opción `Configuración ElevenLabs` dentro de `Configuración de Sistema`.

Ruta frontend:

```text
/settings/eleven-labs
```

La pantalla permite:

- Cargar voces disponibles desde `GET eleven-labs/voices`
- Consultar consumo desde `GET eleven-labs/subscription-status`
- Elegir voz predeterminada
- Elegir modelo
- Ajustar `stability`, `similarity`, `style` y `speakerBoost`
- Activar o desactivar reproducción automática
- Probar una locución con texto libre

## Persistencia de configuración

La configuración no se guarda todavía en base de datos. Se persiste localmente en navegador mediante `StorageService`.

Clave usada:

```text
eleven_labs_frontend_settings
```

Campos persistidos:

```json
{
  "voiceId": "string",
  "voiceName": "string",
  "modelId": "eleven_multilingual_v2",
  "stability": 0.5,
  "similarity": 0.75,
  "style": 0.0,
  "speakerBoost": 0.0,
  "autoPlayResponses": true
}
```

## Servicio reutilizable

`ElevenLabsService` concentra la integración frontend con backend:

- `getVoices()`
- `getSubscriptionStatus()`
- `getSettings()`
- `saveSettings()`
- `playText()`
- `stopCurrentAudio()`

Responsabilidades del servicio:

- Consumir endpoints backend.
- Convertir `audioBase64` a `Blob`.
- Crear y reproducir `HTMLAudioElement`.
- Detener audios previos para evitar traslapes.
- Liberar `ObjectURL` al terminar.

## Integración con Auditor IA

El componente:

```text
client/angular/src/app/features/contabilidad/contabilidad-online/components/ai-agent
```

ahora:

- conserva el HTML sanitizado para mostrar la respuesta;
- conserva el contenido crudo para poder releerlo;
- convierte la respuesta HTML a texto plano;
- reproduce la respuesta mediante ElevenLabs si:
  - `autoReadResponses` está habilitado en el wrapper, y
  - `autoPlayResponses` está habilitado en la configuración guardada.

### Controles agregados en `ai-agent`

- Botón por mensaje para `Releer`
- Botón general para `Releer`
- Botón general para `Detener`
- Indicador visual mientras se está reproduciendo audio

## Integración con Financial Reports Wrapper

En:

```text
client/angular/src/app/features/contabilidad/contabilidad-online/pages/financial-reports-wrapper.html
```

se dejó explícita la activación del modo de lectura automática:

```html
<app-contabilidad-ai-agent #aiAgent [autoReadResponses]="true" />
```

Esto deja el comportamiento centralizado en `ai-agent`, pero activado desde la página contenedora donde vive el Auditor IA.

## Endpoints utilizados

### Obtener voces

```http
GET /api/eleven-labs/voices
```

### Obtener uso de suscripción

```http
GET /api/eleven-labs/subscription-status
```

Nota operativa:

- ElevenLabs puede responder `401 Unauthorized` si la API key no incluye el permiso `user_read`.
- Esa restricción afecta la consulta de suscripción, pero no necesariamente la generación de audio.
- El frontend ya no consulta la suscripción automáticamente al abrir la pantalla; la consulta queda manual para evitar ruido operativo.

### Obtener voces

```http
GET /api/eleven-labs/voices
```

Nota operativa:

- Si este endpoint responde `401 Unauthorized`, la API key no puede listar voces.
- En ese caso, el frontend permite capturar el `voiceId` manualmente para seguir usando `text-to-speech`.

### Generar audio

```http
POST /api/eleven-labs/text-to-speech
```

Payload usado por frontend:

```json
{
  "text": "Texto a leer",
  "voiceId": "voice_id",
  "modelId": "eleven_multilingual_v2",
  "stability": 0.5,
  "similarity": 0.75,
  "style": 0.0,
  "speakerBoost": 0.0
}
```

## Supuestos actuales

- La API Key sigue configurándose únicamente en backend.
- El frontend no expone secretos de ElevenLabs.
- La configuración de voz es por navegador/usuario local, no por cliente ni por tenant.
- El HTML de respuesta IA se simplifica a texto plano antes de enviarse a ElevenLabs.

## Pendientes recomendados

- Persistir configuración por usuario en backend si se requiere roaming entre dispositivos.
- Agregar selector de voz por módulo o por contexto.
- Guardar historial de últimas reproducciones o texto resumido.
- Incorporar fallback a `speechSynthesis` del navegador cuando ElevenLabs no esté configurado.
- Añadir pruebas unitarias para `ElevenLabsService` y para la lógica de autoplay del `ai-agent`.
