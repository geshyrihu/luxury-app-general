/// Datos del perfil del usuario autenticado — espejo de UserProfileDTO del backend.
class PerfilUsuario {
  final String idCliente;
  final String idUsuario;
  final String nombreCliente;
  final String email;
  final String nombre;
  final String apellido;
  final String? telefono;
  final String? rutaFoto;
  final String? rutaFotoCliente;
  final String? puesto;

  const PerfilUsuario({
    required this.idCliente,
    required this.idUsuario,
    required this.nombreCliente,
    required this.email,
    required this.nombre,
    required this.apellido,
    this.telefono,
    this.rutaFoto,
    this.rutaFotoCliente,
    this.puesto,
  });

  String get nombreCompleto => '$nombre $apellido'.trim();

  Map<String, dynamic> aJson() => {
        'idCliente': idCliente,
        'idUsuario': idUsuario,
        'nombreCliente': nombreCliente,
        'email': email,
        'nombre': nombre,
        'apellido': apellido,
        'telefono': telefono,
        'rutaFoto': rutaFoto,
        'rutaFotoCliente': rutaFotoCliente,
        'puesto': puesto,
      };

  factory PerfilUsuario.desdeJson(Map<String, dynamic> json) => PerfilUsuario(
        idCliente: json['idCliente'] as String? ?? '',
        idUsuario: json['idUsuario'] as String? ?? '',
        nombreCliente: json['nombreCliente'] as String? ?? '',
        email: json['email'] as String? ?? '',
        nombre: json['nombre'] as String? ?? '',
        apellido: json['apellido'] as String? ?? '',
        telefono: json['telefono'] as String?,
        rutaFoto: json['rutaFoto'] as String?,
        rutaFotoCliente: json['rutaFotoCliente'] as String?,
        puesto: json['puesto'] as String?,
      );
}
