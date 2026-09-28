import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/config/app_colores.dart';
import '../../../core/enrutador/enrutador_app.dart';
import '../../../core/proveedores/proveedores_servicios.dart';
import '../../../presentacion/proveedores/proveedor_sesion.dart';

class LoginPantalla extends ConsumerStatefulWidget {
  const LoginPantalla({super.key});

  @override
  ConsumerState<LoginPantalla> createState() => _LoginPantallaState();
}

class _LoginPantallaState extends ConsumerState<LoginPantalla> {
  final _claveFormulario = GlobalKey<FormState>();
  final _usuarioCtrl = TextEditingController();
  final _passCtrl = TextEditingController();

  bool _mantenerSesion = false;
  bool _cargando = false;
  bool _verContrasena = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _cargarCredencialesGuardadas();
  }

  @override
  void dispose() {
    _usuarioCtrl.dispose();
    _passCtrl.dispose();
    super.dispose();
  }

  Future<void> _cargarCredencialesGuardadas() async {
    final creds =
        await ref.read(proveedorServicioAuth).leerCredencialesRecordadas();
    if (creds != null && mounted) {
      setState(() {
        _usuarioCtrl.text = creds.email;
        _passCtrl.text = creds.contrasena;
        _mantenerSesion = true;
      });
    }
  }

  Future<void> _iniciarSesion() async {
    if (!_claveFormulario.currentState!.validate()) return;

    setState(() {
      _cargando = true;
      _error = null;
    });

    await ref.read(proveedorSesionProvider.notifier).iniciarSesion(
          nombreUsuario: _usuarioCtrl.text.trim(),
          contrasena: _passCtrl.text,
          recordarSesion: _mantenerSesion,
        );

    if (!mounted) return;

    final sesion = ref.read(proveedorSesionProvider);
    if (sesion.estado == EstadoAuth.error) {
      setState(() {
        _cargando = false;
        _error = sesion.mensajeError;
      });
    }
    // Si fue exitoso, GoRouter redirige automáticamente a /dashboard
  }

  @override
  Widget build(BuildContext context) {
    ref.listen<EstadoSesion>(proveedorSesionProvider, (_, actual) {
      if (actual.estado != EstadoAuth.verificando && _cargando) {
        setState(() => _cargando = false);
      }
    });

    return Scaffold(
      backgroundColor: background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
          child: Form(
            key: _claveFormulario,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const SizedBox(height: 32),
                // Logo
                Container(
                  width: 64,
                  height: 64,
                  decoration: const BoxDecoration(
                    color: primary,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.fingerprint,
                      color: onPrimary, size: 38),
                ),
                const SizedBox(height: 16),
                const Text(
                  'Attendance Hub',
                  style: TextStyle(
                      fontSize: 26,
                      fontWeight: FontWeight.bold,
                      color: primary),
                ),
                Text(
                  'Portal de Acceso Corporativo',
                  style:
                      TextStyle(fontSize: 13, color: onSurfaceVariant),
                ),
                const SizedBox(height: 32),
                // Tarjeta
                Card(
                  elevation: 2,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12)),
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Usuario
                        Text('USUARIO',
                            style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: onSurfaceVariant,
                                letterSpacing: 0.8)),
                        const SizedBox(height: 6),
                        TextFormField(
                          controller: _usuarioCtrl,
                          keyboardType: TextInputType.text,
                          textInputAction: TextInputAction.next,
                          autocorrect: false,
                          decoration: _inputDeco(
                            hint: 'Ej: jperez',
                            icono: Icons.person_outline,
                          ),
                          validator: (v) =>
                              (v == null || v.trim().isEmpty)
                                  ? 'Ingresa tu usuario.'
                                  : null,
                        ),
                        const SizedBox(height: 18),
                        // Contraseña
                        Text('CONTRASEÑA',
                            style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: onSurfaceVariant,
                                letterSpacing: 0.8)),
                        const SizedBox(height: 6),
                        TextFormField(
                          controller: _passCtrl,
                          obscureText: !_verContrasena,
                          textInputAction: TextInputAction.done,
                          onFieldSubmitted: (_) => _iniciarSesion(),
                          decoration: _inputDeco(
                            hint: '••••••••',
                            icono: Icons.lock_outline,
                            sufijo: IconButton(
                              icon: Icon(
                                _verContrasena
                                    ? Icons.visibility_off
                                    : Icons.visibility,
                                color: onSurfaceVariant,
                              ),
                              onPressed: () => setState(
                                  () => _verContrasena = !_verContrasena),
                            ),
                          ),
                          validator: (v) =>
                              (v == null || v.isEmpty)
                                  ? 'Ingresa tu contraseña.'
                                  : null,
                        ),
                        const SizedBox(height: 12),
                        // Recordarme + ¿Olvidaste?
                        Row(
                          mainAxisAlignment:
                              MainAxisAlignment.spaceBetween,
                          children: [
                            Row(children: [
                              Checkbox(
                                value: _mantenerSesion,
                                activeColor: primary,
                                onChanged: (v) => setState(
                                    () => _mantenerSesion = v ?? false),
                              ),
                              Text('Recordarme',
                                  style: TextStyle(
                                      fontSize: 13,
                                      color: onSurfaceVariant)),
                            ]),
                            TextButton(
                              onPressed: () =>
                                  context.push(RutasApp.recuperar),
                              child: Text(
                                '¿Olvidaste tu contraseña?',
                                style: TextStyle(
                                    color: primary, fontSize: 12),
                              ),
                            ),
                          ],
                        ),
                        // Error
                        if (_error != null) ...[
                          const SizedBox(height: 6),
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: errorContainer,
                              border: Border.all(
                                  color:
                                      error.withValues(alpha: 0.4)),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Row(children: [
                              Icon(Icons.error_outline,
                                  color: onErrorContainer, size: 18),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(_error!,
                                    style: TextStyle(
                                        color: onErrorContainer,
                                        fontSize: 12)),
                              ),
                            ]),
                          ),
                        ],
                        const SizedBox(height: 16),
                        // Botón ingresar
                        SizedBox(
                          width: double.infinity,
                          height: 50,
                          child: ElevatedButton(
                            onPressed:
                                _cargando ? null : _iniciarSesion,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: primary,
                              shape: RoundedRectangleBorder(
                                  borderRadius:
                                      BorderRadius.circular(8)),
                            ),
                            child: _cargando
                                ? const CircularProgressIndicator(
                                    color: Colors.white,
                                    strokeWidth: 2)
                                : const Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.center,
                                    children: [
                                      Text('INICIAR SESIÓN',
                                          style: TextStyle(
                                              fontSize: 15,
                                              fontWeight:
                                                  FontWeight.bold,
                                              color: Colors.white)),
                                      SizedBox(width: 8),
                                      Icon(Icons.arrow_forward,
                                          color: Colors.white,
                                          size: 18),
                                    ],
                                  ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.lock_outline,
                        size: 13, color: onSurfaceVariant),
                    const SizedBox(width: 4),
                    Text('Conexión Segura Encriptada (SSL)',
                        style: TextStyle(
                            fontSize: 11, color: onSurfaceVariant)),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  InputDecoration _inputDeco({
    required String hint,
    required IconData icono,
    Widget? sufijo,
  }) {
    return InputDecoration(
      hintText: hint,
      hintStyle: TextStyle(color: onSurfaceVariant),
      prefixIcon: Icon(icono, color: onSurfaceVariant, size: 20),
      suffixIcon: sufijo,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(color: outlineVariant),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: const BorderSide(color: primary),
      ),
      contentPadding:
          const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
    );
  }
}
