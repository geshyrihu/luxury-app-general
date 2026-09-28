# 🧠 Plan de Implementación: Reporteo Avanzado (Consultas Dinámicas)

> **Instrucciones para el Agente CLI:**
> Tienes que ampliar tanto el Backend (MockAspel) como el Frontend (Angular UI) para simular escenarios complejos de reporteo. Tu objetivo es asegurar que la API que le pediremos a Aspel sea lo suficientemente robusta.
> Escribe tu reporte en `docs/plans/advanced-reporting-report.md`.

---

## 🚀 FASE 01 (Backend): Ampliación de Endpoints Dinámicos
**Objetivo:** Soportar filtros por TipoEmpresa, Nivel contable y extraer el Estado de Cuenta completo (Poliza + Auxiliar).

### Prompt de Ejecución (Copiar y pegar al Agente CLI)
```text
Amplía las capacidades de filtrado en `MockAspelEndpoints.cs`:

1. En el DTO `MovimientosQueryRequest`, agrega campos opcionales para:
   - `TipoEmpresa` (string, ej. "Cobranza" o "Contabilidad")
   - `Nivel` (int?, ej. nivel 1 para cuentas de mayor)
   - `NumCtaPapa` o `CtaMayor` (string?)
2. Modifica la consulta de `GET /Query/Movimientos` para aplicar estos filtros. Como el nivel y la Cta_Papa están en la entidad `MockCuentas`, haz un `Join` o incluye una subconsulta con `MockCuentas` para filtrar los `MockAuxiliares` basándote en el nivel de su cuenta.
3. Crea un NUEVO endpoint `GET /api/AspelCOI/Query/EstadoDeCuenta/{numCta}`.
   - Este endpoint recibe un Ejercicio, Rango de fechas y un Número de Cuenta específico.
   - Debe retornar un árbol (nested object): Los datos de la Cuenta, su Saldo Inicial para ese año, y la lista de todos sus `MockAuxiliares` inyectando la información de la `MockPoliza` padre (Concepto de Póliza, Fecha, Tipo_Poli, Num_Poliz). 
   - Esta estructura simula exactamente lo que LuxuryApp necesita para construir el Estado de Cuenta de un condómino sin descargar 15MB de datos.
4. Compila y verifica. Registra el éxito en `docs/plans/advanced-reporting-report.md`.
```

---

## 🚀 FASE 02 (Frontend): Filtros Avanzados y Drill-Down
**Objetivo:** Reflejar el poder de las nuevas consultas dinámicas en la Cara Bonita (Angular).

### Prompt de Ejecución (Copiar y pegar al Agente CLI)
```text
Amplía el Dashboard de Angular (`mock-aspel-dashboard`) para usar los nuevos filtros:

1. En `mock-aspel.service.ts`, actualiza las interfaces y agrega el método `getEstadoDeCuenta(numCta, filtros)`.
2. En `mock-aspel-dashboard.ts` (y su HTML), agrega una barra de filtros superior que incluya:
   - Un selector de `Tipo de Empresa` (Contabilidad / Cobranza).
   - Un selector de `Nivel de Cuenta` (Mayor, Nivel 2, Nivel 3, etc.).
   - Un buscador por `Cuenta Padre` (Cta_Papa).
3. Modifica la tabla principal para que reaccione a estos filtros recargando los datos desde la API.
4. Agrega un botón de "Ver Estado de Cuenta" (Lupa o Documento) en cada fila de Movimientos que pertenezca a una cuenta nivel detalle. Al hacer clic, debe abrir un Modal o expandir la fila para mostrar la respuesta del nuevo endpoint `EstadoDeCuenta` (Saldo inicial + movimientos del periodo con la info de la póliza).
5. Verifica que compile y guarda tu reporte final en `docs/plans/advanced-reporting-report.md`.
```
