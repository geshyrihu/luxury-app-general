# ESTRUCTURA — Manual Jefe de Mantenimiento GLB
> Mapeo del PDF "Capacitación Jefe de Mantenimiento GLB-2025" al sistema de Manuales y Procesos.
> Cada proceso se convierte en un **ManualTemplate** independiente. Los diagramas de flujo se crean desde el editor (sección tipo Flowchart), no se incluyen aquí.

---

## PROCESO 1 — ENTREGA DE RECURSOS

**Folio:** GLB-MTTO-001  
**Tipo:** Procedimiento Operativo  
**Departamento:** Mantenimiento  
**Versión:** 1.0

### Items / Secciones

#### [1] Objetivo — `sectionType: Objective`
```json
{
  "html": "<p>Garantizar que el Jefe de Mantenimiento cuente con todos los recursos materiales, tecnológicos y de acceso necesarios para llevar a cabo sus funciones de forma efectiva desde el primer día de operación en las propiedades administradas por Luxury Building Group.</p>"
}
```

#### [2] Alcance — `sectionType: Scope`
```json
{
  "html": "<p>Aplica a todo el personal de nuevo ingreso al área de mantenimiento. La entrega de recursos es responsabilidad conjunta del área de <strong>Administración</strong> (equipos físicos y uniformes) y del área de <strong>Sistemas</strong> (licencias, accesos y herramientas digitales).</p>"
}
```

#### [3] Glosario — `sectionType: Glossary`
```json
{
  "terms": [
    { "term": "Luxuryapp", "noUsar": "App interna", "definition": "Aplicación operativa interna de Luxury Building Group para gestión de mantenimiento, tickets y bitácoras." },
    { "term": "LuxuryCloud", "noUsar": "Nube", "definition": "Plataforma de almacenamiento en la nube para carpetas compartidas del área de mantenimiento." },
    { "term": "Anydesk", "noUsar": "Soporte remoto", "definition": "Herramienta de soporte técnico remoto instalada en el equipo de cómputo del Jefe de Mtto." },
    { "term": "Correo empresarial", "noUsar": "Correo personal", "definition": "Cuenta de correo corporativa formato Mtto(cliente)@luxurybuilding.com.mx asignada por Sistemas." },
    { "term": "Tarjeta digital", "noUsar": "Firma de correo", "definition": "Firma electrónica profesional instalada en Outlook para comunicaciones oficiales." }
  ]
}
```

#### [4] Matriz RACI — `sectionType: Raci`
```json
{
  "activities": [
    { "activity": "Entrega de uniforme (2 camisas, 2 pantalones, 1 par de botas)", "responsible": "Administración", "accountable": "Administrador", "consulted": "Jefe MTTO", "informed": "Gerente MTTO" },
    { "activity": "Entrega y configuración de computadora (i5, 16GB RAM, SSD 500GB)", "responsible": "Sistemas", "accountable": "Jefe de Sistemas", "consulted": "Administrador", "informed": "Gerente MTTO" },
    { "activity": "Asignación de licencias Office 365, Zoom, Teams", "responsible": "Sistemas", "accountable": "Jefe de Sistemas", "consulted": "Jefe MTTO", "informed": "Administrador" },
    { "activity": "Alta de correo empresarial y tarjeta digital", "responsible": "Sistemas", "accountable": "Jefe de Sistemas", "consulted": "Jefe MTTO", "informed": "Administrador" },
    { "activity": "Acceso a LuxuryApp y App operativa", "responsible": "Administración", "accountable": "Administrador", "consulted": "Sistemas", "informed": "Gerente MTTO" },
    { "activity": "Acceso a carpetas LuxuryCloud", "responsible": "Sistemas", "accountable": "Jefe de Sistemas", "consulted": "Jefe MTTO", "informed": "Gerente MTTO" }
  ]
}
```

#### [5] Pasos del Procedimiento — `sectionType: Steps`
```json
{
  "steps": [
    { "order": 1, "actor": "Administración", "action": "Verificar lista completa de recursos a entregar según tabla de inducción.", "notes": "", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 2, "actor": "Administración", "action": "Entregar uniforme: 2 camisas, 2 pantalones, 1 par de botas. Firmar acuse de recibo.", "notes": "El uniforme se adquiere anualmente.", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 3, "actor": "Administración", "action": "Entregar computadora con requisitos mínimos: core i5, 16 GB RAM, SSD 500 GB.", "notes": "", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 4, "actor": "Sistemas", "action": "Instalar y activar licencias: Office 365, Acrobat Reader, Anydesk.", "notes": "", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 5, "actor": "Sistemas", "action": "Crear y configurar correo empresarial. Instalar tarjeta digital en Outlook.", "notes": "Formato: Mtto(cliente)@luxurybuilding.com.mx", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 6, "actor": "Sistemas", "action": "Configurar Zoom y Teams vinculados al correo empresarial del Jefe de Mtto.", "notes": "Validar que los datos de la cuenta correspondan al correo empresarial.", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 7, "actor": "Sistemas", "action": "Dar acceso a carpetas correspondientes en LuxuryCloud.", "notes": "", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 8, "actor": "Administración", "action": "Dar de alta al Jefe de Mtto en LuxuryApp y App operativa.", "notes": "", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 9, "actor": "Jefe MTTO", "action": "Confirmar recepción de todos los recursos. Firmar acuse de entrega completa.", "notes": "", "isDecision": true, "decisionYes": "Recursos completos → iniciar funciones", "decisionNo": "Recursos incompletos → reportar a Administrador" }
  ]
}
```

#### [6] Advertencia — `sectionType: Alert`
```json
{
  "alertType": 0,
  "text": "No se deben iniciar funciones operativas hasta tener todos los accesos y recursos confirmados. La falta de algún recurso debe reportarse al Administrador el mismo día de ingreso."
}
```

---

## PROCESO 2 — ORDEN Y LIMPIEZA

**Folio:** GLB-MTTO-002  
**Tipo:** Procedimiento Operativo  
**Departamento:** Mantenimiento

### Items / Secciones

#### [1] Objetivo — `sectionType: Objective`
```json
{
  "html": "<p>Establecer los estándares de orden y limpieza que deben mantenerse en el taller, almacén y cuartos de máquinas de las propiedades administradas por Luxury Building Group, proyectando profesionalismo y garantizando un ambiente de trabajo seguro y eficiente.</p>"
}
```

