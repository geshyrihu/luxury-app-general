# Guia Operativa del Flujo Centralizado de Imagenes en Frontend

Fecha: `2026-08-04`
Estado: `Vigente`
Alcance principal: `client/angular/src/app/core`, `client/angular/src/app/shared/ui`, features Angular que suben imagenes
Sensibilidad: `Media-Alta`

## 1. Objetivo

Esta guia documenta como funciona el procesamiento centralizado de imagenes en
el frontend de LuxuryApp.

Su mision es dejar claro:

- donde se prepara una imagen antes de subirse
- como se detectan HEIC y HEIF, especialmente en iPhone
- por que ciertos errores ocurren solo en frontend y no llegan al API
- cual es la ruta oficial para futuras pantallas o refactors de carga

Esta guia no redefine convenciones. Explica la implementacion vigente y el
protocolo seguro para mantenerla.

## 2. Contexto Arquitectonico Obligatorio

Las piezas oficiales del flujo viven en estas rutas reales:

- `D:\repos\luxuryapp-api\client\angular\src\app\core\services\image-processing.service.ts`
- `D:\repos\luxuryapp-api\client\angular\src\app\core\services\heic-converter.service.ts`
- `D:\repos\luxuryapp-api\client\angular\src\app\core\http\interceptors\image-form-data.interceptor.fn.ts`
- `D:\repos\luxuryapp-api\client\angular\src\app\app.config.ts`

Puntos de uso ya integrados:

- wrappers shared de carga de archivos e imagenes en `shared/ui`
- features que procesan imagenes de forma explicita con
  `ImageProcessingService`
- cualquier `HttpClient` que envie `FormData`, gracias al interceptor global

Reglas del sistema rector que gobiernan este caso:

- `CONVENTIONS.md`
- `conventions/frontend/frontend-rules.md`
- `conventions/frontend/frontend-generic-services-catalog.md`
- `conventions/operations/guides-creation-protocol.md`

## 3. Regla de Oro

Toda imagen se prepara en el navegador antes de subirla, y toda carga
`FormData` pasa por una garantia centralizada.

Si una foto falla antes de disparar la solicitud HTTP, el problema esta en la
capa frontend de lectura, conversion o compresion, no en el API.

## 4. Alcance Permitido

Esta arquitectura SI permite:

- convertir HEIC y HEIF a JPEG localmente
- redimensionar imagenes grandes
- comprimir imagenes cuando exceden el tamano configurado
- dejar intactos los archivos que ya cumplen el perfil
- conservar archivos no imagen dentro de `FormData`
- cubrir tanto componentes nuevos como formularios legacy que suben imagenes

## 5. Alcance Prohibido

No se debe:

- implementar conversiones HEIC locales por fuera de `ImageProcessingService`
- agregar servicios externos de conversion para fotos del usuario
- duplicar logica de canvas o compresion dentro de componentes de feature
- hardcodear soluciones aisladas para iPhone dentro de una sola pantalla
- saltarse el interceptor creando cargas multipart manuales sin justificarlo

## 6. Zonas de Alta Sensibilidad

Estas areas requieren especial cuidado:

- formularios Ionic/PWA en iPhone y Safari
- cargas multipart mixtas que combinan imagenes y documentos
- componentes shared de upload, porque impactan multiples modulos
- cualquier flujo offline o reintento de requests con `FormData`

Patron defensivo obligatorio:

- si el archivo es imagen, delegar a `ImageProcessingService`
- si la solicitud usa `FormData`, dejar que el interceptor haga la garantia final
- no mutar el `FormData` original cuando puede haber reintentos o sincronizacion

## 7. Patron de Diagnostico

| Categoria | Sintoma | Causa raiz tipica | Donde revisar primero |
|---|---|---|---|
| `SELECCION` | el usuario elige foto pero no avanza | el control no entrega `File` valido | componente shared o feature que recibe el evento |
| `DETECCION` | una foto HEIC se trata como archivo desconocido | MIME ambiguo o extension no confiable | `ImageProcessingService.isHeic()` |
| `CONVERSION` | la foto falla antes de enviar request | el navegador no pudo decodificar HEIC o fallaron canvas/blob | `HeicConverterService` |
| `COMPRESION` | el archivo se rechaza tras procesarse | no se pudo bajar al limite configurado | `resizeAndCompress()` |
| `MULTIPART` | algunas pantallas funcionan y otras no | el flujo local no procesaba imagenes, pero el interceptor aun debe cubrirlo | `imageFormDataInterceptor` |
| `API` | el backend recibe request pero rechaza payload | el problema ya esta fuera del pipeline cliente | endpoint y backend correspondiente |

