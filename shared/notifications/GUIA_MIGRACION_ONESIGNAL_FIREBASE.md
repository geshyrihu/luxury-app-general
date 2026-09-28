# Guía: Migración de OneSignal + Firebase a cuentas nuevas

> **Contexto**: vas a crear una nueva cuenta de correo dedicada y con ella:
>
> 1. Una **nueva organización/proyecto en OneSignal** (App Android + App Web + Email transaccional).
> 2. Un **nuevo proyecto en Firebase** (vinculado a OneSignal solo para FCM en Android; Web NO necesita Firebase).
>
> Esta guía reemplaza los identificadores actuales:
>
> - OneSignal Android actual: `cb497deb-0fe9-424a-900d-2a006ddadf4f` (en `lib/core/config/configuracion_app.dart:36`).
> - OneSignal Web prod actual: `deeb5e28-6ebc-4260-967e-1b64331122fc` (Angular `environment.prod.ts:14` y API `appsettings.json:96`).
> - OneSignal Web dev actual: `1d454470-eba5-4d7b-82e8-f91b7bed263b`.
> - OneSignal Email actual: `g34eo9fp14ptokt86urvejppt9r5xjs8@templates.onesignal.email` (API `appsettings.json:92`).
> - Firebase Web actual (Angular): project `onesignalwebproduction`, app web `1:333252186012:web:d950fb0be847a39b580259`.
> - Firebase Android actual: `google-services.json` placeholder con `mobilesdk_app_id` en ceros (`android/app/google-services.json`).

---

## Paso 0 — Crear correo dedicado

1. Crea un Gmail/Outlook nuevo dedicado, ej: `luxuryapp-notificaciones@gmail.com`.
2. Habilita 2FA.
3. Úsalo para registrarte en **Firebase** y en **OneSignal**.

---

## Paso 1 — Crear nuevo proyecto en Firebase

1. Ve a https://console.firebase.google.com/ → **Add project** (o "Crear un proyecto").
2. Nombre sugerido: `luxuryapp-notifications` (NO uses `onesignalwebproduction`).
3. Desactiva Google Analytics si no lo necesitas (no es requisito para push).
4. Una vez creado, entra al proyecto.

### 1.1 Registrar la app Web (para Angular)

Firebase Console → Project Settings (⚙️) → **Your apps** → clic en el icono **Web** (`</>`).

- **App nickname**: `LuxuryApp Web`
- **Firebase Hosting**: NO (Angular no usa Hosting de Firebase; sirve con IIS/Nginx).
- **Register app**.
- Te mostrará un objeto `firebaseConfig`. **Cópialo completo**:

```js
const firebaseConfig = {
  apiKey: "<NUEVO_API_KEY_WEB>",
  authDomain: "<PROJECT_ID>.firebaseapp.com",
  projectId: "<PROJECT_ID>",
  storageBucket: "<PROJECT_ID>.appspot.com", // o .firebasestorage.app
  messagingSenderId: "<SENDER_ID>",
  appId: "1:<SENDER_ID>:web:<HASH>",
  measurementId: "G-XXXXXXXXXX",
};
```

→ **Guarda estos valores**: los necesitarás en el Paso 3 (Angular) y Paso 6 (llenado del MD con valores).

### 1.2 Registrar la app Android (para Flutter)

Firebase Console → Project Settings → **Your apps** → **Add app** → Android.

- **Android package name**: `com.example.mobile_commite` (de `android/app/build.gradle.kts:22`). Si decides renombrarlo, usa el nuevo y actualízalo en `build.gradle.kts` y todo el código.
- **App nickname**: `LuxuryApp Android`
- **Debug signing certificate SHA-1** (obligatorio para que Firebase genere un `google-services.json` válido):

```powershell
cd D:\repos\luxuryapp-api\appsmobil\flutter\commitee\app
# Tu debug keystore está en %USERPROFILE%\.android\debug.keystore
keytool -list -v -keystore "$env:USERPROFILE\.android\debug.keystore" -alias androiddebugkey -storepass android -keypass android
```

Copia el `SHA1:` y pégalo en Firebase.

- **Register app**.
- **Descarga `google-services.json`**.
- **Reemplaza** `D:\repos\luxuryapp-api\appsmobil\flutter\commitee\app\android\app\google-services.json` con el descargado.
- **Skip** los pasos 2/3 del wizard (no agregues el SDK Firebase a Gradle; la app no usa `firebase_*` packages).

> ⚠️ El `SHA-1` debe ser el del certificado con el que **firmas la build**. Si vas a firmar release con una keystore distinta, repite el paso en Firebase con el SHA-1 de release.

---

## Paso 2 — Crear nueva organización y apps en OneSignal

1. Ve a https://app.onesignal.com/ → **New Organization/Account** (registro con el correo nuevo del Paso 0).
2. Una vez dentro, ve a **Settings → Keys & IDs** para ver tu **Org ID** y **User Auth Key** (lo necesitarás si en el futuro quieres llamar a la API administrativa).

### 2.1 Crear **App Android** (push móvil)

1. OneSignal → **New App/Website** → selecciona **Android (Native)**.
2. Nombre: `LuxuryApp Android` (o `LuxuryApp Committee`).
3. **SDK Setup**:
   - Elige **Google Android (FCM)** como provider.
   - Te pedirá el **Firebase Server Key** y el **Firebase Sender ID** (messagingSenderId).
     - **Firebase Server Key**: Firebase Console → Project Settings → **Cloud Messaging** → habilita la API legacy (si está deshabilitada) y copia el campo **Server key**.
     - **Firebase Sender ID**: el `messagingSenderId` del `firebaseConfig` del Paso 1.1.
   - Pega ambos en OneSignal.
