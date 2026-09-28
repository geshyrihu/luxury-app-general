Plan de Reimplementación — Reglas de Clasificación Cobranza Online
Contexto
Basado en el análisis de los JSON reales de Aspel (../../../docs/AccountingLuxuryApp/Aspel/20260801-analisis-accounting-aspel-cuentas.json, saldos.json, auxiliares.json, polizas.json) y las reglas de negocio definidas el 2026-08-06.

Referencia técnica completa:
ASPEL_API_GUIDE.md

Lo que aprendimos de los datos reales
De ../../../docs/AccountingLuxuryApp/Aspel/20260801-analisis-accounting-aspel-cuentas.json
La jerarquía 104 es: Raíz (Nivel 1) → Torre (Nivel 2) → Departamento (Nivel 3)
Un departamento = cuenta con Tipo="D", Nivel=3, Status="A", cuarto segmento "000"
Torres identificadas: Acacia (001), Olivo1 (002), Olivo2 (003), Ciruelo1 (004), Ciruelo2 (005), Ciruelo3 (006)
Existen subcuentas con cuarto segmento 004 y 005 (intereses/penalizaciones) — excluirlas del conteo de deptos
De saldos.json
Cada cuenta tiene 12 pares CargoNN / AbonoNN (uno por mes) + Inicial (arrastre del año)
Ejemplo real cuenta 104-001-005-000 (Karen Velasquez):
Inicial: -38,082 — tenía anticipo al inicio del año
Ene: Cargo 12,694 / Abono 0 → acumulado = -25,388
Feb: Cargo 12,694 / Abono 0 → acumulado = -12,694
Mar: Cargo 12,694 / Abono 25,388 → acumulado = 0 (pagó dos meses)
Abr: Cargo 12,694 / Abono 0 → acumulado = +12,694 ← 1 mes vencido
May: Cargo 12,694 / Abono 0 → acumulado = +25,388 ← 2 meses vencidos → MOROSA
De auxiliares.json
Póliza 1 = PENA MORATORIA (cargo adicional, no cuenta como cuota)
Póliza 2 = CUOTA DE MANTENIMIENTO (principal)
Póliza 3 = Descuento pronto pago / complemento
De polizas.json
Póliza 2 registrada ene–ago 2026 confirma cuota mensual continua
Póliza 3 desde jun 2026 = descuento pronto pago activo
Algoritmo central

FUNCIÓN ContarMesesVencidos(saldo, mesCorte):
acumulado = saldo.Inicial
mesesVencidos = 0
PARA M desde 1 hasta mesCorte - 1:
acumulado += Cargo[M] - Abono[M]
SI acumulado > 0: mesesVencidos++
RETORNAR mesesVencidos
FUNCIÓN ClasificarCuenta(saldoActual, mesesMtto, mesesExtra):
SI saldoActual < 0 → ANTICIPOS
SI saldoActual = 0 → SIN ADEUDO
SI mesesMtto > 5 O mesesExtra >= 5 → COBRANZA JUDICIAL
SI mesesMtto >= 2 O mesesExtra >= 1 → MOROSO
SI saldoActual > 0 → DEUDA CORRIENTE
Cambios en el backend
[MODIFY] GetTotalDepartments()
csharp

// Antes: dbContext.Property.Where(p => p.CustomerId == customerId).Count()
// Después:
var accounts104 = \_aspelService.GetCuentas();
return accounts104
.Where(c => c.Num_Cta.StartsWith("104-")
&& c.Tipo == "D"
&& c.Nivel == 3
&& c.Status == "A"
&& c.Num_Cta.EndsWith("-000"))
.Count();
[MODIFY] Cuota mensual total (eliminar ChargeTemplate)
csharp

// Sumar CargoMM de cuentas 104 nivel 3 en el mes del corte
var saldos104 = \_aspelService.GetSaldos()
.Where(s => s.Num_Cta.StartsWith("104-") && s.Num_Cta.EndsWith("-000"));
decimal cuotaTotalMes = saldos104.Sum(s => s.GetCargo(mesCorte));
[MODIFY] Clasificación de cuenta (reemplaza multiplicadores)
csharp

private string ClasificarCuenta(AspelSaldo saldo, int mesCorte)
{
decimal saldoActual = CalcularSaldoAlCorte(saldo, mesCorte);
if (saldoActual < 0) return "ANTICIPOS";
if (saldoActual == 0) return "SIN ADEUDO";
int mesesVencidos = ContarMesesVencidos(saldo, mesCorte);
if (mesesVencidos > 5) return "COBRANZA JUDICIAL";
if (mesesVencidos >= 2) return "MOROSO";
return "DEUDA CORRIENTE";
}
private int ContarMesesVencidos(AspelSaldo s, int mesCorte)
{
decimal acum = s.Inicial;
int count = 0;
for (int m = 1; m < mesCorte; m++)
{
acum += s.GetCargo(m) - s.GetAbono(m);
if (acum > 0) count++;
}
return count;
}
[MODIFY] CobranzaOnlineCurrentChargesDTO.cs — Bug doble descuento
Total debe ser el bruto (antes de abonos)
Pending = Total - Collected sin descuento adicional
Verificación con dato real
Cuenta 104-001-005-000 (Karen Velasquez), corte agosto 2026:

Mes Cargo Abono Acumulado ¿Vencido?
Inicial — — -38,082 —
Ene 12,694 0 -25,388 No
Feb 12,694 0 -12,694 No
Mar 12,694 25,388 0 No
Abr 12,694 0 +12,694 Sí (1)
May 12,694 0 +25,388 Sí (2)
Jun 0 0 +25,388 Sí (3)
Jul 0 0 +25,388 Sí (4)
→ mesesVencidos = 4 → MOROSA ✅

Checklist de ejecución
[ ] Modificar GetTotalDepartments() → cuentas Aspel nivel 3
[ ] Eliminar ChargeTemplate de cálculo de cuota → usar saldos CargoMM
[ ] Implementar ContarMesesVencidos() como método privado en el servicio
[ ] Reemplazar lógica de clasificación con el nuevo algoritmo
[ ] Corregir bug doble descuento en DTO
[ ] Validar Karen Velasquez = MOROSA con 4 meses vencidos
[ ] Validar que Análisis y Detalle Condóminos muestran el mismo total por categoría
