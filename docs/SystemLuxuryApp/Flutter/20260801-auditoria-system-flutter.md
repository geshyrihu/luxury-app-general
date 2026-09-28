# Flutter Audit — LuxuryApp Committee Mobile

**Fecha:** 2026-08-28
**Alcance:** App Flutter existente en `client/flutter/commitee` (paquete `mobile_commite`).
**Propósito:** Inventario previo a la Fase 1 (Gap Analysis) y Fase 2 (implementación del diseño Stitch).

---

## 1. Stack técnico (NO modificar)

| Capa | Librería | Versión | Notas |
|------|----------|---------|-------|
| UI | Flutter SDK | ^3.5.0 | Material 3 (`useMaterial3: true`) |
| State mgmt | flutter_riverpod + riverpod_annotation | ^2.6.1 / ^2.3.5 | Providers manuales + `FutureProvider.autoDispose` por pantalla |
| Inyección / DI | get_it | ^8.0.3 | Declarado en pubspec pero **no se usa**; DI real vía Riverpod `Provider` |
| Red | dio + retrofit + json_annotation | ^5.7.0 / ^4.4.1 / ^4.9.0 | Cliente central en `core/red/cliente_dio.dart` |
| Sesión/seguridad | flutter_secure_storage, jwt_decoder | 9.2.2 / 2.0.1 | Tokens en secure storage |
| Navegación | go_router | ^14.6.3 | Rutas en `core/enrutador/enrutador_app.dart` |
| Serialización | freezed + json_serializable | 2.4.4 / 6.8.0 | Entidades en `dominio/entidades` |
| PDF | syncfusion_flutter_pdfviewer | ^27.1.51 | Visor en `pagina_visor_pdf.dart` |
| Push | onesignal_flutter | ^5.2.10 | `ServicioNotificaciones` (inicializado en `main.dart`) |
| Imagen | image_picker + flutter_image_compress | — | Perfil (cambio de foto) |
| UI util | cherry_toast | ^1.10.0 | Toasts |

**Arquitectura:** Clean (data / dominio / presentacion).
- `data/fuentes_datos/*` — Retrofit/Dio contra API .NET (`ConfiguracionApp.urlBase`).
- `data/repositorios/*` — `RepositorioAuth` (único repositorio formal).
- `dominio/entidades/*` — modelos `desdeJson`.
- `presentacion/paginas/*` — pantallas por módulo (auth, comite, inicio, perfil, visor).
- `presentacion/widgets/cajon_navegacion.dart` — `Drawer` global con selector de cliente.

---

## 2. Estructura de carpetas (lib/)

```
lib/
  app.dart                         # Widget raíz + ThemeData (hardcoded)
  main.dart                        # Bootstrap + OneSignal + splash
  core/
    config/configuracion_app.dart  # URL base, timeouts, claves secure storage
    enrutador/enrutador_app.dart   # GoRouter + redirect por sesión
    errores/fallo_app.dart
    proveedores/proveedores_servicios.dart  # TODOS los providers de pantalla
    red/ cliente_dio + interceptores (log, token)
    servicios/ auth, notificaciones, red, rol, utilidades, deep_link
  data/
    fuentes_datos/ auth, board_directors, cobranza, directorio, usuarios
    repositorios/ repositorio_auth
  dominio/
    entidades/ acceso_cliente, cobranza, directorio, documento_board_directors,
               minuta_detalle, perfil_usuario, poliza_seguro, usuario_autenticado
    repositorios/ i_repositorio_auth
  presentacion/
    paginas/ auth (login, recuperar, reset)
            comite (home, juntas, minutas_lista, minutas_detalle, cobranza,
                    directorio, informes_financieros, poliza_seguro, lista_documentos*)
            inicio (dashboard)
            perfil (perfil, editar_perfil)
            visor (visor_pdf)
    proveedores/ proveedor_sesion
    widgets/ cajon_navegacion
```

`* pagina_lista_documentos.dart` es un widget **genérico** reutilizado para Juntas e Informes; NO tiene ruta propia y NO cubre la Biblioteca documental.