4. **App ID** que se genera (formato UUID): cópialo. Lo llamaremos **`ONESIGNAL_ANDROID_APP_ID`**.
5. **REST API Key**: Settings → Keys & IDs → **REST API Key**. Lo llamaremos **`ONESIGNAL_ANDROID_REST_API_KEY`**.

### 2.2 Crear **App Web** (push web para Angular)

1. OneSignal → **New App/Website** → **Web Push**.
2. Nombre: `LuxuryApp Web`.
3. Setup: elige **Custom Code** (Angular no usa plugin predefinido; insertarás el snippet manualmente).
4. Site URL: `https://luxurybuildingapp.com` (producción) y también `http://localhost:4200` (dev — agregar después en **Settings → Web Platform → Site URL adicional**).
5. Te dará **App ID** (UUID): cópialo. Lo llamaremos **`ONESIGNAL_WEB_APP_ID`** (prod) y **`ONESIGNAL_WEB_DEV_APP_ID`** (dev si decides crear una app separada para dev).
6. **REST API Key**: Settings → Keys & IDs → **REST API Key**. Lo llamaremos **`ONESIGNAL_WEB_REST_API_KEY`** (y `..._DEV` si creas app dev).

> 💡 **Recomendación**: usa **UNA sola app Web** en OneSignal y diferencia dev/prod por el `Site URL`. Solo crea app dev aparte si necesitas segmentación independiente (es el patrón actual). Mantenerlo simple: 1 app web.

### 2.3 Configurar **Email transaccional** (opcional, ya existe en backend)

1. OneSignal → **Channels → Email** → **Setup**.
2. Si la nueva org no incluye email, configura un **Email Sender** con tu dominio (registros SPF/DKIM los entrega OneSignal; te dará registros DNS para que tu proveedor de dominio los apunte).
3. Una vez configurado, el **Email App ID** será algo como `<otro_hash>@templates.onesignal.email`. Lo llamaremos **`ONESIGNAL_EMAIL_APP_ID`**.
4. **Email API Key** (distinta de REST API Key): la encuentras en Settings → Keys & IDs → **Email API Key**. Lo llamaremos **`ONESIGNAL_EMAIL_API_KEY`**.

---

## Paso 3 — Configurar Angular (appsweb/angular)

Archivos a editar:

- `D:\repos\luxuryapp-api\appsweb\angular\src\environments\environment.ts` (dev)
- `D:\repos\luxuryapp-api\appsweb\angular\src\environments\environment.prod.ts` (prod)

### 3.1 Reemplazar `firebaseConfig` (dev y prod)

```ts
firebase: {
  apiKey:            "<NUEVO_API_KEY_WEB>",            // de Paso 1.1
  authDomain:        "<PROJECT_ID>.firebaseapp.com",
  projectId:         "<PROJECT_ID>",
  storageBucket:     "<PROJECT_ID>.appspot.com",
  messagingSenderId: "<SENDER_ID>",
  appId:             "1:<SENDER_ID>:web:<HASH>",
  measurementId:     "G-XXXXXXXXXX"
}
```

> Los valores **deben coincidir** entre dev y prod si decides usar el mismo proyecto Firebase. Si quieres aislar, crea dos proyectos Firebase.

### 3.2 Reemplazar `ONESIGNAL_APPID`

```ts
export const ONESIGNAL_APPID = "<ONESIGNAL_WEB_APP_ID>"; // Paso 2.2
export const ONESIGNAL_ALLOWED_ORIGINS = ["http://localhost:4200", "https://luxurybuildingapp.com"];
```

> ⚠️ El actual código carga el SDK de OneSignal en runtime (ver `src/app/core/services/one-signal.service.ts`). **También agrega el App ID nuevo a Settings → Allowed Origins en el dashboard de OneSignal**.

### 3.3 Verificación Angular

```bash
cd D:\repos\luxuryapp-api\appsweb\angular
ng build --configuration=production
# Abrir http://localhost:4200 → Aceptar permiso de notificación
# En OneSignal → Audience → ver si aparece el nuevo subscriber
```

---

## Paso 4 — Configurar Flutter (appsmobil/flutter/commitee/app)

### 4.1 OneSignal App ID (`lib/core/config/configuracion_app.dart`)

```dart
static const String oneSignalAppId = '<ONESIGNAL_ANDROID_APP_ID>';  // Paso 2.1
```

### 4.2 Reemplazar `google-services.json`

Copia el `google-services.json` del Paso 1.2 a `android/app/google-services.json` (sobreescribe el placeholder).

### 4.3 Agregar permiso `POST_NOTIFICATIONS` (Android 13+)

`android/app/src/main/AndroidManifest.xml` — agregar dentro de `<manifest>`:

```xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.INTERNET" />
```

> Reportado como faltante en la auditoría (`AndroidManifest.xml` no los declara explícitamente). Flutter los agrega vía manifest-merger, pero declararlos explícitos es más claro.

### 4.4 `applicationId` y paquete Android (deber)

Tu `applicationId` actual es `com.example.mobile_commite` (placeholder). Si decides **renombrarlo**:

1. Edita `android/app/build.gradle.kts:22` → `applicationId = "com.luxuryapp.comite"` (o el que quieras).
2. Edita `android/app/build.gradle.kts:11` → `namespace = "com.luxuryapp.comite"`.
3. Edita el `package_name` en `android/app/google-services.json` (es el `package_name` dentro del JSON; debe coincidir).
4. Si tenías código que asume `com.example.mobile_commite`, actualízalo.

> Si lo dejas como `com.example.mobile_commite`, asegúrate de que el `package_name` en Firebase y el `applicationId` coincidan exactamente.

### 4.5 Verificación Flutter

```powershell
cd D:\repos\luxuryapp-api\appsmobil\flutter\commitee\app
flutter clean
flutter pub get
flutter build apk --debug
flutter run -d <DEVICE_ID>

# En la app: aceptar permiso de notificaciones
# En OneSignal → Audience → ver si aparece el nuevo subscriber (Device Type = Android)
```