#### [2] Alcance — `sectionType: Scope`
```json
{
  "html": "<p>Aplica a todas las áreas de trabajo del departamento de mantenimiento: taller, almacén de insumos, almacén de herramientas, cuartos de máquinas y oficina del Jefe de Mantenimiento.</p>"
}
```

#### [3] Matriz RACI — `sectionType: Raci`
```json
{
  "activities": [
    { "activity": "Organización de herramientas en tableros y racks", "responsible": "Jefe MTTO", "accountable": "Jefe MTTO", "consulted": "Supervisor MTTO", "informed": "Gerente MTTO" },
    { "activity": "Limpieza diaria del taller y oficina", "responsible": "Técnico MTTO", "accountable": "Jefe MTTO", "consulted": "", "informed": "Supervisor MTTO" },
    { "activity": "Orden del almacén de insumos y herramientas", "responsible": "Jefe MTTO", "accountable": "Jefe MTTO", "consulted": "Supervisor MTTO", "informed": "Gerente MTTO" },
    { "activity": "Supervisión de estándares de orden", "responsible": "Supervisor MTTO", "accountable": "Gerente MTTO", "consulted": "Jefe MTTO", "informed": "Administrador" }
  ]
}
```

#### [4] Pasos del Procedimiento — `sectionType: Steps`
```json
{
  "steps": [
    { "order": 1, "actor": "Jefe MTTO", "action": "Revisar diariamente que todas las herramientas estén clasificadas y ubicadas en su lugar designado en tableros o racks.", "notes": "Cada herramienta debe tener posición fija e identificada.", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 2, "actor": "Técnico MTTO", "action": "Realizar limpieza del taller, oficina y áreas de trabajo al inicio y al cierre de cada turno.", "notes": "Usar foto de referencia como estándar de entrega.", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 3, "actor": "Jefe MTTO", "action": "Mantener el almacén de insumos organizado por categorías, con etiquetas visibles y pasillos despejados.", "notes": "", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 4, "actor": "Supervisor MTTO", "action": "Realizar supervisión semanal del estado de orden y limpieza. Documentar hallazgos en LuxuryApp.", "notes": "", "isDecision": true, "decisionYes": "Cumple estándar → registrar OK", "decisionNo": "No cumple → levantar observación y dar seguimiento" }
  ]
}
```

#### [5] Nota — `sectionType: Alert`
```json
{
  "alertType": 1,
  "text": "Las fotografías del taller modelo (tableros organizados, pasillos despejados, almacén etiquetado) son el estándar de referencia. Se recomienda publicarlas en el taller como guía visual permanente."
}
```

---

## PROCESO 3 — USO DE UNIFORME

**Folio:** GLB-MTTO-003  
**Tipo:** Política Corporativa  
**Departamento:** Mantenimiento

### Items / Secciones

#### [1] Objetivo — `sectionType: Objective`
```json
{
  "html": "<p>Establecer las directrices para el uso correcto del uniforme del personal de mantenimiento, garantizando una imagen profesional, consistente y alineada con los estándares de Luxury Building Group en todas las propiedades.</p>"
}
```

#### [2] Alcance — `sectionType: Scope`
```json
{
  "html": "<p>Aplica a todos los colaboradores del área de mantenimiento: Jefe de Mantenimiento y Técnicos de Mantenimiento. Los uniformes son adquiridos anualmente por la empresa.</p>"
}
```

#### [3] Glosario — `sectionType: Glossary`
```json
{
  "terms": [
    { "term": "Jefe MTTO", "noUsar": "Supervisor de campo", "definition": "Jefe de Mantenimiento: perfil administrativo-operativo. Uniforme formal (pantalón caqui, camisa manga larga azul, botas vanvien m17)." },
    { "term": "Técnico MTTO", "noUsar": "Técnico operativo", "definition": "Técnico de Mantenimiento: perfil operativo. Uniforme de trabajo (mezclilla, playera negra, botas con casquillo negras, overol para pintar)." },
    { "term": "Fajado", "noUsar": "Camisa por fuera", "definition": "La camisa debe portarse introducida dentro del pantalón en todo momento." }
  ]
}
```

#### [4] Matriz RACI — `sectionType: Raci`
```json
{
  "activities": [
    { "activity": "Portación de uniforme completo y correcto durante el turno", "responsible": "Jefe MTTO / Técnico MTTO", "accountable": "Jefe MTTO", "consulted": "", "informed": "Supervisor MTTO" },
    { "activity": "Supervisión del uso correcto del uniforme", "responsible": "Supervisor MTTO", "accountable": "Gerente MTTO", "consulted": "Administrador", "informed": "Dirección General" },
    { "activity": "Renovación anual de uniformes", "responsible": "Administración", "accountable": "Administrador", "consulted": "Gerente MTTO", "informed": "Jefe MTTO" }
  ]
}
```

#### [5] Pasos del Procedimiento — `sectionType: Steps`
```json
{
  "steps": [
    { "order": 1, "actor": "Jefe MTTO / Técnico MTTO", "action": "Presentarse al turno con uniforme completo asignado según puesto (ver tabla de uniformes por posición).", "notes": "Jefe: pantalón caqui, camisa manga larga azul, botas m17. Técnico: mezclilla, playera negra, botas casquillo.", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 2, "actor": "Jefe MTTO / Técnico MTTO", "action": "Verificar presentación personal: afeitado, peinado adecuado, camisa fajada, cinturón (sin cintas), zapatos bien boleados.", "notes": "", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 3, "actor": "Jefe MTTO", "action": "Portar overol para pintar únicamente al realizar trabajos de pintura. Regresar a uniforme estándar al finalizar.", "notes": "El overol es exclusivo para trabajos de pintura.", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 4, "actor": "Supervisor MTTO", "action": "Verificar presentación del equipo al inicio del turno. Registrar incidencias en LuxuryApp.", "notes": "", "isDecision": true, "decisionYes": "Cumple → iniciar turno", "decisionNo": "No cumple → enviar a corregir presentación antes de iniciar" }
  ]
}
```

#### [6] Advertencia — `sectionType: Alert`
```json
{
  "alertType": 0,
  "text": "El incumplimiento del uniforme es una falta disciplinaria. No se permite iniciar el turno sin el uniforme correcto. El uso incorrecto del uniforme en presencia de clientes afecta directamente la imagen de Luxury Building Group."
}
```

