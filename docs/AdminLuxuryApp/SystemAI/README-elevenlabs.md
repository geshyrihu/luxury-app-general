# 🎙️ Módulo ElevenLabs - Text-to-Speech

Módulo de integración con la API de **ElevenLabs** para servicios de síntesis de voz (Text-to-Speech) en LuxuryApp.

## 📋 Descripción

Este módulo permite convertir texto a audio natural usando inteligencia artificial con las voces de alta calidad de ElevenLabs. Proporciona endpoints para:

- 🗣️ **Obtener lista de voces disponibles** con filtros y características
- 🎵 **Convertir texto a audio** con configuración personalizable de voz
- 📊 **Consultar estado de suscripción** y uso de caracteres

## 📁 Estructura del Módulo

```
Features/ElevenLabs/
├── Controller/
│   └── ElevenLabsController.cs          # Endpoints de la API
├── DTOs/
│   ├── TextToSpeechRequestDTO.cs        # Solicitud de texto a voz
│   ├── TextToSpeechResponseDTO.cs       # Respuesta con audio generado
│   ├── VoiceInfoDTO.cs                  # Información de una voz
│   └── SubscriptionStatusDTO.cs         # Estado de la suscripción
├── Interfaces/
│   └── IElevenLabsAppService.cs         # Contrato del servicio
├── Services/
│   └── ElevenLabsAppService.cs          # Implementación del servicio
└── Mapping/
    └── ElevenLabsMapper.cs              # Documentación de mapeo manual
```

## 🔧 Configuración

### 1. Obtener API Key

1. Ve a https://elevenlabs.io/app/developers/api-keys
2. Inicia sesión o crea una cuenta
3. Copia tu API Key (formato: `sk_...`)

### 2. Configurar en appsettings.json

```json
"ElevenLabs": {
  "ApiKey": "sk_YOUR_ELEVENLABS_API_KEY_HERE"
}
```

> **⚠️ Importante:** Nunca commitear API Keys reales al repositorio. Usar variables de entorno o Azure Key Vault en producción.

## 🌐 Endpoints de la API

### 1. Obtener Lista de Voces

```http
GET /api/eleven-labs/voices
Authorization: Bearer {token}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": [
    {
      "voiceId": "21m00Tcm4TlvDq8ikWAM",
      "name": "Rachel",
      "category": "premade",
      "description": "calm American woman",
      "accent": "american",
      "gender": "female",
      "age": "young",
      "useCases": ["narration", "audiobook"],
      "labels": ["accent", "gender", "age"]
    }
  ],
  "errors": [],
  "responseCode": 200,
  "timestamp": "2026-04-15T12:00:00Z"
}
```

### 2. Convertir Texto a Voz

```http
POST /api/eleven-labs/text-to-speech
Authorization: Bearer {token}
Content-Type: application/json

{
  "text": "Hola, bienvenido a Luxury Building",
  "voiceId": "21m00Tcm4TlvDq8ikWAM",
  "modelId": "eleven_multilingual_v2",
  "stability": 0.5,
  "similarity": 0.75,
  "style": 0.0,
  "speakerBoost": 0.0
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Audio generado exitosamente",
  "data": {
    "audioBase64": "//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZw...",
    "contentType": "audio/mpeg",
    "sizeBytes": 45678,
    "durationSeconds": 3.5,
    "voiceId": "21m00Tcm4TlvDq8ikWAM",
    "modelId": "eleven_multilingual_v2"
  },
  "errors": [],
  "responseCode": 200,
  "timestamp": "2026-04-15T12:00:00Z"
}
```

### 3. Consultar Estado de Suscripción

```http
GET /api/eleven-labs/subscription-status
Authorization: Bearer {token}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": {
    "characterCount": 5420,
    "characterLimit": 10000,
    "usagePercentage": 54.2,
    "remainingCharacters": 4580,
    "tier": "Free",
    "nextBillingDate": "2026-05-01T00:00:00Z"
  },
  "errors": [],
  "responseCode": 200,
  "timestamp": "2026-04-15T12:00:00Z"
}
```