---

## Paso 5 — Configurar el backend .NET (apps/api)

Archivos a editar:

- `D:\repos\luxuryapp-api\api\LuxuryApp.Api\appsettings.json` (prod)
- `D:\repos\luxuryapp-api\api\LuxuryApp.Api\appsettings.Development.json` (dev)

### 5.1 Sección `OneSignal` (push móvil — actualmente FALTA)

Agregar en **ambos** `appsettings.json` y `appsettings.Development.json`:

```json
"OneSignal": {
  "AppId":     "<ONESIGNAL_ANDROID_APP_ID>",
  "RestApiKey": "<ONESIGNAL_ANDROID_REST_API_KEY>"
}
```

> Esta sección es la que `ISendOneSignalService` espera (`OptionsServiceExtensions.cs:21-26` tiene el binding pero está vacío). Sin esto, `SendOneSignalService.cs` envía `app_id=""` y `Key ""` → push móvil falla silenciosamente.

### 5.2 Sección `OneSignalWeb` (Angular web)

```json
"OneSignalWeb": {
  "WebAppId":      "<ONESIGNAL_WEB_APP_ID>",
  "WebRestApiKey": "<ONESIGNAL_WEB_REST_API_KEY>"
}
```

En `appsettings.Development.json` también está `OneSignalWebDev` (si mantienes la separación dev/prod):

```json
"OneSignalWebDev": {
  "WebAppId":      "<ONESIGNAL_WEB_APP_ID_DEV_O_MISMO_QUE_PROD>",
  "WebRestApiKey": "<ONESIGNAL_WEB_REST_API_KEY_DEV_O_MISMO_QUE_PROD>"
}
```

> 💡 Si decides usar **una sola app Web** en OneSignal (recomendación del Paso 2.2), `OneSignalWebDev` puede apuntar a la misma app. La selección dev/prod en `OptionsServiceExtensions.cs:21-33` lee una u otra sección según `IHostEnvironment.IsDevelopment()`.

### 5.3 Sección `OneSignalEmail`

```json
"OneSignalEmail": {
  "AppId":            "<ONESIGNAL_EMAIL_APP_ID>",
  "ApiKey":           "<ONESIGNAL_EMAIL_API_KEY>",
  "EmailFromName":    "Luxury Building",
  "EmailFromAddress": "info@luxury-app.com"
}
```

> Verifica que el dominio `info@luxury-app.com` esté autenticado en OneSignal Email (Paso 2.3).

### 5.4 Vault (opcional pero recomendado)

Los secretos se copian automáticamente al `LuxuryAppVault` vía `VaultSeeder.cs:85-96`. Si quieres que los servicios lean del Vault en lugar de `IOptions`, hay que refactorizar `SendOneSignalService`/`SendOneSignalWebService`/`OneSignalEmailService` para usar `IVaultService`. Está fuera del alcance de esta migración, pero documéntalo como deuda técnica.

### 5.5 Verificación backend

```powershell
# Endpoint de diagnóstico existe:
# POST api/notifications/test-one-signal      → push móvil
# POST api/notifications/test-one-signal-web  → push web
# Ambos en NotificationsEndpoints.cs:37-43

# Levantar la API y probar con Swagger o Postman:
POST https://localhost:5001/api/notifications/test-one-signal
{
  "title": "Test nuevo OneSignal",
  "message": "Hola desde el backend migrado",
  "route": "/comite",
  "externalUserId": "<UUID_DE_UN_USUARIO_REAL>"
}
```

En OneSignal → **Delivery** deberías ver el push enviado (status 200 OK, recipients = 1).

---

## Paso 6 — Checklist final y valores a guardar

### 6.1 Nuevos identificadores

| Variable                         | Valor                              | Origen                               |
| -------------------------------- | ---------------------------------- | ------------------------------------ |
| `ONESIGNAL_ANDROID_APP_ID`       | `<UUID>`                           | Paso 2.1                             |
| `ONESIGNAL_ANDROID_REST_API_KEY` | `<os_v2_app_...>`                  | Paso 2.1                             |
| `ONESIGNAL_WEB_APP_ID`           | `<UUID>`                           | Paso 2.2                             |
| `ONESIGNAL_WEB_REST_API_KEY`     | `<os_v2_app_...>`                  | Paso 2.2                             |
| `ONESIGNAL_EMAIL_APP_ID`         | `<UUID>@templates.onesignal.email` | Paso 2.3                             |
| `ONESIGNAL_EMAIL_API_KEY`        | `<string>`                         | Paso 2.3                             |
| `FIREBASE_PROJECT_ID`            | `<string>`                         | Paso 1                               |
| `FIREBASE_WEB_API_KEY`           | `AIza...`                          | Paso 1.1                             |
| `FIREBASE_WEB_APP_ID`            | `1:SENDER:web:HASH`                | Paso 1.1                             |
| `FIREBASE_SENDER_ID`             | `<string>`                         | Paso 1.1                             |
| `FIREBASE_ANDROID_APP_ID`        | `1:SENDER:android:HASH`            | Paso 1.2 (en `google-services.json`) |
| `FIREBASE_ANDROID_API_KEY`       | `AIza...`                          | Paso 1.2 (en `google-services.json`) |

### 6.2 Archivos del proyecto que quedan modificados

- [ ] `appsweb/angular/src/environments/environment.ts`
- [ ] `appsweb/angular/src/environments/environment.prod.ts`
- [ ] `appsmobil/flutter/commitee/app/lib/core/config/configuracion_app.dart`
- [ ] `appsmobil/flutter/commitee/app/android/app/google-services.json`
- [ ] `appsmobil/flutter/commitee/app/android/app/src/main/AndroidManifest.xml` (permisos POST_NOTIFICATIONS/INTERNET)
- [ ] `api/LuxuryApp.Api/appsettings.json`
- [ ] `api/LuxuryApp.Api/appsettings.Development.json`

