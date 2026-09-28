# AUDIT: Flujo de Carga de Imágenes - iPhone Troubleshooting

**Objetivo:** Analizar el flujo completo de carga de imágenes y identificar problemas específicos en iPhone.

**Fecha:** 2026-08-03  
**Usuario:** Developer  
**Estado:** En Ejecución

---

## 1. FLUJO GENERAL (End-to-End)

```
┌─────────────────────────────────────────────────────────────┐
│ USUARIO (iPhone)                                             │
│ - Abre formulario de Ticket                                 │
│ - Selecciona foto de galería o toma con cámara              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND (Angular) - task-form.ts                           │
│ 1. Validación inicial                                       │
│    - Formato: JPG, PNG, WebP, HEIC ✓                        │
│    - Tamaño: < 10MB (rechazar inmediato) ✓                  │
│                                                              │
│ 2. Conversión HEIC → JPEG (si iOS)                          │
│    - HEIC es formato nativo de iPhone                       │
│    - heic2any librería convierte a JPEG                     │
│                                                              │
│ 3. Compresión                                               │
│    - Canvas 2D para redimensionar                           │
│    - Máx: 4000x4000px                                       │
│    - Calidad: 0.9 → 0.05 (hasta 5MB)                        │
│    - Logs: [COMPRESS]                                       │
│                                                              │
│ 4. FileReader para preview                                  │
│    - Convierte a Data URL                                   │
│    - Muestra preview en UI                                  │
│                                                              │
│ 5. FormData + POST                                          │
│    - Crea FormData con archivo                              │
│    - Envía a /api/tasks/create                              │
└────────────────┬───────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ BACKEND (ASP.NET) - ImageStorageService.cs                 │
│ 1. Validación de tipo (magic bytes)                         │
│    - Verifica: JPG, PNG, WebP                               │
│                                                              │
│ 2. Validación de tamaño                                     │
│    - Máximo: 5MB                                            │
│    - Logs: ImageStorageService                              │
│                                                              │
│ 3. Procesamiento con ImageSharp                             │
│    - Carga imagen en memoria                                │
│    - Redimensiona a 1296x972                                │
│    - Guarda en filesystem                                   │
│                                                              │
│ 4. Error handling                                           │
│    - Logs detallados en servidor                            │
│    - Retorna error al frontend                              │
└────────────────┬───────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ RESPUESTA AL USUARIO                                        │
│ - ✓ Éxito: Imagen guardada, toast "Ticket creado"          │
│ - ✗ Error: Toast con mensaje de error                      │
│ - Log: Enviado a /api/logs/client-error (BD)                │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. PUNTOS DE FALLA CRÍTICOS EN iPhone

### 2.1 🔴 CONVERSIÓN HEIC → JPEG

**Por qué falla en iPhone:**
- iOS 11+ captura fotos en HEIC por defecto
- `heic2any` librería puede fallar en ciertos navegadores
- Safari en iPhone tiene soporte limitado

**Síntomas:**
```
[IMAGE_PROCESS] Iniciando compresión: 8.5MB
[ERROR] heic2any falló al analizar el archivo
(luego intenta procesar como HEIC, que no soporta canvas)
```

**Verificar:**
```bash
# En logs del servidor busca:
grep -i "heic\|heif" logs.txt

