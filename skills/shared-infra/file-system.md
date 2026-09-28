# 🏗️ File & Image Storage System

> **Deep-dive:** las reglas generales están en CONVENTIONS.md §18.1 (Sistema de Archivos). Este archivo contiene ejemplos detallados.

## 4.5. Arquitectura de 3 Capas
**No saltarse capas**. Las responsabilidades son:
1.  `IFileWritePathService` → Obtener la **ruta física** del directorio destino.
2.  `ISecureFileStorageService / IImageStorageService` → **Guardar** el archivo (con validación binaria).
3.  `IFileReadPathService` → Obtener la **URL segura** para que el frontend descargue.

## Imágenes (IImageStorageService)
Para fotos de perfil, productos:
- Redimensionado automático a **1296x972 px**.
- Validación de magic bytes (JPEG, PNG, WebP).
- Tamaño máximo: 5 MB.

## Archivos Seguros (ISecureFileStorageService)
Valida firma binaria (magic bytes):
- JPEG, PNG, PDF, ZIP, Office (docx/xlsx/pptx), XML.
- Tamaño: según `FileStorage:MaxFileSizeMb` en `appsettings.json`.

## Convención de Rutas (FileDirectories)
- `public/customers/{customerId}/{módulo}/...`
- `public/Administration/{módulo}/...`
- `private/rrhh/{userId}/...` (Archivos privados).