---

## PROCESO 4 — INVENTARIOS

**Folio:** GLB-MTTO-004  
**Tipo:** Procedimiento Operativo  
**Departamento:** Mantenimiento

### Items / Secciones

#### [1] Objetivo — `sectionType: Objective`
```json
{
  "html": "<p>Mantener actualizados y controlados todos los inventarios del edificio para garantizar la disponibilidad de recursos, equipos y herramientas necesarios para la operación eficiente del área de mantenimiento.</p>"
}
```

#### [2] Alcance — `sectionType: Scope`
```json
{
  "html": "<ul><li>Amenidades y áreas comunes</li><li>Cuartos de máquinas</li><li>Mobiliario</li><li>Llaves</li><li>Herramientas</li><li>Radios de comunicación</li><li>Medidores (agua, gas, electricidad)</li><li>Equipos generales y de gimnasio</li><li>Catálogos de iluminación y pintura del edificio</li><li>Extintores</li><li>Insumos en almacén</li><li>Pólizas de mantenimiento vigentes</li></ul>"
}
```

#### [3] Glosario — `sectionType: Glossary`
```json
{
  "terms": [
    { "term": "Inventario físico", "noUsar": "Lista de activos", "definition": "Conteo y verificación presencial de los bienes del edificio con registro en LuxuryApp." },
    { "term": "Póliza de mtto vigente", "noUsar": "Contrato de servicio", "definition": "Contrato activo con proveedor externo para mantenimiento preventivo/correctivo de un equipo o sistema." },
    { "term": "Catálogo de iluminación", "noUsar": "Lista de focos", "definition": "Documento que especifica el tipo, potencia y ubicación de cada luminaria del edificio." }
  ]
}
```

#### [4] Matriz RACI — `sectionType: Raci`
```json
{
  "activities": [
    { "activity": "Levantamiento y actualización de inventarios físicos", "responsible": "Jefe MTTO", "accountable": "Jefe MTTO", "consulted": "Supervisor MTTO", "informed": "Administrador" },
    { "activity": "Control de entradas y salidas en almacén (insumos y herramientas)", "responsible": "Jefe MTTO", "accountable": "Jefe MTTO", "consulted": "", "informed": "Supervisor MTTO" },
    { "activity": "Validación de inventarios", "responsible": "Supervisor MTTO", "accountable": "Gerente MTTO", "consulted": "Administrador", "informed": "Dirección General" },
    { "activity": "Registro en LuxuryApp (módulo Almacén)", "responsible": "Jefe MTTO", "accountable": "Jefe MTTO", "consulted": "Sistemas", "informed": "Supervisor MTTO" }
  ]
}
```

#### [5] Pasos del Procedimiento — `sectionType: Steps`
```json
{
  "steps": [
    { "order": 1, "actor": "Jefe MTTO", "action": "Realizar levantamiento de inventario inicial al tomar el cargo. Registrar cada bien con cantidad, estado y ubicación en LuxuryApp → Módulo Almacén.", "notes": "Incluir: amenidades, llaves, herramientas, radios, extintores, equipos.", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 2, "actor": "Jefe MTTO", "action": "Registrar toda entrada de insumos en LuxuryApp al momento de su recepción.", "notes": "Verificar contra orden de compra antes de registrar.", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 3, "actor": "Jefe MTTO", "action": "Registrar toda salida de insumos y préstamo de herramientas con nombre del solicitante y fecha.", "notes": "El préstamo de herramienta genera recibo firmado.", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 4, "actor": "Jefe MTTO", "action": "Actualizar catálogos de iluminación y pintura cada vez que se realice un cambio.", "notes": "", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 5, "actor": "Supervisor MTTO", "action": "Realizar auditoría de inventarios mensualmente. Verificar consistencia con registros en LuxuryApp.", "notes": "", "isDecision": true, "decisionYes": "Inventario cuadra → documentar y cerrar", "decisionNo": "Diferencia encontrada → investigar y corregir con Jefe MTTO" }
  ]
}
```

#### [6] Nota — `sectionType: Alert`
```json
{
  "alertType": 1,
  "text": "Los inventarios deben mantenerse actualizados en tiempo real en LuxuryApp (módulo Almacén). Un inventario desactualizado genera retrasos en compras y pérdida de activos del edificio."
}
```

---

## PROCESO 5 — CALENDARIO DE MANTENIMIENTO

**Folio:** GLB-MTTO-005  
**Tipo:** Procedimiento Operativo  
**Departamento:** Mantenimiento

### Items / Secciones

#### [1] Objetivo — `sectionType: Objective`
```json
{
  "html": "<p>Planificar y programar los mantenimientos preventivos de todos los equipos y sistemas del edificio para garantizar su disponibilidad, maximizar su vida útil y cumplir con las pólizas de mantenimiento vigentes.</p>"
}
```

#### [2] Alcance — `sectionType: Scope`
```json
{
  "html": "<p>Aplica a todos los equipos e instalaciones que son propiedad del edificio y que prestan servicio a los clientes. El calendario debe contemplar: fecha de ejecución, descripción del servicio, frecuencia, proveedor, costo y cuenta contable a afectar.</p>"
}
```

#### [3] Glosario — `sectionType: Glossary`
```json
{
  "terms": [
    { "term": "Mantenimiento preventivo", "noUsar": "Mtto correctivo", "definition": "Servicio programado con anticipación para preservar las condiciones óptimas de un equipo o instalación." },
    { "term": "Calendarización", "noUsar": "Programación informal", "definition": "Registro formal de la fecha, frecuencia y proveedor de cada mantenimiento preventivo en el calendario oficial de LuxuryApp." },
    { "term": "Cuenta contable", "noUsar": "Partida de gasto", "definition": "Código contable al que se carga el gasto del mantenimiento, requerido para la orden de compra." },
    { "term": "Póliza de mtto", "noUsar": "Contrato de servicio", "definition": "Contrato con proveedor externo que establece la frecuencia, alcance y costo del mantenimiento de un equipo." }
  ]
}
```

