# PROMPT: Análisis de Flujo de Carga de Imágenes en iPhone
## (Sin depender de Logs en BD)

**Objetivo:** Identificar exactamente dónde falla la carga de imágenes en iPhone analizando el flujo en tiempo real.

---

## 🔍 FASE 1: VERIFICAR SEÑALES SIN LOGS

### 1.1 ¿El endpoint POST se está llamando?

**En iPhone - Abre DevTools (Chrome Mobile o Safari):**

```javascript
// En la consola del navegador, ejecuta:
fetch('https://tudominio.com/api/logs/client-error', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    level: 'error',
    message: 'Test error',
    details: 'Verificando conexión',
    userAgent: navigator.userAgent,
    url: window.location.href,
    timestamp: new Date().toISOString()
  })
}).then(r => r.json()).then(d => console.log('✓ ENDPOINT RESPONDE:', d))
  .catch(e => console.error('✗ ENDPOINT NO RESPONDE:', e));
```

**Resultados Posibles:**
- ✅ `✓ ENDPOINT RESPONDE: {success: true}` → Endpoint OK
- ❌ `✗ ENDPOINT NO RESPONDE: Network error` → Problema de red/CORS
- ❌ `404 Not Found` → Endpoint no existe
- ❌ `CORS error` → Backend rechaza peticiones

**Acción:**
- Si ✅ → Continuar a 1.2
- Si ❌ → Revisar que `LogsEndPoints.cs` esté publicado correctamente

---

### 1.2 ¿Se envían errores de imagen?

**En iPhone - Al subir foto que falla:**

```javascript
// Ejecutar en consola mientras se carga la foto:

// Interceptar POST requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('🌐 POST REQUEST:', args[0], args[1]?.body);
  return originalFetch.apply(this, args);
};

// Ahora intenta subir foto que falla
// Verás en consola todas las peticiones POST
```

**Buscar:**
- ¿Hay POST a `/api/logs/client-error`?
  - SI → Continuar a 2
  - NO → El error no se está capturando

**Si hay POST:**
```
🌐 POST REQUEST: https://tudominio.com/api/logs/client-error
{
  "level": "error",
  "message": "[IMAGE_UPLOAD_ERROR] Fallo al procesar imagen",
  "details": "Archivo: photo.jpg (6.70MB) | Error: canvas.toBlob falló",
  ...
}
```

---

## 🔍 FASE 2: ANALIZAR FLUJO DE COMPRESIÓN

### 2.1 Verificar que compresión inicia

**En iPhone - Console cuando selecciona foto:**

```javascript
// Busca en DevTools Console estos logs:
[IMAGE_PROCESS] Iniciando compresión: X.XXMB
[COMPRESS] Dimensiones originales: 5600x3200px
[COMPRESS] Redimensionadas a: 4000x2286px
[COMPRESS] Calidad 0.9: 1.41MB
✓ Compresión exitosa a calidad 0.9
```

**Resultado esperado:**
```
[IMAGE_PROCESS] Iniciando compresión: 6.70MB → 5.00MB
[COMPRESS] Dimensiones originales: 5600x3200px
[COMPRESS] Redimensionadas a: 4000x2286px
[COMPRESS] Calidad 0.9: 1.41MB
[COMPRESS] ✓ Compresión exitosa a calidad 0.9
[IMAGE_PROCESS] Imagen comprimida: 1.41MB (máx permitido: 5MB)
```

**Si ve esto:**
- ✅ Compresión OK → Ir a 2.2

**Si NO ve esto, busca:**
- `[IMAGE_PROCESS] Fichero demasiado grande` → Foto > 10MB (rechazar antes de comprimir)
- `[IMAGE_PROCESS] Formato no compatible` → No es JPG/PNG/WebP/HEIC
- Nada después de "Iniciando" → Error en compresión

---

### 2.2 Verificar que preview se genera

**En iPhone - Después de seleccionar foto:**

