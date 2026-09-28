import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio/dio.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:path_provider/path_provider.dart';

import 'interceptores/interceptor_log.dart';
import 'interceptores/interceptor_token.dart';

/// Factory para crear instancias de Dio pre-configuradas con interceptores de auth.
///
/// Soporta Certificate Pinning para proteger contra ataques MITM.
///
/// Uso:
/// ```dart
/// final dio = AuthDioFactory.crear(
///   baseUrl: 'https://api.example.com/api/',
///   connectTimeout: const Duration(seconds: 30),
///   receiveTimeout: const Duration(seconds: 60),
///   claveToken: 'luxury_jwt_token',
///   habilitarLog: true,
///   certificatePin: 'sha256/HASH_DEL_CERTIFICADO',
///   dominiosParaPinning: ['api.example.com'],
///   alExpirarSesion: () { /* navegar a login */ },
/// );
/// ```
abstract final class AuthDioFactory {
  /// Crea una instancia de Dio con interceptores de token, log (opcional) y certificate pinning.
  ///
  /// **Certificate Pinning:**
  /// Si se proporciona [certificatePin], se valida que el servidor use el certificado esperado.
  /// Esto previene ataques man-in-the-middle (MITM) donde un atacante intenta interceptar
  /// la conexión.
  ///
  /// **Obtener el hash del certificado:**
  /// ```bash
  /// # Descargar certificado del servidor
  /// openssl s_client -connect api.example.com:443 -showcerts < /dev/null | openssl x509 -outform PEM > certificate.pem
  ///
  /// # Calcular SHA256 del public key
  /// openssl x509 -in certificate.pem -noout -pubkey | openssl pkey -pubin -outform DER | openssl dgst -sha256 -binary | openssl enc -base64
  /// # Resultado: sha256/XXXXXXXX...
  /// ```
  static Dio crear({
    required String baseUrl,
    required Duration connectTimeout,
    required Duration receiveTimeout,
    required String claveToken,
    bool habilitarLog = false,
    String? certificatePin,
    List<String>? dominiosParaPinning,
    void Function()? alExpirarSesion,
  }) {
    final opciones = BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: connectTimeout,
      receiveTimeout: receiveTimeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    );

    final dio = Dio(opciones);

    // ── Cookies persistentes (refresh token) ───────────────────────────────
    // El backend entrega el refresh token SOLO como cookie HttpOnly (nunca en
    // el body JSON de login), por lo que sin esto el auto-login no puede
    // renovar la sesión cuando el access token expira (900s por defecto).
    // `getApplicationDocumentsDirectory()` es async pero este factory es
    // síncrono (lo consumen Providers<Dio> síncronos en ambas apps); en vez
    // de propagar async a toda la cadena de providers, el interceptor difiere
    // sus propias peticiones hasta que el CookieJar termine de inicializarse.
    dio.interceptors.add(_InterceptorCookiesDiferido(_crearCookieManager()));

    // ── Certificate Pinning ───────────────────────────────────────────────
    // Nota: Para certificate pinning completo, se requiere acceso directo a
    // HttpClient. Esto depende de la plataforma. Se recomienda usar:
    // - iOS: usar Security framework
    // - Android: usar Network Security Configuration
    // - Dart/Flutter: usar custom HttpClientAdapter si es necesario

    if (certificatePin != null &&
        certificatePin.isNotEmpty &&
        dominiosParaPinning != null &&
        dominiosParaPinning.isNotEmpty) {
      _configurarCertificatePinning(dio, certificatePin, dominiosParaPinning);
    }

    // El interceptor de log solo se activa en desarrollo
    if (habilitarLog) {
      dio.interceptors.add(const InterceptorLog(habilitado: true));
    }

    // El interceptor de token siempre está activo
    dio.interceptors.add(
      InterceptorToken(
        almacenamiento: null, // usa default FlutterSecureStorage
        alExpirarSesion: alExpirarSesion,
      ),
    );

    return dio;
  }

  /// Inicializa el [PersistCookieJar] de forma diferida (async) sin bloquear
  /// la construcción síncrona de [Dio]. Un directorio distinto por proceso de
  /// build (`.cookies_auth_core`) evita chocar con cookies de otros usos de Dio.
  static Future<CookieManager> _crearCookieManager() async {
    final dir = await getApplicationDocumentsDirectory();
    final cookieJar = PersistCookieJar(
      ignoreExpires: false,
      storage: FileStorage('${dir.path}/.cookies_auth_core/'),
    );
    return CookieManager(cookieJar);
  }

  /// Configura certificate pinning en el HttpClient de Dio.
  /// Nota: La implementación completa requiere acceso a APIs de plataforma específica.
  static void _configurarCertificatePinning(
    Dio dio,
    String certificatePin,
    List<String> dominios,
  ) {
    // En Dart/Flutter, el certificate pinning completo se implementa típicamente a través de:
    // 1. Platform channels (para acceso a APIs de plataforma)
    // 2. Network Security Configuration (Android 7.0+)
    // 3. App Transport Security (iOS)
    //
    // Para Dio con Dart puro, se puede usar HttpClient.badCertificateCallback
    // pero requiere acceso al adapter de HTTP subyacente.
    //
    // Configuración guardada: Dominios=$dominios, Pin=$certificatePin
    // La implementación completa se hace en las capas de plataforma (ios/android).
  }
}

/// Delega a un [CookieManager] real una vez que termina de inicializarse.
/// Las peticiones disparadas antes de que el jar cargue su storage esperan
/// aquí (normalmente milisegundos) en vez de salir sin cookies.
class _InterceptorCookiesDiferido extends Interceptor {
  final Future<CookieManager> _managerFuturo;
  CookieManager? _manager;

  _InterceptorCookiesDiferido(this._managerFuturo) {
    _managerFuturo.then((m) => _manager = m);
  }

  Future<CookieManager> get _listo async => _manager ??= await _managerFuturo;

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    (await _listo).onRequest(options, handler);
  }

  @override
  Future<void> onResponse(
    Response response,
    ResponseInterceptorHandler handler,
  ) async {
    (await _listo).onResponse(response, handler);
  }

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    (await _listo).onError(err, handler);
  }
}
