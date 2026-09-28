# UI Shared Library Architecture

**Ultima revision:** 2026-07-29

## Fuente oficial actual a consolidar

- [arquitectura-shared-ui.md](../../appsweb/angular/src/app/shared/ui/arquitectura-shared-ui.md)

## Regla

La arquitectura de `shared/ui` es oficial y no debe considerarse carpeta libre.

## Estructura general de la libreria

- `base/`
  - logica compartida sin UI de plataforma
- `web/`
  - implementaciones desktop
- `mobile/`
  - implementaciones moviles
- `adaptive/`
  - delegadores que eligen web o mobile
- `shared/`
  - piezas agnosticas
- `buttons/`
  - sistema de botones
- `inputs/`
  - sistema de inputs

## Reglas de frontera

- `web/` no importa Ionic/mobile
- `mobile/` no importa PrimeNG/web
- `base/` no importa librerias visuales de plataforma
- `adaptive/` es la capa que cruza cuando aplica

## Selectores oficiales

- `app-*`
  - web
- `ili-*`
  - mobile
- `lx-*`
  - adaptativo
- `custom-input-*-signal`
  - inputs adaptativos con selector historico conservado

## Regla de consumo

- Una feature no debe brincar directo a piezas internas si ya existe entrada adaptativa o wrapper oficial.
- Si una abstraccion oficial ya resuelve el caso, se consume esa.

## Impacto si se incumple

- ruptura de fronteras entre plataformas
- proliferacion de componentes paralelos
- perdida de consistencia entre desktop, mobile y capa adaptativa