#### [4] Matriz RACI — `sectionType: Raci`
```json
{
  "activities": [
    { "activity": "Levantamiento de inventario de equipos y sistemas", "responsible": "Jefe MTTO", "accountable": "Jefe MTTO", "consulted": "Gerente MTTO", "informed": "Administrador" },
    { "activity": "Identificación de necesidades de servicio por equipo", "responsible": "Jefe MTTO", "accountable": "Gerente MTTO", "consulted": "Proveedor", "informed": "Supervisor MTTO" },
    { "activity": "Elaboración del calendario anual de mantenimientos", "responsible": "Jefe MTTO", "accountable": "Gerente MTTO", "consulted": "Administrador", "informed": "Dirección General" },
    { "activity": "Definición de cuenta contable a afectar", "responsible": "Administración", "accountable": "Administrador", "consulted": "Gerente MTTO", "informed": "Dirección General" },
    { "activity": "Ejecución del mantenimiento conforme al calendario", "responsible": "Jefe MTTO / Proveedor", "accountable": "Jefe MTTO", "consulted": "Supervisor MTTO", "informed": "Administrador" }
  ]
}
```

#### [5] Pasos del Procedimiento — `sectionType: Steps`
```json
{
  "steps": [
    { "order": 1, "actor": "Jefe MTTO", "action": "Levantar inventario completo de equipos y sistemas del edificio.", "notes": "Incluir todos los bienes que prestan servicio al cliente (bombas, elevadores, equipos de gimnasio, cisterna, etc.)", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 2, "actor": "Jefe MTTO + Gerente MTTO", "action": "Identificar las necesidades de servicio de cada equipo: tipo de mantenimiento, frecuencia recomendada y proveedor autorizado.", "notes": "Consultar pólizas vigentes y manuales de fabricante.", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 3, "actor": "Jefe MTTO", "action": "Elaborar el calendario anual registrando: fecha de ejecución, descripción, frecuencia, proveedor, costo estimado y cuenta contable.", "notes": "La cuenta contable la define Administración.", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 4, "actor": "Gerente MTTO + Administrador", "action": "Revisar y aprobar el calendario. Validar presupuesto disponible por mes.", "notes": "", "isDecision": true, "decisionYes": "Aprobado → publicar y ejecutar", "decisionNo": "Ajustar fechas o proveedores según presupuesto" },
    { "order": 5, "actor": "Jefe MTTO", "action": "Ejecutar mantenimientos conforme al calendario. Supervisar trabajos de proveedores externos.", "notes": "Ver Proceso de Supervisión (GLB-MTTO-010).", "isDecision": false, "decisionYes": "", "decisionNo": "" }
  ]
}
```

---

## PROCESO 6 — SOLICITUDES DE COMPRA

**Folio:** GLB-MTTO-006  
**Tipo:** Procedimiento Operativo  
**Departamento:** Mantenimiento

### Items / Secciones

#### [1] Objetivo — `sectionType: Objective`
```json
{
  "html": "<p>Establecer el proceso formal para la solicitud, cotización, autorización y recepción de insumos y servicios del área de mantenimiento, garantizando transparencia, control del gasto y cumplimiento de los tiempos de ejecución programados.</p>"
}
```

#### [2] Alcance — `sectionType: Scope`
```json
{
  "html": "<p>Aplica a todas las solicitudes de insumos y servicios del área de mantenimiento, tanto programadas (calendario) como urgentes. Involucra a: <strong>Mantenimiento</strong> (genera la solicitud), <strong>Administración</strong> (cotiza y tramita), <strong>Gerente de MTTO</strong> (autoriza), <strong>Dirección General y Comité</strong> (autorizan según monto).</p>"
}
```

#### [3] Glosario — `sectionType: Glossary`
```json
{
  "terms": [
    { "term": "Cuadro comparativo", "noUsar": "Tabla de cotizaciones", "definition": "Documento que compara mínimo 3 proveedores con las mismas especificaciones (peras con peras) para seleccionar la mejor opción." },
    { "term": "Orden de compra (OC)", "noUsar": "Pedido", "definition": "Documento formal emitido por Administración al proveedor autorizado para la adquisición de bienes o servicios." },
    { "term": "Solicitud de cotización (SC)", "noUsar": "Petición de precio", "definition": "Documento enviado al proveedor solicitando precio, garantías, tiempos de entrega y políticas de pago." },
    { "term": "Dictamen de proveedor", "noUsar": "Diagnóstico", "definition": "Evaluación técnica escrita del proveedor sobre la falla o necesidad del equipo/instalación." }
  ]
}
```

#### [4] Matriz RACI — `sectionType: Raci`
```json
{
  "activities": [
    { "activity": "Listado de solicitud de insumos con soporte fotográfico y justificación", "responsible": "Jefe MTTO", "accountable": "Jefe MTTO", "consulted": "Supervisor MTTO", "informed": "Administrador" },
    { "activity": "Cotización con 3 proveedores y cuadro comparativo", "responsible": "Administración", "accountable": "Administrador", "consulted": "Jefe MTTO", "informed": "Gerente MTTO" },
    { "activity": "Envío de solicitud para autorización", "responsible": "Administración", "accountable": "Administrador", "consulted": "Jefe MTTO", "informed": "Gerente MTTO" },
    { "activity": "Autorización de la compra", "responsible": "Gerente MTTO / Dirección General / Comité", "accountable": "Dirección General", "consulted": "Administrador", "informed": "Jefe MTTO" },
    { "activity": "Envío de Orden de Compra al proveedor", "responsible": "Administración", "accountable": "Administrador", "consulted": "Jefe MTTO", "informed": "Gerente MTTO" },
    { "activity": "Recepción física y supervisión del servicio", "responsible": "Jefe MTTO", "accountable": "Jefe MTTO", "consulted": "Supervisor MTTO", "informed": "Administrador" },
    { "activity": "Registro en inventario de insumos recibidos", "responsible": "Jefe MTTO", "accountable": "Jefe MTTO", "consulted": "", "informed": "Supervisor MTTO" }
  ]
}
```