## 8. Protocolo de Intervencion

### 8.1 Recoleccion minima

Siempre confirmar:

- si la solicitud HTTP realmente sale del navegador
- si el archivo original es `jpg`, `png`, `webp`, `heic` o `heif`
- si el error ocurre antes o despues de construir `FormData`
- si el flujo usa componente shared, procesamiento explicito o ambos
- si el archivo final ya fue transformado a `image/jpeg`

### 8.2 Preguntas obligatorias

Antes de tocar codigo, responder:

- el error ocurre antes de que exista trafico al API
- el archivo llega desde iPhone con MIME vacio o `application/octet-stream`
- el navegador puede decodificar HEIC nativamente
- el fallback local `heic-to/csp` esta siendo usado
- la falla esta en conversion, compresion o construccion de `FormData`
- el request usa `HttpClient` normal y por tanto recibe el interceptor

### 8.3 Orden de solucion preferido

1. confirmar que el flujo usa `ImageProcessingService`
2. confirmar que la solicitud sale por `HttpClient` con `FormData`
3. revisar deteccion HEIC/HEIF y decodificacion nativa
4. revisar fallback local `heic-to/csp`
5. revisar limites de tamano y dimension
6. tocar el feature puntual solo si el problema no queda cubierto por la capa central

## 9. Patron Tecnico Recomendado

### Flujo oficial

1. el usuario selecciona o toma una foto
2. el componente o feature entrega un `File`
3. `ImageProcessingService` decide si es imagen
4. si es HEIC/HEIF, `HeicConverterService` intenta convertir localmente a JPEG
5. si la imagen excede limites, se redimensiona o comprime
6. el archivo procesado conserva metadata trazable en memoria
7. si el envio usa `FormData`, `imageFormDataInterceptor` vuelve a inspeccionar
   el cuerpo y procesa cualquier imagen que aun no hubiera pasado por la capa central
8. el request sale al API con imagen normalizada

### Implementacion vigente por pieza

`ImageProcessingService`

- es la puerta de entrada unica para imagenes
- detecta HEIC por extension, MIME y firma binaria si el tipo es ambiguo
- rechaza archivos no soportados cuando el flujo exige imagen real
- convierte HEIC/HEIF a JPEG
- redimensiona y comprime cuando el archivo supera politicas configuradas
- expone `processImage`, `processImages`, `processFiles` y `processFormData`
- evita doble procesamiento con un `WeakMap`

`HeicConverterService`

- primero intenta decodificacion nativa del navegador con `Image` + `canvas`
- si la decodificacion nativa falla, carga bajo demanda `heic-to/csp`
- no usa servicios externos ni envia fotos a terceros
- registra si la conversion fue `native` o `heic-to`

`imageFormDataInterceptor`

- intercepta toda solicitud cuyo body sea `FormData`
- crea un nuevo `FormData` procesado para no mutar el original
- procesa solo `File` de imagen
- conserva campos escalares y archivos no imagen sin cambios
- funciona como garantia final para features shared, legacy y futuros

`app.config.ts`

- registra `imageFormDataInterceptor` al inicio de la cadena de interceptores
- eso garantiza que la normalizacion ocurra antes de otras capas HTTP del frontend

### Antipatrones

No es correcto:

- convertir HEIC con librerias cargadas manualmente en un componente
- llamar APIs externas de conversion desde el navegador
- usar `fetch` aislado con `FormData` y asumir que recibe el interceptor Angular
- agregar canvas y compresion duplicados por pantalla
- asumir que si Android y Windows funcionan, iPhone enviara exactamente el mismo formato

## 10. Reglas por Capa o Stack

### Frontend Angular

- toda nueva subida de imagenes debe usar `ImageProcessingService`
- si el flujo envia `FormData`, debe salir por `HttpClient`
- si existe wrapper shared de upload, debe preferirse sobre implementacion local
- los features no deben contener conversiones HEIC propias

### Shared UI

