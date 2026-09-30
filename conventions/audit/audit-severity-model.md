# Audit Severity Model

**Ultima revision:** 2026-09-30 (agregado veredicto confirmado/necesita validación/rechazado y severidad likelihood×impact para hallazgos de seguridad, adaptado de `cloudflare/security-audit-skill`). Anterior 2026-07-29.

## Clasificaciones minimas (uso general, todo tipo de auditoria)

- incumplimiento critico
- incumplimiento alto
- deuda tecnica
- mejora recomendada
- riesgo de ruptura por shared o contrato

## Uso recomendado

- `incumplimiento critico`
  - rompe produccion, seguridad o contrato sensible
- `incumplimiento alto`
  - funcionalidad importante rota o muy fragil
- `deuda tecnica`
  - incumplimiento relevante sin ruptura inmediata
- `mejora recomendada`
  - ajuste de calidad o consistencia
- `riesgo de ruptura por shared o contrato`
  - corregir directo puede dañar otras zonas; requiere plan

## Capa adicional para hallazgos de seguridad

Un hallazgo de seguridad (acceso indebido, fuga entre `Customer`, bypass de rol, inyección, secretos expuestos) **no se clasifica solo** con las 5 categorías de arriba — primero pasa por un veredicto, y solo `confirmado` recibe la etiqueta `incumplimiento critico`/`incumplimiento alto` de la tabla general:

- **`confirmado`** — trace completo `archivo:línea` + resultado observado (código o fixture local). Recibe severidad `critica`/`alta`/`media`/`baja`/`informativa` (ver tabla de anclas abajo) y **entonces** se mapea a `incumplimiento critico` (severidad crítica/alta) o `incumplimiento alto`/`deuda tecnica` (media/baja) de la tabla general.
- **`necesita validación`** — código real, pero un hecho decisivo vive fuera del repo (config de despliegue, proveedor externo). **Nunca lleva severidad ni se reporta como `incumplimiento`** — es una pregunta abierta con el hecho exacto que falta y quién puede resolverlo.
- **`rechazado`** — el propio código refuta el candidato. Se documenta para que una auditoría futura no repita la misma hipótesis ya descartada.

**Severidad = likelihood × impact; nunca solo impact.** La severidad global no puede superar el impacto demostrado.

| Severidad | Ancla |
|---|---|
| crítica | actor no autenticado obtiene ejecución de código, acceso completo a datos, o control total de cuentas |
| alta | un actor derrota por completo un control explícito con consecuencia real (bypass de auth, lectura/escritura cross-`Customer`, ejecución autenticada de código) |
| media | violación real con alcance acotado o precondiciones poco comunes |
| baja | divulgación de detalles internos no secretos, o esfuerzo sostenido para ganancia mínima |
| informativa | confirmado pero impacto mínimo |

**Antes de marcar `confirmado` con severidad alta/crítica**, el hallazgo pasa por verificación adversarial (agente que encuentra ≠ agente que confirma) — ver `security-audit-checklist.md` para el proceso completo y las clases de ataque aplicables a este stack.