#### [5] Pasos del Procedimiento — `sectionType: Steps`
```json
{
  "steps": [
    { "order": 1, "actor": "Jefe MTTO", "action": "Preparar listado de solicitud con: problema descrito, soporte fotográfico, dictamen del proveedor, solución propuesta y antecedentes de fallas o últimas compras.", "notes": "Enviar con mínimo 15 días de anticipación al mes en que se ejecutará.", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 2, "actor": "Jefe MTTO", "action": "Enviar correo al Administrador, Asistente y Jefe de MTTO. CC: Gerente de MTTO y Supervisión. Formato asunto: [EDIFICIO]-[TEMA] Descripción del servicio.", "notes": "Ejemplo: 'Avivia-58 Requisición mensual de Insumos Eléctricos Enero 2023'", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 3, "actor": "Administración", "action": "Solicitar cotizaciones a mínimo 3 proveedores. Elaborar cuadro comparativo (peras con peras). Incluir: políticas de pago, garantías, tiempos de entrega y logística de ejecución.", "notes": "Si marca y modelo difieren entre proveedores, elaborar comparativo detallado.", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 4, "actor": "Administración", "action": "Verificar disponibilidad de dinero. Enviar expediente completo para autorización.", "notes": "", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 5, "actor": "Gerente MTTO / Dirección / Comité", "action": "Autorizar la compra según monto y políticas vigentes.", "notes": "", "isDecision": true, "decisionYes": "Autorizado → emitir OC", "decisionNo": "Rechazado → Jefe MTTO ajusta solicitud" },
    { "order": 6, "actor": "Administración", "action": "Emitir Orden de Compra al proveedor seleccionado.", "notes": "", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 7, "actor": "Jefe MTTO", "action": "Recepcionar insumos o supervisar ejecución del servicio. Verificar calidad y cantidad contra OC.", "notes": "Ver Proceso de Supervisión (GLB-MTTO-010).", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 8, "actor": "Jefe MTTO", "action": "Registrar insumos recibidos en LuxuryApp → Módulo Almacén → Entrada de Insumos.", "notes": "", "isDecision": false, "decisionYes": "", "decisionNo": "" }
  ]
}
```

#### [6] Advertencia — `sectionType: Alert`
```json
{
  "alertType": 0,
  "text": "Toda solicitud debe realizarse con al menos 15 días de anticipación al mes de ejecución, excepto emergencias. No se tramitarán compras sin cuadro comparativo de 3 proveedores. Las compras sin autorización previa son responsabilidad del solicitante."
}
```

---

## PROCESO 7 — ATENCIÓN A DEPARTAMENTOS

**Folio:** GLB-MTTO-007  
**Tipo:** Procedimiento Operativo  
**Departamento:** Mantenimiento

### Items / Secciones

#### [1] Objetivo — `sectionType: Objective`
```json
{
  "html": "<p>Definir el catálogo de servicios que el área de mantenimiento puede y no puede ofrecer dentro de los departamentos privados de los residentes, garantizando una atención profesional, segura y dentro del alcance operativo autorizado.</p>"
}
```

#### [2] Alcance — `sectionType: Scope`
```json
{
  "html": "<p>Aplica a todas las solicitudes de servicio de mantenimiento dentro de departamentos privados de los condóminos. Los trabajos complejos o especializados que excedan el alcance deben canalizarse a proveedores externos certificados.</p>"
}
```

#### [3] Pasos del Procedimiento — `sectionType: Steps` (Servicios SÍ permitidos)
```json
{
  "steps": [
    { "order": 1, "actor": "Técnico MTTO", "action": "Revisión de instalación eléctrica.", "notes": "", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 2, "actor": "Técnico MTTO", "action": "Cambio de focos y contactos.", "notes": "", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 3, "actor": "Técnico MTTO", "action": "Trabajos de plomería: reparaciones de tuberías sencillas que no requieran romper pisos o plafones.", "notes": "", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 4, "actor": "Técnico MTTO", "action": "Cambio de válvulas y mangueras de lavabos, tarjas y regaderas. Material proporcionado por el condómino.", "notes": "", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 5, "actor": "Técnico MTTO", "action": "Cambio de juntas y destapado de W.C.", "notes": "", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 6, "actor": "Técnico MTTO", "action": "Destapado de coladeras, tarjas, lavabos y regaderas.", "notes": "", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 7, "actor": "Técnico MTTO", "action": "Apertura y cierre de servicios de agua y gas.", "notes": "", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 8, "actor": "Técnico MTTO", "action": "Verificación de red de suministro de gas y reparaciones menores.", "notes": "", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 9, "actor": "Técnico MTTO", "action": "Encendido de calentadores de agua.", "notes": "", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 10, "actor": "Jefe MTTO", "action": "Suministro de herramientas en préstamo (si no están en uso). Entregar con recibo firmado.", "notes": "", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 11, "actor": "Técnico MTTO", "action": "Sellado de ventanas desde el interior. Material proporcionado por el condómino.", "notes": "", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 12, "actor": "Técnico MTTO", "action": "Ajuste de herrajes y chapas (no se abren chapas).", "notes": "", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 13, "actor": "Técnico MTTO", "action": "Apoyo técnico y consultas sobre instalaciones del departamento.", "notes": "", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 14, "actor": "Técnico MTTO", "action": "Colgado de cuadros.", "notes": "Verificar tipo de muro y usar el anclaje adecuado.", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 15, "actor": "Técnico MTTO", "action": "Movimiento de muebles dentro del departamento.", "notes": "", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 16, "actor": "Técnico MTTO", "action": "Instalación de televisores. Verificar previamente que la pared tenga soporte adecuado.", "notes": "", "isDecision": false, "decisionYes": "", "decisionNo": "" }
  ]
}
```

#### [4] Advertencia — Restricciones — `sectionType: Alert`
```json
{
  "alertType": 0,
  "text": "SERVICIOS PROHIBIDOS dentro de departamentos: (1) Permanecer más de 30 min sin justificación. (2) Desarmar electrodomésticos o aparatos electrónicos (cancela garantía del fabricante). (3) Usar materiales del condominio en reparaciones privadas. (4) Presentarse sin equipo de seguridad y herramientas adecuadas. (5) No usar correctamente el uniforme. (6) Fraternizar con el personal de servicio del cliente."
}
```

#### [5] Nota — `sectionType: Alert`
```json
{
  "alertType": 1,
  "text": "Cualquier trabajo que exceda el alcance de este procedimiento debe canalizarse a un proveedor externo especializado. El Jefe de MTTO debe notificar al Administrador antes de rechazar un servicio al condómino."
}
```

---

## PROCESO 8 — RECORRIDOS

**Folio:** GLB-MTTO-008  
**Tipo:** Procedimiento Operativo  
**Departamento:** Mantenimiento

### Items / Secciones

