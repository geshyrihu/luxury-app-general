# Prompt — Reparar los 4 archivos corruptos que bloquean `ng serve`

usuario confirmó que la corrupción y los commits relacionados son
propios, de otra tarea). Se corrigen ahora porque **impiden que `ng
serve` levante para cualquier verificación**, no solo para Fase 6.

**No corras ningún script de reemplazo automático sobre estos
archivos.** La corrupción original probablemente vino de un script así
— cada fix de abajo es texto literal verificado, aplícalo a mano,
archivo por archivo.

## Cómo se verificó cada reconstrucción (para que confíes en el texto, no es una adivinanza a ciegas)

- Los nombres de propiedad del enum (`Department.Administracion`,
  `.Jardineria`, `.Supervision`, `.Direcciones`, `.Recepcion`,
  `.Mensajeria`) se confirmaron leyendo directamente
  `src/app/core/enums/department.enum.ts` — no se adivinaron.
- `"Placas"` se confirmó contra la etiqueta ya usada en el mismo
  archivo (`<span class="data-label">Placas:</span>`, línea 222 de
  `recepcion-pipas-agua-list.ts`).
- `"Cambiar Estado de Sanción"` se reconstruyó a partir del fragmento
  intacto `"Cambiar Es[...]ón"` que sí sobrevivió parcialmente en
  `sanction-list.ts` línea 96.
- `"Nueva Sanción"` (título del diálogo de `onCreate`) es la única
  reconstrucción sin fragmento sobreviviente que la confirme — se
  eligió por consistencia con el patrón `"Nuevo Registro"`/`"Editar"`
  ya usado en otras pantallas de este mismo repo. Si encuentras
  cualquier pista mejor en el archivo (comentario, otro texto similar
  en un componente hermano), úsala en su lugar; si no, usa esta.

## 1. `src/app/modules/recruitment.luxuryapp/expediente-del-empleado/employees/employees/employee-list.ts`

Reemplaza el bloque completo `readonly departamentLabels` (líneas
~76-91) por:

```ts
readonly departamentLabels: Record<number, string> = {
  [Department.Administracion]: "Administración",
  [Department.Legal]: "Legal",
  [Department.Contabilidad]: "Contabilidad",
  [Department.Mantenimiento]: "Mantenimiento",
  [Department.Limpieza]: "Limpieza",
  [Department.Operaciones]: "Operaciones",
  [Department.Jardineria]: "Jardinería",
  [Department.Sistemas]: "Sistemas",
  [Department.Seguridad]: "Seguridad",
  [Department.Constructora]: "Constructora",
  [Department.Supervision]: "Supervisión",
  [Department.Direcciones]: "Dirección",
  [Department.RecursosHumanos]: "Recursos Humanos",
  [Department.Reclutamiento]: "Reclutamiento",
  [Department.Recepcion]: "Recepción",
  [Department.Mensajeria]: "Mensajería",
  [Department.Ludoteca]: "Ludoteca",
  [Department.NA]: "Sin Departamento",
};
```

## 2. `src/app/modules/recruitment.luxuryapp/reclutamiento-y-altas-bajas/recruitment-staff-board/recruitment-staff-board.ts`

Mismo bloque `readonly departamentLabels` (líneas ~111-126), el mismo
reemplazo exacto de arriba.

## 3. `src/app/modules/maintenance.luxuryapp/logs/recepcion-pipas-agua/recepcion-pipas-agua-list.ts`

En el array `photoDefs` (líneas ~165-174), corrige estas 3 líneas
(las demás del array ya están bien, no las toques):

```ts
{ label: "Pipa vacía", url: item.fotoPipaVaciaUrl },   // antes: { ía", url: ... }
{ label: "Placas", url: item.fotoPlacasUrl },          // antes: { label: "Pón", url: ... }
{ label: "Medidor después", url: item.fotoMedidorDespuesUrl }, // antes: { label: "és", url: ... }
{ label: "Nivel después", url: item.fotoNivelDespuesUrl },     // antes: { label: "és", url: ... } (línea 173, la SEGUNDA que dice "és" — no la confundas con la anterior)
```

**Bonus opcional, no bloquea el build** (misma corrupción, no la
detecta `tsc` porque el string queda bien cerrado): línea ~213,
`"Sopoón de Pipa de Agua"` → `"Soporte de Pipa de Agua"` (confirmado
por el nombre de archivo de descarga en la línea 270,
`` `soporte-pipa-${...}` ``). Corrígelo ya que estás en el archivo,
pero si por alguna razón prefieres no tocar nada fuera de lo que
bloquea el build, esto puede quedar pendiente sin problema.

## 4. `src/app/modules/operations.luxuryapp/incidencias-sanciones/sanction/sanction-list.ts`

Dos títulos de diálogo corruptos:

```ts
// onCreate (línea ~85), antes: ón",
"Nueva Sanción",

// onChangeStatus (línea ~96), antes: "Cambiar Esón",
"Cambiar Estado de Sanción",
```

## Verificación

1. `npx tsc --noEmit` → cero errores en estos 4 archivos (y en todo el
   proyecto, si no hay ninguna otra corrupción suelta).
2. `ng serve` levanta limpio, puerto 4200 responde.
3. No toques ningún otro archivo — esto es solo destrabar el build,
   no una limpieza general de encoding.

## Listo cuando

- Los 4 archivos compilan limpio.
- `ng serve` arriba sin error.
- `git diff --stat` mostrando solo estos 4 archivos (5 si se incluyó
  el bonus opcional del punto 3).
