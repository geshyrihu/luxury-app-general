# Modulo: AutitoriaCuentasAspel (Auditoria de Cuentas Aspel)

> **Area funcional:** Contabilidad / Auditoria y Conciliacion de Catalogos
> **Tag de version:** `v1.0`
> **Owner tecnico:** `@equipo-contabilidad`
> **Ultima actualizacion:** `2026-06-25`

---

## Vision General

Realiza una **auditoria estructural** del plan de cuentas de Aspel COI a traves de todos los clientes/configuraciones de un tipo de empresa. Compara catalogo contra un catalogo unificado de referencia y detecta cuentas faltantes y diferencias estructurales (nivel, tipo, naturaleza, cuenta padre, cuenta raiz).

---

## Endpoint

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| `GET` | `api/autitoria-cuentas-aspel?intYear={year}&empresa={Cobranza|Contabilidad|Gastos}` | Administrador, SuperUsuario, Contador, AsistenteFiscal, Asistente | Comparativa estructural de catalogos de cuentas Aspel entre clientes |

---

## Reglas de Negocio

1. **Normalizacion de cuentas:** Los numeros de cuenta se normalizan a formato canonico de 3 digitos separados por guion (`XXX-YYY-ZZZ`). Segmentos de menos de 3 digitos se rellenan con ceros a la izquierda.
2. **Filtro por tipo de empresa:** Para empresa tipo `Cobranza` solo se incluyen cuentas que inician con `104-`. Para `Contabilidad`/`Gastos` se excluyen las que inician con `104-`.
3. **Catalogo de referencia unificado:** Se construye por mayoria simple (voto mayoritario) de todos los clientes que tienen la cuenta, comparando campo por campo.
4. **Tolerancia a fallos por cliente:** Si un cliente falla al consultar Aspel COI, se registra el error pero no se detiene el proceso global. Se retorna error `502` solo si TODOS los clientes fallan.
5. **Calculo de cobertura:** Porcentaje = (cuentas presentes / total de cuentas distintas) * 100.
