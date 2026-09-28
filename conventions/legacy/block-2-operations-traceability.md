# Trazabilidad - Bloque 2 Operacion, Hooks y Encoding

**Fecha:** 2026-07-30
**Bloque:** scripts de auditoria, hooks, onboarding y encoding

---

## Archivos revisados

1. `conventions/scripts-auditoria.md`
2. `conventions/onboarding-git-hooks.md`
3. `conventions/git-hooks-setup.md`
4. `conventions/DEVELOPER_ONBOARDING.md`
5. `conventions/tech-lead-onboarding-guide.md`
6. `conventions/encoding-stricto.md`

---

## Resultado

### 1. `scripts-auditoria.md`

- **Estatus:** absorbido parcialmente
- **Valor migrado:**
  - scripts por rol
  - hooks esperados
  - troubleshooting y comportamiento no destructivo
- **Destino nuevo principal:**
  - [git-hooks-and-audits.md](../operations/git-hooks-and-audits.md)

### 2. `onboarding-git-hooks.md`

- **Estatus:** absorbido parcialmente
- **Valor migrado:**
  - setup rapido para developer
  - rama reconocible
  - prueba de auditoria y entendimiento de hooks
- **Destino nuevo principal:**
  - [developer-onboarding.md](../operations/developer-onboarding.md)
  - [git-hooks-and-audits.md](../operations/git-hooks-and-audits.md)

### 3. `git-hooks-setup.md`

- **Estatus:** absorbido parcialmente
- **Valor migrado:**
  - configuracion minima
  - troubleshooting
  - comportamiento del bypass
- **Destino nuevo principal:**
  - [git-hooks-and-audits.md](../operations/git-hooks-and-audits.md)

### 4. `DEVELOPER_ONBOARDING.md`

- **Estatus:** absorbido funcionalmente
- **Valor migrado:**
  - flujo minimo de onboarding
  - pruebas de hook
  - lectura por rol
- **Destino nuevo principal:**
  - [developer-onboarding.md](../operations/developer-onboarding.md)

### 5. `tech-lead-onboarding-guide.md`

- **Estatus:** absorbido funcionalmente
- **Valor migrado:**
  - rol del mentor
  - onboarding guiado de 15 minutos
  - checklist de cierre
- **Destino nuevo principal:**
  - [tech-lead-onboarding.md](../operations/tech-lead-onboarding.md)

### 6. `encoding-stricto.md`

- **Estatus:** absorbido parcialmente
- **Valor migrado:**
  - regla estricta de UTF-8 sin BOM
  - cautela extra en Windows
  - recreacion desde contenido limpio cuando el archivo ya se corrompio
- **Destino nuevo principal:**
  - [encoding-rules.md](../operations/encoding-rules.md)

---

## Ambiguedades resueltas en este bloque

- hooks y scripts no son autoridad paralela; refuerzan el sistema rector
- onboarding del developer y del Tech Lead ya tienen destino oficial nuevo
- encoding ya no depende solo del documento legacy estricto

---

## Pendientes reales de este bloque

- limpiar referencias legacy y numeracion vieja en los documentos historicos
- validar si todos los scripts nombrados siguen existiendo o si algunos deben
  quedar marcados como historicos