# Si aparecen errores de HEIC, es este el problema
```

**Solución Propuesta:**
```typescript
// En task-form.ts - onFileChange()
// Si HEIC falla, convertir a PNG en lugar de JPEG
// O detectar y avisar al usuario: "Foto en formato HEIC - tarda más"
```

---

### 2.2 🟡 CANVAS 2D NO DISPONIBLE

**Por qué falla en iPhone:**
- Safari en iOS tiene limitaciones con canvas bajo ciertas condiciones
- Canvas.toBlob() puede no estar disponible
- Memoria limitada del device

**Síntomas:**
```
[COMPRESS] Dimensiones originales: 5600x3200px
[COMPRESS] Error en canvas.toBlob: null returned
(o "canvas.toBlob failed")
```

**Verificar:**
```bash
# Busca en logs:
grep -i "canvas\|toBlob" logs.txt
grep -i "CanvasRenderingContext2D" logs.txt
```

**Solución Propuesta:**
```typescript
// Fallback si canvas falla:
if (!ctx) {
  // En lugar de canvas, enviar imagen original comprimida vía ZIP
  // O mostrar: "Tu device no soporta compresión, intenta otra foto"
}
```

---

### 2.3 🟡 FILEREADER ERROR

**Por qué falla en iPhone:**
- Foto bloqueada por permisos de galería
- Path no accesible (iOS sandbox)
- Timeout al leer archivo grande

**Síntomas:**
```
[IMAGE_PROCESS] Error en FileReader: NotAllowedError
(o "Permission denied")
```

**Verificar:**
```bash
grep -i "filereader\|permission\|notallowed" logs.txt
```

**Solución Propuesta:**
```typescript
reader.onerror = () => {
  // Si es permiso: mostrar "Activa acceso a Fotos en Configuración"
  // Si es timeout: "Intenta con foto más pequeña"
}
```

---

### 2.4 🔴 MEMORIA INSUFICIENTE

**Por qué falla en iPhone:**
- iPhone con 64GB puede tener poca RAM disponible
- Imagen 8MP (24MB sin comprimir) requiere mucha RAM
- Canvas requiere 3-4x el tamaño de la imagen en memoria

**Síntomas:**
```
[COMPRESS] Dimensiones originales: 4000x3000px
(nada después - app se congela/crashea)

O:
[ERROR] OutOfMemoryException
[ERROR] heap allocation failed
```

**Verificar:**
```bash
# Busca crashes:
grep -i "memory\|heap\|crash\|out.of.memory" logs.txt

# Si ve patrón: foto grande → nada → error
# Probablemente sea memoria
```

**Solución Propuesta:**
```typescript
// Antes de canvas, verificar disponibilidad:
if (navigator.deviceMemory && navigator.deviceMemory < 2) {
  showError("Tu device tiene poca memoria. Intenta foto más pequeña.");
  return;
}

// O reducir resolución inicial:
const MAX_DIM = navigator.deviceMemory < 4 ? 2000 : 4000;
```

---

### 2.5 🟡 TAMAÑO DE ARCHIVO POST

**Por qué falla en iPhone:**
- Servidor rechaza POST > cierto tamaño (ej: 30MB)
- Network timeout si la red es lenta

**Síntomas:**
```
[IMAGE_PROCESS] Enviando al servidor...
(espera 20 segundos)
[ERROR] 413 Payload Too Large
O:
[ERROR] Network timeout
```

**Verificar:**
```bash
# En logs del servidor busca:
grep -i "413\|payload.*large\|timeout"

# En navegador DevTools:
# Network tab → POST /api/tasks/create → Status
```

**Solución Propuesta:**
```typescript
// Validar tamaño ANTES de enviar:
if (processed.size > 5 * 1024 * 1024) {
  showError("Compresión insuficiente. Foto aún muy grande.");
  // Intentar compresión más agresiva (calidad 0.02)
}
```

---

## 3. CHECKLIST DE DIAGNÓSTICO

Cuando un usuario reporte error en iPhone, ejecutar este checklist:

### Paso 1: Verificar Logs en Servidor
```bash
# Ver últimos logs de error
SELECT TOP 50 * FROM [Logs] 
WHERE Level = 'Error' AND Timestamp > DATEADD(HOUR, -2, GETUTCDATE())
ORDER BY Timestamp DESC

# Buscar específicamente:
SELECT * FROM [Logs]
WHERE MessageTemplate LIKE '%IMAGE_UPLOAD_ERROR%'
   OR MessageTemplate LIKE '%[CLIENT_ERROR]%'
   OR MessageTemplate LIKE '%[COMPRESS]%'
