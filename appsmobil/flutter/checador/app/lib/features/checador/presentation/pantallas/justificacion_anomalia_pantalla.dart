import 'package:flutter/material.dart';
import '../../../../core/config/app_colores.dart';

class JustificacionAnomaliaPantalla extends StatefulWidget {
  final String tipoAnomalia;
  const JustificacionAnomaliaPantalla({super.key, required this.tipoAnomalia});

  @override
  State<JustificacionAnomaliaPantalla> createState() => _JustificacionAnomaliaPantallaState();
}

class _JustificacionAnomaliaPantallaState extends State<JustificacionAnomaliaPantalla> {
  final _notaCtrl = TextEditingController();
  bool get _puedeEnviar => _notaCtrl.text.trim().isNotEmpty;

  String get _mensajeAnomalia {
    switch (widget.tipoAnomalia) {
      case 'GPS fuera de rango':
        return 'Tu ubicación está fuera del radio autorizado de tu sede.';
      case 'GPS no disponible':
        return 'No se pudo obtener tu ubicación GPS (permisos o señal no disponibles).';
      case 'Foto ausente':
        return 'No se tomó la selfie de verificación.';
      case 'Registro duplicado':
        return 'Ya registraste una acción de este tipo hace menos de 5 minutos.';
      case 'Dispositivo distinto':
        return 'Estás registrando desde un dispositivo nuevo no reconocido.';
      default:
        return widget.tipoAnomalia;
    }
  }

  @override
  void dispose() {
    _notaCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Registro con Observación'),
        backgroundColor: Colors.white,
        foregroundColor: azulPrimario,
        elevation: 0,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Alerta
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: amarilloAviso.withValues(alpha:0.1),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: amarilloAviso),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.warning_amber, color: amarilloAviso, size: 22),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Se detectó:',
                              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                          const SizedBox(height: 4),
                          Text(_mensajeAnomalia,
                              style: const TextStyle(fontSize: 13, color: grisTexto)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.blue.shade50,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text(
                  'Tu registro será enviado como pendiente de revisión por RRHH.',
                  style: TextStyle(fontSize: 12, color: azulPrimario),
                ),
              ),
              const SizedBox(height: 24),
              const Text('Motivo (obligatorio):',
                  style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
              const SizedBox(height: 8),
              TextField(
                controller: _notaCtrl,
                maxLines: 4,
                onChanged: (_) => setState(() {}),
                decoration: InputDecoration(
                  hintText: 'Explica brevemente la razón...',
                  hintStyle: const TextStyle(color: grisTexto),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: const BorderSide(color: azulPrimario),
                  ),
                ),
              ),
              const Spacer(),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.pop(context, null),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: grisTexto,
                        side: const BorderSide(color: bordeClaro),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                      child: const Text('Cancelar'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    flex: 2,
                    child: ElevatedButton.icon(
                      onPressed: _puedeEnviar
                          ? () => Navigator.pop(context, _notaCtrl.text.trim())
                          : null,
                      icon: const Icon(Icons.send, color: Colors.white),
                      label: const Text('Enviar de todas formas',
                          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: azulPrimario,
                        disabledBackgroundColor: grisTexto.withValues(alpha:0.4),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
