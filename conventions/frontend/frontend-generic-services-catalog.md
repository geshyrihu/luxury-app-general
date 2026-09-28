# Frontend Generic Services Catalog

**Ultima revision:** 2026-07-29

## Proposito

Definir el catalogo minimo de servicios genericos oficiales que deben agotarse
antes de crear nuevos servicios o helpers locales.

## Casos de uso a cubrir

- servicio unico para HTTP / API
- paginacion estandar
- dialog handler
- storage
- date service
- enum/select service
- table helpers
- toast / notifications
- file download / upload
- auth / current user / contexto
- pdf generator

## Regla

Si ya existe servicio generico oficial, debe usarse antes de crear otro.

## Servicios y utilidades ya reconocidos en el sistema

- `ApiResponseService`
- `PaginationStore`
- `DialogHandlerService`
- `FormHelper`
- `DateService`
- `EnumSelectService`
- `StorageService`
- `TableScrollHeightService`
- `PdfGeneratorService`
- `ImageProcessingService` — puerta de entrada única para validar, convertir
  HEIC/HEIF, redimensionar y comprimir imágenes antes de subirlas. Los
  componentes y features no deben implementar conversiones con canvas o
  librerías HEIC por su cuenta. `imageFormDataInterceptor` aplica además esta
  preparación como garantía final a todo archivo de imagen enviado dentro de
  `FormData`; los documentos y campos escalares se conservan sin cambios.

## Prohibiciones

- No usar `HttpClient` directo en features si el caso ya esta cubierto por `ApiResponseService`.
- No crear helpers locales de paginacion si aplica `PaginationStore`.
- No abrir dialogos directo si el flujo oficial requiere `DialogHandlerService`.
- No duplicar pequenas utilidades transversales dentro de una sola feature.
