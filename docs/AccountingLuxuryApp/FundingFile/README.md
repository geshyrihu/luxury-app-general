# Modulo: FundingFile (Exportacion de Documentos de Fondeo)

> **Area funcional:** Contabilidad / Fondeos y Tesoreria
> **Tag de version:** `v1.0`
> **Owner tecnico:** `@equipo-contabilidad`
> **Ultima actualizacion:** `2026-06-25`

---

## Vision General

Modulo de exportacion/descarga de documentos de fondeo. Genera PDFs de resumen de pagos y ZIPs masivos con facturas (PDF+XML) y solicitudes de pago para tesoreria.

---

## Endpoints

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `POST` | `api/FundingFile/download-zip` | Descarga masiva de solicitudes de pago en ZIP |

---

## Funcionalidades

1. **GenerateFundingPdfAsync:** Crea PDF con tabla detallada de pagos por grupo de gasto, incluye miembros del comite de firma (MTK/Royal/General).
2. **GenerateFundingInvoicesZipAsync:** Busca facturas (PDF) asociadas a ordenes de compra de un periodo de fondeo y las comprime en ZIP.
3. **GenerateBulkInvoicesZipAsync:** Empaqueta facturas (PDF+XML) de IDs de ordenes de compra especificos.
4. **GenerateBulkSolicitudesPagoZipAsync:** Genera PDFs individuales de "Solicitud de Pago" con logo, datos de pago, CLABE, desglose presupuestal, IVA/retenciones y firmas, comprimidos en ZIP.

---

## Reglas de Negocio

1. Los PDFs de solicitud de pago incluyen firmas de los miembros del comite segun el tipo de fondo (MTK/Royal/General).
2. Las facturas se agrupan por orden de compra dentro del ZIP.
3. Se incluyen tanto PDF como XML de cada factura cuando estan disponibles.
