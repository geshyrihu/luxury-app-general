# Módulo Legal y Gobierno Corporativo

Este módulo gestiona la base documental legal del cliente, incluyendo actas de asamblea, contratos de pólizas, expedientes jurídicos y minutas de junta directiva.

---

## Estructura del Módulo

```
Legal/
  BoardDirectors/   (Gestión de documentos y minutas de Junta Directiva)
  ContractPolicy/   (Contratos de pólizas de seguros y fianzas)
  LegalMatter/      (Expedientes y asuntos legales en proceso)
  LegalMinuta/      (Minutas de reuniones legales específicas)
  LegalReport/      (Informes de estado de asuntos legales)
  LegalDirectories/ (Directorio de despachos y contactos legales)
```

---

## Funcionalidades y Reglas

### Junta Directiva (BoardDirectors)
- Organiza documentos por categorías: Actas, Convocatorias, Informes Financieros y Presentaciones Mensuales.
- Proporciona una vista histórica de minutas para el cuerpo directivo.

### Contratos y Pólizas (ContractPolicy)
- Almacena contratos de pólizas de seguro del edificio.
- Permite la carga de documentos físicos (PDF) y el seguimiento de vigencias (`isCurrent`).
- **Restricción:** El sistema marca automáticamente las pólizas vigentes y permite la consulta rápida de la póliza de seguro del edificio para atención de siniestros.

### Asuntos Legales (LegalMatter)
- Seguimiento de litigios o trámites legales categorizados por tipo de asunto.
- Gestión de estados y reportes periódicos de avance.

---

## Integración con Frontend

- **Descarga de Documentos:** Implementado mediante el visor de PDFs estándar del proyecto.
- **Visualización:** Uso intensivo de tablas con filtros por tipo de documento y cliente.
- **Exportación:** Los reportes legales deben usar el estándar `HtmlPrintService`.

---

## Especificaciones Técnicas (API)

- **Endpoints Principales:**
  - `/api/BoardDirectors`: Gestión de documentos directivos.
  - `/api/PolicyContract`: Gestión de seguros y fianzas.
  - `/api/LegalMatter`: Control de asuntos legales.
- **Persistencia de Archivos:** Los PDFs se almacenan en directorios protegidos gestionados por `IFileWritePathService`.
- **Mapeo:** Uso obligatorio de DTOs proyectados manualmente en consultas complejas de documentos.

---

_Documentación actualizada en Junio 2026_
