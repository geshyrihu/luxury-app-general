import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/config/app_colores.dart';
import '../../../../core/servicios/servicio_gps.dart';
import '../../../../core/servicios/servicio_camara.dart';
import '../../data/fuentes/checador_api.dart';
import 'justificacion_anomalia_pantalla.dart';

const String _dispositivoIdEjemplo = 'dispositivo-demo-001';

class VerificacionPantalla extends ConsumerStatefulWidget {
  final String tipoRegistro;
  const VerificacionPantalla({super.key, required this.tipoRegistro});

  @override
  ConsumerState<VerificacionPantalla> createState() => _VerificacionPantallaState();
}

class _VerificacionPantallaState extends ConsumerState<VerificacionPantalla> {
  PosicionGPS? _posicion;
  File? _foto;
  bool _capturandoGps = true;
  bool _capturandoFoto = false;
  bool _enviando = false;
  bool _exitoso = false;

  @override
  void initState() {
    super.initState();
    _capturarEvidencia();
  }

  Future<void> _capturarEvidencia() async {
    // 1. GPS en paralelo con la apertura de cámara
    final posicion = await ServicioGPS.instancia.obtenerPosicion();
    if (!mounted) return;
    setState(() {
      _posicion = posicion;
      _capturandoGps = false;
      _capturandoFoto = true;
    });

    // 2. Cámara
    final foto = await ServicioCamara.instancia.tomarSelfie();
    if (!mounted) return;
    setState(() {
      _foto = foto;
      _capturandoFoto = false;
    });

    // 3. Detectar anomalías localmente
    final anomaliaLocal = _detectarAnomaliaLocal();
    if (anomaliaLocal != null) {
      if (!mounted) return;
      final nota = await Navigator.push<String>(
        context,
        MaterialPageRoute(
          builder: (_) => JustificacionAnomaliaPantalla(tipoAnomalia: anomaliaLocal),
        ),
      );
      if (nota == null) return; // canceló
      await _enviar(nota);
    } else {
      // Sin anomalía local — mostrar pantalla de confirmación
    }
  }

  String? _detectarAnomaliaLocal() {
    if (_posicion == null) return 'GPS no disponible';
    if (_foto == null) return 'Foto ausente';
    return null;
  }

  Future<void> _enviar([String? nota]) async {
    setState(() => _enviando = true);
    try {
      await CheckadorApi.instancia.registrar(
        tipo: widget.tipoRegistro,
        latitud: _posicion?.latitud,
        longitud: _posicion?.longitud,
        dispositivoId: _dispositivoIdEjemplo,
        foto: _foto,
        notaAnomalia: nota,
      );
      if (!mounted) return;
      setState(() {
        _enviando = false;
        _exitoso = true;
      });
      await Future.delayed(const Duration(milliseconds: 1200));
      if (mounted) Navigator.pop(context, true);
    } on Exception catch (e) {
      if (!mounted) return;
      setState(() => _enviando = false);
      // Muestra el error exacto del servidor — visible en pantalla
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(e.toString().replaceFirst('Exception: ', '')),
          backgroundColor: rojoError,
          duration: const Duration(seconds: 6),
          action: SnackBarAction(
            label: 'OK',
            textColor: Colors.white,
            onPressed: () {},
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Verificación de Identidad'),
        backgroundColor: Colors.white,
        foregroundColor: azulPrimario,
        elevation: 0,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              // Círculo de progreso / estado
              _CirculoEstado(
                capturandoGps: _capturandoGps,
                capturandoFoto: _capturandoFoto,
                foto: _foto,
                exitoso: _exitoso,
              ),
              const SizedBox(height: 24),

              if (_capturandoGps)
                const _EstadoTexto(texto: 'Capturando ubicación GPS...', icono: Icons.gps_fixed),
              if (_capturandoFoto)
                const _EstadoTexto(texto: 'Abriendo cámara frontal...', icono: Icons.camera_front),

              if (!_capturandoGps && !_capturandoFoto && !_exitoso && !_enviando) ...[
                // Panel GPS
                _PanelInfo(
                  icono: Icons.location_on_outlined,
                  titulo: 'Ubicación capturada',
                  valor: _posicion != null
                      ? '${_posicion!.latitud.toStringAsFixed(5)}, ${_posicion!.longitud.toStringAsFixed(5)}'
                      : 'No disponible',
                  color: _posicion != null ? verdeExito : rojoError,
                ),
                const SizedBox(height: 12),
                _PanelInfo(
                  icono: Icons.camera_alt_outlined,
                  titulo: 'Selfie',
                  valor: _foto != null ? 'Capturada correctamente' : 'No tomada',
                  color: _foto != null ? verdeExito : rojoError,
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton.icon(
                    onPressed: () => _enviar(),
                    icon: const Icon(Icons.check, color: Colors.white),
                    label: const Text('Confirmar Registro',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: azulPrimario,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                  ),
                ),
              ],

              if (_enviando)
                const Column(children: [
                  SizedBox(height: 16),
                  CircularProgressIndicator(),
                  SizedBox(height: 12),
                  Text('Enviando registro...'),
                ]),

              if (_exitoso)
                Column(children: const [
                  SizedBox(height: 16),
                  Icon(Icons.check_circle, color: verdeExito, size: 48),
                  SizedBox(height: 8),
                  Text('¡Registro Exitoso!',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: verdeExito)),
                ]),
            ],
          ),
        ),
      ),
    );
  }
}

class _CirculoEstado extends StatelessWidget {
  final bool capturandoGps;
  final bool capturandoFoto;
  final File? foto;
  final bool exitoso;

  const _CirculoEstado({
    required this.capturandoGps,
    required this.capturandoFoto,
    required this.foto,
    required this.exitoso,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 160,
      height: 160,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: grisFondo,
        border: Border.all(color: exitoso ? verdeExito : azulPrimario, width: 4),
      ),
      child: ClipOval(
        child: foto != null
            ? Image.file(foto!, fit: BoxFit.cover)
            : Icon(
                exitoso ? Icons.check_circle : Icons.face,
                size: 80,
                color: exitoso ? verdeExito : azulPrimario,
              ),
      ),
    );
  }
}

class _EstadoTexto extends StatelessWidget {
  final String texto;
  final IconData icono;
  const _EstadoTexto({required this.texto, required this.icono});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2)),
        const SizedBox(width: 10),
        Icon(icono, size: 18, color: azulPrimario),
        const SizedBox(width: 6),
        Text(texto, style: const TextStyle(color: grisTexto)),
      ],
    );
  }
}

class _PanelInfo extends StatelessWidget {
  final IconData icono;
  final String titulo;
  final String valor;
  final Color color;

  const _PanelInfo({
    required this.icono,
    required this.titulo,
    required this.valor,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: Icon(icono, color: azulPrimario),
        title: Text(titulo, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
        subtitle: Text(valor, style: TextStyle(color: color, fontSize: 12)),
      ),
    );
  }
}
