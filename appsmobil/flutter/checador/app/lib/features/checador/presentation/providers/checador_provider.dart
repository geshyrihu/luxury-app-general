import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/fuentes/checador_api.dart';
import '../../data/modelos/registro_checador.dart';

final resumenHoyProvider = FutureProvider.autoDispose<ResumenAsistencia?>((ref) {
  return CheckadorApi.instancia.resumenHoy();
});

final misRegistrosProvider = FutureProvider.autoDispose
    .family<List<RegistroChecador>, int>((ref, pagina) {
  return CheckadorApi.instancia.misRegistros(pagina: pagina);
});

final registrandoProvider = StateProvider<bool>((ref) => false);