---

## 3. Tema actual (CRÍTICO)

Definido en `app.dart::_temaPrincipal()`:
- `ColorScheme.fromSeed(seedColor: Color(0xFF0B3164))`.
- `Color(0xFF0B3164)` repetido hardcoded en **cada pantalla** (`static const _colorPrimario = Color(0xFF0B3164)`) y en `cajon_navegacion.dart`, `pagina_inicio.dart`, etc.
- Radios: cards/botones 8–12px (inconsistente; diseño pide 16 cards / 12–14 inputs-botones / 32 top sheets).
- **NO hay `ThemeData` dark.** El `backgroundColor` de pantallas usa `Colors.grey[50]`.
- **NO se usa la fuente Figtree** (fuente por defecto de Material).
- **Montos financieros en fuente normal**, no monospace.
- `ServicioUtilidades.formatearMoneda` siempre 2 decimales (regla: 0 decimales en cards, 2 en desglose).
- Colores semánticos (success/warning/danger/info) hardcodeados por pantalla (ej. `Colors.deepOrange`, `Colors.red`, `Colors.green`, `Colors.blue`).

➡️ Hallazgo central: **no existen tokens de tema ni soporte light/dark**. Toda la Fase 2 de tema es neta-new.

---

## 4. Servicios API y modelos existentes

| Módulo | Fuente de datos | Endpoint cubierto | Estado |
|--------|-----------------|-------------------|--------|
| Auth | `fuente_datos_auth` | Login, recuperar, confirmar reset | ✅ (flujo de recovery incompleto, ver qa-report) |
| BoardDirectors | `fuente_datos_board_directors` | juntas, minutas, detalle minuta, informes, póliza (buildingInsurance) | ✅ |
| Cobranza | `fuente_datos_cobranza` | morosos, detalle moroso | ✅ |
| Directorio | `fuente_datos_directorio` | byCustomer | ✅ |
| Usuarios | `fuente_datos_usuarios` | updateImage, changePassword | ✅ (usado en perfil) |
| **Biblioteca** | — | policyContracts, customDocumentsByType | ❌ **FALTANTE** |

Modelos en `dominio/entidades`: `cobranza.dart` (completo, incluye detalle/vencidos), `minuta_detalle.dart`, `directorio.dart`, `poliza_seguro.dart`, `documento_board_directors.dart`. Todos parecen alineados con los DTOs del backend.

---

## 5. Pantallas existentes (resumen)

Auth: Login, Recuperar (paso 1 identifier), Reset (con token). 
Comité: Home (grid módulos), Junta Mensual, Minutas (lista+detalle), Cobranza (+modal detalle), Directorio (+modal contacto), Informe Financiero, Póliza, Biblioteca (**no enrutada**).
Perfil: Perfil, Editar Perfil. Visor PDF. Dashboard (`/inicio`).

---

## 6. Hallazgos transversales (para Fase 2)

1. **Tema:** crear `ThemeData` light/dark con tokens (ver `design-handoff.md`); eliminar `Color(0xFF0B3164)` hardcoded → usar `Theme.of(context)` / extension de color.
2. **Dark mode:** ausente en 100% de pantallas. Requiere `ThemeMode` + tokens dark y validación 1:1.
3. **Fuentes:** añadir `figtree` (pubspec + `fontFamily`) y `RobotoMono`/monospace para montos.
4. **Moneda:** parametrizar decimales en `formatearMoneda` (0 en cards, 2 en desglose).
5. **Recovery:** falta pantalla de verificación de código (paso 2, countdown 120s).
6. **Biblioteca:** pantalla + ruta + servicio `customDocumentsByType`/`policyContracts` faltantes.
7. **Copy:** múltiples desviaciones de copy exacto (detalle en `qa-report.md`).

---

## 7. Comandos de calidad (Fase 2)

- `flutter analyze` (debe quedar limpio por módulo).
- Tests existentes: `flutter test` (la carpeta `test/` existe; verificar cobertura antes de tocar).
- Rama sugerida: `feature/committee-flutter-ui`; un commit por módulo.
