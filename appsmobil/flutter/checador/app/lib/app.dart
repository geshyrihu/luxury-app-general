import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'core/config/app_colores.dart';
import 'core/enrutador/enrutador_app.dart';

/// Widget raíz de CheckadorApp.
class CheckadorApp extends ConsumerWidget {
  const CheckadorApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final enrutador = ref.watch(proveedorEnrutador);

    return MaterialApp.router(
      title: 'Checador Empleados',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: themeColorScheme(),
        useMaterial3: true,
        scaffoldBackgroundColor: surface,
        cardColor: surfaceContainerLowest,
        appBarTheme: AppBarTheme(
          backgroundColor: surfaceContainerLowest,
          foregroundColor: onSurface,
          elevation: 0,
          centerTitle: false,
        ),
        inputDecorationTheme: InputDecorationTheme(
          border: OutlineInputBorder(
            borderRadius: const BorderRadius.all(Radius.circular(8)),
            borderSide: BorderSide(color: outlineVariant),
          ),
          focusedBorder: const OutlineInputBorder(
            borderRadius: BorderRadius.all(Radius.circular(8)),
            borderSide: BorderSide(color: primary, width: 2),
          ),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: primary,
            foregroundColor: onPrimary,
            shape: const RoundedRectangleBorder(
              borderRadius: BorderRadius.all(Radius.circular(8)),
            ),
          ),
        ),
      ),
      routerConfig: enrutador,
    );
  }
}
