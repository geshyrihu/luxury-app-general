class AccesoCliente {
  final String id;
  final String nombre;
  final String? rutaImagen;

  const AccesoCliente({
    required this.id,
    required this.nombre,
    this.rutaImagen,
  });
}