- los componentes shared pueden procesar la imagen temprano para mejorar preview
- aun asi deben convivir con la garantia final del interceptor
- cualquier cambio shared requiere revisar impacto en modulos consumidores

### API / Backend

- el backend no convierte HEIC en este flujo
- si el error ocurre antes de enviar request, no habra evidencia en logs del API
- la ausencia de logs backend no descarta un bug; puede confirmar que la falla fue cliente

## 11. Validaciones Obligatorias

Cuando se toque este flujo, validar como minimo:

- build Angular sin errores
- pruebas unitarias del servicio o interceptor cuando aplique
- que una foto `jpg/png/webp` siga funcionando
- que una foto `heic/heif` desde iPhone termine en `image/jpeg`
- que un `FormData` mixto preserve PDFs u otros adjuntos no imagen
- que el error, si existia, ocurra o desaparezca antes del API segun el diagnostico esperado

## 12. Senales de Alto Riesgo para Escalar

Detenerse y escalar si:

- el cambio propuesto toca componentes shared sin analisis de impacto suficiente
- se pretende mover la responsabilidad de conversion al backend
- aparece la necesidad de cambiar contratos publicos de upload
- una pantalla sube archivos por un cliente HTTP alterno que no pasa por interceptores
- la solucion exige introducir un servicio externo de conversion
- el problema real parece ser memoria, permisos o politica del navegador/OS y no solo formato

## 13. Checklist Operativo

- [ ] Lei `CONVENTIONS.md`
- [ ] Lei `conventions/frontend/frontend-rules.md`
- [ ] Lei `conventions/frontend/frontend-generic-services-catalog.md`
- [ ] Confirme si el error ocurre antes o despues del request HTTP
- [ ] Verifique si el archivo original es una imagen soportada
- [ ] Revise el paso de deteccion HEIC/HEIF
- [ ] Revise el paso de conversion local a JPEG
- [ ] Revise el paso de compresion o resize
- [ ] Confirme si el flujo usa `HttpClient` con `FormData`
- [ ] Confirme si el interceptor global cubre el caso
- [ ] Valide que no se duplico logica en features
- [ ] Ejecute validaciones tecnicas proporcionales al cambio

## 14. Formato de Entrega

Toda entrega sobre este flujo debe reportar:

- `Archivo original`
- `Tipo detectado`
- `Capa afectada`
- `Causa raiz`
- `Archivo(s) tocado(s)`
- `Cambio aplicado`
- `Riesgo residual`
- `Validacion ejecutada`

Ejemplo:

- Archivo original: `IMG_1024.HEIC`
- Tipo detectado: `image/heic`
- Capa afectada: `frontend/conversion`
- Causa raiz: el navegador no decodifico HEIC nativamente y el fallback no estaba integrado en el flujo central
- Archivo(s) tocado(s): `image-processing.service.ts`, `image-form-data.interceptor.fn.ts`
- Cambio aplicado: conversion local centralizada + garantia global para `FormData`
- Riesgo residual: flujos futuros fuera de `HttpClient` no recibiran cobertura automatica
- Validacion ejecutada: build Angular + pruebas unitarias del servicio/interceptor

## 15. Referencias Clave

- `D:\repos\luxuryapp-api\client\angular\src\app\core\services\image-processing.service.ts`
- `D:\repos\luxuryapp-api\client\angular\src\app\core\services\heic-converter.service.ts`
- `D:\repos\luxuryapp-api\client\angular\src\app\core\http\interceptors\image-form-data.interceptor.fn.ts`
- `D:\repos\luxuryapp-api\client\angular\src\app\app.config.ts`
- `D:\repos\luxuryapp-api\client\angular\src\app\core\services\image-processing.service.spec.ts`
- `D:\repos\luxuryapp-api\client\angular\src\app\core\http\interceptors\image-form-data.interceptor.fn.spec.ts`
- `D:\repos\luxuryapp-api\docs\conventions\frontend\frontend-generic-services-catalog.md`

## 16. Criterio Final

En LuxuryApp, el procesamiento de imagenes es una responsabilidad transversal
del frontend, no de una pantalla aislada.

Si una nueva carga de fotos aparece en la app, debe integrarse al servicio
central y respetar la garantia del interceptor, en lugar de inventar una ruta
paralela.
