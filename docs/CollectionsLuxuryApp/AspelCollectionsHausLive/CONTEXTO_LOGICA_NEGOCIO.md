📍 Ruta: 📂 Documentación > 💼 Contabilidad > AspelCobranzaHausLive
📅 Documento Paralelo de Contexto y Lógica de Negocio

> [!NOTE]
> Este documento explica el estado actual de la fusión funcional de las versiones V1 y V2 del Aviso de Cobro, detallando específicamente cómo el motor backend procesa matemáticamente los descuentos.

## 1. Fusión de Arquitectura V1 y V2

Originalmente, el sistema contaba con dos servicios (y vistas) separados:

- **V1 (Aviso de Cobro Clásico):** Un pasillo crudo que reflejaba directamente el estado de las cuentas en Aspel, aplicando una conciliación de deudas por LIFO.
- **V2 (Aviso de Cobro Interactivo):** Una vista especializada que aplicaba reconciliación FIFO, consolidaba deudas, y "desempacaba" visualmente el Descuento por Pronto Pago para mostrarlo como una deducción explícita del mes actual.

**Estado Actual:** Ambas lógicas fueron fusionadas en `AspelCobranzaHausDetalleAppService.cs`. Actualmente, el endpoint principal sirve la lógica inteligente (FIFO y Desempacado de Descuento), permitiendo que el Frontend renderice una única versión unificada, mucho más clara y amigable para el residente, mientras mantiene la congruencia contable.

## 2. El "Desempacado" del Descuento por Pronto Pago

Para lograr la experiencia de usuario (UX) deseada, donde el descuento se muestra como un rubro explícito (ej. `-$207.11`), el algoritmo en `BuildResponseDTO` realiza un "Desempacado".

### Flujo de Desempacado:

1. El motor busca en los movimientos (`Auxiliares`) del **mes de corte de la consulta** (ej. agosto).
2. Si encuentra un movimiento válido de descuento, extrae su monto.
3. El motor **suma** este monto al vencido más reciente de Mantenimiento (MTTO). Esto "revierte" matemáticamente el descuento aplicado en Aspel.
4. Posteriormente, inyecta un **vencido falso negativo** llamado `"DESCUENTO POR PRONTO PAGO"` por el valor exacto del descuento extraído.

El resultado final en el Frontend es que la deuda total matemática no cambia, pero visualmente el residente puede observar de qué tamaño fue su descuento antes de aplicarlo al total.

## 3. Regla Estricta: Filtro por Terminación `-002`

> [!WARNING]
> **FALSOS POSITIVOS CON RECLASIFICACIONES**
> No se debe intentar extraer descuentos basándose en si la descripción (`ConcepPo`) contiene la palabra "DESCUENTO".

Durante la fusión de V1 y V2, se detectó un caso borde crítico (Empresa 94):

- En Aspel, los contadores realizan "Pólizas de Reclasificación" que mueven dinero entre cuentas de servicios (ej. Energía, Agua). A menudo nombran estas pólizas como `"RECLAS. DESCUENTO ENERGIA"`.
- Si el motor de extracción se basa en la palabra `"DESCUENTO"`, capturará erróneamente estos abonos de reclasificación (ej. $5,677.51) y los calculará como un "Descuento por Pronto Pago", arrojando saldos negativos ilógicos para el residente.

### Implementación Actual Obligatoria

Para asegurar la exactitud de los datos:

1. En `BuildResponseDTO`, el filtro de extracción de descuentos exige estrictamente que el movimiento pertenezca a la subcuenta `-002` (`EndsWith("-002")`).
2. En `ClassifyMovementCore`, el enrutamiento de créditos a la "Bolsa de Descuentos" obedece a la misma regla estricta: solo si termina en `-002`.

Cualquier cambio a la lógica de descuentos en el futuro debe preservar esta regla estricta de cuentas para evitar romper los reportes de cobranza en empresas que no aplican descuentos pero sí utilizan reclasificaciones.
