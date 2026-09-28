import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/config/app_colores.dart';
import '../../../../core/proveedores/proveedores_servicios.dart';
import '../../../../presentacion/proveedores/proveedor_sesion.dart';

class PerfilPantalla extends ConsumerWidget {
  const PerfilPantalla({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final perfil = ref.watch(proveedorPerfilUsuario);

    final nombre = perfil?.nombreCompleto ?? 'Empleado';
    final iniciales = _iniciales(nombre);
    final email = perfil?.email ?? '';
    final puesto = perfil?.puesto ?? 'Empleado';

    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            const SizedBox(height: 16),
            // Avatar
            Container(
              width: 96,
              height: 96,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: const LinearGradient(
                  colors: [azulPrimario, azulSecundario],
                ),
                border: Border.all(color: Colors.white, width: 2),
              ),
              child: Center(
                child: Text(iniciales,
                    style: const TextStyle(
                        fontSize: 30,
                        color: Colors.white,
                        fontWeight: FontWeight.bold)),
              ),
            ),
            const SizedBox(height: 12),
            Text(nombre,
                style: const TextStyle(
                    fontSize: 20, fontWeight: FontWeight.bold)),
            Text(puesto,
                style: const TextStyle(
                    color: azulPrimario, fontWeight: FontWeight.w600)),
            if (email.isNotEmpty)
              Text(email,
                  style: TextStyle(color: grisTexto, fontSize: 12)),
            const SizedBox(height: 28),

            // Tarjeta de datos
            Card(
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12)),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    _CampoInfo(
                        etiqueta: 'ID Usuario',
                        valor: perfil?.idUsuario ?? '—'),
                    const Divider(),
                    _CampoInfo(
                        etiqueta: 'Correo',
                        valor: email.isNotEmpty ? email : '—'),
                    const Divider(),
                    _CampoInfo(
                        etiqueta: 'Edificio',
                        valor: perfil?.nombreCliente ?? '—'),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Botón cerrar sesión
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () => _cerrarSesion(context, ref),
                icon: const Icon(Icons.logout, color: Colors.white),
                label: const Text('Cerrar Sesión',
                    style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: grisTexto,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10)),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _cerrarSesion(BuildContext context, WidgetRef ref) async {
    await ref.read(proveedorSesionProvider.notifier).cerrarSesion();
    // GoRouter redirige automáticamente a /auth/login al detectar noAutenticado
  }

  String _iniciales(String nombre) {
    final partes = nombre.trim().split(' ');
    if (partes.length >= 2) {
      return '${partes[0][0]}${partes[1][0]}'.toUpperCase();
    }
    return nombre.isNotEmpty ? nombre[0].toUpperCase() : '?';
  }
}

class _CampoInfo extends StatelessWidget {
  final String etiqueta;
  final String valor;
  const _CampoInfo({required this.etiqueta, required this.valor});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(etiqueta.toUpperCase(),
              style: const TextStyle(
                  fontSize: 10,
                  color: grisTexto,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.8)),
          const SizedBox(height: 2),
          Text(valor,
              style: const TextStyle(
                  fontSize: 14, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
