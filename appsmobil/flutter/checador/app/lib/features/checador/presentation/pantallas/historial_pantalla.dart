import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/config/app_colores.dart';
import '../providers/checador_provider.dart';
import '../../data/modelos/registro_checador.dart';

class HistorialPantalla extends ConsumerStatefulWidget {
  const HistorialPantalla({super.key});

  @override
  ConsumerState<HistorialPantalla> createState() => _HistorialPantallaState();
}

class _HistorialPantallaState extends ConsumerState<HistorialPantalla> {
  final int _pagina = 1;

  @override
  Widget build(BuildContext context) {
    final registrosAsync = ref.watch(misRegistrosProvider(_pagina));

    return SafeArea(
      child: Column(
        children: [
          // Encabezado
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Historial de Registros',
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                const Text('Resumen detallado de tus marcajes verificados.',
                    style: TextStyle(fontSize: 13, color: grisTexto)),
              ],
            ),
          ),
          // Lista
          Expanded(
            child: registrosAsync.when(
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (e, _) => Center(child: Text('Error: $e')),
              data: (registros) {
                if (registros.isEmpty) {
                  return const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.history, size: 48, color: grisTexto),
                        SizedBox(height: 8),
                        Text('No hay registros.', style: TextStyle(color: grisTexto)),
                      ],
                    ),
                  );
                }
                return ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: registros.length,
                  itemBuilder: (ctx, i) => _TarjetaRegistro(registro: registros[i]),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _TarjetaRegistro extends StatefulWidget {
  final RegistroChecador registro;
  const _TarjetaRegistro({required this.registro});

  @override
  State<_TarjetaRegistro> createState() => _TarjetaRegistroState();
}

class _TarjetaRegistroState extends State<_TarjetaRegistro> {
  bool _expandido = false;

  Color get _colorBorde => widget.registro.esAnomalia ? rojoError : bordeClaro;

  @override
  Widget build(BuildContext context) {
    final r = widget.registro;
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10),
        side: BorderSide(color: _colorBorde),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(10),
        onTap: () => setState(() => _expandido = !_expandido),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            children: [
              Row(
                children: [
                  _IconoTipo(tipo: r.tipo, esAnomalia: r.esAnomalia),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(r.tipo,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                        Text(r.fechaHora, style: const TextStyle(fontSize: 12, color: grisTexto)),
                        if (r.esAnomalia)
                          Container(
                            margin: const EdgeInsets.only(top: 4),
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: rojoError.withValues(alpha:0.1),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(r.tipoAnomalia ?? 'Anomalía',
                                style: const TextStyle(fontSize: 10, color: rojoError,
                                    fontWeight: FontWeight.bold)),
                          ),
                      ],
                    ),
                  ),
                  Icon(
                    _expandido ? Icons.expand_less : Icons.expand_more,
                    color: grisTexto,
                  ),
                ],
              ),
              if (_expandido) ...[
                const Divider(height: 16),
                _Detalle(etiqueta: 'IP', valor: r.ipAddress ?? '—'),
                if (r.distanciaMetros != null)
                  _Detalle(etiqueta: 'Distancia', valor: '${r.distanciaMetros!.toStringAsFixed(0)} m'),
                if (r.notaAnomalia != null)
                  _Detalle(etiqueta: 'Nota', valor: r.notaAnomalia!),
                if (r.estadoAnomalia != null)
                  _Detalle(etiqueta: 'Estado RRHH', valor: r.estadoAnomalia!),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class _IconoTipo extends StatelessWidget {
  final String tipo;
  final bool esAnomalia;
  const _IconoTipo({required this.tipo, required this.esAnomalia});

  @override
  Widget build(BuildContext context) {
    IconData icono;
    Color color;
    switch (tipo) {
      case 'Entrada':
        icono = Icons.login;
        color = azulPrimario;
        break;
      case 'Salida':
        icono = Icons.logout;
        color = rojoError;
        break;
      case 'SalidaComite':
        icono = Icons.groups_outlined;
        color = azulSecundario;
        break;
      case 'RegresoComite':
        icono = Icons.keyboard_return;
        color = Colors.teal;
        break;
      default:
        icono = Icons.warning_amber;
        color = amarilloAviso;
    }
    if (esAnomalia) color = rojoError;
    return Container(
      width: 40,
      height: 40,
      decoration: BoxDecoration(
        color: color.withValues(alpha:0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Icon(icono, color: color, size: 20),
    );
  }
}

class _Detalle extends StatelessWidget {
  final String etiqueta;
  final String valor;
  const _Detalle({required this.etiqueta, required this.valor});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        children: [
          SizedBox(
            width: 90,
            child: Text('$etiqueta:',
                style: const TextStyle(fontSize: 12, color: grisTexto)),
          ),
          Expanded(
            child: Text(valor,
                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500)),
          ),
        ],
      ),
    );
  }
}
