# UTF-8 Stricto - Regla Obligatoria para Agentes

> **Estado de autoridad:** documento historico de apoyo controlado.
> La autoridad vigente para encoding vive en:
> - `CONVENTIONS.md`
> - `./operations/encoding-rules.md`
> - `.editorconfig`
> - `.gitattributes`
> - `.vscode/settings.json`
> Este archivo conserva contexto historico del incidente y las reglas de
> endurecimiento, pero no debe operar como fuente primaria aislada.

**Vigencia historica:** 2026-07-28 en adelante  
**Severidad historica:** critica  
**Responsable:** todo agente que toque archivos sensibles

---

## Proposito

Preservar el aprendizaje historico del incidente de encoding que afecto
documentacion clave y dejar claro por que el proyecto endurecio reglas de
UTF-8, movimientos de archivos y validaciones posteriores.

La regla rectora actual ya vive en
`./operations/encoding-rules.md`.

---

## Leccion historica principal

- un archivo corrupto por encoding puede inutilizar documentacion y flujo de
  trabajo
- no basta con "guardar y seguir"; hay que verificar legibilidad y encoding
- mover archivos con herramientas inadecuadas en Windows puede introducir
  corrupcion

---

## Reglas historicas que siguen siendo validas

- mantener archivos sensibles en UTF-8 sin BOM
- preferir PowerShell para operaciones de archivos delicadas en Windows
- verificar encoding y legibilidad despues de crear o mover archivos sensibles
- si un archivo queda verdaderamente dañado, preferir recrearlo desde contenido
  limpio antes que aplicar conversiones dudosas

---

## Capas de proteccion preservadas

- `.editorconfig`
- `.gitattributes`
- `.vscode/settings.json`

---

## Checklist historico util

- verificar que el archivo siga legible y sin mojibake
- confirmar que no quedo con BOM cuando el proyecto no lo permite
- si hubo move o reubicacion, volver a verificar despues del cambio
- si el archivo se corrompio de verdad, reportar y recrear con contenido limpio

---

## Relacion con documentos vigentes

- `CONVENTIONS.md`
- `./operations/encoding-rules.md`

---

## Nota Final

Este archivo se conserva como apoyo historico del endurecimiento de encoding.
La regla vigente ya no vive aqui, sino en el sistema rector actual.