### 6.3 Validación de extremo a extremo

1. **Web push (Angular)**:
   - Login en `https://luxurybuildingapp.com` → aceptar permiso de notif.
   - OneSignal → Audience: aparece 1 subscriber con `Device Type = Web Push`.
   - Disparar push desde backend (`test-one-signal-web`) → llega al navegador.

2. **Android push (Flutter)**:
   - `flutter run` → app arranca → aceptar permiso de notif.
   - OneSignal → Audience: aparece 1 subscriber con `Device Type = Android`.
   - Disparar push desde backend (`test-one-signal`) → llega al dispositivo.

3. **Email transaccional**:
   - Disparar flujo que envíe email (ej. invitación a junta) → llega al destinatario.

4. **Alias `external_id`**:
   - En Flutter, después del login, `_servicioNotificaciones.vincularUsuario(userId)` llama `OneSignal.login(idUsuario)`. Verifica en OneSignal → Audience → OneSignal Player → campo `external_id` = `ApplicationUser.Id` (Guid del backend).

### 6.4 Limpieza posterior

- Borrar la organización OneSignal vieja (`luxurybuildingapp`/lo que sea).
- Borrar el proyecto Firebase viejo (`onesignalwebproduction`) si no lo vas a usar para otra cosa.
- Revocar claves API anteriores en OneSignal (Settings → Keys & IDs → Regenerate) si sospechas que quedaron expuestas.
- Actualizar README del repo mencionando los nuevos identificadores (sin commitear las claves en texto plano — usa `.example` y Vault).

---

## Notas finales

- **El `google-services.json` placeholder con `mobilesdk_app_id` en ceros** es lo que actualmente está rompiendo tu app Android (Firebase rechaza la autenticación → OneSignal cuelga → splash infinito). Reemplazarlo por uno generado en Firebase Console (Paso 1.2) es **la solución principal**, más importante que migrar a cuentas nuevas.
- **El push móvil del backend nunca funcionó** porque la sección `OneSignal` está ausente en `appsettings.*`. Esta migración lo arregla de paso.
- **No hay tabla en BD que persista `player_id`**: el backend solo usa el alias `external_id` (= `ApplicationUser.Id`). El cliente (Flutter/Angular) lo asigna al inicializar OneSignal. No se necesita refactor de BD.
- **Los endpoints de diagnóstico** (`test-one-signal`, `test-one-signal-web`) son perfectos para validar la migración sin esperar a un flujo real.

---

## Paso 7 — Configurar iOS (Flutter)

> **Estado actual**: la carpeta `ios/` existe (`D:\repos\luxuryapp-api\appsmobil\flutter\commitee\app\ios`) pero **no tiene NADA configurado para OneSignal/FCM**. Faltan:
>
> - `GoogleService-Info.plist`
> - `OneSignalAppId` en `Info.plist`
> - Capability **Push Notifications** + APNs en el Xcode project
> - Entitlements `aps-environment`
>
> Si solo vas a publicar Android, puedes saltarte este paso. Si en el futuro quieres iOS, síguelo completo.

### 7.1 Requisitos previos (macOS con Xcode)

- macOS con **Xcode 15+** instalado.
- Cuenta de **Apple Developer Program** (paga) activa para App Store y APNs reales. Para pruebas en device sin publicar, basta una **Apple ID personal** con provisioning automático.
- **CocoaPods** (`sudo gem install cocoapods` o `brew install cocoapods`).
- Tu **Bundle Identifier** final, ej: `com.luxuryapp.comite`.

### 7.2 Crear el App ID y capability en Apple Developer

1. Ve a https://developer.apple.com/account → **Certificates, Identifiers & Profiles** → **Identifiers**.
2. **+** → **App IDs** → **App** → Next.
3. **Description**: `LuxuryApp Committee`.
4. **Bundle ID**: `com.luxuryapp.comite` (debe coincidir con el `applicationId` que usarás en Xcode; si mantienes el `com.example.mobile_commite` actual, usa ese).
5. En **Capabilities**, marca **Push Notifications** ✅.
6. **Continue** → **Register**.

### 7.3 Crear el provisioning profile

1. **Profiles** → **+** → **iOS App Development** (para debug en device) o **App Store** (para release).
2. Selecciona el **App ID** que acabas de crear.
3. Selecciona tu **certificado de developer** y los **devices** de prueba.
4. Genera y **descarga** el `.mobileprovision`.

### 7.4 Generar APNs Key (para OneSignal)

OneSignal necesita una **APNs Auth Key** (.p8) o un **APNs Certificate** (.p12) para enviar pushes a iOS.

**Recomendado: APNs Auth Key** (más moderno, no caduca anualmente):

1. Apple Developer → **Certificates, Identifiers & Profiles** → **Keys** → **+**.
2. **Key Name**: `LuxuryApp OneSignal APNs Key`.
3. Marca **Apple Push Notifications service (APNs)** ✅ → **Continue** → **Register**.
4. **Descarga el `.p8`** (es la única vez; guárdalo seguro) → anota el **Key ID**.
5. Necesitarás también tu **Team ID** (Apple Developer → Membership → Team ID).

### 7.5 Registrar app iOS en Firebase (para FCM en iOS)

> Aunque OneSignal canaliza hacia FCM, en iOS **necesitas un `GoogleService-Info.plist`** válido para que `firebase_messaging` (y por transitividad `onesignal_flutter`) funcionen.

