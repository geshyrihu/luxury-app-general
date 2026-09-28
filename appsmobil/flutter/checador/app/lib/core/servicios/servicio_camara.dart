import 'dart:io';
import 'package:image_picker/image_picker.dart';

class ServicioCamara {
  ServicioCamara._();
  static final ServicioCamara instancia = ServicioCamara._();

  final _picker = ImagePicker();

  /// Abre la cámara frontal y retorna el archivo.
  /// NUNCA usa ImageSource.gallery — regla de negocio del checador.
  Future<File?> tomarSelfie() async {
    final foto = await _picker.pickImage(
      source: ImageSource.camera,
      maxWidth: 800,
      maxHeight: 800,
      imageQuality: 80,
    );
    if (foto == null) return null;
    return File(foto.path);
  }
}
