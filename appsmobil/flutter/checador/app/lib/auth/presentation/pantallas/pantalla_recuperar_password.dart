import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/config/app_colores.dart';
import '../../../core/proveedores/proveedores_servicios.dart';

class PantallaRecuperarPassword extends ConsumerStatefulWidget {
  const PantallaRecuperarPassword({super.key});

  @override
  ConsumerState<PantallaRecuperarPassword> createState() =>
      _PantallaRecuperarPasswordState();
}

class _PantallaRecuperarPasswordState
    extends ConsumerState<PantallaRecuperarPassword> {
  final _claveFormulario = GlobalKey<FormState>();
  final _controladorEmail = TextEditingController();

  bool _cargando = false;
  bool _enviado = false;
  String? _mensajeError;

  @override
  void dispose() {
    _controladorEmail.dispose();
    super.dispose();
  }

  Future<void> _enviarSolicitud() async {
    if (!_claveFormulario.currentState!.validate()) return;

    setState(() {
      _cargando = true;
      _mensajeError = null;
    });

    final resultado = await ref
        .read(proveedorRepositorioAuth)
        .recuperarContrasena(_controladorEmail.text.trim());

    if (!mounted) return;

    resultado.fold(
      (fallo) => setState(() {
        _cargando = false;
        _mensajeError = fallo.mensaje;
      }),
      (_) => setState(() {
        _cargando = false;
        _enviado = true;
      }),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: background,
      appBar: AppBar(
        title: const Text('Recuperar contraseña'),
        backgroundColor: primary,
        foregroundColor: onPrimary,
        elevation: 0,
      ),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: _enviado ? _pantallaExito(context) : _formulario(),
            ),
          ),
        ),
      ),
    );
  }

  Widget _formulario() {
    return Form(
      key: _claveFormulario,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Icon(Icons.lock_reset, size: 64, color: primary),
          const SizedBox(height: 20),
          Text(
            'Recuperar contraseña',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: primary,
            ),
          ),
          const SizedBox(height: 10),
          Text(
            'Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 14, color: onSurfaceVariant),
          ),
          const SizedBox(height: 32),
          TextFormField(
            controller: _controladorEmail,
            keyboardType: TextInputType.emailAddress,
            textInputAction: TextInputAction.done,
            onFieldSubmitted: (_) => _enviarSolicitud(),
            decoration: InputDecoration(
              labelText: 'Correo electrónico',
              prefixIcon: const Icon(Icons.email_outlined),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            validator: (valor) {
              if (valor == null || valor.trim().isEmpty) {
                return 'Ingresa tu correo electrónico.';
              }
              final esEmail =
                  RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(valor);
              if (!esEmail) return 'Ingresa un correo electrónico válido.';
              return null;
            },
          ),
          const SizedBox(height: 16),
          if (_mensajeError != null) ...[
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: errorContainer,
                border: Border.all(color: error.withValues(alpha: 0.4)),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                _mensajeError!,
                style: TextStyle(color: onErrorContainer, fontSize: 13),
              ),
            ),
            const SizedBox(height: 16),
          ],
          SizedBox(
            height: 50,
            child: ElevatedButton(
              onPressed: _cargando ? null : _enviarSolicitud,
              style: ElevatedButton.styleFrom(
                backgroundColor: primary,
                foregroundColor: onPrimary,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: _cargando
                  ? const SizedBox(
                      width: 22,
                      height: 22,
                      child: CircularProgressIndicator(
                          color: Colors.white, strokeWidth: 2.5),
                    )
                  : const Text(
                      'Enviar instrucciones',
                      style: TextStyle(
                          fontSize: 16, fontWeight: FontWeight.w600),
                    ),
            ),
          ),
          const SizedBox(height: 16),
          TextButton(
            onPressed: () => context.pop(),
            child: Text(
              'Volver al inicio de sesión',
              style: TextStyle(color: primary),
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
        const Icon(Icons.mark_email_read_outlined,
            size: 80, color: Colors.green),
        const SizedBox(height: 20),
        Text(
          '¡Correo enviado!',
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.bold,
            color: primary,
          ),
        ),
        const SizedBox(height: 12),
        Text(
          'Si el correo "${_controladorEmail.text.trim()}" está registrado, recibirás las instrucciones en tu bandeja de entrada.',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 14, color: onSurfaceVariant),
        ),
        const SizedBox(height: 32),
        SizedBox(
          height: 50,
          child: ElevatedButton(
            onPressed: () => context.pop(),
            style: ElevatedButton.styleFrom(
              backgroundColor: primary,
              foregroundColor: onPrimary,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8)),
            ),
            child: const Text('Volver al inicio de sesión'),
          ),
        ),
      ],
    );
  }
}
