# Candidates Frontend Setup

Ultima revision: `2026-08-09`
Para: developers que continuan el modulo `Candidates`

## Objetivo

Dar un punto de entrada rapido y correcto al frontend del modulo sin empujar
rutas o abstracciones que hoy no existen en el feature.

## Lectura minima recomendada

Leer en este orden:

1. `CONVENTIONS.md`
2. `docs/README.md` de esta carpeta
3. `docs/decisiones.md` de esta carpeta
4. `api/.../Candidates/README.md`

No tomar como verdad operativa documentos viejos que describan:

- `client/luxuryapp/...`
- rutas distintas a `candidates`, `applications`, `interviews`
- servicios frontend no presentes en codigo

## Ruta oficial del frontend

```text
client/angular/src/app/modules/recruitment.luxuryapp/candidates
```

## Estructura que debes memorizar

```text
candidates/
|-- candidates/
|-- candidate-applications/
|-- candidate-interview/
|-- recruitment-shared/
|-- docs/
`-- candidates.routing.ts
```

Regla practica:

- `candidates/`: ficha maestra del candidato
- `candidate-applications/`: postulaciones y cambios de etapa
- `candidate-interview/`: retroalimentacion
- `recruitment-shared/`: piezas reutilizables dentro del modulo

## Rutas para correr y probar

- `http://localhost:4200/recruitment/candidates/candidates`
- `http://localhost:4200/recruitment/candidates/applications`
- `http://localhost:4200/recruitment/candidates/interviews`

## Patron tecnico que si existe hoy

El feature actual usa:

- componentes standalone
- `signal()` y `computed()`
- `ApiResponseService`
- `DialogHandlerService`
- componentes `@ui/*`

No asumas que el modulo ya usa:

- stores de paginacion por feature
- servicios `CandidateService` por entidad
- componentes con sufijo `.component.ts`

## Primer recorrido sugerido

### 1. Leer el routing local

Archivo:

- `candidates.routing.ts`

Confirma las tres entradas reales del modulo:

- `candidates`
- `applications`
- `interviews`

### 2. Leer los entry points

- `candidates/candidate-list.ts`
- `candidate-applications/candidate-application-list.ts`
- `candidate-interview/candidate-interview-pending-list.ts`

### 3. Leer los modales clave

- `candidates/candidate-form.ts`
- `candidate-applications/candidate-stage-change-modal.ts`
- `candidate-applications/candidate-process-hiring-modal.ts`
- `candidate-interview/candidate-interview-feedback-form.ts`

## Primer cambio seguro

Si necesitas un primer cambio pequeno para ubicarte:

1. abre `candidates/candidate-list.ts` y sus vistas desktop/mobile
2. identifica una columna o etiqueta visible
3. cambia solo presentacion, no contratos
4. valida en runtime en `candidates`

## Endpoints que realmente consume el feature

Revisa:

- `src/app/core/constants/endpoints/reclutamiento.endpoints.ts`

Piezas clave:

- `EndpointsReclutamiento.Candidates`
- `EndpointsReclutamiento.CandidateApplications`
- `EndpointsReclutamiento.CandidateInterviews`

## Cosas que hoy causan errores de continuidad

- buscar archivos `*.component.ts` que no existen
- documentar `api/candidates` cuando el modulo usa `recruitment-candidates`
- hablar de estados `AwaitingInterview` o `Interviewed` cuando el enum real es otro
- asumir carpeta `interfaces/` en raiz del feature
- mezclar `Candidate` con `CandidateApplication`

## Checklist antes de tocar codigo

- verificar si el cambio es de `candidate`, `candidate-application` o `candidate-interview`
- ubicar el endpoint real en `EndpointsReclutamiento`
- validar si ya existe un componente reusable en `recruitment-shared`
- revisar si el cambio afecta etapa, CV o proceso de alta
- no tocar shared global sin analisis de impacto

## Nota de runtime

La validacion manual completa del modulo depende de que:

- frontend local responda en `4200`
- backend local responda correctamente
- la conexion a SQL del entorno este sana

Si el backend no levanta, puedes revisar layout, wiring y rutas del frontend,
pero no cerrar el smoke test funcional completo.