ORDER BY Timestamp DESC
```

### Paso 2: Analizar Patrón de Error
| Error | Causa Probable | Acción |
|-------|----------------|--------|
| `heic2any falló` | HEIC → JPEG falla | Usar PNG en lugar de JPEG |
| `canvas.toBlob retornó null` | Canvas no disponible | Usar fallback sin canvas |
| `FileReader error: NotAllowedError` | Permisos | Pedir que active acceso a fotos |
| (nada después de "Dimensiones originales") | Memoria insuficiente | Limitar resolución inicial |
| `413 Payload Too Large` | POST muy grande | Comprimir más |
| Timeout | Red lenta | Aumentar timeout |

### Paso 3: Validar Frontend Logs
En devTools del usuario (si es posible):
```javascript
// Copiar los logs de consola que empiezan con:
[IMAGE_PROCESS]
[COMPRESS]
[ClientErrorLogger]

// Y pegarlos en ticket de soporte
```

### Paso 4: Proponer Solución
Según el error, recomendar:
- Foto de menor resolución
- Usar galería en lugar de cámara (o viceversa)
- Reiniciar navegador
- Actualizar iOS
- Borrar caché del navegador

---

## 4. CASOS DE PRUEBA (QA)

**Para reproducir cada problema:**

### Test: HEIC Conversion
```
1. iPhone + Safari
2. Tomar foto con cámara (genera HEIC)
3. Seleccionar en formulario
4. Verificar logs: "heic2any" o "¡Completado!"
```

### Test: Canvas Limitations
```
1. iPhone + Safari (versión vieja)
2. Subir foto 8MP (4000x3000px)
3. Verificar logs: "canvas.toBlob" o "✓ Exitosa"
```

### Test: Memory Pressure
```
1. iPhone 6 o 6S (1GB RAM)
2. Tomar foto de máxima resolución
3. Ver si se congela o muestra error
```

### Test: Network Timeout
```
1. iPhone en 3G lento
2. Subir foto de 4MB
3. Medir tiempo de respuesta
4. Verificar si llega a servidor
```

---

## 5. MONITOREO CONTINUO

**Revisar diariamente:**
```bash
# Logs de error en últimas 24h
SELECT COUNT(*) as ErrorCount FROM [Logs]
WHERE Level = 'Error' 
  AND (MessageTemplate LIKE '%IMAGE%' 
    OR MessageTemplate LIKE '%CLIENT_ERROR%')
  AND Timestamp > DATEADD(DAY, -1, GETUTCDATE())

# Si ErrorCount > 5, investigar
```

**Alertas:**
- ⚠️ Si `heic2any` falla > 2 veces/día: aumentar timeout
- ⚠️ Si `canvas.toBlob` falla > 1 vez/día: añadir fallback
- ⚠️ Si FileReader falla > 3 veces/día: mejorar permisos
- 🔴 Si OutOfMemory > 1 vez: limitar resolución global

---

## 6. ACCIONES POR IMPLEMENTAR

- [ ] Fallback si HEIC conversion falla
- [ ] Fallback si Canvas no disponible
- [ ] Detectar memoria disponible y limitar resolución
- [ ] Aumentar timeout de red en mobile
- [ ] Mostrar mensaje "Foto en HEIC, procesando..." (más tiempo)
- [ ] Test en iPhone 6, 8, 12 (diferentes RAM)
- [ ] Test en Safari, Chrome, Firefox iOS

---

## 7. REFERENCIAS

**Archivos Relacionados:**
- Frontend: `client/angular/src/app/apps/operations.luxuryapp/task-engine/tasks/task-message/task-form.ts`
- Backend: `api/LuxuryApp.Providers/Services/ImageStorageService.cs`
- Logging: `api/LuxuryApp.Application/Moduls/SystemLuxuryApp/System-AuditLogs/LogApp/EndPoints/LogsEndPoints.cs`

**Librerías Críticas:**
- heic2any: Conversión HEIC → JPEG
- ImageSharp: Procesamiento de imágenes en servidor
- Canvas 2D API: Compresión en navegador

**Endpoints:**
- POST `/api/tasks/create` - Crear ticket con imágenes
- POST `/api/logs/client-error` - Enviar errores al servidor
- GET `/api/logs` - Ver logs en admin panel

---

**Próximo Paso:** Ejecutar este audit cuando se reporte error en iPhone