#### [1] Objetivo — `sectionType: Objective`
```json
{
  "html": "<p>Identificar oportunamente las necesidades de mantenimiento en las áreas de uso común del edificio mediante recorridos diarios sistemáticos, resolviendo de inmediato las incidencias menores y documentando las que requieren planificación en LuxuryApp.</p>"
}
```

#### [2] Alcance — `sectionType: Scope`
```json
{
  "html": "<p>Aplica a todas las áreas comunes del edificio con especial enfoque en las de <strong>mayor uso y afluencia</strong>: lobby, elevadores, escaleras, estacionamiento, áreas recreativas, piscinas, gimnasio y cuartos de máquinas.</p>"
}
```

#### [3] Matriz RACI — `sectionType: Raci`
```json
{
  "activities": [
    { "activity": "Identificar áreas prioritarias de recorrido", "responsible": "Jefe MTTO", "accountable": "Jefe MTTO", "consulted": "Supervisor MTTO", "informed": "Administrador" },
    { "activity": "Ejecutar recorrido diario (mínimo 1 hora) y llenar checklist", "responsible": "Jefe MTTO / Técnico MTTO", "accountable": "Jefe MTTO", "consulted": "", "informed": "Supervisor MTTO" },
    { "activity": "Resolver incidencias menores al momento", "responsible": "Técnico MTTO", "accountable": "Jefe MTTO", "consulted": "", "informed": "Supervisor MTTO" },
    { "activity": "Registrar incidencias que requieren planificación en LuxuryApp", "responsible": "Jefe MTTO", "accountable": "Jefe MTTO", "consulted": "Supervisor MTTO", "informed": "Administrador" }
  ]
}
```

#### [4] Pasos del Procedimiento — `sectionType: Steps`
```json
{
  "steps": [
    { "order": 1, "actor": "Jefe MTTO", "action": "Identificar y priorizar las áreas de mayor uso y afluencia del edificio. Definir ruta de recorrido diario.", "notes": "Lobby, elevadores, escaleras, estacionamiento, piscina y cuartos de máquinas son áreas prioritarias.", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 2, "actor": "Jefe MTTO / Técnico MTTO", "action": "Ejecutar recorrido diario de al menos una hora. Llenar el checklist de recorrido en LuxuryApp (Módulo 5.3 - Bitácoras).", "notes": "El recorrido debe realizarse en horario de mayor actividad de residentes.", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 3, "actor": "Técnico MTTO", "action": "Usar criterio para atender y resolver al momento todos los detalles menores identificados durante el recorrido.", "notes": "Ejemplos: foco fundido, puerta desajustada, fuga menor, etc.", "isDecision": true, "decisionYes": "Se resuelve al momento → registrar en bitácora como resuelto", "decisionNo": "Requiere materiales o planificación → pasar al paso 4" },
    { "order": 4, "actor": "Jefe MTTO", "action": "Registrar en LuxuryApp las incidencias que requieren planificación, materiales o proveedor. Asignar prioridad y seguimiento.", "notes": "Usar módulo de Tickets o Solicitudes según corresponda.", "isDecision": false, "decisionYes": "", "decisionNo": "" }
  ]
}
```

---

## PROCESO 9 — BITÁCORAS

**Folio:** GLB-MTTO-009  
**Tipo:** Procedimiento Operativo  
**Departamento:** Mantenimiento

### Items / Secciones

#### [1] Objetivo — `sectionType: Objective`
```json
{
  "html": "<p>Garantizar el registro completo y oportuno de todas las actividades de mantenimiento, consumos, inventarios y movimientos de almacén en los módulos correspondientes de LuxuryApp, para una gestión integral, trazable y auditable del área.</p>"
}
```

#### [2] Alcance — `sectionType: Scope`
```json
{
  "html": "<p>Aplica a todos los registros del área de mantenimiento: mantenimientos preventivos, recorridos diarios, lecturas de medidores (agua, luz, gas), revisiones de equipos, movimientos de almacén (insumos y herramientas) y pruebas de equipos especiales (albercas). Plataforma: <strong>LuxuryApp Módulo 5.3 (Bitácoras)</strong> y <strong>Módulo Almacén</strong>.</p>"
}
```

#### [3] Glosario — `sectionType: Glossary`
```json
{
  "terms": [
    { "term": "Bitácora diaria", "noUsar": "Registro informal", "definition": "Registro en LuxuryApp de todas las actividades del día: recorridos, mantenimientos, incidencias y lecturas de medidores." },
    { "term": "Mantenimiento preventivo", "noUsar": "Servicio programado", "definition": "Trabajo realizado de forma planificada para preservar el estado óptimo de un equipo o instalación." },
    { "term": "Entrada de insumos", "noUsar": "Recepción de materiales", "definition": "Registro en el módulo de Almacén de LuxuryApp cuando se reciben materiales o insumos." },
    { "term": "Salida de insumos", "noUsar": "Uso de materiales", "definition": "Registro en el módulo de Almacén de LuxuryApp cuando se utilizan materiales del inventario." }
  ]
}
```

#### [4] Matriz RACI — `sectionType: Raci`
```json
{
  "activities": [
    { "activity": "Registro en bitácora diaria (recorridos, lecturas, mantenimientos)", "responsible": "Jefe MTTO", "accountable": "Jefe MTTO", "consulted": "", "informed": "Supervisor MTTO" },
    { "activity": "Registro de entradas de insumos en módulo Almacén", "responsible": "Jefe MTTO", "accountable": "Jefe MTTO", "consulted": "", "informed": "Supervisor MTTO" },
    { "activity": "Registro de salidas de insumos y préstamo de herramienta", "responsible": "Jefe MTTO", "accountable": "Jefe MTTO", "consulted": "", "informed": "Supervisor MTTO" },
    { "activity": "Revisión y validación de bitácoras", "responsible": "Supervisor MTTO", "accountable": "Gerente MTTO", "consulted": "Administrador", "informed": "Dirección General" }
  ]
}
```

