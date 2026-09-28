/// Representa un cliente/condominio al que tiene acceso el usuario autenticado.
/// Espejo de `SelectItem<Guid>` del backend.
class AccesoCliente {
  final String id;
  final String nombre;
  final String? rutaImagen;

  const AccesoCliente({
    required this.id,
    required this.nombre,
    this.rutaImagen,
  });

  /// Serializa a JSON para persistencia en SecureStorage.
  Map<String, dynamic> aJson() => {
        'id': id,
        'nombre': nombre,
        'rutaImagen': rutaImagen,
      };

  /// Construye desde el JSON almacenado.
  factory AccesoCliente.desdeJson(Map<String, dynamic> json) => AccesoCliente(
        id: json['id'] as String? ?? '',
        nombre: json['nombre'] as String? ?? '',
        rutaImagen: json['rutaImagen'] as String?,
      );
}
