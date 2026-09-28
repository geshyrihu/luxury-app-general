# QA Report — Gap Analysis (Fase 1)

**Comparativa:** pantallas Flutter actuales (`client/flutter/commitee`) vs export Stitch + reglas de negocio.
**Conclusión:** El app tiene la estructura de navegación y la capa de datos/services/modelos mayormente completa, pero **carece de theming tokenizado, dark mode, y varias pantallas/copy exactos**. La Fase 2 es principalmente (1) tema+dark, (2) recovery paso 2, (3) biblioteca, (4) corrección de copy/estados, (5) modal de deuda a 1 caja.

---

## 1. Verificación de puntos críticos del prompt

| # | Requisito | Estado actual Flutter | Veredicto |
|---|-----------|-----------------------|-----------|
| 1 | Login móvil **SIN "Recordarme"** | `pagina_login.dart` tiene `Checkbox` "Recordar sesión" + `_cargarCredencialesRecordadas` | ❌ Debe eliminarse |
| 2 | Countdown 120s + "Reenviar código" solo en 0 | **No existe pantalla de verificación de código** (paso 2 del recovery ausente) | ❌ FALTANTE |
| 3 | Minuta con 4 secciones (Invitados Externos incluida) | `pagina_minutas_detalle.dart` tiene Administración/Comité/Invitados Externos/Acuerdos | ✅ (ver desviaciones de copy/estado) |
| 4 | Modal de deuda con **UNA sola caja** de criterio + sin botones pago/descarga | `pagina_cobranza.dart` usa **3 cajas** (`_tituloCriterio`/`_descripcionCriterio` por clasificación) | ❌ Debe ser 1 caja con textos exactos de Angular |
| 5 | Directorio "En turno"/"Fuera de turno" | Usa `Chip` con `estadoTurno` (ver entidad) y colores verde/gris | ⚠️ Validar copy exacto y ausencia de indicador cuando `isOnShift==null` |

---

## 2. Desviaciones de copy exacto (por módulo)

### Auth
- Login: título **"Portal Comité"** (debe ser **"Bienvenido de nuevo"** + subtítulo **"Inicia sesión para continuar"**).
- Label usuario: **"Usuario / Correo electrónico"** (debe ser **"Usuario"**). Label password: **"Contraseña"** ✅.
- Botón: **"Ingresar"** (debe ser **"INICIAR SESIÓN"**).
- Recuperar: título **"Recuperar contraseña"** / "Recuperar contraseña" (Stitch: copy de paso 1). Botón **"Enviar instrucciones"** (revisar copy final de Stitch).
- Reset inválido: **"Enlace inválido"** / "El enlace de recuperación es inválido o ha expirado..." (debe ser exacto **"Enlace inválido o expirado."**).
- Reset válido: botón **"Cambiar contraseña"** (revisar copy final).

### Cobranza
- Título AppBar **"Cobranza"** (Stitch probablemente sin AppBar textual o con hero). El hero "Cartera vencida" + "{X} de {Y} condóminos deben" **está presente** en las tarjetas ✅.
- "Cobrado del mes" + "Meta del mes" presentes en `_TarjetaAvance` (etiquetas "Meta"/"Cobrado"/"Faltante").
- Vacío lista: **"No hay condóminos con adeudo pendiente."** (debe ser **"Sin propiedades con deuda."**).
- Vacío global: **"No hay información de cobranza."** ✅.
- Error detalle: **"No se pudo cargar el desglose de deuda."** (debe ser **"No se pudo cargar el desglose."**).
- Loading detalle: spinner sin texto (debe mostrar **"Cargando desglose..."**).
- Montos: `formatearMoneda` siempre 2 decimales (debe ser **0 en cards**, 2 en desglose) y **no monospace**.
- Colores de severidad hardcodeados (`Colors.red`/`deepOrange`/`blue`) en vez de tokens danger/warn/info.
- Saldos: naranja (>0) / verde (<0) ✅ lógica presente, pero ver paleta token.

### Minutas (lista)
- Vacío: **"No hay minutas disponibles."** (regla no especifica lista vacía; sección usa "No registrados"). Revisar.
- Título AppBar **"Minutas"**.

### Minutas (detalle)
- Título AppBar **"Detalle Minuta"**.
- Sección de acuerdos: **"Acuerdos y Asuntos"** (debe ser **"Acuerdos y Asuntos Tratados"**).
- Mapeo de estados: actual `switch` solo cubre `pendiente`/`en progreso`/`concluido`/`cancelado`; regla añade `proceso`, `doing`, `completado`, `hecho`, `no autorizado` → debe ampliarse y usar tokens (warning/primary/success/danger).
- Error: **"Error al cargar el detalle."** (debe ser **"No se pudo cargar la información de la minuta."**).
- Contadores de sección y "No registrados" **no implementados** (solo se ocultan secciones vacías).