1. Firebase Console → **Project Settings** → **Your apps** → **Add app** → **iOS**.
2. **Apple bundle ID**: `com.luxuryapp.comite` (o el que uses).
3. **App nickname**: `LuxuryApp iOS`.
4. **App Store ID** (opcional, lo puedes dejar vacío para debug).
5. **Register app** → **Download `GoogleService-Info.plist`**.
6. **Skip** los pasos del wizard (no agregues `firebase_core` al `Podfile`; con `onesignal_flutter` basta porque ya lo trae como dependencia transitiva, pero necesitas el `.plist`).

### 7.6 Configurar la app iOS OneSignal

1. OneSignal → **New App/Website** → **iOS (Native)**.
2. Nombre: `LuxuryApp iOS` (o usa la misma que creaste para Android y agrega la plataforma iOS a esa app: **Settings → Platforms → Apple iOS**).
3. **Apple SDK**:
   - Te pedirá subir el **APNs Auth Key (.p8)** o Certificate (.p12).
   - Sube el `.p8` del Paso 7.4.
   - **Key ID**: el del Paso 7.4.
   - **Team ID**: el del Paso 7.4.
   - **Bundle ID**: `com.luxuryapp.comite` (debe coincidir exactamente con el del App ID de Apple).
4. **Save**. OneSignal te asignará el **App ID** (puede ser el mismo UUID que el de Android, si es la misma app; si creaste apps separadas, será otro UUID).
5. **REST API Key**: Settings → Keys & IDs.

### 7.7 Modificar el proyecto Flutter (Xcode)

Abre el proyecto iOS:

```bash
cd D:\repos\luxuryapp-api\appsmobil\flutter\commitee\app
open ios/Runner.xcworkspace
```

#### 7.7.1 Agregar `GoogleService-Info.plist`

1. En Xcode, clic derecho sobre la carpeta `Runner` → **Add Files to "Runner"…**.
2. Selecciona `GoogleService-Info.plist` descargado en Paso 7.5.
3. **Importante**: en el panel derecho marca el target **Runner** ✅ y **Copy items if needed** ✅.
4. Confirma que aparece en el **Project Navigator** bajo `Runner/`.

#### 7.7.2 Agregar `OneSignalAppId` al `Info.plist`

Edita `ios/Runner/Info.plist` y agrega dentro del `<dict>` principal (sugiero justo después de `CFBundleDisplayName`):

```xml
<key>OneSignalAppId</key>
<string><ONESIGNAL_IOS_APP_ID_O_MISMO_QUE_ANDROID></string>

<key>OneSignalAutoPrompt</key>
<false/>
```

> Si estás usando la **misma app OneSignal** para Android e iOS, pon aquí el mismo `ONESIGNAL_ANDROID_APP_ID`. Si creaste apps separadas, usa el UUID que te dio OneSignal al agregar la plataforma iOS.

#### 7.7.3 Habilitar Push Notifications capability

1. En Xcode, selecciona el proyecto **Runner** (icono azul arriba).
2. Pestaña **Signing & Capabilities** → **+ Capability** → busca **Push Notifications** → agregar.
3. Verifica que **Background Modes** también esté presente (suele agregarse al seleccionar Push Notifications). Marca **Remote notifications** ✅.

#### 7.7.4 Configurar el deployment target

`ios/Podfile` (primera línea):

```ruby
platform :ios, '12.0'   # mínimo requerido por onesignal_flutter 5.x
```

Si tu proyecto dice `13.0` o mayor, déjalo.

#### 7.7.5 Verificar `AppDelegate.swift`

`ios/Runner/AppDelegate.swift` debe verse similar a:

```swift
import UIKit
import Flutter

@UIApplicationMain
@objc class AppDelegate: FlutterAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    GeneratedPluginRegistrant.register(with: self)
    // OneSignal se inicializa desde Dart (servicio_notificaciones.dart)
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}
```

> **No hace falta** instanciar OneSignal en AppDelegate: `onesignal_flutter` lo hace desde Dart. Pero necesitas la capability APNs habilitada (Paso 7.7.3) o el plugin no recibirá tokens.

#### 7.7.6 Pod install

```bash
cd ios
pod install --repo-update
cd ..
```

### 7.8 Permiso iOS de notificaciones

iOS pide permiso la primera vez que el usuario interactúa. Tu `ServicioNotificaciones.inicializar()` ya llama `OneSignal.Notifications.requestPermission(true)` (`servicio_notificaciones.dart:18`), lo cual dispara el diálogo nativo. **No hay que agregar nada en Info.plist** para iOS (a diferencia de Android 13+).

### 7.9 Verificación iOS

```bash
flutter clean
cd ios && pod install && cd ..
flutter run -d <IOS_DEVICE_ID>   # device real OBLIGATORIO para probar APNs

# En el device: aceptar permiso de notificaciones
# En OneSignal → Audience → ver si aparece el nuevo subscriber (Device Type = iOS)
```

> ⚠️ **Los simuladores NO reciben pushes APNs**. Necesitas un device físico.

Disparar push desde backend:

```powershell
POST https://localhost:5001/api/notifications/test-one-signal
{
  "title": "Test iOS",
  "message": "Push desde el backend al iPhone",
  "route": "/comite",
  "externalUserId": "<UUID>"
}
```

En OneSignal → **Delivery** debe aparecer el push enviado a iOS.

---

## Paso 8 — Checklist iOS adicional

- [ ] Apple Developer App ID creado con Push Notifications capability
- [ ] APNs Auth Key (.p8) descargada y guardada en sitio seguro
- [ ] Provisioning profile generado y aplicado en Xcode
- [ ] Firebase Console tiene registrada la app iOS (mismo proyecto Firebase)
- [ ] `GoogleService-Info.plist` descargado y agregado a `ios/Runner/`
- [ ] Bundle ID en Xcode = mismo que en Apple Developer y Firebase
- [ ] `OneSignalAppId` en `Info.plist`
- [ ] Push Notifications capability habilitada en Xcode + Background Modes → Remote notifications
- [ ] OneSignal: plataforma iOS agregada con APNs Auth Key, Key ID, Team ID
- [ ] `pod install` ejecutado
- [ ] Test en device físico (no simulador)
- [ ] Push desde backend llega al iPhone