#### [5] Pasos del Procedimiento — `sectionType: Steps`
```json
{
  "steps": [
    { "order": 1, "actor": "Jefe MTTO", "action": "Al cierre de cada turno, registrar en LuxuryApp → Módulo 5.3 Bitácoras: recorridos realizados, mantenimientos ejecutados, lecturas de agua/luz/gas y revisiones de equipos.", "notes": "No acumular registros para el día siguiente. El registro debe ser del mismo día.", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 2, "actor": "Jefe MTTO", "action": "Al recepcionar insumos o materiales, registrar inmediatamente la entrada en LuxuryApp → Módulo Almacén → Entrada de Insumos.", "notes": "Verificar contra orden de compra antes de registrar.", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 3, "actor": "Jefe MTTO", "action": "Al utilizar insumos del inventario, registrar la salida en LuxuryApp → Módulo Almacén → Salida de Insumos.", "notes": "Incluir número de ticket o trabajo al que se asocia la salida.", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 4, "actor": "Jefe MTTO", "action": "Al prestar herramienta, registrar en LuxuryApp → Módulo Almacén → Inventario de Herramientas → Salida. Obtener firma del solicitante.", "notes": "", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 5, "actor": "Supervisor MTTO", "action": "Revisar semanalmente que las bitácoras estén completas y al día. Reportar omisiones al Gerente de MTTO.", "notes": "", "isDecision": false, "decisionYes": "", "decisionNo": "" }
  ]
}
```

#### [6] Advertencia — `sectionType: Alert`
```json
{
  "alertType": 0,
  "text": "Las bitácoras son documentos oficiales de gestión. La omisión de registros puede generar inconsistencias en inventarios, pérdida de trazabilidad y observaciones en auditorías. Todo registro debe realizarse el mismo día en que ocurre la actividad."
}
```

---

## PROCESO 10 — SUPERVISIÓN DE TRABAJOS

**Folio:** GLB-MTTO-010  
**Tipo:** Procedimiento Operativo  
**Departamento:** Mantenimiento

### Items / Secciones

#### [1] Objetivo — `sectionType: Objective`
```json
{
  "html": "<p>Asegurar que todos los trabajos de mantenimiento realizados por personal interno o proveedores externos cumplan con los estándares de calidad requeridos, minimizando retrabajos, quejas de clientes y gastos no planificados.</p>"
}
```

#### [2] Alcance — `sectionType: Scope`
```json
{
  "html": "<p>Aplica a la revisión post-ejecución de <strong>todos los trabajos de mantenimiento</strong>, sin excepción: correctivos, preventivos, de proveedores externos y de personal interno. La supervisión debe realizarse inmediatamente al finalizar cada trabajo.</p>"
}
```

#### [3] Matriz RACI — `sectionType: Raci`
```json
{
  "activities": [
    { "activity": "Supervisar trabajos de personal interno (técnicos)", "responsible": "Jefe MTTO", "accountable": "Jefe MTTO", "consulted": "Supervisor MTTO", "informed": "Administrador" },
    { "activity": "Supervisar trabajos de proveedores externos", "responsible": "Jefe MTTO", "accountable": "Jefe MTTO", "consulted": "Gerente MTTO", "informed": "Administrador" },
    { "activity": "Solicitar garantías por escrito al proveedor", "responsible": "Jefe MTTO", "accountable": "Jefe MTTO", "consulted": "Administración", "informed": "Gerente MTTO" },
    { "activity": "Reportar incumplimiento de proveedor al Administrador", "responsible": "Jefe MTTO", "accountable": "Jefe MTTO", "consulted": "Gerente MTTO", "informed": "Dirección General" }
  ]
}
```

#### [4] Pasos del Procedimiento — `sectionType: Steps`
```json
{
  "steps": [
    { "order": 1, "actor": "Jefe MTTO", "action": "Al finalizar cualquier trabajo, realizar revisión exhaustiva del resultado. Verificar que cumpla con el estándar de calidad acordado.", "notes": "", "isDecision": true, "decisionYes": "Cumple estándar → proceder a cierre y garantía", "decisionNo": "No cumple → pedir corrección antes de dar por terminado" },
    { "order": 2, "actor": "Jefe MTTO", "action": "Para trabajos de personal interno: brindar orientación y guía inmediata al colaborador. Puede incluir capacitación adicional o supervisión directa del proceso.", "notes": "El objetivo es que el colaborador aprenda, no solo que rehaga el trabajo.", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 3, "actor": "Jefe MTTO", "action": "Para trabajos de proveedor externo: exigir garantía por escrito del trabajo realizado. Verificar que las especificaciones del contrato/OC se hayan cumplido.", "notes": "Las garantías deben archivarse en LuxuryCloud.", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 4, "actor": "Jefe MTTO", "action": "Si se detecta incumplimiento del proveedor: documentar la inconsistencia con fotos y reporte escrito. Notificar inmediatamente al Administrador.", "notes": "", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 5, "actor": "Jefe MTTO", "action": "Cerrar el trabajo en LuxuryApp con nota de supervisión, calificación y observaciones.", "notes": "", "isDecision": false, "decisionYes": "", "decisionNo": "" }
  ]
}
```

#### [5] Advertencia — `sectionType: Alert`
```json
{
  "alertType": 0,
  "text": "Nunca firmar conformidad de un trabajo sin haberlo revisado físicamente. Un trabajo aceptado sin supervisión que posteriormente falla genera costos dobles y responsabilidad directa del Jefe de MTTO."
}
```

---

## PROCESO 11 — REPORTES

**Folio:** GLB-MTTO-011  
**Tipo:** Procedimiento Operativo  
**Departamento:** Mantenimiento

### Items / Secciones

#### [1] Objetivo — `sectionType: Objective`
```json
{
  "html": "<p>Establecer el proceso y los estándares para la generación, nombramiento y envío de los reportes periódicos del área de mantenimiento, garantizando información precisa, oportuna y en el formato correcto para la toma de decisiones.</p>"
}
```

#### [2] Alcance — `sectionType: Scope`
```json
{
  "html": "<p>Aplica a todos los reportes del área de mantenimiento: diarios (asistencia, pruebas PCI/cerca/planta), semanales (plan de trabajo) y mensuales (informe completo de mantenimiento). Plataformas: <strong>LuxuryApp</strong> (generación de datos), <strong>LuxuryCloud</strong> (archivo), <strong>WhatsApp y correo electrónico</strong> (envío).</p>"
}
```

