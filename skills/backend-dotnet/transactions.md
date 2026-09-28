# ⚙️ Transactions & EF Core Operations

> **Deep-dive:** las reglas generales están en CONVENTIONS.md §9 (Transacciones). Este archivo contiene ejemplos detallados.

## 6.1. Regla General — Confía en `SaveChangesAsync`
EF Core envuelve automáticamente cada llamada a `SaveChangesAsync()` en una transacción implícita.
- **Usa `SaveChangesAsync()` directamente** cuando creas/modificas entidades dentro del mismo `DbContext` en una sola operación lógica.

## 6.2. Cuándo usar Transacción Explícita (`BeginTransactionAsync`)
Usa `BeginTransactionAsync()` **solo** en estas situaciones:
1.  Múltiples `SaveChangesAsync()` que deben ser atómicos.
2.  Operaciones en diferentes unidades de trabajo.
3.  Puntos de control intermedios (`Savepoint`).
4.  Operaciones mixtas: EF Core + SQL crudo (`ExecuteSqlRawAsync`).

## 6.3. Anti-patrones (🚫 No hacer esto)
- Transacción explícita innecesaria para un solo `SaveChangesAsync`.
- Múltiples `SaveChangesAsync()` sin transacción cuando deben ser atómicos.
- No incluir servicios externos (Email, SignalR) dentro de la transacción de base de datos.
