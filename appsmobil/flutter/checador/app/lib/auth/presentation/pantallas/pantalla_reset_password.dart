import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/config/app_colores.dart';
import '../../../core/enrutador/enrutador_app.dart';
import '../../../core/proveedores/proveedores_servicios.dart';

class PantallaResetPassword extends ConsumerStatefulWidget {
  final String token;
  final String email;

  const PantallaResetPassword({
    super.key,
    required this.token,
    required this.email,
  });

  @override
  ConsumerState<PantallaResetPassword> createState() =>
      _PantallaResetPasswordState();
}

class _PantallaResetPasswordState
    extends ConsumerState<PantallaResetPassword> {
  final _claveFormulario = GlobalKey<FormState>();
  final _controladorNueva = TextEditingController();
  final _controladorConfirmar = TextEditingController();

  bool _mostrarNueva = false;
  bool _mostrarConfirmar = false;
  bool _cargando = false;
  bool _exito = false;
  String? _mensajeError;

  @override
  void dispose() {
    _controladorNueva.dispose();
    _controladorConfirmar.dispose();
    super.dispose();
  }

  Future<void> _confirmarReset() async {
    if (!_claveFormulario.currentState!.validate()) return;

    setState(() {
      _cargando = true;
      _mensajeError = null;
    });

    final resultado =
        await ref.read(proveedorRepositorioAuth).confirmarRecuperacion(
              email: widget.email,
              token: widget.token,
              nuevaContrasena: _controladorNueva.text,
            );

    if (!mounted) return;

    resultado.fold(
      (fallo) => setState(() {
        _cargando = false;
        _mensajeError = fallo.mensaje;
      }),
      (_) => setState(() {
        _cargando = false;
        _exito = true;
      }),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: background,
      appBar: AppBar(
        title: const Text('Nueva contraseña'),
        backgroundColor: primary,
        foregroundColor: onPrimary,
        elevation: 0,
        automaticallyImplyLeading: false,
      ),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: widget.token.isEmpty
                  ? _pantallaEnlaceInvalido(context)
                  : _exito
                      ? _pantallaExito(context)
                      : _formulario(),
            ),
          ),
        ),
      ),
    );
  }

  Widget _pantallaEnlaceInvalido(BuildContext context) {
    return Column(
      children: [
        const Icon(Icons.link_off, size: 64, color: Colors.red),
        const SizedBox(height: 16),
        const Text('Enlace inválido',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        const Text(
          'El enlace de recuperación es inválido o ha expirado. Solicita uno nuevo.',
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 24),
        ElevatedButton(
          onPressed: () => context.go(RutasApp.recuperar),
          style: ElevatedButton.styleFrom(
            backgroundColor: primary,
            foregroundColor: onPrimary,
          ),
          child: const Text('Solicitar nuevo enlace'),
        ),
      ],
    );
  }

  Widget _formulario() {
    return Form(
      key: _claveFormulario,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Icon(Icons.lock_reset, size: 64, color: primary),
          const SizedBox(height: 16),
          Text(
            'Crea tu nueva contraseña',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: primary,
            ),
          ),
          if (widget.email.isNotEmpty) ...[
            const SizedBox(height: 6),
            Text(
              widget.email,
              textAlign: TextAlign.center,
              style: TextStyle(color: onSurfaceVariant, fontSize: 13),
            ),
          ],
          const SizedBox(height: 32),
          TextFormField(
            controller: _controladorNueva,
            obscureText: !_mostrarNueva,
            textInputAction: TextInputAction.next,
            decoration: InputDecoration(
              labelText: 'Nueva contraseña',
              prefixIcon: const Icon(Icons.lock_outline),
              border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8)),
              suffixIcon: IconButton(
                icon: Icon(_mostrarNueva
                    ? Icons.visibility_off
                    : Icons.visibility),
                onPressed: () =>
                    setState(() => _mostrarNueva = !_mostrarNueva),
              ),
            ),
            validator: (valor) {
              if (valor == null || valor.isEmpty) {
                return 'Ingresa tu nueva contraseña.';
              }
              if (valor.length < 8) {
                return 'La contraseña debe tener al menos 8 caracteres.';
              }
              return null;
            },
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _controladorConfirmar,
            obscureText: !_mostrarConfirmar,
            textInputAction: TextInputAction.done,
            onFieldSubmitted: (_) => _confirmarReset(),
            decoration: InputDecoration(
              labelText: 'Confirmar contraseña',
              prefixIcon: const Icon(Icons.lock_outline),
              border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8)),
              suffixIcon: IconButton(
                icon: Icon(_mostrarConfirmar
                    ? Icons.visibility_off
                    : Icons.visibility),
                onPressed: () =>
                    setState(() => _mostrarConfirmar = !_mostrarConfirmar),
              ),
            ),
            validator: (valor) {
              if (valor != _controladorNueva.text) {
                return 'Las contraseñas no coinciden.';
              }
              return null;
            },
          ),
          const SizedBox(height: 16),
          if (_mensajeError != null) ...[
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: errorContainer,
                border:
                    Border.all(color: error.withValues(alpha: 0.4)),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                _mensajeError!,
                style:
                    TextStyle(color: onErrorContainer, fontSize: 13),
              ),
            ),
            const SizedBox(height: 16),
          ],
          SizedBox(
            height: 50,
            child: ElevatedButton(
              onPressed: _cargando ? null : _confirmarReset,
              style: ElevatedButton.styleFrom(
                backgroundColor: primary,
                foregroundColor: onPrimary,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8)),
              ),
              child: _cargando
                  ? const SizedBox(
                      width: 22,
                      height: 22,
                      child: CircularProgressIndicator(
                          color: Colors.white, strokeWidth: 2.5),
                    )
                  : const Text(
                      'Cambiar contraseña',
                      style: TextStyle(
                          fontSize: 16, fontWeight: FontWeight.w600),
                    ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _pantallaExito(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const Icon(Icons.check_circle_outline,
            size: 80, color: Colors.green),
        const SizedBox(height: 20),
        Text(
          '¡Contraseña actualizada!',
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.bold,
            color: primary,
          ),
        ),
        const SizedBox(height: 12),
        Text(
          'Tu contraseña ha sido restablecida correctamente. Ya puedes iniciar sesión.',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 14, color: onSurfaceVariant),
        ),
        const SizedBox(height: 32),
        SizedBox(
          height: 50,
          child: ElevatedButton(
            onPressed: () => context.go(RutasApp.login),
            style: ElevatedButton.styleFrom(
              backgroundColor: primary,
              foregroundColor: onPrimary,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8)),
            ),
            child: const Text('Ir a inicio de sesión'),
          ),
        ),
      ],
    );
  }
}