#### [3] Glosario — `sectionType: Glossary`
```json
{
  "terms": [
    { "term": "PCI", "noUsar": "Sistema contra incendio", "definition": "Sistema de Protección Contra Incendios del edificio. Requiere prueba de funcionamiento semanal." },
    { "term": "Planta de emergencia", "noUsar": "Generador", "definition": "Generador eléctrico de respaldo. Requiere prueba de funcionamiento semanal." },
    { "term": "Reporte mensual de MTTO", "noUsar": "Informe mensual", "definition": "Conjunto de 10 archivos PDF exportados de LuxuryApp que resumen la gestión completa del mes." },
    { "term": "Chat LUX-MTTO", "noUsar": "Grupo de WhatsApp", "definition": "Grupo oficial de WhatsApp del equipo de mantenimiento para comunicaciones operativas y envío de reportes semanales." }
  ]
}
```

#### [4] Matriz RACI — `sectionType: Raci`
```json
{
  "activities": [
    { "activity": "Reporte diario de asistencia (WhatsApp)", "responsible": "Jefe MTTO", "accountable": "Jefe MTTO", "consulted": "", "informed": "Supervisor MTTO" },
    { "activity": "Reporte semanal: Plan de trabajo (correo, viernes antes 4pm)", "responsible": "Jefe MTTO", "accountable": "Jefe MTTO", "consulted": "Supervisor MTTO", "informed": "Administrador" },
    { "activity": "Reportes semanales: Pruebas PCI, Cerca, Planta (WhatsApp, viernes antes 4pm)", "responsible": "Jefe MTTO", "accountable": "Jefe MTTO", "consulted": "", "informed": "Administrador, Supervisor MTTO" },
    { "activity": "Reporte mensual de MTTO (correo, último día hábil del mes)", "responsible": "Jefe MTTO", "accountable": "Jefe MTTO", "consulted": "Supervisor MTTO", "informed": "Administrador" },
    { "activity": "Revisión y validación de reportes mensuales", "responsible": "Supervisor MTTO", "accountable": "Gerente MTTO", "consulted": "Administrador", "informed": "Dirección General" }
  ]
}
```

#### [5] Pasos del Procedimiento (Reporte Mensual) — `sectionType: Steps`
```json
{
  "steps": [
    { "order": 1, "actor": "Jefe MTTO", "action": "El último día hábil del mes, ingresar a LuxuryApp → Módulo Operaciones → Reportes.", "notes": "", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 2, "actor": "Jefe MTTO", "action": "Exportar y descargar los 10 reportes en PDF con el nombre exacto indicado en la tabla de reportes.", "notes": "1.1 Resumen Tickets / 1.2 Resumen Mantenimientos Preventivos / 1.3 Mantenimientos Preventivos / 2.1 Consumos Agua-Gas-Electricidad / 3.1 Entrada Insumos / 3.2 Salida Insumos / 4.1 Bitácora Diaria / 5.1 Solicitud Insumos y Servicios / 6.1 Bitácora Préstamo Herramienta / 7.1 Bitácora Albercas", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 3, "actor": "Jefe MTTO", "action": "Subir los 10 archivos a LuxuryCloud en la ruta: 1.6 MANTENIMIENTO → BITÁCORAS DE MTTO → [AÑO] → [MES].", "notes": "", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 4, "actor": "Jefe MTTO", "action": "Enviar correo al Administrador y Supervisor con asunto: '[EDIFICIO] - INFORME MENSUAL DE MANTENIMIENTO [MES AÑO]'. Incluir enlace a la carpeta de LuxuryCloud.", "notes": "El cuerpo del correo debe seguir la plantilla oficial aprobada.", "isDecision": false, "decisionYes": "", "decisionNo": "" },
    { "order": 5, "actor": "Supervisor MTTO", "action": "Revisar los reportes y confirmar recepción. Si hay discrepancias, notificar al Jefe de MTTO en un plazo de 2 días hábiles.", "notes": "", "isDecision": true, "decisionYes": "Reportes correctos → archivar y cerrar el mes", "decisionNo": "Discrepancias → Jefe MTTO corrige y reenvía" }
  ]
}
```

#### [6] Nota — `sectionType: Alert`
```json
{
  "alertType": 1,
  "text": "Los archivos PDF del reporte mensual deben guardarse con el nombre exacto especificado (ej: '1.1 RESUMEN TICKETS'). Un nombre incorrecto dificulta la identificación y el archivo histórico en LuxuryCloud."
}
```

---

## RESUMEN DE TEMPLATES A CREAR

| # | Folio | Proceso | Tipo | Secciones |
|---|-------|---------|------|-----------|
| 1 | GLB-MTTO-001 | Entrega de Recursos | Procedimiento Operativo | Objetivo, Alcance, Glosario, RACI, Pasos, Advertencia |
| 2 | GLB-MTTO-002 | Orden y Limpieza | Procedimiento Operativo | Objetivo, Alcance, RACI, Pasos, Nota |
| 3 | GLB-MTTO-003 | Uso de Uniforme | Política Corporativa | Objetivo, Alcance, Glosario, RACI, Pasos, Advertencia |
| 4 | GLB-MTTO-004 | Inventarios | Procedimiento Operativo | Objetivo, Alcance, Glosario, RACI, Pasos, Nota |
| 5 | GLB-MTTO-005 | Calendario de Mantenimiento | Procedimiento Operativo | Objetivo, Alcance, Glosario, RACI, Pasos |
| 6 | GLB-MTTO-006 | Solicitudes de Compra | Procedimiento Operativo | Objetivo, Alcance, Glosario, RACI, Pasos, Advertencia |
| 7 | GLB-MTTO-007 | Atención a Departamentos | Procedimiento Operativo | Objetivo, Alcance, Pasos (x16), Advertencia, Nota |
| 8 | GLB-MTTO-008 | Recorridos | Procedimiento Operativo | Objetivo, Alcance, RACI, Pasos |
| 9 | GLB-MTTO-009 | Bitácoras | Procedimiento Operativo | Objetivo, Alcance, Glosario, RACI, Pasos, Advertencia |
| 10 | GLB-MTTO-010 | Supervisión de Trabajos | Procedimiento Operativo | Objetivo, Alcance, RACI, Pasos, Advertencia |
| 11 | GLB-MTTO-011 | Reportes | Procedimiento Operativo | Objetivo, Alcance, Glosario, RACI, Pasos, Nota |

> **Nota:** Los diagramas de flujo se crean directamente en el editor de cada proceso usando la sección `sectionType: Flowchart` con la herramienta Draw.io integrada.
