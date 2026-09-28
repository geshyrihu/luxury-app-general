# 🧠 Plan de Implementación: Simulador Aspel (Fase Avanzada - UUIDs y Centros de Costo)

> **Instrucciones para el Agente CLI:**
> El objetivo es expandir nuestro simulador (Mock Aspel) para que soporte y valide las reglas avanzadas de contabilidad electrónica y prorrateo (UUIDs y Departamentos). Esto nos permitirá probar el flujo completo en la UI de LuxuryApp antes de enviar el requerimiento definitivo a Aspel.
> Escribe tu reporte en `docs/plans/mock-advanced-features-report.md`.

---

## 🚀 FASE 01 (Backend): Ampliación de Entidades y Reglas de Negocio
**Objetivo:** Agregar soporte para UUIDs y Departamentos, y hacer que el API rechace pólizas si faltan datos obligatorios.

### Prompt de Ejecución (Copiar y pegar al Agente CLI)
```text
Amplía el motor del MockAspelDbContext y los Endpoints:

1. Modifica la entidad `MockAuxiliar` para incluir (si no existen) los campos:
   - `IdUuid` (int) y `Uuid_Fiscal` (string, max 36)
   - `NumDepto` (int)
   (No olvides agregarlos al DTO de request `PolizaCreateRequest.Partida` y de response).
2. Agrega una nueva migración de EF Core o actualiza el esquema si estás en memoria.
3. En el endpoint `POST /api/AspelCOI/Polizas`, agrega la siguiente Validación de Negocio Estricta ANTES de guardar:
   - Haz un cruce de las partidas enviadas contra la tabla `MockCuentas`.
   - REGLA 1 (Contabilidad Electrónica): Si la cuenta destino tiene `CapturaUuid == 1` y el usuario no envió un `Uuid_Fiscal` en la partida, retorna `400 Bad Request` con el mensaje: "La cuenta requiere UUID obligatoriamente."
   - REGLA 2 (Centros de Costo): Si la cuenta tiene `Deptsino == 'S'` y el `NumDepto` enviado es <= 0, retorna `400 Bad Request` indicando: "La cuenta exige centro de costos (Departamento)."
4. Compila y asegúrate de que estas nuevas validaciones funcionen.
5. Reporta en `docs/plans/mock-advanced-features-report.md` bajo "Reporte Backend Fase Avanzada".
```

---

## 🚀 FASE 02 (Frontend): Interfaz Inteligente para Contabilidad Electrónica
**Objetivo:** Actualizar el formulario de pólizas en Angular para que reaccione dinámicamente a la configuración de cada cuenta.

### Prompt de Ejecución (Copiar y pegar al Agente CLI)
```text
Amplía el Formulario Reactivo del Simulador en Angular:

1. En `mock-aspel-poliza-form.ts` y su HTML, actualiza el FormArray de Partidas para incluir dos nuevos campos visuales por fila: `UUID` y `NumDepto`.
2. Lógica Dinámica: Cuando el usuario seleccione una cuenta en el Dropdown de una partida, haz una búsqueda rápida en el catálogo de cuentas local.
   - Si la cuenta seleccionada tiene `capturaUuid === 1`, haz que el campo `UUID` en la UI se vuelva rojo/obligatorio (Agrega el validator `Validators.required`). Si es 0, escóndelo o deshabilítalo.
   - Si la cuenta tiene `deptsino === 'S'`, haz lo mismo con el campo `Departamento`.
3. Esto simulará la experiencia de usuario real de un ERP contable dentro de LuxuryApp, evitando que el usuario cometa errores antes de darle al botón de Guardar.
4. Verifica que Angular compile sin errores.
5. Reporta en `docs/plans/mock-advanced-features-report.md` bajo "Reporte Frontend Fase Avanzada".
```