---

## Resumen de archivos modificados (todos los pasos)

| Plataforma      | Archivo                                                                   | Cambio                                                         |
| --------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Backend         | `api/LuxuryApp.Api/appsettings.json`                                      | `OneSignal.AppId/RestApiKey`, `OneSignalWeb`, `OneSignalEmail` |
| Backend         | `api/LuxuryApp.Api/appsettings.Development.json`                          | Igual + `OneSignalWebDev`                                      |
| Angular         | `appsweb/angular/src/environments/environment.ts`                         | `firebase`, `ONESIGNAL_APPID`                                  |
| Angular         | `appsweb/angular/src/environments/environment.prod.ts`                    | Igual                                                          |
| Flutter Android | `appsmobil/flutter/commitee/app/lib/core/config/configuracion_app.dart`   | `oneSignalAppId`                                               |
| Flutter Android | `appsmobil/flutter/commitee/app/android/app/google-services.json`         | Reemplazo con archivo válido de Firebase                       |
| Flutter Android | `appsmobil/flutter/commitee/app/android/app/src/main/AndroidManifest.xml` | `POST_NOTIFICATIONS` + `INTERNET`                              |
| Flutter iOS     | `appsmobil/flutter/commitee/app/ios/Runner/GoogleService-Info.plist`      | Agregado (nuevo)                                               |
| Flutter iOS     | `appsmobil/flutter/commitee/app/ios/Runner/Info.plist`                    | `OneSignalAppId`, `OneSignalAutoPrompt`                        |
| Flutter iOS     | `appsmobil/flutter/commitee/app/ios/Runner.xcodeproj`                     | Push Notifications capability (vía Xcode UI)                   |
| Flutter iOS     | `appsmobil/flutter/commitee/app/ios/Podfile`                              | `platform :ios, '12.0'` (verificar)                            |

---

## Paso 9 — Estrategia dev / prod por plataforma

> **Principio**: cada plataforma (Angular Web, Flutter Android, Flutter iOS, Backend) debe poder apuntar a su **app de prueba de OneSignal/Firebase** cuando se compila en modo desarrollo, y a la **app productiva** cuando se compila en modo release — **sin tocar código fuente ni hacer commits para cambiar de entorno**.

### 9.1 Mapa de artefactos necesarios

| Plataforma            | Artefacto dev                                           | Artefacto prod                                  |
| --------------------- | ------------------------------------------------------- | ----------------------------------------------- |
| **OneSignal Web**     | App `LuxuryApp Web Dev` (UUID dedicado)                 | App `LuxuryApp Web`                             |
| **OneSignal Android** | App `LuxuryApp Android Dev` (UUID dedicado)             | App `LuxuryApp Android`                         |
| **OneSignal iOS**     | App `LuxuryApp iOS Dev` (UUID dedicado)                 | App `LuxuryApp iOS`                             |
| **OneSignal Email**   | (mismo App ID en dev y prod — solo cambia el remitente) | (igual)                                         |
| **Firebase Web**      | Proyecto `luxuryapp-notifications-dev`                  | Proyecto `luxuryapp-notifications`              |
| **Firebase Android**  | App Android dentro de `luxuryapp-notifications-dev`     | App Android dentro de `luxuryapp-notifications` |
| **Firebase iOS**      | App iOS dentro de `luxuryapp-notifications-dev`         | App iOS dentro de `luxuryapp-notifications`     |

> 💡 **¿Por qué proyectos Firebase separados?** Para que los push tokens y las métricas no se mezclen. Si no te importa, puedes usar **un solo proyecto Firebase** y solo cambiar el `google-services.json` / `GoogleService-Info.plist` entre dev/prod.

### 9.2 Backend .NET (ya está medio resuelto)

`api/LuxuryApp.Api/OptionsServiceExtensions.cs:29-31` ya distingue dev/prod leyendo `OneSignalWebDev` o `OneSignalWeb` según `IHostEnvironment.IsDevelopment()`. Solo falta extenderlo:

#### 9.2.1 Crear apps OneSignal dev adicionales

1. **OneSignal Web Dev**: New App/Website → Web Push → nombre `LuxuryApp Web Dev`. Anota `ONESIGNAL_WEB_DEV_APP_ID` y `ONESIGNAL_WEB_DEV_REST_API_KEY`.
2. **OneSignal Android Dev**: New App/Website → Android → nombre `LuxuryApp Android Dev`. Vincula con Firebase `luxuryapp-notifications-dev`. Anota `ONESIGNAL_ANDROID_DEV_APP_ID` y `ONESIGNAL_ANDROID_DEV_REST_API_KEY`.
3. **OneSignal iOS Dev**: Settings de la app anterior (Android Dev) → Platforms → Add iOS. O crea una nueva app iOS separada. Anota `ONESIGNAL_IOS_DEV_APP_ID` y `ONESIGNAL_IOS_DEV_REST_API_KEY`.

#### 9.2.2 `appsettings.Development.json`

```json
"OneSignal": {
  "AppId":     "<ONESIGNAL_ANDROID_DEV_APP_ID>",
  "RestApiKey": "<ONESIGNAL_ANDROID_DEV_REST_API_KEY>"
},
"OneSignalWebDev": {
  "WebAppId":      "<ONESIGNAL_WEB_DEV_APP_ID>",
  "WebRestApiKey": "<ONESIGNAL_WEB_DEV_REST_API_KEY>"
},
"OneSignalIosDev": {
  "AppId":     "<ONESIGNAL_IOS_DEV_APP_ID>",
  "RestApiKey": "<ONESIGNAL_IOS_DEV_REST_API_KEY>"
},
"OneSignalEmail": {
  "AppId":            "<ONESIGNAL_EMAIL_APP_ID>",
  "ApiKey":           "<ONESIGNAL_EMAIL_API_KEY>",
  "EmailFromName":    "Luxury Building (Dev)",
  "EmailFromAddress": "dev@luxury-app.com"
}
```

