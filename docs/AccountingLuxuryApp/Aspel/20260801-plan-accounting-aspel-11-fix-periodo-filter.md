# 🧠 Plan Rápido: Arreglo de Filtro por Periodo y Nivel

> **Instrucciones para el Agente CLI:**
> El Frontend está enviando un filtro `periodo`, pero la API no lo está recibiendo ni procesando. Además, debemos asegurarnos de que la API soporte ese filtro.

### Prompt de Ejecución (Copiar y pegar al Agente CLI)
```text
Corrige el filtro de periodo en la consulta de movimientos:
1. En el backend (`MockAspelEndpoints.cs`), dentro del record `MovimientosQueryRequest`, agrega la propiedad `int? Periodo`.
2. En el método `GetMovimientosAsync`, agrega la regla de filtrado:
   `if (request.Periodo.HasValue) query = query.Where(item => item.auxiliar.Periodo == request.Periodo.Value);`
3. En el frontend (`mock-aspel-dashboard.ts`), en el método `refresh()`, asegúrate de que el objeto `query` incluya `periodo: this.period()`. (Esto ya debería estar, solo confírmalo).
4. Compila el backend para que acepte este nuevo filtro.
```
