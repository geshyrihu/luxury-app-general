# Guía de Usuario: Módulo de Cobranza Aspel (Live)

## 1. Resumen
El módulo **Cobranza Aspel (Live)** permite a los administradores y ejecutivos de cuenta consultar, en tiempo real, el estado de cuenta y las deudas vigentes de los residentes directamente desde la base de datos de Aspel. Esta integración asegura que la información mostrada en LuxuryApp sea la misma que emite la contabilidad central (Aspel COI/SAE), eliminando discrepancias por sincronizaciones retrasadas.

## 2. Para qué sirve
- **Ver saldos al día:** Consultar si un departamento (customer) tiene saldos pendientes.
- **Detalle de deuda (Aviso de Cobro):** Desglosar exactamente qué conceptos (Mantenimiento, Agua, Intereses Moratorios) conforman el adeudo total y qué meses están pendientes.
- **Transparencia:** Mostrarle al usuario final (residente) sus saldos y permitir descargar el Aviso de Cobro oficial unificado.

## 3. Usuarios Objetivo
- **Administrador del Condominio:** Utiliza el módulo para dar seguimiento a la morosidad y enviar los estados de cuenta.
- **Contador / Ejecutivo de Cobranza:** Utiliza el módulo para corroborar que lo reflejado en plataforma cruza exactamente con Aspel.
- **Residentes (indirectamente):** Consumen el resultado de esta cobranza a través de la app Haus cuando se conectan a ver sus saldos.

## 4. Conceptos Clave
- **Deuda Vigente (Actual):** Sumatoria de todos los conceptos que no han sido liquidados en su totalidad al día de la fecha de corte.
- **Aviso de Cobro:** Documento en PDF que agrupa y detalla la deuda actual, desglosando los cargos, abonos y el saldo final por concepto.
- **Descuentos por Pronto Pago:** Ajustes a favor que se aplican sobre cuotas específicas. El módulo desglosa visualmente estos descuentos sin romper los acumulados contables.
- **Auxiliar Aspel:** El reporte base (origen de la verdad) que contiene la lista de movimientos financieros de un cliente.

## 5. Flujo Principal Narrado
1. El **Administrador** ingresa a LuxuryApp y se dirige al Panel de Cobranza.
2. Selecciona la pestaña o vista de **Deudas Actuales (Live)** y busca un departamento.
3. El sistema hace una **petición en tiempo real** al backend (LuxuryApp API).
4. El backend se conecta de forma directa a la **Base de Datos SQL (Aspel)** para leer el historial completo de la cuenta.
5. Se calcula la suma exacta de Cargos y Abonos acumulados, revirtiendo lógicamente los descuentos para visualización.
6. El backend omite del detalle las cuentas que ya están en ceros (pagadas) y envía el **JSON estructurado** de regreso.
7. El **Panel de Cobranza** muestra la tabla de deuda vigente y permite abrir el **Modal de Detalle**.
8. Desde allí, el Administrador puede generar un PDF o revisar el desglose concepto por concepto.

## 6. Diagrama de Flujo y Arquitectura
<iframe src="./flujo-cobranza.html" width="100%" height="600" style="border:none;"></iframe>
*[Ver el diagrama interactivo a pantalla completa](./flujo-cobranza.html)*

## 7. Paso a Paso en el Sistema (Capturas Reales)

**Paso 1: Entrar a Cobranza**
Ve al menú lateral izquierdo, bajo "Contabilidad", haz clic en **Cobranza Panel**.

**Paso 2: Vista Principal**
Por defecto verás el panel "Aspel Cobranza". En la sección "Deudas Actuales Live", podrás buscar y ver la lista de propiedades del cliente con deuda vigente.

**Paso 3: Consultar Detalle**
Presiona el botón "Consultar" tras ajustar el filtro de fecha de corte (por defecto es "Hoy"). Podrás hacer clic en una propiedad para abrir el modal de detalle o generar su estado de cuenta.

## 8. Permisos
- Para acceder al módulo, el usuario requiere permisos dentro del rol **Administrador LBG** o **Cobranza LBG** (en términos de negocio, personal administrativo o mesa de control). *PENDIENTE: Confirmar con el equipo si se requiere algún permiso granular específico de lectura cruzada*.

## 9. Estados del Módulo

| Estado Visual | Descripción |
| --- | --- |
| **Consultar** | Botón activo para lanzar la petición a Aspel. |
| **Limpiar** | Botón para borrar los filtros y reiniciar la vista. |
| *(Modal)* **Saldo Pendiente** | Muestra el dinero que aún no se ha liquidado en rojo. |
| *(Modal)* **Abonos** | Muestra el histórico de pagos del residente. |

## 10. Errores Comunes y FAQ

- **Pregunta:** ¿Por qué un residente no ve una cuota antigua en su Haus App?
  - **Respuesta:** El sistema agrupa los saldos. Si el residente ya pagó la totalidad de ese concepto histórico, la cuenta queda con Saldo = 0 y se oculta automáticamente para mantener la vista limpia.
- **Pregunta:** ¿Por qué el descuento sale como negativo?
  - **Respuesta:** Para que los totales visuales del "Aviso de Cobro" cuadren de forma lógica. El descuento se extrae y se resta de los Cargos originales.
- **Problema Común:** "Error de conexión con Aspel". Esto ocurre si la VPN o la réplica de base de datos de SQL Server de Aspel está caída. LuxuryApp no puede inventar el dato, así que reporta el fallo de origen.

## 11. Limitaciones Conocidas
- La información de cobro es de **lectura**. No se pueden registrar pagos a través de esta pantalla; los pagos se siguen operando directamente en el ERP Aspel o las pasarelas de pago.
- La fecha de corte por defecto es la del servidor ("Hoy").

## 12. Enlaces Técnicos
- [Documentación Técnica (Backend)](../../../../../api/LuxuryApp.Application/Modules/CollectionsLuxuryApp/CONTEXTO_LOGICA_NEGOCIO.md)
- *Otros documentos de nivel técnico estarán disponibles en esta misma carpeta.*
