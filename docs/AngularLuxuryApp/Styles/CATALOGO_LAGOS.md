# Catálogo de Componentes: Lagos Template vs LuxuryApp

Este documento mantiene el rastreo de qué estilos y componentes del template original **Lagos** han sido adaptados e importados formalmente al Design System de LuxuryApp (inyectados vía `ds-entry.scss`).

* **[x]** = Importado y adaptado a colores corporativos (`--ds-primary`).
* **[ ]** = Pendiente de migración (disponible en el código de Lagos pero aún no trasladado).

---

## 1. Utilidades y Base (Helpers)
Estas son clases rápidas usadas extensivamente en el HTML del template.

- [x] **Utilidades de Texto (Weights):** `.f-w-600`, `.f-w-700`, etc. (Migrado a `_lagos-ui-kits.scss`)
- [x] **Utilidades de Borde:** `.b-r-4`, `.b-r-15`, `.rounded-circle`, etc. (Migrado a `_lagos-ui-kits.scss`)
- [x] **Colores rápidos:** `.font-primary`, `.bg-primary`, `.bg-secondary`, etc. (Migrado a `_lagos-ui-kits.scss`)
- [x] **Scrollbar:** Diseño macOS/Lagos (Migrado vía mixin a modales)
- [ ] **Reset CSS original de Lagos:** (Omitido intencionalmente para no chocar con Bootstrap nativo)

---

## 2. Componentes UI Base (Components)
El núcleo visual de los elementos de interfaz.

- [x] **Alerts:** (`_alerts.scss`)
- [x] **Avatars & Avatar Groups:** `.avatar`, `.img-100`, `.status-online`, `.customers` (`_lagos-ui-kits.scss`)
- [x] **Badges:** Variantes solidas y redondeadas (`_lagos-ui-kits.scss`)
- [x] **Buttons:** Estilos nativos de botones (`_buttons.scss`)
- [x] **Cards:** Tarjetas con sombras de Lagos (`_cards.scss`)
- [x] **Calendar (FullCalendar):** Grilla, toolbar y eventos (`_fullcalendar-overrides.scss`)
- [x] **Dropdowns:** Menús desplegables (`_dropdowns.scss`)
- [x] **Forms & Inputs:** Campos de texto, floats (`_forms.scss`, `_inputs.scss`)
- [x] **Modals:** Ventanas flotantes con animaciones y blur (`_modals.scss`)
- [x] **Select2 / Ng-Select:** Adaptación del selector múltiple (`_ng-select-overrides.scss`)
- [x] **Switches:** Toggles de encendido/apagado (`_lagos-ui-kits.scss`)
- [x] **Tables & Datatables:** (`_tables.scss`, `_table-overrides.scss`)
- [x] **Tabs:** Pestañas de navegación (`_lagos-ui-kits.scss`)
- [x] **Accordion:** Paneles colapsables (`_lagos-ui-kits.scss`)
- [x] **Bookmark / Breadcrumb:** Migas de pan y marcadores (`_lagos-ui-kits.scss`)
- [x] **Datepicker / Flatpickr:** Implementado vía librería `angularx-flatpickr` (`_flatpickr.scss`)
- [x] **Form Wizards:** Formularios paso a paso (`_forms.scss`)
- [x] **List / List-group:** Listas estilizadas (`_lagos-ui-kits.scss`)
- [x] **Loader / Spinners:** Iconos de carga (`_lagos-ui-kits.scss`)
- [x] **Popover & Tooltip:** Globos emergentes al pasar el mouse (`_lagos-ui-kits.scss`)
- [x] **Progress:** Barras de progreso (`_lagos-ui-kits.scss`)
- [x] **Radio / Checkbox:** Estilos personalizados cuadrados y circulares (`_lagos-ui-kits.scss`)
- [x] **Ribbons:** Cintas de colores que van en las esquinas de las Cards (`_lagos-ui-kits.scss`)
- [x] **Range-Slider:** Deslizadores numéricos (`_inputs.scss`)
- [x] **Toasts:** Notificaciones push (`_alerts.scss`)
- [x] **Tour / Tree:** Guías y diagramas de árbol (`_lagos-ui-kits.scss`)

---

## 3. Layout (Estructura)
Define la estructura "Macro" de la aplicación.
> **Status:** En *Standby* por decisión de arquitectura actual.

- [ ] **Header:** Barra superior (notificaciones, perfil)
- [ ] **Sidebar:** Menú lateral izquierdo (colapsable, dark/light mode)
- [ ] **Footer:** Pie de página
- [ ] **Megaoption:** Menús expansivos grandes

---

## 4. Páginas Específicas (Pages CSS)
El template Lagos incluye CSS súper específico para páginas pre-construidas. Sólo deben migrarse cuando se construya el módulo equivalente en Angular para evitar engordar la app con código muerto.

- [x] **Timeline:** Líneas de tiempo (`_timelines.scss`)
- [ ] **Blog**
- [ ] **Chat / Contactos**
- [ ] **Dashboards:** (Widget cards, gráficos Chartist/Apex)
- [ ] **E-Commerce:** (Catálogo, carrito, checkout)
- [ ] **Email / Inbox**
- [ ] **Kanban Board**
- [ ] **Login / Autenticación**
- [ ] **User Profile** (Cabeceras de perfiles)
- [ ] **Pricing / Rating / Invoice**
