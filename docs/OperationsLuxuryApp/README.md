# Módulo de Operaciones y Mantenimiento

Este módulo centraliza toda la operatividad técnica de los inmuebles, desde la gestión de activos y mantenimiento preventivo hasta el ciclo de compras y control de inventarios.

---

## Estructura del Módulo

Debido a su complejidad, el módulo de Operaciones se organiza en cuatro pilares fundamentales:

### 1. Gestión de Compras (`Purchases`)
- **Solicitud de Compra:** Registro de necesidades, cotizaciones (máx. 3) y cuadro comparativo.
- **Autorización:** Flujo de aprobación por montos y roles.
- **Integración:** Análisis de cotizaciones mediante IA y validación de presupuesto contra el módulo Contable.

### 2. Mantenimiento y Activos (`Machinery`, `Maintenance`)
- **Inventario de Maquinaria:** Registro detallado de equipos, garantías, manuales y ubicación física.
- **Calendarios de Mantenimiento:** Programación de servicios preventivos y correctivos.
- **Bitácoras Operativas:** Registro de lecturas de medidores, niveles de piscinas (`PiscinaBitacora`) y llamadas de emergencia en elevadores.

### 3. Inventarios y Almacenes (`Product`, `Warehouse`)
- **Catálogo de Productos:** Definición de insumos, unidades de medida y marcas.
- **Control de Existencias:** Entradas, salidas y transferencias entre almacenes.
- **Inventarios Especializados:** Control de extintores, llaves, luminarias, pintura y equipos de radiocomunicación.

### 4. Back-Office y Logística
- **Tareas Programadas (`Tasks`):** Gestión de pendientes operativos y legales.
- **Recepción de Inmuebles (`DeliveryReception`):** Procesos de entrega-recepción de áreas comunes y departamentos.
- **Soporte:** Recepción de pipas de agua y préstamos de herramientas.

---

## Reglas de Negocio Transversales

1.  **Seguridad y Auditoría:** Todas las operaciones críticas registran el usuario y timestamp. El uso de `[LogUserActivity]` es obligatorio en controladores.
2.  **Archivos y Evidencias:** Se permite la carga de fotos y documentos (PDF) para respaldar compras, mantenimientos y recepciones. El almacenamiento está organizado jerárquicamente por `CustomerId`.
3.  **Aislamiento Multi-tenant:** El filtrado por cliente es estricto y no negociable en todas las capas del servicio.

---

## Integración con Frontend

- **Arquitectura Responsiva:** Los módulos de bitácoras e inventarios deben ser **Mobile-first** mediante Ionic/Angular para su uso por personal técnico en campo.
- **Uso de Signals:** Implementación obligatoria para el manejo reactivo de inventarios y calendarios.
- **Reportes:** Uso de `HtmlPrintService` para la generación de órdenes de compra, hojas de mantenimiento y actas de recepción.

---

## Especificaciones Técnicas (API)

- **Controllers:** Organizados por subdominio (ej. `/api/solicitudcompra`, `/api/machinery`).
- **DTOs:** Uso de `ApiResponseDTO<T>`. Prohibido el uso de AutoMapper en proyecciones de listados extensos (inventarios).
- **Primary Constructors:** Estándar de codificación para todos los servicios inyectados.

---

_Documentación consolidada en Junio 2026_
