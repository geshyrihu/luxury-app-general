import 'acceso_cliente.dart';
import 'perfil_usuario.dart';

/// Usuario autenticado con sesión activa — espejo de UserTokenDTO del backend.
class UsuarioAutenticado {
  final String token;
  final DateTime expiracion;
  final List<String> roles;
  final PerfilUsuario perfil;
  final List<AccesoCliente> accesosCliente;

  const UsuarioAutenticado({
    required this.token,
    required this.expiracion,
    required this.roles,
    required this.perfil,
    required this.accesosCliente,
  });

  bool get esEmpleado =>
      roles.any((r) => r.toLowerCase() == 'empleado');

  bool get esAdministrador =>
      roles.any((r) =>
          r.toLowerCase() == 'administrador' ||
          r.toLowerCase() == 'superadmin');
}