### Directorio
- Vacío Personal: **"No hay contactos en esta sección."** (debe ser **"No hay miembros disponibles"**).
- Vacío Casetas: mismo genérico (debe ser **"No hay casetas registradas"**).
- Horario: solo renderiza si `schedule.isNotEmpty`; regla pide **"Sin horario registrado."** cuando vacío.
- WhatsApp prefijo 52 si 10 dígitos ✅. `isOnShift==null` → sin indicador ✅ (Icono chevron). Validar copy "En turno"/"Fuera de turno".

### Póliza
- Vacío: **"No hay póliza registrada."** (debe ser **"No hay póliza disponible"**).
- Campos Proveedor/Descripción/Fecha Inicio/Fecha Fin presentes ✅.
- Botón PDF solo si `tieneDocumento` ✅.

### Biblioteca
- **No existe pantalla ni ruta.** Ausente `customDocumentsByType`/`policyContracts` en `fuente_datos_board_directors`.
- Vacío requerido: **"No se encontraron documentos"**.

### Perfil
- Título **"Mi Perfil"**; edición y foto con `image_picker` presentes; cambio de password presente.
- Validar que cambio de password → **logout al éxito** (revisar `pagina_editar_perfil.dart`, no leído a fondo).

### Visor PDF
- `syncfusion_flutter_pdfviewer` presente ✅.

---

## 3. Estado del tema Light / Dark

| Aspecto | Light | Dark |
|---------|-------|------|
| `ThemeData` con tokens | ❌ (hardcoded `0xFF0B3164`) | ❌ (inexistente) |
| Figtree font | ❌ | ❌ |
| Monospace en montos | ❌ | ❌ |
| Radios 16/12-14/32 | ⚠️ parcial (8–14 inconsistente) | ⚠️ |
| Sombras azuladas | ⚠️ manual por pantalla | ⚠️ |
| Variantes dark de cada screen | — | ❌ 0% |

**Conclusión tema:** La Fase 2 debe crear `ThemeData` light/dark desde tokens (`../../../docs/SystemLuxuryApp/Flutter/20260801-guia-system-flutter-handoff.md`) y sustituir todos los `Color(0xFF0B3164)` / colores semánticos hardcodeados por tokens. Esto es trabajo neto-new y transversal a todos los módulos.

---

## 4. Componentes reutilizables detectados

- `CajonNavegacion` (Drawer global + selector de cliente) — reutilizable, requiere tema.
- `PaginaListaDocumentos` (genérico para Juntas/Informes) — reutilizable para Biblioteca (con ajustes).
- Patrón `_Tarjeta*`, `_filaDato`, `_seccionTitulo`, `_tarjetaInfo` repetido en varias pantallas → candidatos a widgets compartidos de tema.
- `ServicioUtilidades.formatearMoneda/formatearFecha/urlArchivo` — centralizar formato.
- `mostrarDetalleMoroso` / `_DetalleContacto` (bottom sheets) — patrón de modal a tipar con tokens.

---

## 5. Pantallas FALTANTES (implementación)

1. **Verificar código** (recovery paso 2): pantalla + inserción en flujo (`recuperar → verificar → reset`), countdown 120s, "Reenviar código" en 0, token por nav state.
2. **Biblioteca documental**: pantalla + ruta en `enrutador_app.dart` + método en `fuente_datos_board_directors` (`customDocumentsByType`, `policyContracts`) + provider en `proveedores_servicios.dart`. Filtros customerId 3/4 para concesiones.
3. **Detalle de categoría documental**: pantalla de detalle de la biblioteca.
4. **Dark mode**: aplicar a todas las pantallas existentes.

---

## 6. Recomendación de orden de Fase 2 (del prompt)

Auth → Home → Cobranza → Directorio → Minutas → Biblioteca/Póliza → Perfil.
Se sugiere además un **paso 0 de tema** (tokens light/dark + Figtree + monospace) previo a los módulos, para no retocar cada pantalla dos veces.

---

## 7. Riesgos / notas

- `get_it` está en pubspec pero no se usa; no introducirlo (mantener Riverpod).
- `flutter analyze` y `flutter test` deben correrse módulo a módulo en Fase 2.
- No tocar Angular (`client/angular/...`) ni backend.
- OneSignal ya integrado; no ampliar uso de push.