```javascript
// En DevTools, busca:
[IMAGE_PROCESS] Imagen comprimida: X.XXMB
(luego debe mostrar preview de foto en UI)
```

**Resultado esperado:**
- ✅ Se ve preview de foto en formulario
- ❌ No se ve preview → Error en FileReader

**Si no se ve preview, busca error:**
```
[IMAGE_PROCESS] Error en FileReader: <mensaje>
```

---

## 🔍 FASE 3: ANALIZAR COMPRESIÓN ESPECÍFICA

### 3.1 ¿Canvas 2D está disponible?

**En iPhone - Console:**

```javascript
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

if (!ctx) {
  console.error('❌ CANVAS 2D NO DISPONIBLE EN ESTE DEVICE');
} else {
  console.log('✅ CANVAS 2D DISPONIBLE');
  
  // Probar canvas.toBlob
  canvas.toBlob(blob => {
    if (blob) {
      console.log('✅ canvas.toBlob FUNCIONA');
    } else {
      console.error('❌ canvas.toBlob retorna NULL');
    }
  }, 'image/jpeg', 0.9);
}
```

**Si ❌:**
- Canvas no disponible → No se puede comprimir
- Necesitas fallback sin canvas

---

### 3.2 ¿HEIC se convierte a JPEG?

**En iPhone - Si foto viene del carrete:**

```javascript
// Busca en console:
heic2any falló al analizar el archivo

// Si ves esto:
// ❌ HEIC → JPEG falla
// Foto se procesa como HEIC original
// Canvas falla porque HEIC no es soportado
```

**Solución:**
- Si falla HEIC conversion → Usar PNG en lugar de JPEG
- O mostrar error: "Tu foto está en formato HEIC, intenta con otra"

---

## 🔍 FASE 4: ANALIZAR ENVÍO AL SERVIDOR

### 4.1 ¿Se envía FormData al servidor?

**En iPhone - Network Tab (DevTools):**

1. Ir a **Network** tab
2. Seleccionar foto
3. Clickear Guardar
4. Buscar POST a `/api/tasks/create`

**Verificar:**
```
POST /api/tasks/create
Status: 200 ✅ (éxito)
Status: 400 ❌ (error de validación)
Status: 413 ❌ (archivo demasiado grande)
Status: 500 ❌ (error servidor)
Timeout ❌ (no responde)
```

**Si Status 200:**
- ✅ Servidor recibió y procesó OK

**Si Status 400/413:**
- ❌ Imagen no cumple validación servidor
- Revisar respuesta: "Error al procesar imagen: ..."

---

### 4.2 ¿Se envía error al endpoint de logs?

**En iPhone - Network Tab:**

1. Seleccionar foto
2. Ver error
3. Buscar POST a `/api/logs/client-error`

**Verificar:**
- ✅ Hay POST a `/api/logs/client-error` → Logs se envían
- ❌ No hay POST → Endpoint no se está llamando

**Si se envía:**
```
POST /api/logs/client-error
{
  "level": "error",
  "message": "[IMAGE_UPLOAD_ERROR] ...",
  "details": "...",
  "userAgent": "Mozilla/5.0 (iPhone ...)",
  "timestamp": "2026-08-03T17:30:00Z"
}

Response:
{
  "success": true,
  "message": "Error registrado en el servidor"
}
```

---

## 📋 MATRIZ DE DIAGNÓSTICO (Sin Logs)

Basado en lo que VES en pantalla/console, el problema es:

| Síntoma | Causa | Solución |
|---------|-------|----------|
| Foto seleccionada, nada pasa | Compresión atascada | Foto muy grande, device poca RAM |
| Error "Formato no compatible" | HEIC no convertido | Usar JPG/PNG en lugar de foto del carrete |
| Error "Imagen aún demasiado grande" | Compresión insuficiente | Foto resolución muy alta |
| Preview NO se muestra | FileReader error | Permisos de galería bloqueados |
| Toast error sin detalle | ClientErrorLogger no funciona | Endpoint no publicado correctamente |
| Red > 30 segundos | Timeout | Red lenta o servidor lento |
| Status 413 en POST | Imagen > límite servidor | Comprimir más (< 5MB) |
| Status 500 en POST | Error servidor al procesar | Verificar ImageStorageService en servidor |

