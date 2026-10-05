# Solicitud a Aspel: Nuevos Endpoints de Cobranza

## Objetivo
Hoy generamos `estado de cuenta`, `aviso de cobro` y la vista de `deudas actuales` consumiendo respuestas masivas de Aspel y haciendo todo el agrupamiento y cálculo matemático en nuestro API.  
Necesitamos 3 endpoints nuevos enfocados en optimizar este flujo, reducir drásticamente el volumen de datos transferidos y evitar consultar datasets completos.

## Estructura actual de respuestas Aspel
Los endpoints actuales regresan el mismo envelope:

```json
{
  "intEstatus": 1,
  "strMensaje": "OK",
  "data": [ ... ]
}
```

## Endpoints / datasets actuales que hoy consumimos
1. `cuentas`
   Campos principales: `Num_Cta`, `Nombre`, `Status`, `Nivel`, `Cta_Papa`, `Cta_Raiz`

2. `saldos`
   Campos principales: `Num_Cta`, `Ejercicio`, `Inicial`, `Cargo01..Cargo12`, `Abono01..Abono12`

3. `polizas`
   Campos principales: `Tipo_Poli`, `Num_Poliz`, `Periodo`, `Ejercicio`, `Fecha_Pol`, `Concep_Po`

4. `auxiliares`
   Campos principales: `Tipo_Poli`, `Num_Poliz`, `Num_Part`, `Periodo`, `Ejercicio`, `Num_Cta`, `Fecha_Pol`, `Concep_Po`, `Debe_Haber`, `MontoMov`

## Problema actual
Para calcular la deuda actual o consultar una sola cuenta tenemos que descargar y procesar en memoria una cantidad masiva de información de todo el año:

- `estado de cuenta`: hoy depende principalmente de descargar todos los `saldos` + todos los `auxiliares` del ejercicio y filtrar manualmente.
- `aviso de cobro`: igual, depende de todo el histórico de `auxiliares` del año.
- `deudas actuales`: para mostrar el listado de quién debe, tenemos que descargar literalmente **todos los auxiliares y saldos de la empresa** y hacer el cálculo cuenta por cuenta.

Esto genera una latencia inaceptable y respuestas que pesan decenas de Megabytes.

## Solicitud de nuevos endpoints

### 1. Endpoint de Estado de Cuenta por cuenta
**Objetivo:** consultar solo los movimientos de una cuenta (y sus subcuentas de conceptos) y su saldo inicial, sin descargar todo el ejercicio.

**Filtros requeridos:**
- `empresa`
- `year`
- `num_cta` (ej. `103-004-004` o `103-004-004-000`)
- `fecha_inicio`
- `fecha_fin`

**Respuesta esperada:**
```json
{
  "intEstatus": 1,
  "strMensaje": "OK",
  "data": {
    "saldo_inicial": 0.0,
    "movimientos": [
      {
        "Tipo_Poli": "Ig",
        "Num_Poliz": "30",
        "Num_Part": 1,
        "Periodo": 4,
        "Ejercicio": 2026,
        "Num_Cta": "103-004-004-001",
        "Fecha_Pol": "2026-04-30T00:00:00",
        "Concep_Po": "CUOTA DE MTTO ABRIL 2026",
        "Debe_Haber": "D",
        "MontoMov": 10049.0
      },
      {
        "Tipo_Poli": "Ig",
        "Num_Poliz": "31",
        "Num_Part": 1,
        "Periodo": 4,
        "Ejercicio": 2026,
        "Num_Cta": "103-004-004-002",
        "Fecha_Pol": "2026-04-30T00:00:00",
        "Concep_Po": "RECARGO ABRIL 2026",
        "Debe_Haber": "D",
        "MontoMov": 500.0
      }
    ]
  }
}
```

### 2. Endpoint de Aviso de Cobro por cuenta
**Objetivo:** consultar solo los cargos, abonos y saldo pendiente de una cuenta (y sus subcuentas de conceptos) para construir el aviso de cobro a una fecha de corte.

**Filtros requeridos:**
- `empresa`
- `year`
- `num_cta` (ej. `103-004-004` o `103-004-004-000`)
- `fecha_corte`

**Respuesta esperada:**
```json
{
  "intEstatus": 1,
  "strMensaje": "OK",
  "data": {
    "saldo_inicial": 0.0,
    "saldo_actual": 0.0,
    "movimientos": [
      {
        "Tipo_Poli": "Dr",
        "Num_Poliz": "1",
        "Num_Part": 1,
        "Periodo": 1,
        "Ejercicio": 2026,
        "Num_Cta": "103-004-004-001",
        "Fecha_Pol": "2026-01-01T00:00:00",
        "Concep_Po": "CUOTAS DE MTTO ENERO 2026",
        "Debe_Haber": "D",
        "MontoMov": 10049.0
      }
    ]
  }
}
```

### 3. Endpoint de Deudas Actuales Consolidadas (Global)
**Objetivo:** Obtener un listado ligero con el saldo final calculado de todas las propiedades de la empresa, ejecutado directamente por el motor de Aspel. Esto nos evita descargar millones de registros de pólizas solo para hacer sumas locales.

**Filtros requeridos:**
- `empresa`
- `year`
- `fecha_corte`

**Respuesta esperada:**
- Un arreglo que solo contenga el identificador de cada cuenta base (nivel 3) (y opcionalmente su nombre) junto con su saldo final calculado a la fecha de corte. Aquí sí es aceptable consolidar todo el saldo en la cuenta base.
```json
{
  "intEstatus": 1,
  "strMensaje": "OK",
  "data": [
    {
      "Num_Cta": "103-004-004-000",
      "Nombre": "DEPTO 101",
      "Saldo_Actual": 15000.00
    },
    {
      "Num_Cta": "103-004-005-000",
      "Nombre": "DEPTO 102",
      "Saldo_Actual": 0.00
    }
  ]
}
```

## Reglas importantes
1. **Comportamiento del filtro `num_cta` y Cuentas de 4 Niveles:** Actualmente los cargos están clasificados en cuentas de 4 niveles (ej. `...-001` para mtto, `...-002` para recargos). Al enviar el parámetro `num_cta` (ej. `103-004-004` o `103-004-004-000`) en los endpoints 1 y 2, la consulta interna de Aspel debe comportarse como un agrupamiento por prefijo (`LIKE '103-004-004-%'`) para que se incluyan todos los movimientos de esas subcuentas.
2. **Conservar el Número de Cuenta Real:** En la respuesta de movimientos de los endpoints 1 y 2, **es obligatorio mantener el `Num_Cta` real (de 4 niveles)** donde se registró el movimiento (ej. `103-004-004-001`). No deben enmascarar ni sobrescribir este valor con la cuenta base, ya que nosotros utilizamos ese 4to nivel para realizar el desglose de deuda por concepto en el Aviso de Cobro.
3. No requerimos que Aspel nos entregue el layout ni formatos PDF de ningún documento.
4. Solo necesitamos los datos crudos, pero ya agrupados y filtrados.
5. Si Aspel prefiere, los endpoints 1 y 2 pueden regresar `data` como arreglo en vez de objeto, pero la recomendación es incluir al menos el bloque de `movimientos` consolidado.

## Beneficio esperado
- Reducción drástica del tamaño de la respuesta (de decenas de Megabytes a unos cuantos Kilobytes).
- Menor tráfico de red entre el servidor de base de datos Aspel y el API.
- Tiempo de respuesta casi inmediato para paneles críticos como "Deudas Actuales".
- Mayor estabilidad y escalabilidad.