## 🎛️ Modelos Disponibles

| Modelo | Descripción | Uso Recomendado |
|--------|-------------|-----------------|
| `eleven_multilingual_v2` | Soporta 29 idiomas, incluyendo español | ✅ **Recomendado para LuxuryApp** |
| `eleven_turbo_v2_5` | Más rápido, buena calidad | Textos largos, respuestas rápidas |
| `eleven_flash_v2_5` | Máxima velocidad | Tiempo real, baja latencia |

## 🎚️ Parámetros de Voz

### Stability (0.0 - 1.0)
- **Bajo (0.0-0.3):** Más expresivo y variable
- **Medio (0.4-0.6):** Balanceado ✅
- **Alto (0.7-1.0):** Muy estable y consistente

### Similarity (0.0 - 1.0)
- **Bajo (0.0-0.5):** Menos parecido a la voz original
- **Alto (0.6-1.0):** Más fiel a la voz original ✅

### Style (0.0 - 1.0)
- Controla la exageración emocional
- **0.0:** Neutral (recomendado para la mayoría)
- **1.0:** Muy expresivo

### SpeakerBoost (0.0 - 1.0)
- Reduce artefactos y ruidos en el audio
- **0.0:** Desactivado
- **0.5-1.0:** Activado para mejor calidad

## 💰 Planes y Límites

| Plan | Caracteres/Mes | Precio |
|------|----------------|--------|
| **Free** | 10,000 | $0 |
| **Starter** | 30,000 | $5/mes |
| **Pro** | 100,000 | $22/mes |
| **Scale** | 500,000+ | $99+/mes |

> **Nota:** 1 carácter ≈ 1 letra. Un párrafo corto (~500 caracteres) genera ~30 segundos de audio.

## 🔒 Seguridad

- ✅ API Key almacenada en `appsettings.json` (no en código)
- ✅ Headers HTTP seguros (`xi-api-key` en header, no en URL)
- ✅ Validación de entrada en DTOs
- ✅ Logging de errores sin exponer datos sensibles
- ✅ Timeout de 2 minutos para prevenir bloqueos

## 📝 Patrones del Proyecto Seguidos

- ✅ **Primary Constructors** en todas las clases
- ✅ **ApiResponseDTO<T>** para todas las respuestas
- ✅ **Controllers thin** (sin lógica de negocio)
- ✅ **Mapeo manual** (sin AutoMapper)
- ✅ **Comentarios en español**
- ✅ **IDs como Guid** (donde aplica)
- ✅ **UTF-8 sin BOM**
- ✅ **Endpoints en kebab-case**
- ✅ **Atributo `[LogUserActivity]`** en todos los endpoints

## 🧪 Ejemplo de Uso desde Frontend

```typescript
// Obtener voces disponibles
const voices = await httpClient.get('/api/eleven-labs/voices').toPromise();

// Generar audio
const audioResponse = await httpClient.post('/api/eleven-labs/text-to-speech', {
  text: 'Bienvenido al residencial Luxury Building',
  voiceId: '21m00Tcm4TlvDq8ikWAM',
  modelId: 'eleven_multilingual_v2'
}).toPromise();

// Reproducir audio
const audioBytes = atob(audioResponse.data.audioBase64);
const blob = new Blob([audioBytes], { type: 'audio/mpeg' });
const audioUrl = URL.createObjectURL(blob);
const audio = new Audio(audioUrl);
audio.play();
```

## 🚀 Próximos Pasos (Opcional)

- [ ] Agregar soporte para clonación de voces personalizadas
- [ ] Implementar streaming de audio para archivos largos
- [ ] Agregar caché de audios generados frecuentemente
- [ ] Integrar con sistema de notificaciones de audio
- [ ] Soporte para SSML (Speech Synthesis Markup Language)

## 📞 Soporte

Para problemas con la integración:
- Documentación oficial: https://elevenlabs.io/docs
- Estado del servicio: https://status.elevenlabs.io
- Issues del proyecto: Revisar logs en Serilog

---

**Última actualización:** Abril 2026  
**Versión:** 1.0.0
