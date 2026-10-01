# Plan de Refactorización: Vistas Móviles Adaptativas (UI/UX App-Feel)

**Módulo:** SharedLuxuryApp / UI  
**Fecha:** 2026-09-24  
**Responsable:** Arquitectura Frontend  
**Referencia Auditoría:** `reporte_auditoria_movil.md` (2026-09-24)

---

## 1. Contexto y Problema (Problem Statement)
La auditoría móvil de UI/UX demostró que las vistas de administración (`/admin`, `/admin/users`, `/admin/approval-rules`) están sufriendo de "fugas de Bootstrap". Esto ocurre porque se está utilizando el mismo template HTML (diseñado para escritorio con tablas y flexbox) en pantallas móviles, lo que causa recortes, solapamientos y una nula sensación de aplicación nativa (App-Feel).

## 2. Decisión Arquitectónica (ADR)
Siguiendo lo dictado en `arquitectura-shared-ui.md` (§4 y §5), la solución no es aislar el CSS a la fuerza, sino **separar el HTML** mediante Componentes Adaptativos.

## 3. Matriz de Reglas de Negocio a Respetar (4 Niveles)
- **Nivel 1 (Invariantes):** Ninguna lógica de negocio en TypeScript (CVA, signals, llamadas HTTP) debe alterarse. Ambas vistas (web/móvil) consumen el mismo controlador o Signal.
- **Nivel 2 (Flujo):** Los formularios móviles deben seguir abriéndose en un `ion-modal` utilizando el `IonicDialogModal` wrapper.
- **Nivel 3 (Seguridad):** Los permisos de renderizado de botones y acciones (roles) deben ser idénticos en escritorio y móvil.
- **Nivel 4 (Validación):** Touch targets en móvil deben ser de mínimo 44x44pt. El carácter separador `é` debe eliminarse (Quick Win).

## 4. Plan de Ejecución (Fases)

### Fase 1: Core y "Quick Wins" (Transversal)
1. Buscar y reemplazar el separador `é` en los pipes o interpolaciones de nombres/roles (`users-list.component`, `customers-list.component`).
2. Ajustar el padding derecho de los botones `.ili-am-trigger` en las tarjetas de `shared/ui/mobile`.
3. Ajustar márgenes en el componente del *Header Móvil* para prevenir el desbordamiento de la imagen de perfil y los botones de toggle.

### Fase 2: Refactorización Vista `Users` (`/admin/users`)
1. Crear `users-list-mobile.html` (o aislar lógicamente el `<ng-container>` para móvil).
2. Modificar el template principal de `users-list.component.html` para envolverlo en:
   ```html
   @if (platformService.isMobile()) {
     <app-users-list-mobile [users]="users()" />
   } @else {
     <!-- HTML original de escritorio -->
   }
   ```
3. El HTML móvil debe usar `<ion-list>`, `<ion-item>`, `<ion-avatar>`, `<ion-label>` nativos, sin usar clases `.row` o `.col-` de Bootstrap.

### Fase 3: Refactorización Vista `Approval Rules` (`/admin/approval-rules`)
1. Reemplazar la alerta genérica "optimizado para escritorio" por una verdadera vista móvil en base a tarjetas Ionic (`<ion-card>`).
2. Ajustar los botones de acción ("Guardar Cambios") envolviéndolos en `<ion-buttons>` dentro de un `<ion-toolbar>` para que no se recorten.

## 5. Criterios de Aceptación
- [ ] Ejecutar `npm run audit:ui` sin introducir violaciones de fronteras.
- [ ] La vista móvil de Usuarios renderiza listas nativas de Ionic sin clases `d-flex` de Bootstrap.
- [ ] La funcionalidad CRUD se mantiene intacta.
- [ ] El carácter `é` ya no existe en el sistema.