#### 9.2.3 `appsettings.json` (producción)

```json
"OneSignal": {
  "AppId":     "<ONESIGNAL_ANDROID_APP_ID>",
  "RestApiKey": "<ONESIGNAL_ANDROID_REST_API_KEY>"
},
"OneSignalWeb": {
  "WebAppId":      "<ONESIGNAL_WEB_APP_ID>",
  "WebRestApiKey": "<ONESIGNAL_WEB_REST_API_KEY>"
},
"OneSignalIos": {
  "AppId":     "<ONESIGNAL_IOS_APP_ID>",
  "RestApiKey": "<ONESIGNAL_IOS_REST_API_KEY>"
},
"OneSignalEmail": {
  "AppId":            "<ONESIGNAL_EMAIL_APP_ID>",
  "ApiKey":           "<ONESIGNAL_EMAIL_API_KEY>",
  "EmailFromName":    "Luxury Building",
  "EmailFromAddress": "info@luxury-app.com"
}
```

#### 9.2.4 Extender `OptionsServiceExtensions.cs` (dev/prod para iOS)

```csharp
var oneSignalIosSection = environment.IsDevelopment()
    ? configuration.GetSection("OneSignalIosDev")
    : configuration.GetSection("OneSignalIos");
services.Configure<OneSignalIosSettingsDTO>(oneSignalIosSection);
```

Y crear `OneSignalIosSettingsDTO` espejo de `OneSignalSettingsDTO` con `AppId` + `RestApiKey`.

#### 9.2.5 `ISendOneSignalService` para que sepa a qué plataforma enviar

Hoy `SendOneSignalService` solo usa `OneSignalSettingsDTO` (push móvil → todos). Para diferenciar Android vs iOS en backend:

- **Opción A (recomendada)**: un solo servicio `ISendOneSignalService` que acepta un parámetro `Platform = "android" | "ios"` y elige qué `OneSignalSettingsDTO` o `OneSignalIosSettingsDTO` usar. Un solo POST a OneSignal si la app OneSignal es la misma para Android e iOS (multi-plataforma). Si son apps separadas, dos POSTs.

- **Opción B (más simple, válida si ambas plataformas comparten app OneSignal)**: no hacer nada, `SendOneSignalService` con su `OneSignalSettingsDTO` cubre ambos. La elección de a qué dispositivo llega lo hace OneSignal enrutando por canal.

> 💡 **Recomendación**: si vas a crear **una sola app OneSignal** con plataformas Android+iOS (Paso 2), usa la Opción B (sin cambios). Si vas a crear **apps separadas** (más estricto), usa la Opción A.

#### 9.2.6 Verificación backend dev vs prod

```powershell
$env:ASPNETC_ENVIRONMENT = "Development"
dotnet run --project api/LuxuryApp.Api
# Probar endpoint test-one-signal con un usuario de prueba
# En OneSignal Web Dev → Audience → debe aparecer el subscriber
```

```powershell
$env:ASPNETC_ENVIRONMENT = "Production"
dotnet run --project api/LuxuryApp.Api
# Disparar test-one-signal → en OneSignal Web (prod) → Audience
```

### 9.3 Angular Web (ya está medio resuelto)

#### 9.3.1 Estado actual

- `environment.ts` (dev) tiene `ONESIGNAL_APPID = "<ONESIGNAL_WEB_DEV_APP_ID>"` y `firebase` con proyecto dev.
- `environment.prod.ts` (prod) tiene `ONESIGNAL_APPID = "<ONESIGNAL_WEB_APP_ID>"` y `firebase` con proyecto prod.

#### 9.3.2 Comandos

```bash
# Dev → compila con environment.ts
ng serve
# o
ng build --configuration=development

# Prod → compila con environment.prod.ts
ng build --configuration=production
```

Angular CLI reemplaza automáticamente `import { environment } from 'src/environments/environment'` con la versión correcta según la flag.

#### 9.3.3 Asegúrate de que `angular.json` tenga la configuración `fileReplacements`

`appsweb/angular/angular.json` → sección `projects.<app>.architect.build.configurations.production`:

```json
"production": {
  "fileReplacements": [
    {
      "replace": "src/environments/environment.ts",
      "with":  "src/environments/environment.prod.ts"
    }
  ],
  ...
}
```

Si esto ya está, perfecto. Si no, agrégalo.

#### 9.3.4 `main.ts` / `app.config.ts` deben importar desde `environments/environment` (sin `.prod`)

Verificado en el reporte previo (`app.config.ts:39`). El CLI resuelve en build.

### 9.4 Flutter (Android + iOS)

Flutter no tiene un sistema nativo de `fileReplacements` como Angular. Las dos opciones son:

#### Opción A: `--dart-define` (recomendado, ya lo usas)

`lib/core/config/configuracion_app.dart` ya tiene `_entorno = String.fromEnvironment('ENTORNO', defaultValue: 'dev')` y un getter `esProduccion`. Extender:

