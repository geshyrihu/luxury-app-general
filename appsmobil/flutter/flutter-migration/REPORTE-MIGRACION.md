# Reporte de Migración: Angular → Flutter (Web + iOS + Android)

**Proyecto:** LuxuryApp  
**Origen:** Angular 22.2.9 (Standalone Components + Ionic 8 + Capacitor 8)  
**Destino:** Flutter 4.x (Dart)  
**Fecha:** 2026-06-27  
**Versión:** 1.0

---

## Índice

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Stack Tecnológico Propuesto](#2-stack-tecnológico-propuesto)
3. [Fases de Migración](#3-fases-de-migración)
4. [Mapeo Angular → Flutter](#4-mapeo-angular--flutter)
5. [Arquitectura de Navegación](#5-arquitectura-de-navegación)
6. [Autenticación y Autorización](#6-autenticación-y-autorización)
7. [Sistema de Estilos y Tema](#7-sistema-de-estilos-y-tema)
8. [Estado Global y Reactividad](#8-estado-global-y-reactividad)
9. [Capa de API y Servicios](#9-capa-de-api-y-servicios)
10. [Estrategia Mobile (iOS/Android)](#10-estrategia-mobile-iosandroid)
11. [Web con Flutter](#11-web-con-flutter)
12. [Componentes por Módulo de Negocio](#12-componentes-por-módulo-de-negocio)
13. [Estrategia de Pruebas](#13-estrategia-de-pruebas)
14. [PWA y Offline](#14-pwa-y-offline)
15. [Internacionalización (i18n)](#15-internacionalización-i18n)
16. [Consideraciones de Rendimiento](#16-consideraciones-de-rendimiento)
17. [Riesgos y Mitigaciones](#17-riesgos-y-mitigaciones)
18. [Estimación de Esfuerzo](#18-estimación-de-esfuerzo)
19. [Recomendaciones Finales](#19-recomendaciones-finales)

---

## 1. Resumen Ejecutivo

### 1.1 Proyecto actual en cifras (vs Flutter)

| Métrica | Angular Actual | Flutter Destino |
|---------|---------------|-----------------|
| Framework | Angular 22.2.9 | Flutter 4.x |
| Lenguaje | TypeScript | Dart 3.x |
| Componentes | ~480 standalone | ~480 widgets |
| Servicios | ~70 en core/services | ~70 servicios Dart |
| UI Library | PrimeNG 22 + PrimeFlex 4 | Flutter Material + paquetes propios |
| Mobile | Ionic 8 (WebView) | Nativo (Skia/Impeller) |
| Híbrido | Capacitor 8 | Flutter Web + Mobile (mismo código) |
| Estado | Angular Signals | Riverpod / BLoC |
| Tiempo real | SignalR 10 | signalr_netrcore + web_socket_channel |
| Build | Vite (web) + Gradle (Android) | Dart compile + Gradle/Xcode |
| Testing | Vitest + Jasmine | flutter_test + integration_test |
| PWA | @angular/service-worker | Flutter Web (no necesita PWA) |
| Layout | CSS/PrimeFlex (flexbox) | Widget tree (Row, Column, Flex) |

### 1.2 Diferencias fundamentales Angular → Flutter

| Concepto | Impacto |
|----------|---------|
| **Lenguaje**: TypeScript → Dart | Migración manual total de lógica. Dart es más estricto (null safety, tipos). |
| **UI declarativa**: HTML templates → Widget tree | No hay HTML, CSS ni JSX. Todo es código Dart en árbol de widgets. |
| **Layout**: CSS (flexbox/grid) → Widgets composicionales | No hay CSS. `Row`, `Column`, `Stack`, `Flex` reemplazan flexbox. |
| **Responsive**: Media queries CSS → LayoutBuilder/OrientationBuilder | Misma capacidad, distinta implementación. |
| **UI Library**: PrimeNG → Flutter packages | No hay PrimeNG/PrimeReact para Flutter. Usar paquetes como `syncfusion_flutter_datagrid`, `flutter_datatable`, o widgets custom. |
| **Navegación**: React Router → GoRouter/ Navigator 2.0 | Declarativa con GoRouter, similar a React Router. |
| **Web**: PWA Angular → Flutter Web | Flutter Web compila a Canvas/DOM. No es PWA tradicional. |
| **Mobile**: Ionic (WebView) → Nativo Flutter | Flutter pinta todo con Skia. Sin WebView. |
| **Rendimiento**: ~500KB JS bundle → ~5MB+ Dart binary | Flutter produce binarios más grandes. |
| **SEO**: Angular SSR → Flutter Web (sin SSR nativo) | Flutter Web no tiene SSR. Para SEO usar `flutter_html` + server-side rendering separado. |

### 1.3 Principales desafíos de migración

1. **Dart vs TypeScript**: Migrar ~480 archivos TS a Dart. Dart tiene null safety, `sealed class`, `extension methods`, sin `any`/`unknown`.
2. **Widget tree vs HTML**: Reemplazar todo template HTML + CSS por widgets Dart. El cambio más grande.
3. **PrimeNG → equivalente Flutter**: No existe PrimeNG/PrimeReact para Flutter. Usar `syncfusion_flutter_datagrid` para tablas, `flutter_form_builder` para formularios, o construir widgets custom.
4. **Ionic → Flutter nativo**: Ionic (WebView con componentes nativos) → Flutter (todo nativo). Cambio radical en la experiencia mobile.
5. **Design System SCSS → Flutter Theme**: Migrar 500+ líneas de variables CSS a `ThemeData` + `ThemeExtension`.
6. **SignalR → signalr_netrcore**: El paquete `signalr_core` para Dart funciona, pero con limitaciones vs JS.
7. **~480 widgets**: Esfuerzo de migración muy significativo, cada widget requiere reescritura completa.

---

## 2. Stack Tecnológico Propuesto

### 2.1 Core

| Capa | Tecnología | Versión | Justificación |
|------|-----------|---------|---------------|
| Framework | Flutter | 4.x | Estable, maduro, multiplataforma |
| Lenguaje | Dart | 3.x | Null safety, pattern matching, records |
| Build | flutter build | - | Compilación nativa para cada plataforma |
| Navegación | GoRouter | 15.x | Declarativa, deep links, redirects |
| Estado global | Riverpod | 3.x | Seguro, testable, sin boilerplate |
| Estado servidor | Riverpod + dio | - | Queries + mutations |
| Inyección | Riverpod providers | - | Reemplaza DI de Angular |

### 2.2 UI y Componentes

| Capa | Tecnología | Reemplaza a |
|------|-----------|-------------|
| Tablas | Syncfusion DataGrid / DataTable2 | p-table |
| Formularios | flutter_form_builder + reactive_forms | ReactiveForms |
| Calendario | table_calendar / syncfusion_datepicker | flatpickr + fullcalendar |
| Gráficas | fl_chart | ng2-charts + ngx-charts |
| Mapas | flutter_map (Leaflet) | @bluehalo/ngx-leaflet |
| Editor texto | flutter_quill | @kolkov/angular-editor |
| PDF | syncfusion_flutter_pdfviewer | ng2-pdf-viewer |
| Excel | excel (Dart) | exceljs + xlsx |
| Drag & Drop | flutter_draggable | ngx-drag-drop |
| QR | qr_flutter | qrcode |
| Fechas | intl + flutter_date_range_picker | date-fns + flatpickr |
| Notificaciones | flutter_local_notifications | ngx-toastr |
| Alertas | flutter_slidable + custom | sweetalert2 |
| Filtros tabla | propios + DataTable2 | p-table filters |
| Iconos | flutter_iconly + iconify_flutter | iconify-icon + feather |
| Splash | flutter_native_splash | - |
| Pull to refresh | RefreshIndicator nativo | - |
| QR Scanner | mobile_scanner | Capacitor Barcode Scanner |
| Cámara | image_picker | Capacitor Camera |
| Offline | hive + drift (SQLite) | localforage |

### 2.3 Estado y Data Flow

| Capa | Tecnología | Reemplaza a |
|------|-----------|-------------|
| Estado global | Riverpod (Notifier + AsyncNotifier) | Angular Signals |
| Estado servidor | Riverpod `FutureProvider`/`AsyncNotifier` | TanStack Query / API calls |
| Estado formularios | flutter_form_builder + reactive_forms | ReactiveForms |
| Tiempo real | signalr_netrcore + web_socket_channel | @microsoft/signalr |
| Cache local | drift (SQLite) + hive | localforage |

### 2.4 Auth y Seguridad

| Capa | Tecnología | Reemplaza a |
|------|-----------|-------------|
| JWT | dart_jsonwebtoken + jwt_decoder | jwt-decode |
| Firebase Auth | firebase_auth + firebase_core | @angular/fire |
| Firebase | firebase_core, cloud_firestore, etc. | @angular/fire |
| OneSignal | onesignal_flutter | OneSignal SDK web |

### 2.5 Testing

| Capa | Tecnología |
|------|-----------|
| Unit tests | flutter_test + mocktail |
| Widget tests | flutter_test |
| Integration tests | integration_test |
| E2E | patrol (reemplaza Detox) |
| Visual | alchemist + golden tests |

---

## 3. Fases de Migración

### Fase 0: Setup y Fundación (Semanas 1-3)

```
luxuryapp-api/client/flutter-migration/
├── pubspec.yaml
├── analysis_options.yaml
├── lib/
│   ├── main.dart
│   ├── app.dart
│   ├── router/
│   │   ├── app_router.dart
│   │   └── guards/
│   ├── core/
│   │   ├── theme/
│   │   ├── widgets/         (Design System)
│   │   ├── services/
│   │   ├── providers/       (Riverpod)
│   │   ├── models/          (DTOs, enums)
│   │   ├── utils/
│   │   └── constants/
│   ├── features/            (8 módulos)
│   ├── layouts/
│   └── auth/
├── assets/
│   ├── i18n/
│   ├── images/
│   ├── fonts/
│   └── svg/
├── web/
├── android/
├── ios/
├── test/
└── integration_test/
```

**Actividades:**
1. `flutter create --org com.luxury --platforms web,android,ios luxury_app`
2. Configurar Dart null safety, lints estrictos
3. Configurar GoRouter con lazy loading + redirects
4. Configurar Riverpod + dio
5. Configurar tema Flutter con Design System
6. Configurar Firebase + OneSignal
7. Configurar SignalR
8. Configurar CI/CD (Codemagic / GitHub Actions)

### Fase 1: Core Widgets (Semanas 3-6)

**Objetivo:** Construir los ~95 widgets del Design System en Flutter.

**Widgets críticos (equivalente core/components):**

| Angular Component | Flutter Widget |
|-------------------|----------------|
| `app-table` | `AppDataTable` (wrapper Syncfusion/Snippet) |
| `empty-state` | `EmptyStateWidget` |
| `status-badge` | `StatusBadge` (custom Chip) |
| `app-icon` | `AppIcon` (Iconify wrapper) |
| `confirm-dialog` | `ConfirmDialog` (AlertDialog wrapper) |
| `action-menu` | `PopupMenuButton` / `AppActionMenu` |
| `data-view-mobile` | `ListView.builder` wrapper |
| `buttons` (15 vars) | `AppButton` (ElevatedButton/OutlinedButton wrapper) |
| `primeng-custom-caption` | `TableCaption` widget |
| `primeng-custom-table-footer` | `TableFooter` widget |
| `primeng-custom-toast` | `AppToast` (SnackBar/overlay wrapper) |
| `status-badge` | `StatusBadge` (colored chip con icono) |
| `app-icon` | `AppIcon` (Iconify para Flutter) |

### Fase 2: Servicios y Estado Global (Semanas 5-8)

| Angular Service | Flutter Riverpod Provider |
|----------------|--------------------------|
| `auth.service` | `authProvider` (AsyncNotifier) |
| `customer-id.service` | `customerProvider` |
| `asp-role.service` | `roleProvider` |
| `layout.service` | `layoutProvider` |
| `connectivity.service` | `connectivityProvider` |
| `signalr.service` | `signalRProvider` |
| `one-signal.service` | `oneSignalProvider` |
| `sync-queue.service` | `syncQueueProvider` |
| `api-response.service` | `apiClientProvider` + `dio` |
| `menu.service` | `menuProvider` |
| `theme.service` | `themeProvider` |

### Fase 3: Layouts y Navegación (Semanas 6-9)

| Angular | Flutter |
|---------|---------|
| `LayoutEmployee` | `EmployeeShell` (Scaffold + NavigationRail/BottomNav) |
| `LayoutCommittee` | `CommitteeShell` |
| `LayoutDireccion` | `DireccionShell` |
| `authGuard` | GoRouter `redirect` |
| `employeeGuard` | GoRouter redirect con role check |
| `committeeGuard` | GoRouter redirect |
| `direccionGuard` | GoRouter redirect |
| `roleRedirectGuard` | `$shell` routing |

### Fase 4: Features — Prioridad 1 (Semanas 8-18)

| Módulo | Componentes | Semanas |
|--------|-------------|---------|
| **Operations** | 102 | 8-13 |
| **Accounting** | 28 | 10-13 |
| **Purchasing** | 50 | 13-16 |
| **HR** | 49 | 14-17 |

### Fase 5: Features — Prioridad 2 (Semanas 16-22)

| Módulo | Componentes | Semanas |
|--------|-------------|---------|
| **System** | 42 | 16-19 |
| **Maintenance** | 31 | 18-20 |
| **Legal** | 9 | 20-21 |
| **Recruitment** | 8 | 20-21 |

### Fase 6: Auth y Shared (Semanas 18-22)

1. Login web + mobile widgets
2. Recovery/reset password
3. ai-chat-widget + image-analysis-dialog
4. Migrar pipes → extension methods + formatters
5. Páginas extra (404, 500, offline, unauthorized)

### Fase 7: Testing, QA y Web (Semanas 22-26)

1. Widget tests para core widgets
2. Unit tests para providers/servicios
3. Golden tests para regresión visual
4. Integration tests (patrol)
5. Pruebas en Web (Flutter Web)
6. Pruebas Android + iOS
7. Auditoría de rendimiento (DevTools)

### Fase 8: Despliegue (Semanas 26-28)

1. Google Play Store
2. Apple App Store
3. Flutter Web (hosting alternativo o junto al Angular)
4. Documentación + handover

---

## 4. Mapeo Angular → Flutter

### 4.1 Conceptos fundamentales

| Angular | Flutter/Dart |
|---------|-------------|
| `@Component({template, styles})` | `class MyWidget extends StatelessWidget/StatefulWidget` + `build()` |
| HTML Template | Widget tree (`build()` method) |
| CSS (`.class { property: value }`) | Widget properties + `Theme` |
| `@Input()` / `@Output()` | Constructor parameters / callback properties |
| `@Injectable()` service | Riverpod provider / service class |
| `providedIn: "root"` | Riverpod `ProviderScope` (global) |
| `@Pipe()` | Dart extension methods |
| `@Directive()` | Custom widgets / `StatelessWidget` |
| `CanActivateFn` guard | GoRouter `redirect` callback |
| `HttpInterceptorFn` | Dio interceptor |
| `signal<T>()` | `StateProvider<T>` / `Notifier` |
| `computed()` | `Provider` / `ref.watch().select()` |
| `effect()` | `ref.listen()` |
| `*ngIf` / `@if` | `if (condition) Widget(...)` in build |
| `*ngFor` / `@for` | `ListView.builder()` / `Column(children: list.map(...))` |
| `[innerHTML]` | `flutter_html` / `HtmlWidget` |
| `(click)`, `(change)` | `onPressed`, `onChanged`, `onTap` |
| `| async` pipe | `ref.watch(streamProvider)` |
| `@ViewChild()` | `GlobalKey` |
| `<ng-content>` / `<ng-template>` | `child` / `children` properties |
| `lazy load (loadComponent)` | `await Future.delayed` / GoRouter lazy pages |
| `@angular/service-worker` | Flutter Web (no requiere) |
| `RouterModule.forChild()` | GoRouter `GoRoute` nesting |
| ReactiveForms | `flutter_form_builder` / `reactive_forms` |
| PrimeNG | Syncfusion / widgets custom |
| Ionic | Flutter Material (nativo) |

### 4.2 Mapeo PrimeNG → Flutter

| PrimeNG | Flutter Package | Notas |
|---------|----------------|-------|
| `p-table` | `syncfusion_flutter_datagrid` / `DataTable2` | SfDataGrid es el más completo |
| `p-button` | `ElevatedButton` / `OutlinedButton` / `TextButton` | Nativos de Material |
| `p-dialog` | `AlertDialog` / `showDialog()` | Nativos |
| `p-inputText` | `TextField` | Nativo |
| `p-dropdown` | `DropdownButtonFormField` / `flutter_typeahead` | Nativo + autocomplete |
| `p-multiSelect` | `MultiSelectChip` / `MultiSelectDialog` | Custom o `flutter_multi_select` |
| `p-calendar` | `showDatePicker` / `syncfusion_datepicker` | Nativo + Syncfusion |
| `p-card` | `Card` (Material) | Nativo |
| `p-tag` | `Chip` / `InputChip` | Nativo + custom styling |
| `p-badge` | `Badge` widget / `CircleAvatar` | Nativo |
| `p-toast` | `SnackBar` / `fluttertoast` / overlay | Nativo |
| `p-confirmDialog` | `showDialog` + `AlertDialog` | Nativo |
| `p-progressSpinner` | `CircularProgressIndicator` | Nativo |
| `p-message` | `SnackBar` / `InlineAlert` widget | Nativo |
| `p-tabView` | `TabBar` + `TabBarView` | Nativo |
| `p-accordion` | `ExpansionTile` / `ExpansionPanelList` | Nativo |
| `p-fieldset` | `ExpansionTile` o custom | Custom |
| `p-toolbar` | `AppBar` / `BottomAppBar` / custom | Nativo |
| `p-menu` | `Drawer` / `NavigationRail` / `NavigationBar` | Nativo |
| `p-tooltip` | `Tooltip` | Nativo |
| `p-avatar` | `CircleAvatar` / custom | Nativo |
| `p-fileUpload` | `file_picker` / `image_picker` | Paquete |
| `p-chart` | `fl_chart` | No Syncfusion para charts |
| `p-popover` | `PopupMenuButton` / `showMenu` | Nativo |
| `p-inputNumber` | `TextField` + `inputFormatters: [FilteringTextInputFormatter.digitsOnly]` | Nativo |
| `p-inputMask` | `mask_text_input_formatter` | Paquete |
| `p-inputTextarea` | `TextField(maxLines: 4)` | Nativo |
| `p-password` | `TextField(obscureText: true)` | Nativo |
| `p-checkbox` | `Checkbox` / `CheckboxListTile` | Nativo |
| `p-radioButton` | `Radio` / `RadioListTile` | Nativo |
| `p-toggleButton` | `ToggleButtons` | Nativo |
| `p-selectButton` | `SegmentedButton` / `ToggleButtons` | Nativo |
| `p-slider` | `Slider` | Nativo |
| `p-rating` | `RatingBar` (paquete) | No nativo |
| `p-colorPicker` | `flutter_colorpicker` | Paquete |
| `p-knob` | Custom | Custom |
| `p-paginator` | `DataTable` paginator / custom | DataTable.sor |
| `p-skeleton` | `shimmer` | Paquete |
| `p-progressBar` | `LinearProgressIndicator` | Nativo |
| `p-timeline` | `TimelineTile` (paquete) / custom | Paquete `timeline_tile` |
| `p-tree` | `flutter_treeview` / `TreeView` | Paquete |
| `p-treetable` | Syncfusion TreeGrid | Syncfusion |
| `p-image` | `Image.network` / `Image.file` | Nativo |
| `p-sidebar` | `Drawer` / `showModalBottomSheet` | Nativo |
| `p-steps` | `Stepper` / custom | Nativo `Stepper` |
| `p-breadcrumb` | Custom con `List<Widget>` | Custom |
| `p-contextMenu` | `showMenu` / `GesturDetector(onSecondaryTap)` | Nativo |
| `p-scrollTop` | `ScrollController` + FAB | Custom |
| `p-virtualScroller` | `ListView.builder(itemCount: large)` | Nativo, virtualizado |
| `p-autocomplete` | `Autocomplete` / `flutter_typeahead` | Nativo Material 3 / paquete |
| `p-listbox` | `ListView` / `ListTile` | Nativo |
| `p-emptymessage` | `EmptyStateWidget` (custom) | Custom |
| `p-customcaption` | `TableCaption` (custom) | Custom |
| `p-customtablefooter` | `TableFooter` (custom) | Custom |
| `p-dock` | Custom | Custom |
| `p-galleria` | `PageView` + indicators | Nativo |
| `p-speedDial` | `SpeedDial` (paquete) / FAB menu | Paquete `speed_dial` |
| `p-megaMenu` | Custom | Custom |

### 4.3 Mapeo de enums

```dart
// Angular (TypeScript)
export enum EApplicationRole {
  SuperUsuario = 'SuperUsuario',
  Direccion = 'Direccion',
  Legal = 'Legal',
  // ...38 roles
}

// Flutter (Dart)
enum EApplicationRole {
  superUsuario('SuperUsuario'),
  direccion('Direccion'),
  legal('Legal'),
  // ...

  final String value;
  const EApplicationRole(this.value);

  static EApplicationRole fromString(String value) {
    return EApplicationRole.values.firstWhere((e) => e.value == value);
  }
}
```

### 4.4 Mapeo de pipes → extension methods

```dart
// Angular @Pipe
@Pipe({ name: 'capitalizado' })
export class CapitalizadoPipe implements PipeTransform {
  transform(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
}

// Flutter extension method
extension StringExtension on String {
  String get capitalizado {
    if (isEmpty) return this;
    return '${this[0].toUpperCase()}${substring(1).toLowerCase()}';
  }
}

// Uso: name.capitalizado
```

### 4.5 Mapeo de servicios Angular → Dart/Flutter

```dart
// Angular AuthService (@Injectable)
@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSession = new BehaviorSubject<UserTokenDTO | null>(null);
  isAuthenticated$ = this.currentUserSession.pipe(map(u => u !== null));
  userToken$ = this.currentUserSession.asObservable();

  async login(credentials: AuthLoginDTO) { ... }
  async logout() { ... }
  async refreshToken() { ... }
}

// Flutter AuthService (Riverpod)
class AuthService {
  final Dio _dio;

  AuthService(this._dio);

  Future<UserTokenDTO> login(AuthLoginDTO credentials) async {
    final response = await _dio.post('/Auth/Login', data: credentials.toJson());
    return UserTokenDTO.fromJson(response.data);
  }

  Future<void> logout() async {
    await _dio.post('/Auth/Logout');
  }

  Future<UserTokenDTO?> refreshToken() async {
    try {
      final response = await Dio().post('/Auth/Refresh');
      return UserTokenDTO.fromJson(response.data);
    } catch (_) {
      return null;
    }
  }
}

// Riverpod provider
final authServiceProvider = Provider<AuthService>((ref) {
  return AuthService(ref.read(dioProvider));
});

final authStateProvider = AsyncNotifierProvider<AuthNotifier, UserTokenDTO?>(AuthNotifier.new);

class AuthNotifier extends AsyncNotifier<UserTokenDTO?> {
  @override
  Future<UserTokenDTO?> build() async {
    // trySilentLogin
    try {
      return await ref.read(authServiceProvider).refreshToken();
    } catch (_) {
      return null;
    }
  }

  Future<void> login(AuthLoginDTO credentials) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() => ref.read(authServiceProvider).login(credentials));
  }

  Future<void> logout() async {
    await ref.read(authServiceProvider).logout();
    state = const AsyncValue.data(null);
  }
}
```

---

## 5. Arquitectura de Navegación

### 5.1 GoRouter

```dart
// lib/router/app_router.dart
import 'package:go_router/go_router.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authStateProvider);

  return GoRouter(
    initialLocation: '/',
    debugLogDiagnostics: true,

    redirect: (context, state) {
      final isAuthenticated = authState.valueOrNull != null;
      final isAuthRoute = state.matchedLocation.startsWith('/auth');
      final isPublicRoute = state.matchedLocation.startsWith('/publico');

      // No autenticado → login
      if (!isAuthenticated && !isAuthRoute && !isPublicRoute) {
        return '/auth/login';
      }
      // Autenticado en login → redirect según rol
      if (isAuthenticated && isAuthRoute) {
        return _redirectByRole(authState.valueOrNull);
      }
      return null;
    },

    routes: [
      // Auth routes
      GoRoute(path: '/auth', ...
        routes: [
          GoRoute(path: 'login', builder: (_, __) => const LoginPage()),
          GoRoute(path: 'recovery', builder: (_, __) => const RecoverPasswordPage()),
          GoRoute(path: 'reset', builder: (_, __) => const ResetPasswordPage()),
        ],
      ),

      // Public
      GoRoute(path: '/publico', ...),

      // Offline / Unauthorized / 404
      GoRoute(path: '/offline', builder: (_, __) => const OfflinePage()),
      GoRoute(path: '/unauthorized', builder: (_, __) => const UnauthorizedPage()),
      GoRoute(path: '/page404', builder: (_, __) => const Page404()),

      // Committee Shell
      ShellRoute(
        builder: (_, __, child) => CommitteeShell(child: child),
        routes: [
          GoRoute(path: '/committee', ...),
        ],
      ),

      // Direccion Shell
      ShellRoute(
        builder: (_, __, child) => DireccionShell(child: child),
        routes: [
          GoRoute(path: '/direccion', ...),
        ],
      ),

      // Employee Shell (default)
      ShellRoute(
        builder: (_, __, child) => EmployeeShell(child: child),
        routes: [
          GoRoute(path: '/', redirect: (_, __) => '/dashboard'),
          GoRoute(path: '/dashboard', builder: (_, __) => const DashboardPage()),
          GoRoute(path: '/accounting', ...),
          GoRoute(path: '/operations', ...),
          GoRoute(path: '/purchasing', ...),
          // ... resto de features
        ],
      ),
    ],
  );
});

String _redirectByRole(UserTokenDTO? user) {
  final roles = user?.roles ?? [];
  if (roles.contains(EApplicationRole.comite.value)) return '/committee';
  if (roles.contains(EApplicationRole.direccion.value)) return '/direccion';
  return '/dashboard';
}
```

### 5.2 Guard por rol

```dart
// Verificación en el redirect global
String? _checkRoleAccess(String location, List<String> roles) {
  final committeesRoutes = ['/committee'];
  final direccionRoutes = ['/direccion'];

  if (committeesRoutes.any((r) => location.startsWith(r)) &&
      !roles.contains(EApplicationRole.comite.value)) {
    return '/unauthorized';
  }
  if (direccionRoutes.any((r) => location.startsWith(r)) &&
      !roles.contains(EApplicationRole.direccion.value)) {
    return '/unauthorized';
  }
  return null;
}
```

### 5.3 Lazy loading con GoRouter

```dart
// Cada módulo exporta sus rutas como una lista de GoRoute
GoRoute(
  path: '/purchasing',
  builder: (_, __) => const PurchasingShell(),
  routes: [
    GoRoute(
      path: 'requests',
      builder: (_, __) => const PurchaseRequestListPage(),
      routes: [
        GoRoute(
          path: ':id',
          builder: (_, state) =>
              PurchaseRequestDetailPage(id: state.pathParameters['id']!),
        ),
        GoRoute(
          path: ':id/edit',
          builder: (_, state) =>
              PurchaseRequestFormPage(id: state.pathParameters['id']),
        ),
      ],
    ),
    GoRoute(
      path: 'orders',
      builder: (_, __) => const PurchaseOrderListPage(),
    ),
    GoRoute(
      path: 'providers',
      builder: (_, __) => const ProviderListPage(),
    ),
  ],
),
```

---

## 6. Autenticación y Autorización

### 6.1 Auth Notifier (Riverpod)

```dart
// lib/core/providers/auth_provider.dart

final authServiceProvider = Provider<AuthService>((ref) {
  return AuthService(ref.read(dioProvider));
});

// Estado de autenticación
class AuthState {
  final UserTokenDTO? user;
  final bool isLoading;
  final String? error;

  const AuthState({this.user, this.isLoading = false, this.error});

  bool get isAuthenticated => user != null;

  AuthState copyWith({UserTokenDTO? user, bool? isLoading, String? error}) {
    return AuthState(
      user: user ?? this.user,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  final AuthService _authService;
  final CustomerService _customerService;

  AuthNotifier(this._authService, this._customerService) : super(const AuthState());

  Future<void> initialize() async {
    // trySilentLogin
    state = state.copyWith(isLoading: true);
    try {
      final user = await _authService.refreshToken();
      if (user != null) {
        state = AuthState(user: user);
        await _customerService.initializeFromToken(user);
      } else {
        state = const AuthState();
      }
    } catch (_) {
      state = const AuthState();
    }
  }

  Future<void> login(AuthLoginDTO credentials) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final user = await _authService.login(credentials);
      state = AuthState(user: user);
      await _customerService.initializeFromToken(user);
      // Iniciar SignalR
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
      rethrow;
    }
  }

  Future<void> logout() async {
    await _authService.logout();
    _customerService.clear();
    state = const AuthState();
  }

  bool hasRole(EApplicationRole role) {
    return state.user?.roles?.contains(role.value) ?? false;
  }

  bool hasAnyRole(List<EApplicationRole> roles) {
    return roles.any((r) => hasRole(r));
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(
    ref.read(authServiceProvider),
    ref.read(customerServiceProvider),
  );
});

// Providers derivados
final isAuthenticatedProvider = Provider<bool>((ref) {
  return ref.watch(authProvider).isAuthenticated;
});

final currentUserProvider = Provider<UserTokenDTO?>((ref) {
  return ref.watch(authProvider).user;
});

final roleProvider = Provider.family<bool, EApplicationRole>((ref, role) {
  return ref.watch(authProvider).hasRole(role);
});
```

### 6.2 Dio Interceptor (JWT + Offline)

```dart
// lib/core/http/dio_client.dart

final dioProvider = Provider<Dio>((ref) {
  final dio = Dio(BaseOptions(
    baseUrl: environment.apiBaseUrl,
    connectTimeout: const Duration(seconds: 30),
    receiveTimeout: const Duration(seconds: 30),
    headers: {'Content-Type': 'application/json'},
  ));

  dio.interceptors.add(JwtInterceptor(ref));
  dio.interceptors.add(OfflineInterceptor(ref));

  return dio;
});

class JwtInterceptor extends Interceptor {
  final Ref _ref;

  JwtInterceptor(this._ref);

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    final user = _ref.read(authProvider).user;
    if (user?.token != null) {
      options.headers['Authorization'] = 'Bearer ${user!.token}';
    }
    final customerId = _ref.read(customerProvider).id;
    if (customerId != null) {
      options.headers['X-Customer-Id'] = customerId;
    }
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    if (err.response?.statusCode == 401) {
      try {
        final authNotifier = _ref.read(authProvider.notifier);
        await authNotifier.initialize(); // Refresh token
        // Retry original request
        final user = _ref.read(authProvider).user;
        err.requestOptions.headers['Authorization'] = 'Bearer ${user!.token}';
        final response = await Dio().fetch(err.requestOptions);
        handler.resolve(response);
        return;
      } catch (_) {}
    }
    handler.next(err);
  }
}

class OfflineInterceptor extends Interceptor {
  final Ref _ref;

  OfflineInterceptor(this._ref);

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    final isOnline = _ref.read(connectivityProvider);
    final isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].contains(options.method);

    if (!isOnline && isMutation) {
      // Encolar para sincronización
      _ref.read(syncQueueProvider.notifier).enqueue(SyncQueueItem(
        method: options.method,
        url: options.path,
        data: options.data,
        timestamp: DateTime.now().millisecondsSinceEpoch,
      ));
      // No lanzar error, mockear éxito
      handler.resolve(Response(
        requestOptions: options,
        statusCode: 200,
        data: {'__offline': true},
      ));
      return;
    }
    handler.next(options);
  }
}
```

### 6.3 Firebase Auth

```dart
// lib/core/services/firebase_service.dart
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';

class FirebaseService {
  Future<void> initialize() async {
    await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );
  }

  Future<UserCredential> signInWithGoogle() async {
    final googleProvider = GoogleAuthProvider();
    return await FirebaseAuth.instance.signInWithPopup(googleProvider);
  }

  Future<void> signOut() async {
    await FirebaseAuth.instance.signOut();
  }
}
```

---

## 7. Sistema de Estilos y Tema

### 7.1 Estrategia

En Flutter no hay CSS. El Design System SCSS actual se migra a:

1. **`ThemeData`**: Configuración Material global (colores, tipografía, formas)
2. **`ThemeExtension`**: Extensiones para colores DS propietarios (`--ds-*`, `--primary-*`)
3. **Widgets personalizados**: Cada componente core usa `Theme.of(context)` para look & feel

### 7.2 Flutter Theme (equivalente al mypreset.ts + variables CSS)

```dart
// lib/core/theme/app_theme.dart
import 'package:flutter/material.dart';

// Design System tokens
class DsColors {
  // Primary palette (de _colors.scss)
  static const primary50 = Color(0xFFEDF1FF);
  static const primary100 = Color(0xFFD6E0FF);
  static const primary200 = Color(0xFFB6C8FF);
  static const primary300 = Color(0xFF86A3FF);
  static const primary400 = Color(0xFF4F73FF);
  static const primary500 = Color(0xFF1A43F0);  // Main primary
  static const primary600 = Color(0xFF0E33CC);
  static const primary700 = Color(0xFF0E28A1);
  static const primary800 = Color(0xFF112482);
  static const primary900 = Color(0xFF142369);
  static const primary950 = Color(0xFF000818);

  // Semantic colors
  static const success = Color(0xFF006837);
  static const warning = Color(0xFFB45309);
  static const danger = Color(0xFFBA1A1A);
  static const info = Color(0xFF0891B2);
  static const help = Color(0xFF7C3AED);

  // Neutral
  static const surface = Color(0xFFF8FAFC);
  static const surfaceElevated = Color(0xFFFFFFFF);
  static const background = Color(0xFFF1F5F9);
  static const textPrimary = Color(0xFF0F172A);
  static const textSecondary = Color(0xFF475569);
  static const textMuted = Color(0xFF94A3B8);
  static const border = Color(0xFFE2E8F0);
  static const borderStrong = Color(0xFFCBD5E1);
}

class DsTypography {
  static const fontFamily = 'Inter';
  static const fontFamilyHeading = 'Hanken Grotesk';

  // Font scale (modular 1.25)
  static const double xs = 10;
  static const double sm = 12;
  static const double base = 14;
  static const double lg = 16;
  static const double xl = 20;
  static const double xxl = 24;
  static const double xxxl = 32;
  static const double display = 48;
}

// Extension para colores DS en el tema
class DsTheme extends ThemeExtension<DsTheme> {
  final Color? primaryContainer;
  final Color? onPrimaryContainer;
  final Color? secondaryContainer;
  final Color? onSecondaryContainer;
  final Color? luxuryGold;
  final Color? budgetBg;
  final Color? documentHeader;
  final Color? documentBg;
  final Color? neonGlow;
  final Color? sidebarBg;
  final Color? headerBg;

  const DsTheme({
    this.primaryContainer,
    this.onPrimaryContainer,
    this.secondaryContainer,
    this.onSecondaryContainer,
    this.luxuryGold,
    this.budgetBg,
    this.documentHeader,
    this.documentBg,
    this.neonGlow,
    this.sidebarBg,
    this.headerBg,
  });

  @override
  DsTheme copyWith({
    Color? primaryContainer,
    Color? onPrimaryContainer,
    Color? secondaryContainer,
    Color? onSecondaryContainer,
    Color? luxuryGold,
    Color? budgetBg,
    Color? documentHeader,
    Color? documentBg,
    Color? neonGlow,
    Color? sidebarBg,
    Color? headerBg,
  }) {
    return DsTheme(
      primaryContainer: primaryContainer ?? this.primaryContainer,
      onPrimaryContainer: onPrimaryContainer ?? this.onPrimaryContainer,
      // ...
    );
  }

  @override
  DsTheme lerp(DsTheme other, double t) {
    return DsTheme(
      primaryContainer: Color.lerp(primaryContainer, other.primaryContainer, t),
      // ...
    );
  }

  static const light = DsTheme(
    primaryContainer: Color(0xFFEDF1FF),
    onPrimaryContainer: Color(0xFF142369),
    secondaryContainer: Color(0xFFF1F5F9),
    onSecondaryContainer: Color(0xFF0F172A),
    luxuryGold: Color(0xFFD4AF37),
    budgetBg: Color(0xFFFFF8E1),
    documentHeader: Color(0xFF1B3A6B),
    documentBg: Color(0xFFFEFDF6),
    neonGlow: Color(0x331A43F0),
    sidebarBg: Color(0xFFFFFFFF),
    headerBg: Color(0xFFFFFFFF),
  );

  static const dark = DsTheme(
    primaryContainer: Color(0xFF1E3A5F),
    onPrimaryContainer: Color(0xFFD6E0FF),
    // ...
  );
}

// Tema completo
class AppTheme {
  static ThemeData light() {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,

      // Color scheme
      colorScheme: ColorScheme.light(
        primary: DsColors.primary500,
        onPrimary: Colors.white,
        primaryContainer: DsColors.primary50,
        onPrimaryContainer: DsColors.primary900,
        secondary: DsColors.primary600,
        onSecondary: Colors.white,
        surface: DsColors.surface,
        onSurface: DsColors.textPrimary,
        error: DsColors.danger,
        onError: Colors.white,
        outline: DsColors.border,
      ),

      // Typography
      textTheme: TextTheme(
        displayLarge: TextStyle(fontFamily: DsTypography.fontFamilyHeading, fontSize: DsTypography.display),
        headlineLarge: TextStyle(fontFamily: DsTypography.fontFamilyHeading, fontSize: DsTypography.xxxl),
        headlineMedium: TextStyle(fontFamily: DsTypography.fontFamilyHeading, fontSize: DsTypography.xxl),
        titleLarge: TextStyle(fontFamily: DsTypography.fontFamily, fontSize: DsTypography.xl),
        bodyLarge: TextStyle(fontFamily: DsTypography.fontFamily, fontSize: DsTypography.base),
        bodyMedium: TextStyle(fontFamily: DsTypography.fontFamily, fontSize: DsTypography.base),
        labelLarge: TextStyle(fontFamily: DsTypography.fontFamily, fontSize: DsTypography.sm),
        labelSmall: TextStyle(fontFamily: DsTypography.fontFamily, fontSize: DsTypography.xs),
      ),

      // Component themes
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: DsColors.primary500,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          textStyle: const TextStyle(fontSize: DsTypography.sm, fontWeight: FontWeight.w600),
        ),
      ),

      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: DsColors.border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: DsColors.border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: DsColors.primary500, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: DsColors.danger),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        labelStyle: TextStyle(color: DsColors.textSecondary),
      ),

      cardTheme: CardTheme(
        elevation: 1,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        color: Colors.white,
        surfaceTintColor: Colors.transparent,
      ),

      chipTheme: ChipThemeData(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      ),

      extensions: [DsTheme.light],
    );
  }

  static ThemeData dark() {
    final base = light();
    return base.copyWith(
      brightness: Brightness.dark,
      colorScheme: base.colorScheme.copyWith(
        brightness: Brightness.dark,
        primary: DsColors.primary400,
        surface: const Color(0xFF09090B),
      ),
      extensions: [DsTheme.dark],
    );
  }
}

// Acceso rápido a colores DS
extension DsThemeOf on BuildContext {
  DsTheme get ds => Theme.of(this).extension<DsTheme>()!;
}
```

### 7.3 Widgets responsivos (equivalente a hidden md:block)

```dart
// lib/core/widgets/responsive_layout.dart
import 'package:flutter/material.dart';

class ResponsiveLayout extends StatelessWidget {
  final Widget desktop;
  final Widget mobile;
  final double breakpoint;

  const ResponsiveLayout({
    super.key,
    required this.desktop,
    required this.mobile,
    this.breakpoint = 768,
  });

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth >= breakpoint) {
          return desktop;
        }
        return mobile;
      },
    );
  }
}

// Uso:
// ResponsiveLayout(
//   desktop: SfDataGrid(...),
//   mobile: ListView.builder(...),
// )
```

---

## 8. Estado Global y Reactividad

### 8.1 Estrategia Riverpod

```dart
// lib/core/providers/providers.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';

// ─── Auth ───
final authServiceProvider = Provider<AuthService>((ref) => AuthService(ref.read(dioProvider)));
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref.read(authServiceProvider), ref.read(customerServiceProvider));
});

// ─── Customer ───
final customerServiceProvider = Provider<CustomerService>((ref) => CustomerService(ref.read(dioProvider)));
final customerProvider = StateNotifierProvider<CustomerNotifier, CustomerState>((ref) {
  return CustomerNotifier(ref.read(customerServiceProvider));
});

// ─── Roles ───
final roleProvider = Provider.family<bool, EApplicationRole>((ref, role) {
  return ref.watch(authProvider).user?.roles?.contains(role.value) ?? false;
});

// ─── Layout ───
final sidebarOpenProvider = StateProvider<bool>((ref) => true);
final themeModeProvider = StateProvider<ThemeMode>((ref) => ThemeMode.light);

// ─── Connectivity ───
final connectivityProvider = StreamProvider<bool>((ref) {
  return ConnectivityService().onStatusChange;
});

// ─── UI ───
final loaderProvider = StateProvider<bool>((ref) => false);

// ─── SignalR ───
final signalRProvider = Provider<SignalRService>((ref) {
  final service = SignalRService(ref.read(authProvider).user?.token);
  ref.onDispose(() => service.dispose());
  return service;
});

// ─── Sync Queue ───
final syncQueueProvider = StateNotifierProvider<SyncQueueNotifier, List<SyncQueueItem>>((ref) {
  return SyncQueueNotifier();
});
```

### 8.2 Equivalente a Angular Signals

```dart
// Angular: signal<T>(value), computed(() => ...), effect(() => ...)
// Flutter Riverpod: StateProvider, Provider (computed), ref.listen (effect)

// Signal
// Angular: const count = signal(0);
// Flutter:  final countProvider = StateProvider<int>((ref) => 0);

// Computed
// Angular: const doubled = computed(() => count() * 2);
// Flutter:  final doubledProvider = Provider<int>((ref) => ref.watch(countProvider) * 2);

// Effect
// Angular: effect(() => { console.log(count()); });
// Flutter: ref.listen(countProvider, (prev, next) => print(next));

// En widget:
// Angular: <p>{{ count() }}</p>
// Flutter:  Text('${ref.watch(countProvider)}')
```

### 8.3 TanStack Query equivalente (Riverpod AsyncNotifier)

```dart
// Angular: const { data, isLoading } = usePurchaseRequests(filters);
// Flutter:
final purchaseRequestListProvider = FutureProvider.family<List<PurchaseRequestDTO>, PRFilters>((ref, filters) async {
  final dio = ref.read(dioProvider);
  final response = await dio.get('/PurchaseRequests', queryParameters: filters.toJson());
  return (response.data as List).map((j) => PurchaseRequestDTO.fromJson(j)).toList();
});

// Uso en widget:
// Widget build(BuildContext context, WidgetRef ref) {
//   final asyncData = ref.watch(purchaseRequestListProvider(filters));
//   return asyncData.when(
//     data: (list) => AppDataTable(data: list, ...),
//     loading: () => const ShimmerLoader(),
//     error: (e, _) => EmptyStateWidget(message: e.toString()),
//   );
// }

// Mutations
final createPurchaseRequestProvider = FutureProvider.family<void, PurchaseRequestDTO>((ref, dto) async {
  await ref.read(dioProvider).post('/PurchaseRequests', data: dto.toJson());
  ref.invalidate(purchaseRequestListProvider);
});
```

---

## 9. Capa de API y Servicios

### 9.1 Environment

```dart
// lib/core/constants/environment.dart
class Environment {
  static const bool production = bool.fromEnvironment('PRODUCTION', defaultValue: false);

  static String get apiBaseUrl {
    if (production) return 'https://luxurybuildingapp.com/api/';
    return 'http://localhost:7070/api/';
  }

  static String get apiDomain {
    if (production) return 'https://luxurybuildingapp.com/';
    return 'http://localhost:7070/';
  }

  static String get signalRUrl {
    if (production) return 'https://luxurybuildingapp.com/ws/notificationHub';
    return 'http://localhost:7070/ws/notificationHub';
  }

  static const String oneSignalAppId = 'deeb5e28-6ebc-4260-967e-1b64331122fc';
}
```

### 9.2 Servicios específicos

```dart
// lib/features/purchasing/services/purchase_request_service.dart
class PurchaseRequestService {
  final Dio _dio;

  PurchaseRequestService(this._dio);

  Future<List<PurchaseRequestDTO>> getList({int status = 3}) async {
    final response = await _dio.get('/PurchaseRequests', queryParameters: {'status': status});
    return (response.data as List).map((j) => PurchaseRequestDTO.fromJson(j)).toList();
  }

  Future<PurchaseRequestDTO> getById(String id) async {
    final response = await _dio.get('/PurchaseRequests/$id');
    return PurchaseRequestDTO.fromJson(response.data);
  }

  Future<PurchaseRequestDTO> create(CreatePurchaseRequestDTO dto) async {
    final response = await _dio.post('/PurchaseRequests', data: dto.toJson());
    return PurchaseRequestDTO.fromJson(response.data);
  }

  Future<PurchaseRequestDTO> update(String id, UpdatePurchaseRequestDTO dto) async {
    final response = await _dio.put('/PurchaseRequests/$id', data: dto.toJson());
    return PurchaseRequestDTO.fromJson(response.data);
  }

  Future<void> delete(String id) async {
    await _dio.delete('/PurchaseRequests/$id');
  }
}

final purchaseRequestServiceProvider = Provider<PurchaseRequestService>((ref) {
  return PurchaseRequestService(ref.read(dioProvider));
});
```

### 9.3 SignalR Service

```dart
// lib/core/services/signalr_service.dart
import 'package:signalr_core/signalr_core.dart';
import '../constants/environment.dart';

class SignalRService {
  HubConnection? _connection;
  String? _token;

  SignalRService(this._token);

  final StreamController<Notification> _notificationController = StreamController.broadcast();
  Stream<Notification> get onNotification => _notificationController.stream;

  Future<void> start() async {
    _connection = HubConnectionBuilder()
        .withUrl(Environment.signalRUrl, transportType: TransportType.webSockets)
        .build();

    _connection!.on('ReceiveNotification', (args) {
      if (args?.isNotEmpty == true) {
        _notificationController.add(Notification.fromJson(args![0]));
      }
    });

    _connection!.onclose(({error}) => print('SignalR closed: $error'));
    _connection!.onreconnecting(({error}) => print('SignalR reconnecting...'));
    _connection!.onreconnected(({connectionId}) => print('SignalR reconnected: $connectionId'));

    await _connection!.start();
  }

  Future<void> stop() async {
    await _connection?.stop();
    _connection = null;
  }

  Future<void> joinGroup(String group) async {
    await _connection?.invoke('JoinGroup', args: [group]);
  }

  Future<void> leaveGroup(String group) async {
    await _connection?.invoke('LeaveGroup', args: [group]);
  }

  void dispose() {
    stop();
    _notificationController.close();
  }
}
```

### 9.4 Customer ID Service

```dart
// lib/core/services/customer_service.dart
class CustomerService {
  final Dio _dio;

  CustomerService(this._dio);

  Future<CustomerDTO> getById(String id) async {
    final response = await _dio.get('/Customers/$id');
    return CustomerDTO.fromJson(response.data);
  }
}

class CustomerState {
  final String? id;
  final String? nombreCorto;
  final String? customerName;
  final String? photoPath;
  final bool isLoaded;

  const CustomerState({this.id, this.nombreCorto, this.customerName, this.photoPath, this.isLoaded = false});

  CustomerState copyWith({String? id, String? nombreCorto, String? customerName, String? photoPath, bool? isLoaded}) {
    return CustomerState(
      id: id ?? this.id,
      nombreCorto: nombreCorto ?? this.nombreCorto,
      customerName: customerName ?? this.customerName,
      photoPath: photoPath ?? this.photoPath,
      isLoaded: isLoaded ?? this.isLoaded,
    );
  }
}

class CustomerNotifier extends StateNotifier<CustomerState> {
  final CustomerService _service;

  CustomerNotifier(this._service) : super(const CustomerState());

  Future<void> initializeFromToken(UserTokenDTO token) async {
    final customerId = token.customerId ?? _getFromStorage();
    if (customerId != null) {
      await setCustomerId(customerId);
    }
  }

  Future<void> setCustomerId(String id) async {
    final customer = await _service.getById(id);
    state = CustomerState(
      id: customer.id,
      nombreCorto: customer.nombreCorto,
      customerName: customer.customerName,
      photoPath: customer.photo,
      isLoaded: true,
    );
    _saveToStorage(id);
  }

  void clear() => state = const CustomerState();

  String? _getFromStorage() => null; // SharedPreferences
  void _saveToStorage(String id) {} // SharedPreferences
}
```

---

## 10. Estrategia Mobile (iOS/Android)

### 10.1 Nativo vs WebView

A diferencia de Ionic/Capacitor (WebView), Flutter es **completamente nativo**:

```
Ionic/Capacitor:  Web App (HTML/JS/CSS) → WebView → Nativos (Bridge)
Flutter:          Widget Tree (Dart) → Skia/Impeller → Nativos (Platform Channels)
```

Esto significa:
- **Ventajas**: Mejor rendimiento, 60fps consistentes, acceso nativo, sin dependencia del WebView del sistema
- **Desventajas**: No hay CSS/HTML, todo widgets; bundle más grande (~15-20MB APK)

### 10.2 Plugins Capacitor → Flutter

| Capacitor Plugin | Flutter Package |
|-----------------|-----------------|
| `@capacitor/camera` | `image_picker` |
| `@capacitor/push-notifications` | `firebase_messaging` + `flutter_local_notifications` |
| `@capacitor/geolocation` | `geolocator` |
| `@capacitor/barcode-scanner` | `mobile_scanner` |
| `@capacitor/share` | `share_plus` |
| `@capacitor/storage` | `shared_preferences` / `drift` |
| `@capacitor/splash-screen` | `flutter_native_splash` |
| `@capacitor/status-bar` | `system_ui_mode` |
| OneSignal web | `onesignal_flutter` |

### 10.3 Platform Detection

```dart
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

bool get isWeb => kIsWeb;
bool get isAndroid => !kIsWeb && Platform.isAndroid;
bool get isIOS => !kIsWeb && Platform.isIOS;
bool get isMobile => isAndroid || isIOS;
```

### 10.4 Responsive Shell (Layout)

```dart
// lib/layouts/employee/employee_shell.dart
class EmployeeShell extends ConsumerStatefulWidget {
  final Widget child;
  const EmployeeShell({super.key, required this.child});

  @override
  ConsumerState<EmployeeShell> createState() => _EmployeeShellState();
}

class _EmployeeShellState extends ConsumerState<EmployeeShell> {
  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth < 768) {
          return MobileScaffold(child: widget.child);
        }
        return DesktopScaffold(child: widget.child);
      },
    );
  }
}

// Desktop: NavigationRail lateral + body
class DesktopScaffold extends StatelessWidget {
  final Widget child;
  const DesktopScaffold({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          NavigationRail(
            selectedIndex: 0,
            onDestinationSelected: (index) {},
            labelType: NavigationRailLabelType.all,
            leading: Padding(
              padding: const EdgeInsets.all(8),
              child: Image.asset('assets/images/logo.png', height: 40),
            ),
            destinations: const [
              NavigationRailDestination(icon: Icon(Icons.dashboard), label: Text('Dashboard')),
              NavigationRailDestination(icon: Icon(Icons.shopping_cart), label: Text('Compras')),
              // ... menu items
            ],
          ),
          const VerticalDivider(width: 1),
          Expanded(child: child),
        ],
      ),
    );
  }
}

// Mobile: BottomNavigationBar + drawer
class MobileScaffold extends StatelessWidget {
  final Widget child;
  const MobileScaffold({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: Drawer(child: MenuDrawer()),
      body: child,
      bottomNavigationBar: NavigationBar(
        selectedIndex: 0,
        onDestinationSelected: (index) {},
        destinations: const [
          NavigationDestination(icon: Icon(Icons.dashboard), label: 'Dashboard'),
          NavigationDestination(icon: Icon(Icons.shopping_cart), label: 'Compras'),
          NavigationDestination(icon: Icon(Icons.more_horiz), label: 'Más'),
        ],
      ),
    );
  }
}
```

---

## 11. Web con Flutter

### 11.1 Consideraciones

| Aspecto | Flutter Web | Angular Web |
|---------|-------------|-------------|
| Renderizado | CanvasKit (WebGL) / HTML | DOM nativo |
| SEO | Limitado (sin SSR nativo) | Angular Universal o CSR |
| Bundle size | ~2MB+ (wasm/canvas) | ~500KB JS |
| PWA | No recomendado | Excelente |
| Carga inicial | Lenta (descarga engine) | Rápida |
| Rendimiento | Bueno (60fps) | Bueno |
| Accesibilidad | Limitada | Buena (DOM nativo) |
| Text selection | Limitada | Nativa |
| URL handling | GoRouter (declarativo) | React Router |

**Recomendación**: Flutter Web es adecuado para la versión mobile-responsive de la app, pero **NO** reemplaza completamente la versión web actual para escritorio pesado (tablas complejas, reportes, dashboards con mucha interacción). Considerar mantener Angular para web desktop y usar Flutter para mobile + web mobile.

### 11.2 Configuración Web

```html
<!-- web/index.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LuxuryApp</title>
  <base href="/">
  <link rel="manifest" href="/manifest.webmanifest">
  <link rel="icon" type="image/png" href="assets/images/favicon.png">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Hanken+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="flutter.js" defer></script>
</head>
<body>
  <script>
    window.addEventListener('load', function() {
      _flutter.loader.loadEntrypoint({
        serviceWorker: {
          serviceWorkerVersion: '...',
        },
        onEntrypointLoaded: function(engineInitializer) {
          engineInitializer.initializeEngine().then(function(appRunner) {
            appRunner.runApp();
          });
        }
      });
    });
  </script>
</body>
</html>
```

### 11.3 Estrategia híbrida web

Para aprovechar lo mejor de ambos mundos:

```
Producción actual:
┌──────────────────────────────┐
│    Angular Web (desktop)     │ ← SEO, PWA, carga rápida, tablas pesadas
│    Angular Web (mobile)      │ ← Responsive, Ionic components
└──────────────────────────────┘

Con Flutter:
┌──────────────────────────────┐
│    Angular Web (desktop)     │ ← Se mantiene para escritorio
│    Flutter Web (mobile web)  │ ← Mobile responsive si se desea
│    Flutter Native (iOS/Android) │ ← Nueva experiencia mobile nativa
└──────────────────────────────┘

O bien, migración completa:
┌──────────────────────────────┐
│    Flutter Web (responsive)  │ ← Reemplaza Angular en todas las plataformas
│    Flutter Native            │ ← Mismo código
└──────────────────────────────┘
```

---

## 12. Componentes por Módulo de Negocio

### 12.1 Patrón de widget típico

```dart
// Representa un componente Angular completo → widget Flutter
// Angular: purchase-request-list.ts + purchase-request-list.html + CSS

// Flutter: purchase_request_list_page.dart
class PurchaseRequestListPage extends ConsumerWidget {
  const PurchaseRequestListPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final filters = ref.watch(purchaseRequestFiltersProvider);
    final asyncData = ref.watch(purchaseRequestListProvider(filters));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Solicitudes de Compra'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => _showForm(context),
          ),
        ],
      ),
      body: asyncData.when(
        data: (items) => _buildList(context, items),
        loading: () => const ShimmerLoader(),
        error: (e, _) => EmptyStateWidget(message: e.toString()),
      ),
    );
  }

  Widget _buildList(BuildContext context, List<PurchaseRequestDTO> items) {
    return LayoutBuilder(builder: (context, constraints) {
      if (constraints.maxWidth < 768) {
        return _buildMobileList(items);
      }
      return _buildDesktopTable(items);
    });
  }

  Widget _buildMobileList(List<PurchaseRequestDTO> items) {
    if (items.isEmpty) {
      return const EmptyStateWidget(
        icon: Icons.inventory_2_outlined,
        title: 'Sin solicitudes',
      );
    }
    return ListView.builder(
      itemCount: items.length,
      itemBuilder: (context, index) {
        final item = items[index];
        return Card(
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
          child: ListTile(
            title: Text(item.folio, style: const TextStyle(fontWeight: FontWeight.w600)),
            subtitle: Text(item.providerName ?? ''),
            trailing: StatusBadge(status: item.status),
            onTap: () => context.push('/purchasing/requests/${item.id}'),
          ),
        );
      },
    );
  }

  Widget _buildDesktopTable(List<PurchaseRequestDTO> items) {
    return AppDataTable(
      columns: [
        DataColumn(label: Text('Folio', style: TextStyle(fontWeight: FontWeight.w600))),
        DataColumn(label: Text('Proveedor', style: TextStyle(fontWeight: FontWeight.w600))),
        DataColumn(label: Text('Monto', style: TextStyle(fontWeight: FontWeight.w600))),
        DataColumn(label: Text('Estatus', style: TextStyle(fontWeight: FontWeight.w600))),
        DataColumn(label: Text('Acciones', style: TextStyle(fontWeight: FontWeight.w600))),
      ],
      rows: items.map((item) => DataRow(cells: [
        DataCell(Text(item.folio)),
        DataCell(Text(item.providerName ?? '')),
        DataCell(Text('\$${item.amount?.toStringAsFixed(2) ?? '0.00'}')),
        DataCell(StatusBadge(status: item.status)),
        DataCell(Row(
          children: [
            IconButton(icon: const Icon(Icons.edit), onPressed: () => _editItem(context, item)),
            IconButton(icon: const Icon(Icons.delete), onPressed: () => _deleteItem(context, item)),
          ],
        )),
      ])).toList(),
    );
  }

  void _showForm(BuildContext context) {
    showDialog(context: context, builder: (_) => const PurchaseRequestFormPage());
  }

  void _editItem(BuildContext context, PurchaseRequestDTO item) {
    showDialog(context: context, builder: (_) => PurchaseRequestFormPage(item: item));
  }

  void _deleteItem(BuildContext context, PurchaseRequestDTO item) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Confirmar eliminación'),
        content: Text('¿Eliminar solicitud ${item.folio}?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancelar')),
          TextButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Eliminar')),
        ],
      ),
    );
    if (confirmed == true) {
      await ref.read(purchaseRequestServiceProvider).delete(item.id!);
      ref.invalidate(purchaseRequestListProvider);
    }
  }
}

// Form en modal
class PurchaseRequestFormPage extends ConsumerStatefulWidget {
  final PurchaseRequestDTO? item;
  const PurchaseRequestFormPage({super.key, this.item});

  @override
  ConsumerState<PurchaseRequestFormPage> createState() => _PurchaseRequestFormPageState();
}

class _PurchaseRequestFormPageState extends ConsumerState<PurchaseRequestFormPage> {
  final _formKey = GlobalKey<FormState>();
  late String _providerId;
  late String _description;
  late double _amount;
  bool _submitting = false;

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(widget.item != null ? 'Editar Solicitud' : 'Nueva Solicitud'),
      content: Form(
        key: _formKey,
        child: SizedBox(
          width: 500,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              DropdownButtonFormField(
                value: _providerId,
                items: providers.map((p) => DropdownMenuItem(value: p.id, child: Text(p.name))).toList(),
                onChanged: (v) => _providerId = v as String,
                decoration: const InputDecoration(labelText: 'Proveedor'),
                validator: (v) => v == null ? 'Requerido' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                initialValue: _description,
                decoration: const InputDecoration(labelText: 'Descripción'),
                maxLines: 4,
                validator: (v) => (v?.length ?? 0) < 10 ? 'Muy corta' : null,
                onChanged: (v) => _description = v,
              ),
            ],
          ),
        ),
      ),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancelar')),
        ElevatedButton(
          onPressed: _submitting ? null : _submit,
          child: _submitting
              ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2))
              : Text(widget.item != null ? 'Actualizar' : 'Guardar'),
        ),
      ],
    );
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _submitting = true);
    try {
      if (widget.item != null) {
        await ref.read(purchaseRequestServiceProvider).update(widget.item!.id!, /* dto */);
      } else {
        await ref.read(purchaseRequestServiceProvider).create(/* dto */);
      }
      ref.invalidate(purchaseRequestListProvider);
      if (mounted) Navigator.pop(context);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }
}
```

### 12.2 Widget AppDataTable (equivalente a app-table)

```dart
// lib/core/widgets/app_data_table.dart
class AppDataTable extends StatelessWidget {
  final List<DataColumn> columns;
  final List<DataRow> rows;
  final int? rowsPerPage;
  final bool showAdd;
  final String? title;
  final Widget Function()? emptyState;
  final VoidCallback? onAdd;

  const AppDataTable({
    super.key,
    required this.columns,
    required this.rows,
    this.rowsPerPage = 30,
    this.showAdd = false,
    this.title,
    this.emptyState,
    this.onAdd,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Column(
        children: [
          // Caption (búsqueda + botón agregar)
          if (title != null || showAdd)
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  if (title != null)
                    Text(title!, style: Theme.of(context).textTheme.titleLarge),
                  const Spacer(),
                  if (showAdd)
                    ElevatedButton.icon(
                      icon: const Icon(Icons.add),
                      label: const Text('Agregar'),
                      onPressed: onAdd,
                    ),
                ],
              ),
            ),
          // Tabla
          rows.isEmpty
              ? (emptyState?.call() ?? const EmptyStateWidget())
              : SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: DataTable(
                    columns: columns,
                    rows: rows,
                    dataRowHeight: 48,
                    headingRowHeight: 48,
                    columnSpacing: 24,
                    horizontalMargin: 24,
                  ),
                ),
          // Footer
          if (rows.isNotEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
              child: Row(
                children: [
                  Text(
                    'En total hay ${rows.length} registros.',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
```

### 12.3 StatusBadge Widget

```dart
// lib/core/widgets/status_badge.dart
class StatusBadge extends StatelessWidget {
  final String status;
  final int? statusCode;

  const StatusBadge({super.key, required this.status, this.statusCode});

  @override
  Widget build(BuildContext context) {
    final (Color bg, Color fg, IconData icon) = _getStyle(status);
    return Chip(
      avatar: Icon(icon, size: 16, color: fg),
      label: Text(status, style: TextStyle(color: fg, fontSize: 12, fontWeight: FontWeight.w600)),
      backgroundColor: bg,
      side: BorderSide.none,
      padding: const EdgeInsets.symmetric(horizontal: 4),
      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
      visualDensity: VisualDensity.compact,
    );
  }

  (Color, Color, IconData) _getStyle(String status) {
    switch (status.toLowerCase()) {
      case 'pendiente':
        return (Color(0xFFFEF3C7), Color(0xFF92400E), Icons.schedule);
      case 'proceso':
      case 'en proceso':
        return (Color(0xFFDBEAFE), Color(0xFF1E40AF), Icons.sync);
      case 'concluido':
      case 'completado':
        return (Color(0xFFD1FAE5), Color(0xFF065F46), Icons.check_circle);
      case 'cancelado':
        return (Color(0xFFFEE2E2), Color(0xFF991B1B), Icons.cancel);
      case 'abierto':
        return (Color(0xFFFEE2E2), Color(0xFF991B1B), Icons.error);
      case 'cerrado':
        return (Color(0xFFD1FAE5), Color(0xFF065F46), Icons.check_circle);
      default:
        return (Color(0xFFF3F4F6), Color(0xFF374151), Icons.help);
    }
  }
}
```

### 12.4 EmptyState Widget

```dart
// lib/core/widgets/empty_state_widget.dart
class EmptyStateWidget extends StatelessWidget {
  final IconData icon;
  final String? title;
  final String? message;
  final String? actionLabel;
  final VoidCallback? onAction;

  const EmptyStateWidget({
    super.key,
    this.icon = Icons.inbox_outlined,
    this.title,
    this.message,
    this.actionLabel,
    this.onAction,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(48),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 64, color: Theme.of(context).colorScheme.outline),
            const SizedBox(height: 16),
            Text(
              title ?? 'Sin datos',
              style: Theme.of(context).textTheme.titleLarge,
              textAlign: TextAlign.center,
            ),
            if (message != null) ...[
              const SizedBox(height: 8),
              Text(
                message!,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
                textAlign: TextAlign.center,
              ),
            ],
            if (actionLabel != null && onAction != null) ...[
              const SizedBox(height: 24),
              ElevatedButton.icon(
                icon: const Icon(Icons.add),
                label: Text(actionLabel!),
                onPressed: onAction,
              ),
            ],
          ],
        ),
      ),
    );
  }
}
```

---

## 13. Estrategia de Pruebas

### 13.1 Stack

| Angular | Flutter |
|---------|---------|
| Vitest + Jasmine | flutter_test |
| React Testing Library | flutter_test (WidgetTester) |
| Jest (mocking) | mocktail |
| Playwright (E2E) | integration_test + patrol |
| Chromatic (visual) | golden tests (alchemist) |

### 13.2 Configuración

```yaml
# pubspec.yaml
dev_dependencies:
  flutter_test:
    sdk: flutter
  integration_test:
    sdk: flutter
  mocktail: ^1.0.0
  patrol: ^3.0.0
  alchemist: ^1.0.0
```

### 13.3 Ejemplo de test

```dart
// test/features/purchasing/purchase_request_list_page_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mocktail/mocktail.dart';

class MockPurchaseRequestService extends Mock implements PurchaseRequestService {}

void main() {
  late MockPurchaseRequestService mockService;

  setUp(() {
    mockService = MockPurchaseRequestService();
    registerFallbackValue(PurchaseRequestFilter());
  });

  testWidgets('Muestra tabla con solicitudes', (tester) async {
    when(() => mockService.getList(any())).thenAnswer((_) async => [
      PurchaseRequestDTO(id: '1', folio: 'PR-001', status: 'Pendiente'),
      PurchaseRequestDTO(id: '2', folio: 'PR-002', status: 'Aprobado'),
    ]);

    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          purchaseRequestServiceProvider.overrideWithValue(mockService),
        ],
        child: const MaterialApp(home: PurchaseRequestListPage()),
      ),
    );

    await tester.pumpAndSettle();

    expect(find.text('Solicitudes de Compra'), findsOneWidget);
    expect(find.text('PR-001'), findsOneWidget);
    expect(find.text('PR-002'), findsOneWidget);
  });

  testWidgets('Muestra empty state cuando no hay datos', (tester) async {
    when(() => mockService.getList(any())).thenAnswer((_) async => []);

    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          purchaseRequestServiceProvider.overrideWithValue(mockService),
        ],
        child: const MaterialApp(home: PurchaseRequestListPage()),
      ),
    );

    await tester.pumpAndSettle();

    expect(find.text('Sin solicitudes'), findsOneWidget);
  });
}
```

---

## 14. PWA y Offline

### 14.1 Flutter Web no es PWA tradicional

Flutter Web compila a Canvas/WebGL. El service worker solo cachea el engine Flutter, no funciona como PWA tradicional. **No recomendado para reemplazar PWA de Angular.**

### 14.2 Offline con Drift (SQLite)

```dart
// lib/core/services/offline/drift_database.dart
import 'package:drift/drift.dart';
import 'package:drift/native.dart';
import 'package:path/path.dart' as p;
import 'package:path_provider/path_provider.dart';

part 'drift_database.g.dart';

class SyncQueueItems extends Table {
  TextColumn get id => text().withDefault(const Constant(''))();
  TextColumn get method => text()();
  TextColumn get url => text()();
  TextColumn get data => text().nullable()();
  IntColumn get timestamp => integer()();
  BoolColumn get synced => boolean().withDefault(const Constant(false))();

  @override
  Set<Column> get primaryKey => {id};
}

@DriftDatabase(tables: [SyncQueueItems])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 1;

  Future<void> enqueue(SyncQueueItem item) => into(syncQueueItems).insert(item);
  Future<List<SyncQueueItem>> pendingItems() =>
      (select(syncQueueItems)..where((t) => t.synced.equals(false))).get();
  Future<void> markSynced(String id) =>
      (update(syncQueueItems)..where((t) => t.id.equals(id))).write(const SyncQueueItem(synced: true));
}

LazyDatabase _openConnection() {
  return LazyDatabase(() async {
    final dbFolder = await getApplicationDocumentsDirectory();
    final file = File(p.join(dbFolder.path, 'luxuryapp.sqlite'));
    return NativeDatabase(file);
  });
}
```

### 14.3 Connectivity + Sync

```dart
// lib/core/services/offline/connectivity_service.dart
class ConnectivityService {
  final _connectivity = Connectivity();

  Stream<bool> get onStatusChange =>
    _connectivity.onConnectivityChanged.map((result) =>
      result != ConnectivityResult.none
    );
}

// Sync automático al reconectar
class SyncService {
  final AppDatabase _db;
  final Dio _dio;

  SyncService(this._db, this._dio);

  Future<void> syncAll() async {
    final pending = await _db.pendingItems();
    for (final item in pending) {
      try {
        await _dio.request(
          item.url,
          data: item.data,
          options: Options(method: item.method),
        );
        await _db.markSynced(item.id);
      } catch (_) {
        break; // Reintentar después
      }
    }
  }
}
```

---

## 15. Internacionalización (i18n)

### 15.1 Configuración

```yaml
# pubspec.yaml
dependencies:
  flutter_localizations:
    sdk: flutter
  intl: ^0.20.0

flutter:
  generate: true
```

```yaml
# l10n.yaml
arb-dir: lib/l10n
template-arb-file: app_es.arb
output-localization-file: app_localizations.dart
```

```json
// lib/l10n/app_es.arb
{
  "@@locale": "es",
  "appTitle": "LuxuryApp",
  "dashboard": "Panel de Control",
  "settings": "Configuración",
  "profile": "Perfil",
  "purchaseRequests": "Solicitudes de Compra",
  "purchaseOrders": "Órdenes de Compra",
  "add": "Agregar",
  "save": "Guardar",
  "cancel": "Cancelar",
  "delete": "Eliminar",
  "confirm": "Confirmar",
  "noResults": "No se encontraron resultados",
  "totalRecords": "En total hay {count} registros.",
  "@totalRecords": {
    "placeholders": {
      "count": { "type": "int" }
    }
  }
}
```

```json
// lib/l10n/app_en.arb
{
  "@@locale": "en",
  "appTitle": "LuxuryApp",
  "dashboard": "Dashboard",
  "settings": "Settings",
  "profile": "Profile",
  "purchaseRequests": "Purchase Requests",
  "purchaseOrders": "Purchase Orders",
  "add": "Add",
  "save": "Save",
  "cancel": "Cancel",
  "delete": "Delete",
  "confirm": "Confirm",
  "noResults": "No results found",
  "totalRecords": "{count} records total.",
  "@totalRecords": {
    "placeholders": {
      "count": { "type": "int" }
    }
  }
}
```

### 15.2 Uso

```dart
// Widget auto-traducido
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class DashboardPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Scaffold(
      appBar: AppBar(title: Text(l10n.dashboard)),
    );
  }
}
```

---

## 16. Consideraciones de Rendimiento

### 16.1 Bundle size

| Plataforma | Tamaño | Notas |
|------------|--------|-------|
| Android APK | ~15-20 MB | AAB reduce a ~5-8 MB |
| iOS IPA | ~20-30 MB | Similar |
| Web (Flutter) | ~2-3 MB (wasm) | Más pesado que Angular |
| Angular actual | ~500 KB (gzip) | Más ligero para web |

### 16.2 Estrategias de optimización

1. **Lazy loading de rutas**: `await Future.delayed` + GoRouter
2. **Shimmer loading**: Placeholder mientras cargan datos
3. **ListView.builder**: Virtualización nativa para listas largas
4. **Image caching**: `cached_network_image` para imágenes
5. **const constructors**: `const MyWidget()` para evitar rebuilds
6. **RepaintBoundary**: Aislar widgets que repintan frecuentemente
7. **DevTools**: Profile mode, timeline, memory

### 16.3 Flutter Web específico

```dart
// Optimización para web
import 'package:flutter/foundation.dart';

class HeavyTableWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    if (kIsWeb) {
      // Usar rendering HTML en lugar de CanvasKit
      return HtmlElementView(viewType: 'heavy-table');
    }
    return SyncfusionDataGrid(...); // Nativo
  }
}
```

---

## 17. Riesgos y Mitigaciones

| Riesgo | Impacto | Probabilidad | Mitigación |
|--------|---------|--------------|------------|
| **No existe PrimeNG para Flutter** | Alto | Alta | Usar Syncfusion + widgets custom. Syncfusion DataGrid es el reemplazo más completo para p-table. |
| **Flutter Web no es buena experiencia para escritorio pesado** | Alto | Alta | Mantener Angular para web desktop. Flutter solo para mobile native + mobile web. |
| **Dart learning curve para el equipo** | Alto | Alta | Capacitación 2-3 semanas. Dart es más fácil que TypeScript (sin sobrecarga de tipos). |
| **SignalR en Dart es menos estable** | Medio | Media | Usar `signalr_netrcore`. Considerar SSE (Server-Sent Events) como alternativa. |
| **Migración de ~480 templates HTML a widget tree** | Muy alto | Alta | Automatizar lo posible con scripts. Priorizar widgets core primero. |
| **Test suite inexistente para Flutter** | Alto | Alta | Construir tests desde el día 1 (TDD) |
| **SEO para Flutter Web** | Medio | Alta | Flutter Web no tiene SSR. Para páginas públicas (reportes), mantener Angular o usar `flutter_html` + headless render. |
| **Integración con Firebase/OneSignal** | Bajo | Baja | Paquetes oficiales `firebase_*` y `onesignal_flutter` |
| **Accesibilidad (a11y)** | Medio | Media | Flutter tiene `Semantics` widget. Auditoría con `flutter analyze` + DevTools. |
| **Rendimiento de Flutter Web en dispositivos antiguos** | Medio | Media | CanvasKit requiere WebGL2. Ofrecer Angular como fallback o usar render HTML. |
| **Migración de ~70 servicios** | Alto | Media | Riverpod providers + dio. Arquitectura clara desde el inicio. |
| **Chart.js + ngx-charts → fl_chart** | Medio | Baja | fl_chart soporta todos los tipos (bar, line, pie, radial). APIs distintas. |
| **PDF generation (exceljs, xlsx)** | Medio | Media | `excel` (Dart) + `pdf` (Dart). Mismas capacidades. |
| **Code signing + App Store deployment** | Bajo | Baja | Flutter usa mismo proceso Xcode/Android Studio. |

---

## 18. Estimación de Esfuerzo

### 18.1 Por fase

| Fase | Duración | Recursos | Días-hombre |
|------|----------|----------|-------------|
| Fase 0: Setup | 3 semanas | 1 senior + 1 mid | 30 |
| Fase 1: Core Widgets | 4 semanas | 2 devs | 40 |
| Fase 2: Servicios + Estado | 3 semanas | 2 devs | 30 |
| Fase 3: Layouts + Navegación | 3 semanas | 2 devs | 30 |
| Fase 4: Features P1 (Ops + Acc + Purch) | 12 semanas | 3 devs | 180 |
| Fase 5: Features P2 (HR + Sys + Maint + Legal + Rec) | 8 semanas | 3 devs | 120 |
| Fase 6: Auth + Shared | 3 semanas | 2 devs | 30 |
| Fase 7: Testing + QA | 6 semanas | 2 devs + QA | 60 |
| Fase 8: Despliegue | 3 semanas | 1 devops | 15 |
| **Total** | **~45 semanas** | **3 devs** | **~535 días-hombre** |

### 18.2 Comparativa con React

| Aspecto | React | Flutter | Diferencia |
|---------|-------|---------|------------|
| Lenguaje | TypeScript (mismo) | Dart (nuevo) | +1-2 semanas aprendizaje |
| UI | JSX (similar a HTML) | Widget tree (nuevo) | +3-4 semanas adaptación |
| UI Library | PrimeReact (similar) | Syncfusion/custom | +2-3 semanas custom |
| Mobile | Ionic (WebView, mismo) | Nativo Flutter | +4-6 semanas nativo |
| Web | Excelente (PWA, SSR) | Limitado (Canvas) | React gana en web |
| Estado | Zustand + TanStack Query | Riverpod | Similar esfuerzo |
| Testing | Vitest + RTL | flutter_test + mocktail | Similar |
| Bundle | ~500KB | ~5MB+ (mobile) ~2MB (web) | Flutter más pesado |
| **Total** | **~34 semanas / ~390 días-hombre** | **~45 semanas / ~535 días-hombre** | Flutter ~30% más lento |

---

## 19. Recomendaciones Finales

### 19.1 ¿React vs Flutter? Decisión

| Criterio | React (Ionic) | Flutter |
|----------|---------------|---------|
| **Velocidad de migración** | ✅ Más rápida (~34 sem) | ❌ Más lenta (~45 sem) |
| **Web (desktop)** | ✅ Excelente (PWA, SSR, SEO) | ❌ Limitada (Canvas, sin SSR) |
| **Mobile (iOS/Android)** | ⚠️ WebView (Ionic) | ✅ Nativo (Skia) |
| **Rendimiento mobile** | ⚠️ Depende del WebView | ✅ 60fps consistente |
| **UI/UX nativa** | ⚠️ WebView se siente web | ✅ Nativa (Material/Cupertino) |
| **Design System existente** | ✅ PrimeNG → PrimeReact (directo) | ❌ Todo custom (Syncfusion) |
| **Equipo knowledge** | ✅ TypeScript (mismo) | ❌ Dart (nuevo) |
| **Bundle size** | ✅ ~500KB | ❌ ~5-15MB |
| **Ecosistema librerías** | ✅ Maduro | ✅ Maduro |
| **Animaciones** | ⚠️ CSS/JS | ✅ Impeller engine |
| **Offline/Sync** | ✅ Service Worker | ⚠️ drift + manual |
| **Testing** | ✅ Vitest + RTL | ✅ flutter_test |

### 19.2 Recomendación final

**Para este proyecto específico (LuxuryApp):**

| Plataforma | Recomendación | Razón |
|------------|--------------|-------|
| **Web Desktop** | **Mantener Angular (o migrar a React)** | Flutter Web no da buena experiencia para tablas pesadas, reportes, dashboards. Angular ya funciona bien. |
| **Web Mobile** | **React (Ionic) o Flutter** | Ambos funcionan bien. React es más rápido de migrar. |
| **iOS/Android** | **Flutter** | Experiencia nativa superior a Ionic WebView. Vale la pena el esfuerzo extra. |

**Estrategia híbrida recomendada:**

```
├── client/angular/          → MANTENER para web desktop (o migrar a React)
├── client/react/            → OPCIÓN A: web mobile + PWA (rápido)
├── client/flutter-migration/ → OPCIÓN B: iOS + Android nativos (lento pero superior)
```

O, si se quiere una sola base de código:

```
├── client/react/            → ÚNICA: web + mobile (Ionic/Capacitor) → RÁPIDO
├── client/flutter-migration/ → MANTENER como referencia para futura migración nativa
```

**Decisión final depende de:**
1. **¿Qué tan importante es la experiencia nativa mobile?** → Flutter gana
2. **¿Qué tan importante es la web desktop?** → React/Angular ganan
3. **¿Cuánto tiempo tenemos?** → React es ~30% más rápido
4. **¿El equipo sabe Dart o quiere aprender?** → Factor decisivo

### 19.3 MVP vs Full migration

**Opción A: Flutter solo mobile (recomendada como primer paso)**
- Mantener Angular para web
- Construir Flutter solo para iOS + Android
- Reutilizar APIs y lógica de negocio
- **Duración**: ~24 semanas (solo Fases 0-3 + mobile features + testing)

**Opción B: Flutter full (web + mobile)**
- Migrar todo a Flutter
- **Duración**: ~45 semanas
- **Riesgo**: Flutter Web puede no satisfacer necesidades desktop

**Opción C: React para web + Flutter para mobile**
- React (Ionic): web desktop + web mobile → ~34 semanas
- Flutter: solo iOS + Android → ~24 semanas
- **Total**: ~40 semanas (equipos paralelos)
- **Mejor experiencia en cada plataforma**

### 19.4 Lo que NO cambia (migración directa)

| Elemento | Status |
|----------|--------|
| API REST endpoints | ✅ Idénticos |
| DTOs/Modelos | ✅ Migración directa a Dart classes |
| Enums | ✅ Migración directa |
| Estructura de datos | ✅ Idéntica |
| SignalR Hub | ⚠️ Mismo protocolo, distinto cliente |
| Assets (imágenes, fuentes) | ✅ Migración directa a assets/ |
| Diseño responsive | ⚠️ Widget tree vs CSS |
| Lógica de negocio | ✅ Se reescribe en Dart |
| Firebase + OneSignal | ✅ Paquetes oficiales |
| Manejo de JWT | ✅ Mismo algoritmo |
| Formatos de fecha (es-MX) | ✅ intl package |
| SweetAlert2 → AlertDialog | ⚠️ Nativo, distinta UX |
| Content Security Policy | ❌ No aplica (no DOM) |

### 19.5 Señales de éxito

- [ ] Build de Flutter exitoso (`flutter build apk`, `flutter build ios`, `flutter build web`)
- [ ] Login + auth flow funcional (web + mobile)
- [ ] Layouts responsive con NavigationRail + BottomNavigation
- [ ] SignalR conectado y recibiendo notificaciones
- [ ] Tablas con Syncfusion DataGrid + paginación + filtros
- [ ] Formularios con flutter_form_builder + validación
- [ ] Diálogos de creación/edición funcionales
- [ ] Offline sync queue operativa (drift)
- [ ] Aplicación Android compilada con Flutter
- [ ] Aplicación iOS compilada con Flutter
- [ ] Widget tests para core widgets
- [ ] Traducciones funcionando (es/en) con ARB
- [ ] Tema oscuro funcional con ThemeExtension
- [ ] Dashboard con datos reales
- [ ] Golden tests para regresión visual

---

## Apéndice A: Dependencias pubspec.yaml propuestas

```yaml
name: luxury_app
description: LuxuryApp - Gestión Inmobiliaria
version: 1.0.0
publish_to: none

environment:
  sdk: '>=3.6.0 <4.0.0'
  flutter: '>=4.0.0'

dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter
  intl: ^0.20.0
  
  # Navigation
  go_router: ^15.0.0
  
  # State Management
  flutter_riverpod: ^3.0.0
  riverpod_annotation: ^3.0.0
  
  # HTTP & WebSockets
  dio: ^5.7.0
  signalr_netrcore: ^1.3.0
  web_socket_channel: ^3.0.0
  
  # UI Components
  syncfusion_flutter_datagrid: ^28.0.0
  syncfusion_flutter_datepicker: ^28.0.0
  syncfusion_flutter_pdfviewer: ^28.0.0
  flutter_form_builder: ^10.0.0
  form_builder_validators: ^11.0.0
  fl_chart: ^0.70.0
  flutter_map: ^7.0.0
  flutter_quill: ^11.0.0
  flutter_typeahead: ^5.2.0
  table_calendar: ^3.1.0
  flutter_staggered_animations: ^1.1.0
  
  # Icons
  iconify_flutter: ^0.2.0
  iconify_flutter_feather: ^0.2.0
  
  # Storage & Offline
  drift: ^2.23.0
  sqlite3_flutter_libs: ^0.5.0
  shared_preferences: ^2.3.0
  hive_flutter: ^1.2.0
  
  # Firebase
  firebase_core: ^3.12.0
  firebase_auth: ^5.5.0
  firebase_messaging: ^15.2.0
  firebase_cloud_firestore: ^5.6.0
  
  # OneSignal
  onesignal_flutter: ^5.2.0
  
  # Push
  flutter_local_notifications: ^18.0.0
  
  # Native Features
  image_picker: ^1.1.0
  mobile_scanner: ^6.0.0
  geolocator: ^13.0.0
  share_plus: ^10.0.0
  path_provider: ^2.1.0
  connectivity_plus: ^6.1.0
  device_info_plus: ^11.3.0
  
  # Media & Documents
  pdf: ^3.11.0
  excel: ^5.0.0
  printing: ^5.14.0
  cached_network_image: ^3.4.0
  flutter_html: ^3.0.0
  flutter_pdfview: ^1.3.0
  qr_flutter: ^4.1.0
  
  # UX
  shimmer: ^3.0.0
  flutter_slidable: ^3.1.0
  fluttertoast: ^8.2.0
  smooth_page_indicator: ^1.2.0
  badges: ^3.1.0
  skeletonizer: ^1.4.0
  
  # Utils
  dart_jsonwebtoken: ^2.14.0
  jwt_decoder: ^2.0.1
  mask_text_input_formatter: ^2.9.0
  flutter_svg: ^2.0.0
  url_launcher: ^6.3.0
  file_picker: ^8.1.0
  timelime_tile: ^2.0.0
  flutter_rating_bar: ^4.0.0
  flutter_animate: ^4.5.0
  collection: ^1.18.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  integration_test:
    sdk: flutter
  mocktail: ^1.0.0
  riverpod_generator: ^3.0.0
  build_runner: ^2.4.0
  drift_dev: ^2.23.0
  alchemist: ^1.0.0
  patrol: ^3.0.0
  flutter_lints: ^5.0.0

flutter:
  uses-material-design: true
  generate: true
  
  assets:
    - assets/images/
    - assets/fonts/
    - assets/svg/
    - assets/i18n/
  
  fonts:
    - family: Inter
      fonts:
        - asset: assets/fonts/inter/Inter-Regular.ttf
        - asset: assets/fonts/inter/Inter-Medium.ttf
          weight: 500
        - asset: assets/fonts/inter/Inter-SemiBold.ttf
          weight: 600
        - asset: assets/fonts/inter/Inter-Bold.ttf
          weight: 700
    - family: Hanken Grotesk
      fonts:
        - asset: assets/fonts/hanken-grotesk/HankenGrotesk-Regular.ttf
        - asset: assets/fonts/hanken-grotesk/HankenGrotesk-Medium.ttf
          weight: 500
        - asset: assets/fonts/hanken-grotesk/HankenGrotesk-SemiBold.ttf
          weight: 600
        - asset: assets/fonts/hanken-grotesk/HankenGrotesk-Bold.ttf
          weight: 700
```

---

## Apéndice B: Estructura completa del proyecto Flutter

```
client/flutter-migration/
├── pubspec.yaml
├── analysis_options.yaml
├── l10n.yaml
├── build.yaml                          # build_runner config
├── flutter_native_splash.yaml
├── .env                                # Variables de entorno
├── .gitignore
├── web/
│   ├── index.html
│   ├── manifest.json
│   ├── icons/
│   └── splash/
├── android/
│   ├── app/
│   ├── build.gradle
│   └── settings.gradle
├── ios/
│   ├── Runner/
│   ├── Podfile
│   └── ...
├── assets/
│   ├── images/
│   │   ├── default-avatar.png
│   │   ├── favicon.png
│   │   ├── logo.png
│   │   └── login/
│   ├── fonts/
│   │   ├── inter/
│   │   ├── hanken-grotesk/
│   │   └── century-gothic/
│   ├── svg/
│   │   ├── icon-sprite.svg
│   │   └── landing-icons.svg
│   └── i18n/
│       ├── es.json
│       └── en.json
├── test/
│   ├── core/
│   │   ├── widgets/
│   │   └── providers/
│   ├── features/
│   └── helpers/
├── integration_test/
│   ├── app_test.dart
│   └── ...
└── lib/
    ├── main.dart
    ├── app.dart                           # MaterialApp + ProviderScope
    ├── bootstrap.dart                     # Inicialización Firebase, OneSignal
    ├── router/
    │   ├── app_router.dart                # GoRouter
    │   └── guards/
    │       ├── auth_guard.dart
    │       ├── role_guard.dart
    │       └── redirect_guard.dart
    ├── core/
    │   ├── theme/
    │   │   ├── app_theme.dart             # ThemeData + ThemeExtension
    │   │   ├── ds_colors.dart
    │   │   ├── ds_typography.dart
    │   │   └── primereact_preset.dart     # (no aplica, solo conceptual)
    │   ├── widgets/                       # Design System (~95 widgets)
    │   │   ├── app_data_table.dart
    │   │   ├── empty_state_widget.dart
    │   │   ├── status_badge.dart
    │   │   ├── app_icon.dart
    │   │   ├── confirm_dialog.dart
    │   │   ├── action_menu.dart
    │   │   ├── data_view_mobile.dart
    │   │   ├── responsive_layout.dart
    │   │   ├── table_caption.dart
    │   │   ├── table_footer.dart
    │   │   ├── shimmer_loader.dart
    │   │   ├── app_toast.dart
    │   │   ├── buttons/
    │   │   │   ├── app_button.dart
    │   │   │   ├── app_button_add.dart
    │   │   │   ├── app_button_save.dart
    │   │   │   ├── app_button_delete.dart
    │   │   │   └── app_button_icon.dart
    │   │   ├── charts/
    │   │   │   ├── bar_chart.dart
    │   │   │   ├── line_chart.dart
    │   │   │   ├── pie_chart.dart
    │   │   │   └── gauge_chart.dart
    │   │   ├── form_builder/              # Custom form fields
    │   │   ├── wizard/
    │   │   ├── timeline/
    │   │   ├── gantt/
    │   │   ├── signature_pad/
    │   │   ├── file_upload/
    │   │   ├── rich_text_editor/
    │   │   ├── barcode_scanner/
    │   │   ├── image_viewer/
    │   │   ├── command_palette/
    │   │   ├── customer_360/
    │   │   ├── theme_switcher/
    │   │   └── ...                         # Resto de ~95 widgets
    │   ├── providers/                      # Riverpod providers globales
    │   │   ├── auth_provider.dart
    │   │   ├── customer_provider.dart
    │   │   ├── role_provider.dart
    │   │   ├── layout_provider.dart
    │   │   ├── connectivity_provider.dart
    │   │   ├── menu_provider.dart
    │   │   ├── notification_provider.dart
    │   │   ├── sync_queue_provider.dart
    │   │   └── ui_provider.dart
    │   ├── http/
    │   │   ├── dio_client.dart             # Dio + interceptors
    │   │   ├── jwt_interceptor.dart
    │   │   ├── offline_interceptor.dart
    │   │   └── api_response.dart           # Response wrapper
    │   ├── services/
    │   │   ├── auth_service.dart
    │   │   ├── customer_service.dart
    │   │   ├── signalr_service.dart
    │   │   ├── one_signal_service.dart
    │   │   ├── connectivity_service.dart
    │   │   ├── sync_service.dart
    │   │   ├── export_pdf_service.dart
    │   │   ├── html_print_service.dart
    │   │   └── ...
    │   ├── models/                         # DTOs + Enums
    │   │   ├── dtos/
    │   │   ├── enums/
    │   │   └── interfaces/
    │   ├── constants/
    │   │   ├── environment.dart
    │   │   ├── endpoints.dart
    │   │   └── app_config.dart
    │   ├── utils/
    │   │   ├── extensions/                 # Extension methods (pipes)
    │   │   │   ├── string_extensions.dart
    │   │   │   ├── number_extensions.dart
    │   │   │   ├── date_extensions.dart
    │   │   │   └── bool_extensions.dart
    │   │   ├── helpers/
    │   │   │   ├── table_helper.dart
    │   │   │   ├── form_helper.dart
    │   │   │   ├── file_helper.dart
    │   │   │   ├── log_helper.dart
    │   │   │   └── document_types.dart
    │   │   └── validators/
    │   └── i18n/
    │       └── l10n/                       # ARB files
    ├── layouts/
    │   ├── employee/
    │   │   ├── employee_shell.dart
    │   │   ├── employee_desktop.dart
    │   │   ├── employee_mobile.dart
    │   │   ├── sidebar.dart
    │   │   ├── header.dart
    │   │   └── menu_drawer.dart
    │   ├── committee/
    │   │   ├── committee_shell.dart
    │   │   └── ...
    │   └── direccion/
    │       ├── direccion_shell.dart
    │       └── ...
    ├── auth/
    │   ├── login/
    │   │   ├── login_page.dart
    │   │   ├── login_form.dart
    │   │   └── login_mobile.dart
    │   ├── recovery/
    │   │   └── recover_password_page.dart
    │   └── reset/
    │       └── reset_password_page.dart
    ├── features/
    │   ├── accounting/
    │   │   ├── routes.dart
    │   │   ├── providers/
    │   │   ├── widgets/
    │   │   ├── ar/
    │   │   ├── budgeting/
    │   │   ├── general-ledger/
    │   │   └── fondeos-y-reporteo/
    │   ├── operations/
    │   │   ├── routes.dart
    │   │   ├── providers/
    │   │   ├── widgets/
    │   │   ├── announcements/
    │   │   ├── dashboard/
    │   │   ├── inventory/
    │   │   ├── meetings/
    │   │   ├── supervision/
    │   │   └── ...
    │   ├── purchasing/
    │   │   ├── routes.dart
    │   │   ├── providers/
    │   │   ├── widgets/
    │   │   ├── pr/
    │   │   ├── po/
    │   │   ├── providers/
    │   │   └── quotes/
    │   ├── hr/
    │   ├── maintenance/
    │   ├── system/
    │   ├── legal/
    │   └── recruitment/
    ├── shared/
    │   ├── widgets/
    │   │   ├── ai_chat_widget.dart
    │   │   └── image_analysis_dialog.dart
    │   └── utils/
    ├── pages-extra/
    │   ├── page_404.dart
    │   ├── page_500.dart
    │   ├── offline_page.dart
    │   └── unauthorized_page.dart
    └── generated/                         # Build runner output
        ├── ...
        └── app_localizations.dart
```

---

## Apéndice C: Estrategia de despliegue

### Build commands

```bash
# Development
flutter run -d chrome                                  # Web
flutter run -d android                                  # Android
flutter run -d ios                                      # iOS

# Production
flutter build apk --release --split-per-abi             # Android APK
flutter build appbundle --release                       # Android AAB (Play Store)
flutter build ios --release --no-codesign               # iOS (Xcode archive)
flutter build web --release --wasm                      # Web (WASM)

# Analysis
flutter analyze
dart format .
```

### CI/CD (Codemagic / GitHub Actions)

```yaml
# .github/workflows/flutter.yml
name: Flutter Build
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '4.0.x'
      - run: flutter pub get
      - run: flutter analyze
      - run: flutter test
      - run: flutter build web --wasm
      - run: flutter build apk --release
```

---

*Fin del reporte. Para decidir entre React y Flutter, revisar la sección 19 (Recomendaciones Finales) y la comparativa directa con React en `../react/REPORTE-MIGRACION.md`.*
