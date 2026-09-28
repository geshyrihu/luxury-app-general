# TROUBLESHOOTING - Guía de Diagnóstico

## Problemas Comunes y Soluciones

### 📸 PROBLEMA CRÍTICO: Fotos HEIC de iPhone no se cargan

**Síntoma:**
```
Archivo rechazado por tipo inválido. 
Archivo: "IMG_0466.HEIC", Tipo: "application/octet-stream"
```

**Causa:**
- iPhone captura fotos en formato HEIC
- El servidor rechazaba porque ContentType era `application/octet-stream`
- La conversión HEIC → JPEG fallaba

**SOLUCIÓN IMPLEMENTADA:**
1. ✅ Frontend detecta HEIC por extensión (no solo ContentType)
2. ✅ Fuerza conversión HEIC → JPEG antes de enviar
3. ✅ Si falla conversión, muestra error claro al usuario
4. ✅ Backend ahora acepta HEIC como formato válido
5. ✅ Backend detecta HEIC por magic bytes (no solo ContentType)

**Resultado después de actualizar:**
- ✅ Fotos HEIC se convierten automáticamente a JPEG
- ✅ Si falla conversión, usuario ve: "Tu foto HEIC no se puede procesar, intenta..."
- ✅ Si por algún motivo no se convierte, servidor acepta y procesa el HEIC

---

### 📸 Problema: "Error: No se pudo completar la operación" al subir fotos (Mobile)

**Síntomas:**
- En mobile (iOS/Android), al seleccionar una foto o tomarla con la cámara, aparece un error genérico
- El error muestra "Error: No se pudo completar la operación" sin detalles
- En desktop funciona perfectamente
- Afecta formularios con upload de imágenes (Tasks, Tickets, etc.)

**Causas Posibles:**

1. **Formato de imagen no soportado**
   - iOS envía HEIC/HEIF natively
   - Android puede enviar diferentes formatos
   - El navegador mobile puede tener limitaciones

2. **Problema de memoria o procesamiento**
   - Canvas 2D no disponible en ciertos navegadores mobile
   - Imágenes muy grandes causan timeout en compresión
   - BufferSize insuficiente para canvas

3. **Permisos del navegador**
   - Acceso a galería bloqueado
   - Permisos de cámara insuficientes
   - Sandbox del navegador restrictivo

4. **Errores en FileReader**
   - Archivo no se puede leer desde galería
   - Path de archivo bloqueado por seguridad
   - Timeout al procesar archivo

**Solución Implementada:**

Se mejoró el manejo de errores en `task-form.ts` con:

```typescript
// Logs detallados para diagnóstico
console.log(`[IMAGE_PROCESS] Iniciando...`);
console.log(`[COMPRESS] Dimensiones originales: ${w}x${h}px`);

// Error handling específico
reader.onerror = () => {
  console.error("[IMAGE_PROCESS] Error en FileReader:", reader.error);
  showError("Error al leer la imagen", "...");
};

// Mensajes de error más descriptivos
if (errorMessage.includes("canvas")) {
  userMessage = "Error al procesar la imagen. Prueba con otra imagen.";
} else if (errorMessage.includes("load")) {
  userMessage = "Error al cargar la imagen. Verifica que sea válida.";
}
```

**Cómo Diagnosticar (Sin Mac):**

#### ✅ Opción Recomendada: Ver Logs en el Servidor (Automático)

Todos los errores de imagen en **cualquier dispositivo** (iPhone, Android, Desktop) se envían automáticamente al servidor.

**En tu admin panel:**

1. Ve a **Análisis y Reportes → Registros de API**
2. Filtra por:
   - **Level:** Error
   - **Fecha/Hora:** Cuando ocurrió el error
   - **Busca:** `IMAGE_UPLOAD_ERROR` o `COMPRESS`

3. Verás exactamente:
   ```
   [IMAGE_UPLOAD_ERROR] Fallo al procesar imagen en beforeWork
   Archivo: photo.jpg (6.70MB) | Error: canvas.toBlob falló
   ```

