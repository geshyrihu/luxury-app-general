📊 ANÁLISIS DETALLADO DEL REPORTE "FLUJO DE EFECTIVO (FE)"
🏢 ESTRUCTURA GENERAL
El reporte está organizado en 2 áreas principales:

CONTABLE (Filas 4-20): Flujo de bancos e inversiones
ADMINISTRACIÓN (Filas 21-33): Cuentas por pagar y cobrar
📋 CATÁLOGO DE CUENTAS Y FUENTES DE DATOS
SECCIÓN 1: ÁREA CONTABLE - BANCOS
Fila Concepto No. Cuenta Tipo Columna COI Empresa Fórmula Aspel
4 SALDO INICIAL BANCOS 102-000-000 Saldo Inicial (I) COI CONTABLE 108 @CTA[102-000-000, I]{MMAA}
5 SALDO INICIAL INVERSIONES 103-000-000 Saldo Inicial (I) COI CONTABLE 108 @CTA[103-000-000, I]{MMAA}
6 CUOTAS COBRADAS 102-001-001 Debe (D) COI COBRANZA 92 @CTA[102-001-001, D]{MMAA} - Otros Ingresos - Venta Inversión
7 OTROS INGRESOS 404-001-000 MANUAL COI CONTABLE 108 ⚠️ DIGITAR MANUAL
8 VENTA FONDOS INVERSIÓN 103-000-000 Haber (H) COI CONTABLE 108 @CTA[103-000-000, H]{MMAA}
9 INGRESOS (SUBTOTAL) - FORMULA - - =SUMA(E4:E8)
SECCIÓN 2: ÁREA CONTABLE - GASTOS
Fila Concepto No. Cuenta Tipo Empresa Fórmula Aspel
11 PAGOS A PROVEEDORES 201-000-000 Debe (D) - -@CTA[201-000-000, D]{MMAA}
12 PAGOS A ACREEDORES 202-000-000 Debe (D) - -@CTA[202-000-000, D]{MMAA}
13 PAGOS TARJETA CORPORATIVA 102-001-003 Debe (D) - -@CTA[102-001-003, D]{MMAA}
14 PAGOS DE SUELDOS 204-001-000 Debe (D) - -@CTA[204-001-000, D]{MMAA}
15 PAGOS DE IMPUESTOS (MES ANT) 205-000-000 + 206-000-000 + 207-000-000 Debe (D) - -@CTA[205-000-000, D]{MMAA} - @CTA[206-000-000, D]{MMAA} - @CTA[207-000-000, D]{MMAA}
16 COMPRA FONDOS INVERSIÓN 103-000-000 - 403-001-000 MANUAL 108 ⚠️ DIGITAR MANUAL (U16-V16)
17 PAGOS COMISIONES BANCARIAS 609-001-000 Debe (D) - -@CTA[609-001-000, D]{MMAA}
18 GASTOS (SUBTOTAL) - FORMULA - =SUMA(E11:E17)
20 SALDO BANCARIO FINAL - FORMULA - =INGRESOS + GASTOS (E9+E18)
SECCIÓN 3: ÁREA ADMINISTRACIÓN - CUENTAS POR PAGAR
Fila Concepto No. Cuenta Tipo Fórmula Aspel
22 CUENTAS POR PAGAR (SUBTOTAL) - FORMULA =SUMA(E23:E25)
23 CXP A PROVEEDORES 201-000-000 Saldo Final (F) -@CTA[201-000-000, F]{MMAA}
24 CXP DE SUELDOS 204-001-000 Saldo Final (F) -@CTA[204-001-000, F]{MMAA}
25 CXP DE IMPUESTOS 205-000-000 + 206-000-000 + 207-000-000 Saldo Final (F) -@CTA[205-000-000, F]{MMAA} - @CTA[206-000-000, F]{MMAA} - @CTA[207-000-000, F]{MMAA}
27 EFECTIVO DISPONIBLE DESPUÉS CXP - FORMULA =E20 + E22
SECCIÓN 4: ÁREA ADMINISTRACIÓN - CUENTAS POR COBRAR
Fila Concepto No. Cuenta Tipo Fórmula Aspel
29 CUENTA POR COBRAR AL CIERRE 104-000-000 Saldo Final (F) @CTA[104-000-000, F]{MMAA} - Cobranza Judicial
30 COBRANZA JUDICIAL - MANUAL ⚠️ DIGITAR MANUAL
31 CXC A CORTO PLAZO - FORMULA =E29
33 EFECTIVO DISPONIBLE DESPUÉS CXC - FORMULA =E27 + E31
SECCIÓN 5: NOTA - INVERSIONES
Fila Concepto No. Cuenta Tipo Fórmula Aspel
35 FONDO DE RESERVA 103-000-000 Saldo Inicial (I) @CTA[103-000-000, I]{MMAA}
36 VENTA FONDOS INVERSIÓN - FORMULA =-E8 (referencia inversa)
37 COMPRA FONDOS INVERSIÓN - FORMULA =-E16 (referencia inversa)
38 INTERESES GANADOS 403-000-000 Haber (H) @CTA[403-000-000, H]{MMAA}
39 TOTAL INVERSIÓN - FORMULA =SUMA(E35:E38)
🔑 PARÁMETROS DE CONEXIÓN ASPEL COI
Sintaxis de la fórmula Aspel:
@coiwin|valor!'@CTA[NUMERO-CUENTA, TIPO]{MMAA}'
Códigos de Tipo de Columna:
Código Significado
I Saldo Inicial
D Movimientos al DEBE
H Movimientos al HABER
F Saldo FINAL
Formato de Período:
{MMAA} → Ejemplo: {0125} = Enero 2025, {1225} = Diciembre 2025
Empresas (ID):
108 = Empresa COI Contable principal
92 = Empresa COI Cobranza
📊 CATÁLOGO COMPLETO DE CUENTAS CONTABLES
No. Cuenta Descripción Uso en Reporte
102-000-000 Bancos Saldo Inicial Bancos
102-001-001 Bancos - Subcuenta Cuotas Cobradas
102-001-003 Bancos - Tarjeta Corporativa Pagos Tarjeta
103-000-000 Inversiones Saldo Inversiones / Venta-Compra Fondos
104-000-000 Clientes (CXC) Cuentas por Cobrar
201-000-000 Proveedores Pagos y Saldo CXP Proveedores
202-000-000 Acreedores Pagos a Acreedores
204-001-000 Sueldos por Pagar Pagos y Saldo CXP Sueldos
205-000-000 ISR por Pagar Pagos y Saldo CXP Impuestos
206-000-000 IVA por Pagar Pagos y Saldo CXP Impuestos
207-000-000 Otros Impuestos Pagos y Saldo CXP Impuestos
403-000-000 Intereses Ganados Ingresos por Inversiones
403-001-000 Intereses (subcuenta) Referencia en Compra Inversión
404-001-000 Otros Ingresos Entrada manual
609-001-000 Comisiones Bancarias Gasto por comisiones
🔄 LÓGICA DE CÁLCULOS (Para implementar en Angular)
// Estructura de cálculos en Angular
interface FlujoEfectivo {
// INGRESOS
saldoInicialBancos: number; // COI(102-000-000, I)
saldoInicialInversiones: number; // COI(103-000-000, I)
cuotasCobradas: number; // COI(102-001-001, D) - otrosIngresos - ventaInversion
otrosIngresos: number; // MANUAL
ventaFondosInversion: number; // COI(103-000-000, H)
totalIngresos: number; // SUM(arriba)

// GASTOS (valores negativos)
pagosProveedores: number; // -COI(201-000-000, D)
pagosAcreedores: number; // -COI(202-000-000, D)
pagosTarjeta: number; // -COI(102-001-003, D)
pagosSueldos: number; // -COI(204-001-000, D)
pagosImpuestos: number; // -COI(205+206+207, D)
compraInversion: number; // MANUAL
comisionesBancarias: number; // -COI(609-001-000, D)
totalGastos: number; // SUM(gastos)

// RESULTADOS
saldoBancarioFinal: number; // totalIngresos + totalGastos
cxpProveedores: number; // -COI(201-000-000, F)
cxpSueldos: number; // -COI(204-001-000, F)
cxpImpuestos: number; // -COI(205+206+207, F)
totalCXP: number; // SUM(cxp)
efectivoDespuesCXP: number; // saldoBancario + totalCXP

cxcAlCierre: number; // COI(104-000-000, F) - cobranzaJudicial
cobranzaJudicial: number; // MANUAL
cxcCortoPlazo: number; // cxcAlCierre
efectivoDespuesCXC: number; // efectivoDespuesCXP + cxcCortoPlazo
}
⚠️ CAMPOS DE ENTRADA MANUAL
Los siguientes campos requieren entrada manual del usuario:

Fila 7 - OTROS INGRESOS (E7:P7)
Fila 16 - COMPRA FONDOS INVERSIÓN (E16:P16) - Nota: U16 menos V16
Fila 30 - COBRANZA JUDICIAL (E30:P30)