```dart
// ── OneSignal ──────────────────────────────────────────────────────────────
// Dev: app OneSignal "LuxuryApp Android Dev" + "LuxuryApp iOS Dev"
// Prod: app OneSignal "LuxuryApp Android" + "LuxuryApp iOS"
static const String _oneSignalAndroidAppIdDev = '<ONESIGNAL_ANDROID_DEV_APP_ID>';
static const String _oneSignalAndroidAppIdProd = '<ONESIGNAL_ANDROID_APP_ID>';
static const String _oneSignalIosAppIdDev = '<ONESIGNAL_IOS_DEV_APP_ID>';
static const String _oneSignalIosAppIdProd = '<ONESIGNAL_IOS_APP_ID>';

static const String _oneSignalAppIdActual = String.fromEnvironment(
  'ONESIGNAL_APP_ID',
  defaultValue: '',  // si no se pasa, usamos las de dev/prod por defecto
);

static String get oneSignalAppId {
  if (_oneSignalAppIdActual.isNotEmpty) return _oneSignalAppIdActual;  // override explícito
  return esProduccion ? _oneSignalAndroidAppIdProd : _oneSignalAndroidAppIdDev;
}

static String get oneSignalIosAppId {
  return esProduccion ? _oneSignalIosAppIdProd : _oneSignalIosAppIdDev;
}
```

#### Comandos de build

```bash
# Android dev (debug, apunta a OneSignal Android Dev + API dev)
flutter run --dart-define=ENTORNO=dev

# Android prod (release APK)
flutter build apk --release --dart-define=ENTORNO=prod

# iOS dev
flutter run --dart-define=ENTORNO=dev

# iOS prod
flutter build ios --release --dart-define=ENTORNO=prod
```

> ⚠️ **El App ID de OneSignal Android está hardcoded en `lib/core/config/configuracion_app.dart:36`**. Eso significa que **el mismo APK instalado contiene un único App ID**. Si el mismo dispositivo necesita probar dev y prod, debe desinstalar y reinstalar. Si quieres que coexistan, necesitas:
>
> - Diferenciar `applicationId` (`com.luxuryapp.comite.dev` vs `com.luxuryapp.comite`), lo que te da dos apps distintas instaladas en paralelo.
> - O usar **flavors** de Android/iOS (Paso 9.5).

#### Opción B: flavors (más robusto)

Si necesitas dev/prod **simultáneamente en el mismo dispositivo** (QA, demos, etc.), usa flavors.

**Android (`android/app/build.gradle.kts`):**

```kotlin
android {
    flavorDimensions += "environment"

    productFlavors {
        create("dev") {
            dimension = "environment"
            applicationIdSuffix = ".dev"   // com.example.mobile_commite.dev
            versionNameSuffix = "-dev"
            resValue("string", "app_name", "LuxuryApp Dev")
        }
        create("prod") {
            dimension = "environment"
            resValue("string", "app_name", "LuxuryApp")
        }
    }
}
```

**iOS (Xcode → Runner → Build Settings → + → User-Defined):**

- `PRODUCT_BUNDLE_IDENTIFIER` distinto por Configuration.
- O duplicar el target (más limpio): Runner-Dev y Runner-Prod.

**Flutter (`lib/main.dart`):**

```dart
const appFlavor = String.fromEnvironment('FLAVOR', defaultValue: 'dev');
// o leer flavor de dart_defines
```

```bash
flutter run --flavor dev -t lib/main_dev.dart
flutter build apk --flavor prod --release
```

> Los flavors son más complejos pero te permiten tener `LuxuryApp Dev` y `LuxuryApp` instalados a la vez en el mismo dispositivo.

### 9.5 Estrategia recomendada para tu proyecto

| Plataforma       | Estrategia                                                                 | Razón                                                        |
| ---------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------- |
| Backend          | `appsettings.Development.json` + `appsettings.Production.json` (ya existe) | Patrón estándar .NET                                         |
| Angular          | `environment.ts` + `environment.prod.ts` + `fileReplacements` (ya existe)  | Patrón estándar Angular CLI                                  |
| Flutter Android  | `--dart-define=ENTORNO=dev                                                 | prod`+ override opcional`--dart-define=ONESIGNAL_APP_ID=...` | Suficiente si QA no necesita coexistencia |
| Flutter iOS      | Igual que Android                                                          | Suficiente si QA no necesita coexistencia                    |
| OneSignal        | Apps separadas dev/prod por plataforma                                     | Aisla métricas y audiencias                                  |
| Firebase Web     | Proyectos separados dev/prod                                               | Aisla tokens                                                 |
| Firebase Android | Proyectos separados dev/prod (con apps Android registradas en cada uno)    | Cada `google-services.json` es único                         |
| Firebase iOS     | Proyectos separados dev/prod (con apps iOS registradas en cada uno)        | Cada `GoogleService-Info.plist` es único                     |

### 9.6 Gitignore: nunca subir archivos con secretos reales

Agrega a `.gitignore` raíz:

```gitignore
# Firebase (los .json tienen api_key aunque sea público)
appsmobil/flutter/**/google-services.json
appsmobil/flutter/**/GoogleService-Info.plist

# Angular environments reales (mantén solo .example.ts)
appsweb/angular/src/environments/environment.ts
appsweb/angular/src/environments/environment.prod.ts

# Backend secrets
api/**/appsettings.Development.json
api/**/appsettings.Production.json
```

Sube solo los `.example.*` con placeholders `YOUR_*`.

### 9.7 Checklist de coexistencia dev/prod

- [ ] Apps OneSignal dev creadas (Web, Android, iOS) con sus REST API Keys
- [ ] Proyectos Firebase dev creados (Web, Android, iOS) con sus `google-services.json` / `GoogleService-Info.plist`
- [ ] Backend distingue dev/prod (extender `OptionsServiceExtensions.cs` para iOS)
- [ ] Angular usa `fileReplacements` (verificar `angular.json`)
- [ ] Flutter usa `--dart-define=ENTORNO=...` + override `ONESIGNAL_APP_ID=...`
- [ ] `.gitignore` excluye los archivos con secretos reales
- [ ] Cada `.example.*` documenta qué valores faltan
- [ ] El README del repo explica cómo generar los archivos reales localmente
- [ ] Documentar la rotación de claves: si se filtra una clave dev, regenerar sin tocar prod (y viceversa)