**Ventajas:**
- ✅ Funciona en iPhone sin Mac
- ✅ Funciona en Android sin USB
- ✅ Funciona en cualquier dispositivo
- ✅ Los errores se guardan en la BD
- ✅ Puedes ver histórico completo

#### Alternativa: Desktop Chrome con Android

1. **Conecta teléfono Android por USB**
2. **Abre `chrome://inspect` en desktop Chrome**
3. **Selecciona tu dispositivo y abre DevTools**
4. **Busca logs con prefijo `[IMAGE_PROCESS]` o `[COMPRESS]`**

#### Qué Buscar en los Logs del Servidor

```
[IMAGE_UPLOAD_ERROR] - Error al procesar imagen
    ↓
Muestra: Archivo, Tamaño, Mensaje de error específico

Ejemplos:
- "canvas.toBlob falló" → Problema del navegador/device
- "Error al cargar imagen" → Archivo corrupto o inaccesible
- "requires too much memory" → Device con poca RAM
```

**⚠️ Importante: Publicar Cambios**

Para que los errores se registren en la BD, necesitas publicar estos cambios:

1. **Backend:**
   - Endpoint actualizado: `LogsEndPoints.cs` - ahora usa `ILogger` para guardar en BD

2. **Frontend:**
   - Servicio mejorado: `ClientErrorLoggerService.ts` - con retry automático
   - Task form: `task-form.ts` - envía errores de imagen

Después de publicar, los errores aparecerán en **Registros de API** con prefijo `[CLIENT_ERROR]`.

---

**Acciones por Usuario:**

Si ve "Error al procesar imagen":

1. ✅ **Comprueba que la foto sea JPG, PNG o WebP**
   - No HEIC/HEIF renombrados (iOS 11+)
   - Si es HEIC, la app debería convertirla automáticamente

2. ✅ **Intenta con una foto de menor resolución**
   - La compresión tiene límites si el dispositivo tiene poca memoria
   - Fotos de 5MB+ pueden fallar en mobile con RAM limitada

3. ✅ **Limpia la caché del navegador**
   - En algunos casos, la caché causa issues con el canvas

4. ✅ **Intenta en otro navegador**
   - Chrome suele ser más compatible que Safari/Firefox en Android
   - En iOS, todos usan el mismo motor WebKit

5. ✅ **Reporta con más detalles:**
   - Abre DevTools (ver arriba)
   - Copia el log completo que aparezca en consola
   - Incluye: dispositivo, navegador, versión OS, tamaño de foto original

**Technical Details - Límites de Compresión:**

- **Tamaño máximo:** 5MB (validado en servidor)
- **Compresión automática:** Reduce a máx 5MB con quality 0.9 → 0.05
- **Máx dimensiones:** 4000x4000px
- **Formatos:** JPG, PNG, WebP (HEIC convertido a JPG automáticamente)

**Para Desarrolladores:**

Si el error persiste, revisa:

```typescript
// client/angular/src/app/apps/operations.luxuryapp/task-engine/tasks/task-message/task-form.ts
// Métodos: onFileChange(), compressToMaxSize()

// backend api/LuxuryApp.Providers/Services/ImageStorageService.cs
// Revisa: Save(), IsValidFileSize(), GetMimeType()
```

### Monitoreo Continuo

Para verificar que funciona en producción:

```bash
# En DevTools de mobile
localStorage.setItem('DEBUG', '*');  // Activa logs

# Luego intenta subir foto y busca:
# [IMAGE_PROCESS]
# [COMPRESS]
# ✓ Compresión exitosa
```

---

## Otros Problemas Comunes

(A completar según issues reportados)

### 🔄 Problema: Refresh button no recarga el componente

**Solución:** Ver `RefreshService` en `core/services/refresh.service.ts`

### 📱 Problema: Overlay de procesamiento no se ve en mobile

**Solución:** Ver `lx-processing-overlay` en `shared/ui/adaptive/processing-overlay/`