---

## 🛠️ CHECKLIST SIN LOGS

### Antes de reportar "no funciona en iPhone":

- [ ] ¿Se ve en console `[IMAGE_PROCESS]` logs?
  - SI → Código frontend OK
  - NO → Problema en task-form.ts

- [ ] ¿Llega a `[COMPRESS]` logs?
  - SI → Imagen se carga en memoria
  - NO → Foto rechazada o error en lectura

- [ ] ¿Se genera preview?
  - SI → FileReader OK
  - NO → Problema con permisos o path

- [ ] ¿Hay POST a `/api/logs/client-error`?
  - SI → Error se envía al servidor
  - NO → Endpoint no publicado o CORS bloqueado

- [ ] ¿POST `/api/tasks/create` retorna 200?
  - SI → Servidor aceptó la foto
  - NO → Error validación servidor

---

## 🎯 PASOS PARA INVESTIGAR

### Si usuario dice "Error en iPhone":

1. **Pedirle que abra DevTools y tome screenshot de:**
   - Console tab (mostrando logs `[IMAGE_PROCESS]`, `[COMPRESS]`)
   - Network tab POST requests
   - El error visible en la UI

2. **Analizar screenshot:**
   - ¿Hay logs? → Sí/No
   - ¿Qué dice el último log?
   - ¿Hay POST a `/api/logs/client-error`?
   - ¿Qué status tiene?

3. **Diagnosticar según resultados:**
   - Si no hay logs → Frontend no se ejecuta
   - Si hay logs pero no POST → ClientErrorLogger bloqueado
   - Si hay POST pero status 404 → Endpoint no existe
   - Si POST pero responde error → Backend tiene problema

---

## ⚠️ SEÑALES DE ALERTA SIN LOGS

### Estos síntomas indican el problema:

**"La foto desaparece pero no se guarda"**
- ✗ Foto se envía pero servidor rechaza
- Buscar: POST `/api/tasks/create` Status 400/413/500

**"Veo error pero sin detalles"**
- ✗ Toast muestra error genérico
- Buscar: ClientErrorLogger.logError() se llama pero POST falla

**"Se congela la app"**
- ✗ Canvas/Compresión bloquea UI
- Buscar: Console stuck, no más logs después de "Dimensiones originales"

**"No pasa nada al seleccionar foto"**
- ✗ Error antes de compresión
- Buscar: Validación rechaza foto (tamaño, formato)

---

## 📱 ALTERNATIVA: SIN DEVTOOLS

Si usuario no puede abrir DevTools:

```javascript
// Ejecutar en console para guardar logs localmente:

// 1. Crear un buffer de logs
window._debugLogs = [];

// 2. Interceptar console.log
const origLog = console.log;
console.log = function(...args) {
  window._debugLogs.push(args.join(' '));
  origLog.apply(console, args);
};

// 3. Después de intentar subir foto, copiar logs:
console.log(JSON.stringify(window._debugLogs, null, 2));

// 4. Pedir que copie y pegue el output
```

Pedir que pegue eso en un email o ticket.

---

## RESUMEN

| Necesitas saber | Busca | Dónde |
|-----------------|-------|-------|
| ¿Compresión funciona? | `[COMPRESS] ✓ Exitosa` | Console |
| ¿Foto se envía? | `POST /api/tasks/create` Status 200 | Network tab |
| ¿Error se registra? | `POST /api/logs/client-error` Status 200 | Network tab |
| ¿Canvas disponible? | `canvas.getContext('2d')` | Console (test) |
| ¿HEIC convertido? | `heic2any falló` (si aparece, es error) | Console |

**Esto te dará 90% de certeza de dónde está el problema SIN necesidad de logs en BD.**
