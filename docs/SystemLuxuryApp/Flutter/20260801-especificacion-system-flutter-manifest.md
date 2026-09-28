# Design Manifest — Stitch → Flutter

**Export Stitch:** `client/flutter/stitch_luxuryapp_committee_ui_prototype`
Cada carpeta trae `screen.png` + `code.html` (referencia visual; NO portar HTML).

Leyenda: ✅ implementado · ⚠️ implementado con desviaciones · ❌ FALTANTE · 🌙 falta variante dark.

---

## Auth

| Carpeta Stitch | Pantalla | Estado Flutter | Archivo |
|----------------|----------|----------------|---------|
| auth_01_login_mobile_default_dark | Login (dark) | ⚠️🌙 | `pagina_login.dart` (copy/estado wrong, no dark) |
| auth_02_login_mobile_error_light | Login error | ⚠️ | `pagina_login.dart` (`_tarjetaError`) |
| auth_03_recovery_code_step_1_identifier_dark | Recuperar (paso 1) | ⚠️🌙 | `pagina_recuperar_password.dart` (copy distinto) |
| auth_04_recovery_code_step_2_countdown_running_dark | **Verificar código (paso 2, countdown 120s)** | ❌ | — (no existe pantalla) |
| auth_06_reset_password_valid_dark | Reset válido | ⚠️🌙 | `pagina_reset_password.dart` |
| auth_07_reset_password_invalid_link_light | Reset enlace inválido | ⚠️ | `pagina_reset_password.dart` (`_pantallaEnlaceInvalido`) |
| recuperar_contraseña_paso_1 | Recuperar paso 1 (light) | ⚠️ | `pagina_recuperar_password.dart` |
| restablecer_contraseña | Reset | ⚠️ | `pagina_reset_password.dart` |
| login_mobile_1 / login_mobile_2 / login_dark_mode / login_dark_mode_refined_v2 | Login variants | ⚠️🌙 | `pagina_login.dart` |

## Home / Dashboard

| Carpeta Stitch | Pantalla | Estado | Archivo |
|----------------|----------|--------|---------|
| com_01_inicio_comit_default_dark / inicio_comit* | Módulo Comité (grid) | ⚠️🌙 | `pagina_home_comite.dart` |
| (dashboard) | Dashboard bienvenida | ⚠️🌙 | `pagina_inicio.dart` (`/inicio`) |

## Cobranza

| Carpeta Stitch | Pantalla | Estado | Archivo |
|----------------|----------|--------|---------|
| cobranza / cobranza_refined / cobranza_dark_mode / cobranza_dark_mode_refined_v2 / com_13_cobranza_data_dark | Lista cobranza | ⚠️🌙 | `pagina_cobranza.dart` |
| com_14_cobranza_empty_light | Cobranza vacío | ⚠️ | `pagina_cobranza.dart` (copy distinto) |
| com_15_detalle_de_deuda_cobranza_judicial_dark_1/2 / com_16 (morosos) / com_17 (corriente) / detalle_de_deuda* | Modal detalle deuda | ⚠️🌙 | `pagina_cobranza.dart` (`mostrarDetalleMoroso`) — 3 cajas de criterio, regla pide 1 |
| com_18_detalle_de_deuda_loading_light | Detalle loading | ⚠️ | `pagina_cobranza.dart` ("Cargando desglose..." falta) |
| com_19_detalle_de_deuda_error_light | Detalle error | ⚠️ | `pagina_cobranza.dart` (copy distinto) |

## Directorio

| Carpeta Stitch | Pantalla | Estado | Archivo |
|----------------|----------|--------|---------|
| directorio / directorio_dark_mode / com_20_directorio_personal_dark / com_21_directorio_casetas_light | Directorio (Personal/Casetas) | ⚠️🌙 | `pagina_directorio.dart` |
| directorio_with_empty_states | Vacíos | ⚠️ | `pagina_directorio.dart` (copy distinto) |
| detalle_de_contacto / detalle_de_contacto_refined_v2 / com_23_detalle_de_contacto_default_dark | Detalle contacto | ⚠️🌙 | `pagina_directorio.dart` (`_DetalleContacto`) |

## Minutas

| Carpeta Stitch | Pantalla | Estado | Archivo |
|----------------|----------|--------|---------|
| minutas / minutas_dark_mode* / com_04_minutas_data_dark | Lista minutas | ⚠️🌙 | `pagina_minutas_lista.dart` |
| com_05_minuta_detalle_data_4_sections_dark / detalle_de_minuta* | Detalle minuta (4 secciones) | ⚠️🌙 | `pagina_minutas_detalle.dart` |
| detalle_de_minuta_with_error_state | Detalle error | ⚠️ | `pagina_minutas_detalle.dart` (copy "No se pudo cargar la información de la minuta." falta) |

## Juntas / Informes / Póliza

| Carpeta Stitch | Pantalla | Estado | Archivo |
|----------------|----------|--------|---------|
| junta_mensual / junta_mensual_with_empty_state | Junta mensual | ⚠️🌙 | `pagina_juntas_mensuales.dart` |
| informe_financiero | Informe financiero | ⚠️🌙 | `pagina_informes_financieros.dart` |
| póliza_del_edificio / póliza_del_edificio_refined_v2 / com_12_póliza_del_edificio_empty_light | Póliza | ⚠️🌙 | `pagina_poliza_seguro.dart` |

## Biblioteca / Póliza documental

| Carpeta Stitch | Pantalla | Estado | Archivo |
|----------------|----------|--------|---------|
| biblioteca_documental / com_10_biblioteca_detalle_empty_light_1/2 | **Biblioteca documental** | ❌ | — (no hay pantalla ni ruta) |
| detalle_de_categoría_documental | **Detalle categoría** | ❌ | — |

## Perfil / Visor

| Carpeta Stitch | Pantalla | Estado | Archivo |
|----------------|----------|--------|---------|
| perfil / perfil_dark_mode* / com_24_perfil_default_dark | Perfil | ⚠️🌙 | `pagina_perfil.dart` |
| (editar) | Editar perfil / foto / cambio password | ⚠️🌙 | `pagina_editar_perfil.dart` |
| visor_pdf / com_25_visor_pdf_dark | Visor PDF | ⚠️🌙 | `pagina_visor_pdf.dart` |

## Sistemas de tema (referencia de tokens)

| Carpeta Stitch | Significado | Estado |
|----------------|-------------|--------|
| institutional_elegance | Light design system (tokens) | ❌ (no aplicado) |
| nocturnal_institutional | Dark design system (tokens) | ❌ (no aplicado) |

---

## Resumen de FALTANTES

1. **Verificar código** (recovery paso 2, countdown 120s) — pantalla + flujo.
2. **Biblioteca documental** (`customDocumentsByType` / `policyContracts`) — pantalla + ruta + servicio.
3. **Detalle de categoría documental** — pantalla.
4. **Dark mode** en 100% de pantallas (tokens `nocturnal_institutional`).
5. **Tokens light** aplicados vía `ThemeData` (hoy todo hardcoded `0xFF0B3164`).
