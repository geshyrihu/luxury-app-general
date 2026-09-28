# Documentation and Encoding Standard

> **Deep-dive:** las reglas generales están en CONVENTIONS.md §10 (Encoding) y §11 (Documentación). Este archivo contiene ejemplos detallados.

## 0. Documentación del Código
Todo el código del proyecto **debe documentarse en español**, sin excepción.

Esto aplica a:
- **Comentarios de línea y bloque** (`//`, `/* */`, `<!-- -->`)
- **Resúmenes XML** en C# (`/// <summary>`, `/// <param>`, `/// <returns>`)
- **JSDoc / TSDoc** en TypeScript
- **Nombres de variables y métodos** — si el nombre no es autoexplicativo, el comentario aclaratorio va en español
- **Archivos .md** de documentación por módulo

**Prohibido**: comentarios en inglés, incluso en código generado por herramientas (deben traducirse).

## 7. Internacionalización (i18n)
LuxuryApp es una aplicación **monoidioma en español de México**. No se implementará soporte multi-idioma.
- **Backend (.NET)**: Los textos de respuesta de la API están hardcoded en español directamente en los servicios. No se usan archivos `.resx`.
- **Frontend (Angular)**: `LOCALE_ID` está configurado en `"es-MX"`. Los pipes de fecha y número usan este locale por defecto.

## 8. Codificación de Caracteres (Encoding)
**Todo archivo del proyecto debe estar en UTF-8 sin BOM.** Esta es la única codificación aceptada.
Evita el uso de Latin-1/Windows-1252 (Visual Studio default), ya que causa corrupción de caracteres (ej. `N?mero` en lugar de `Número`).
