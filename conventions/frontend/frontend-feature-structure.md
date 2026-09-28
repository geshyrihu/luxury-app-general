# Frontend Feature Structure

**Ultima revision:** 2026-07-29

## Proposito

Definir la estructura real y obligatoria de una feature frontend Angular usando
patrones ya existentes y aprobados dentro del proyecto.

## Regla base

La estructura de features frontend debe seguir la estructura real y vigente del
proyecto. Ejemplo de referencia:

- [banks](../../appsweb/angular/src/app/modules/admin.luxuryapp/catalogos-generales/banks)

## Estructura observada y aprobada

> ⚠️ **Distinción feature vs grupo (vigente desde 2026-09-15):** este documento describe la estructura de una **feature** (submódulo, nivel 4). Un **grupo** (nivel 3, ej. `candidates/`) NO repite esta forma con archivos sueltos en su raíz; un grupo contiene submódulos y cada submódulo replica esta estructura. Ver `CONVENTIONS_FOLDER-FRONT.MD` §1.3. `banks/` es una feature; `candidates/` es un grupo que contiene la feature `candidate-core/` (y otras).

Tomando `banks` como referencia viva, una feature puede componerse de:

- raiz de feature
- archivo principal de listado
- archivo principal de formulario
- carpeta `desktop/`
- carpeta `mobile/`
- carpeta `interfaces/`
- specs por pieza principal

### Ejemplo real

```text
appsweb/angular/src/app/modules/admin.luxuryapp/catalogos-generales/banks/
|-- bank-form.html
|-- bank-form.spec.ts
|-- bank-form.ts
|-- bank-list.html
|-- bank-list.spec.ts
|-- bank-list.ts
|-- desktop/
|-- interfaces/
`-- mobile/
```

## Que vive en cada lugar

- Raiz de feature:
  - contenedores principales como `bank-list.ts` y `bank-form.ts`
  - templates y specs principales
- `desktop/`:
  - implementaciones especificas de escritorio
- `mobile/`:
  - implementaciones especificas moviles
- `interfaces/`:
  - DTOs, interfaces de forms y contratos locales de la feature

## Reglas

- El nombre semantico del modulo debe corresponder con backend.
- El dominio padre debe corresponder, por ejemplo `AdminLuxuryApp` <-> `admin.luxuryapp`.
- Si una nueva feature no tiene ubicacion clara, el agente propone y espera aprobacion.
- Codigo existente no se reubica por iniciativa propia; se reporta o entra a plan de migracion.
- Toda feature CRUD debe contemplar desktop y mobile cuando aplique.
- La raiz de feature no debe convertirse en cajon de sastre; utilidades y tipos deben vivir en sus carpetas correctas.
- Si existe estructura equivalente ya consolidada en una feature hermana, debe reutilizarse como referencia antes de inventar una nueva.

## Antipatrones

- Crear carpetas arbitrarias como `models/`, `utils/` o `services/` sin validar el patron vigente.
- Duplicar implementaciones desktop o mobile fuera de sus carpetas.
- Mezclar contratos shared con contratos locales de feature sin analisis de impacto.

