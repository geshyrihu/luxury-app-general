class RegistroChecador {
  final String id;
  final String nombreEmpleado;
  final String tipo;
  final String fechaHora;
  final String? ubicacion;
  final double? distanciaMetros;
  final String? fotoUrl;
  final String? ipAddress;
  final bool esAnomalia;
  final String? tipoAnomalia;
  final String? estadoAnomalia;
  final String? notaAnomalia;

  const RegistroChecador({
    required this.id,
    required this.nombreEmpleado,
    required this.tipo,
    required this.fechaHora,
    this.ubicacion,
    this.distanciaMetros,
    this.fotoUrl,
    this.ipAddress,
    required this.esAnomalia,
    this.tipoAnomalia,
    this.estadoAnomalia,
    this.notaAnomalia,
  });

  factory RegistroChecador.fromJson(Map<String, dynamic> json) {
    return RegistroChecador(
      id: json['id'] as String,
      nombreEmpleado: json['nombreEmpleado'] as String,
      tipo: json['tipo'] as String,
      fechaHora: json['fechaHora'] as String,
      ubicacion: json['ubicacion'] as String?,
      distanciaMetros: (json['distanciaMetros'] as num?)?.toDouble(),
      fotoUrl: json['fotoUrl'] as String?,
      ipAddress: json['ipAddress'] as String?,
      esAnomalia: json['esAnomalia'] as bool? ?? false,
      tipoAnomalia: json['tipoAnomalia'] as String?,
      estadoAnomalia: json['estadoAnomalia'] as String?,
      notaAnomalia: json['notaAnomalia'] as String?,
    );
  }
}

class ResumenAsistencia {
  final int totalMes;
  final String tasaPuntualidad;
  final String? ultimoRegistro;
  final String? estadoActual;
  final List<RegistroChecador> registrosHoy;

  const ResumenAsistencia({
    required this.totalMes,
    required this.tasaPuntualidad,
    this.ultimoRegistro,
    this.estadoActual,
    required this.registrosHoy,
  });

  factory ResumenAsistencia.fromJson(Map<String, dynamic> json) {
    final lista = (json['registrosHoy'] as List<dynamic>? ?? [])
        .map((e) => RegistroChecador.fromJson(e as Map<String, dynamic>))
        .toList();
    return ResumenAsistencia(
      totalMes: json['totalMes'] as int? ?? 0,
      tasaPuntualidad: json['tasaPuntualidad'] as String? ?? '0%',
      ultimoRegistro: json['ultimoRegistro'] as String?,
      estadoActual: json['estadoActual'] as String?,
      registrosHoy: lista,
    );
  }
}
