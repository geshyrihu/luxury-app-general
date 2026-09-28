# Arquitectura Base: Separación Estricta Web/Móvil (PWA Native Feel)

## 1. El Problema Raíz ("Meses arreglando y descomponiendo")
La razón por la que la aplicación ha sido frágil en su vista móvil es por intentar **fusionar paradigmas**. Componentes como `<app-data-view-mobile>` intentaron ser un "puente" rápido para listar datos, pero lo hicieron usando clases de escritorio (`d-flex`, `flex-column`, `position: sticky`) dentro del ecosistema de Ionic. 

**Consecuencia:** Se rompe el scroll nativo, los Safe Areas (Notch de iPhone), el comportamiento del teclado, y la tipografía hereda los estilos gigantes de Bootstrap (la "Fuga de Bootstrap").

## 2. El Patrón Oficial: Bifurcación Smart-Dumb (Basado en el módulo `Banks`)
El submódulo de Bancos (`catalogs/banks`) tiene la estructura perfecta que debemos estandarizar en **todos los catálogos y vistas**:

```text
banks/
├── bank-list.ts           (SMART COMPONENT) - Lógica, Signals, API. No tiene HTML estructural.
├── bank-list.html         (BIFURCADOR) - Solo tiene @if (platform.isMobile())
├── desktop/
│   └── bank-list-desktop  (DUMB WEB) - Puro HTML Bootstrap y <app-table>.
└── mobile/
    └── bank-list-mobile   (DUMB MÓVIL) - 100% Ionic Nativo. Cero Bootstrap.
```

### Reglas del Smart Component (`bank-list.ts`)
- Inyecta servicios, maneja estados (`signal`) y hace llamadas HTTP.
- **NO** manipula el DOM.
- Pasa los datos hacia abajo (via `[data]`) y escucha eventos (via `(edit)`, `(delete)`).

---

## 3. La Muerte de `<app-data-view-mobile>`
De acuerdo al prompt `analisismobil.md`, buscamos una **app móvil real**. `<app-data-view-mobile>` debe ser **deprecado y eliminado progresivamente** porque:
1. Simula un header con `position: sticky` en lugar de usar `<ion-header>`, perdiendo el cálculo del Notch.
2. Usa breadcrumbs, lo cual es un anti-patrón en UI móvil.
3. Envuelve la lista en un `div` con `overflow-y-auto`, destruyendo el pull-to-refresh y el scroll nativo de `<ion-content>`.

### El Nuevo Estándar para Componentes Móviles (`-mobile.html`)
Cada vista móvil delegada debe comportarse como una página nativa, utilizando exclusivamente el DOM de Ionic:

```html
<!-- EJEMPLO ESTÁNDAR PARA bank-list-mobile.html -->
<div class="ion-page"> <!-- Necesario si Angular 22 no lo inyecta por el enrutador -->
  
  <ion-header class="ion-no-border">
    <ion-toolbar>
      <ion-title>Bancos</ion-title>
      <!-- Botón de acción principal en el header -->
      <ion-buttons slot="end">
        <ion-button (click)="add.emit()">
          <ion-icon name="add-circle" class="text-2xl text-primary"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
    
    <ion-toolbar>
      <ion-searchbar placeholder="Buscar banco..." animated></ion-searchbar>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <!-- Filtros ocultables (Accordion) o Botón que abra un Bottom Sheet -->
    <ion-list inset="true">
      @for(item of data(); track item.id) {
        <ion-item>
          <ion-avatar slot="start">
            <app-icon icon="business-outline" class="text-primary"></app-icon>
          </ion-avatar>
          <!-- REGLA DE ORO: Todo texto va dentro de ion-label -->
          <ion-label>
            <h2 class="ion-text-wrap fw-bold">{{ item.shortName }}</h2>
            <p class="ion-text-wrap">{{ item.code }} - {{ item.largeName }}</p>
          </ion-label>
        </ion-item>
      }
    </ion-list>
  </ion-content>

</div>
```

---

## 4. Reglas Estrictas de Maquetación Móvil (Checklist PWA)

Para construir la librería de custom components móviles y asegurar que NUNCA más se rompa la tipografía o el layout, los desarrolladores y agentes deben seguir este checklist:

1. **La Regla del Label (`<ion-label>`)**: 
   - Prohibido usar `<h2>`, `<h3>`, `<p>` sueltos dentro de un `<ion-item>`. Si no están dentro de un `<ion-label>`, Ionic no aplica su Shadow DOM y Bootstrap inflará la tipografía.
2. **Cero Bootstrap Estructural en Móvil**:
   - Prohibido usar `d-flex`, `row`, `col`, `w-100`, `h-100` para construir layouts móviles. Ionic usa sus propios slots (`slot="start"`, `slot="end"`) e `<ion-grid>` si es estrictamente necesario.
3. **Manejo de Formularios (Modal vs Page)**:
   - Tal como dicta `arquitectura-shared-ui.md`, los formularios móviles se abren en un `ion-modal` usando el `IonicDialogModal` wrapper, consumiendo los mismos `DynamicDialogConfig`. No cambies esta lógica, funciona excelente.
4. **Filtros Inteligentes**:
   - Nunca apilar selects (`<custom-input-select-signal>`) a simple vista en móvil. Deben ir dentro de un `<ion-accordion>` o abrirse en un modal tipo "Bottom Sheet".

## 5. Próximos Pasos (Hoja de Ruta)
1. **Congelar `<app-data-view-mobile>`**: No usarlo en ningún catálogo nuevo.
2. **Refactorizar Catálogos Core**: Migrar `banks`, `customers`, y módulos de alto tráfico al nuevo estándar de `<ion-header>` e `<ion-content>` sin wrappers.
3. **Desacoplar CSS**: Asegurar que `styles.scss` no inyecte estilos de reseteo web a las etiquetas `h1-h6` cuando la app corre en móvil.
