import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/config/app_colores.dart';
import '../providers/checador_provider.dart';
import 'historial_pantalla.dart';
import 'perfil_pantalla.dart';
import 'verificacion_pantalla.dart';

class DashboardPantalla extends ConsumerStatefulWidget {
  const DashboardPantalla({super.key});

  @override
  ConsumerState<DashboardPantalla> createState() => _DashboardPantallaState();
}

class _DashboardPantallaState extends ConsumerState<DashboardPantalla> {
  int _tabActual = 0;
  late Timer _reloj;
  String _horaActual = '';
  String _fechaActual = '';

  @override
  void initState() {
    super.initState();
    _actualizarReloj();
    _reloj = Timer.periodic(const Duration(seconds: 1), (_) => _actualizarReloj());
  }

  void _actualizarReloj() {
    final ahora = DateTime.now();
    setState(() {
      _horaActual =
          '${ahora.hour.toString().padLeft(2, '0')}:${ahora.minute.toString().padLeft(2, '0')}:${ahora.second.toString().padLeft(2, '0')}';
      _fechaActual = _formatearFecha(ahora);
    });
  }

  String _formatearFecha(DateTime d) {
    const meses = [
      '', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
    ];
    const dias = [
      '', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo',
    ];
    return '${dias[d.weekday]}, ${d.day} de ${meses[d.month]} de ${d.year}';
  }

  @override
  void dispose() {
    _reloj.cancel();
    super.dispose();
  }

  void _onNavTap(int index) => setState(() => _tabActual = index);

  @override
  Widget build(BuildContext context) {
    final List<Widget> pantallas = [
      _CuerpoDashboard(horaActual: _horaActual, fechaActual: _fechaActual),
      const HistorialPantalla(),
      const PerfilPantalla(),
    ];

    return Scaffold(
      body: pantallas[_tabActual],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _tabActual,
        onTap: _onNavTap,
        selectedItemColor: azulPrimario,
        unselectedItemColor: grisTexto,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.dashboard_outlined), label: 'Dashboard'),
          BottomNavigationBarItem(icon: Icon(Icons.history), label: 'Historial'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: 'Perfil'),
        ],
      ),
    );
  }
}

class _CuerpoDashboard extends ConsumerWidget {
  final String horaActual;
  final String fechaActual;

  const _CuerpoDashboard({required this.horaActual, required this.fechaActual});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final resumenAsync = ref.watch(resumenHoyProvider);

    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Barra superior
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(children: [
                  Container(
                    width: 36, height: 36,
                    decoration: BoxDecoration(
                      color: azulPrimario.withValues(alpha: 0.15), shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.fingerprint, color: azulPrimario, size: 22),
                  ),
                  const SizedBox(width: 10),
                  const Text('Attendance Hub',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: azulPrimario)),
                ]),
                const CircleAvatar(
                  backgroundColor: azulPrimario,
                  radius: 18,
                  child: Text('CR', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Hero card con reloj
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: azulPrimario,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('BIENVENIDO,',
                      style: TextStyle(color: Colors.white70, fontSize: 11,
                          fontWeight: FontWeight.bold, letterSpacing: 1)),
                  const Text('Empleado',
                      style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Text(horaActual,
                      style: const TextStyle(color: Colors.white, fontSize: 36,
                          fontWeight: FontWeight.w900, letterSpacing: -1)),
                  Text(fechaActual,
                      style: TextStyle(color: Colors.white.withValues(alpha: 0.9), fontSize: 13)),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Grid de botones 2x2
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 1.2,
              children: [
                _BotonAccion(
                  titulo: 'Entrada',
                  icono: Icons.login,
                  color: azulPrimario,
                  onTap: () => _irAVerificacion(context, 'Entrada'),
                ),
                _BotonAccion(
                  titulo: 'Salida',
                  icono: Icons.logout,
                  color: rojoError,
                  onTap: () => _irAVerificacion(context, 'Salida'),
                ),
                _BotonAccion(
                  titulo: 'Salida a Comité',
                  icono: Icons.groups_outlined,
                  color: azulSecundario,
                  onTap: () => _irAVerificacion(context, 'SalidaComite'),
                ),
                _BotonAccion(
                  titulo: 'Regreso de Comité',
                  icono: Icons.keyboard_return,
                  color: Colors.teal,
                  onTap: () => _irAVerificacion(context, 'RegresoComite'),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Actividad de hoy
            Align(
              alignment: Alignment.centerLeft,
              child: Text('Actividad de Hoy',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: azulPrimario)),
            ),
            const SizedBox(height: 8),
            resumenAsync.when(
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (e, _) => const Text('Error al cargar registros'),
              data: (resumen) {
                if (resumen == null || resumen.registrosHoy.isEmpty) {
                  return Card(
                    child: Padding(
                      padding: const EdgeInsets.all(24),
                      child: Center(
                        child: Text('No hay registros hoy.',
                            style: TextStyle(color: grisTexto)),
                      ),
                    ),
                  );
                }
                return Card(
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  child: Column(
                    children: resumen.registrosHoy.map((r) {
                      return ListTile(
                        leading: Icon(
                          r.esAnomalia ? Icons.warning_amber : Icons.check_circle,
                          color: r.esAnomalia ? amarilloAviso : verdeExito,
                        ),
                        title: Text(r.tipo, style: const TextStyle(fontWeight: FontWeight.bold)),
                        subtitle: Text(r.fechaHora, style: const TextStyle(fontSize: 12)),
                        trailing: r.esAnomalia
                            ? const Icon(Icons.pending, color: amarilloAviso)
                            : const Icon(Icons.check, color: verdeExito),
                      );
                    }).toList(),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  void _irAVerificacion(BuildContext context, String tipo) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => VerificacionPantalla(tipoRegistro: tipo)),
    );
  }
}

class _BotonAccion extends StatelessWidget {
  final String titulo;
  final IconData icono;
  final Color color;
  final VoidCallback onTap;

  const _BotonAccion({
    required this.titulo,
    required this.icono,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: const BorderSide(color: bordeClaro)),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: onTap,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icono, color: color, size: 26),
            ),
            const SizedBox(height: 10),
            Text(titulo,
                textAlign: TextAlign.center,
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
          ],
        ),
      ),
    );
  }
}
