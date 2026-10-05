Ruta: 📂 API > Accounting > ContabilidadOnline > ValidacionCatalogo

# 🧪 Reporte Validación de Catálogo

📅 Última Revisión: 22-jun-26  
🛡️ Estado: Vigente  
👤 Responsable: Equipo Accounting

---

## Objetivo

Cruzar el catálogo contable recibido desde Aspel contra un baseline esperado por Luxury.

---

## Endpoint y servicio

- Endpoint: `GET /api/contabilidad-online/validacion-catalogo/{customerId}/{year}`
- Servicio: `ValidacionCatalogoService`
- Contrato: `FinancialStatementDTO`

---

## Qué valida

- cuentas mayor esperadas de nivel 1
- cuentas obsoletas
- cuentas faltantes

---

## Reglas

### Baseline

El baseline vive en `ContabilidadReportBaseService.ExcelBaselineNivel1` e incluye referencias como:

- `101-000-000`
- `102-000-000`
- `201-000-000`
- `301-000-000`
- `401-000-000`
- `600-000-000`

### Cuentas obsoletas

- cualquier cuenta cuyo primer dígito sea `7`

### Cuentas faltantes

- si una cuenta mayor esperada no existe en el árbol recibido, se agrega a `CuentasFaltantes`

---

## Detrás de cámaras

- es una auditoría de estructura, no un reporte financiero de saldos
- reutiliza la misma construcción jerárquica del resto del módulo

