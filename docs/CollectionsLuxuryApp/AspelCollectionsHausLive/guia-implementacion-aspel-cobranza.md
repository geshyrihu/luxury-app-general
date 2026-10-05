Guía de Implementación: API de Integración Contable (LuxuryApp)Para generar un estado de cuenta, el consumidor de la API debe seguir un flujo de tres pasos: Identificar al Cliente $\rightarrow$ Obtener sus Cuentas $\rightarrow$ Consultar Movimientos.1. Discovery Endpoints (Nuevos)A. Endpoint: GetCustomersEste endpoint devuelve el catálogo de entidades (edificios o condominios maestros) registrados en el sistema.Propósito: Permitir que el usuario elija qué edificio o empresa quiere consultar.Respuesta Sugerida:JSON{
"success": true,
"data": [
{ "customerId": "SG-001", "name": "Residencial Sierra Gorda" },
{ "customerId": "LL-002", "name": "Las Lomas 2" },
{ "customerId": "AL-003", "name": "Altos de Santa Fe" }
]
}
B. Endpoint: GetAccountsByCustomerFiltra el catálogo de cuentas de Aspel COI basándose en el customerId y la regla de negocio del rango 200.Parámetros: customerId (string), year (int).Regla de Filtro: 1. Mapear el customerId a la intEmpresa correspondiente en COI.2. Retornar solo los registros de GetCuentas donde Num*Cta inicie con "200-".Respuesta Sugerida:JSON{
"success": true,
"customerId": "SG-001",
"total_condominos": 45,
"cuentas": [
{
"num_cta": "200-001-001",
"nombre": "DEPTO 101 - TORRE A",
"estatus": "A"
},
{
"num_cta": "200-001-002",
"nombre": "DEPTO 102 - TORRE A",
"estatus": "A"
}
]
} 2. Lógica de Procesamiento del Estado de CuentaUna vez que el consumidor tiene el num_cta del endpoint anterior, procede a solicitar el reporte final.Paso 1: Obtener Saldo InicialUsando el endpoint GetSaldos, localizamos la cuenta y aplicamos la fórmula según el periodo ($N$) deseado:$$\text{Saldo Inicial Mes}\_N = \text{Inicial} + \sum*{i=1}^{N-1} (\text{Cargo}\_i - \text{Abono}\_i)$$Paso 2: Unir Pólizas y Auxiliares (Join)Se deben recibir ambos arreglos y cruzarlos por la Llave Cuádruple:TIPO_POLI + NUM_POLIZ + PERIODO + EJERCICIO.Paso 3: Construcción del JSON FinalSe genera el balance progresivo (running balance) fila por fila:Saldo Anterior: Inicia con el resultado del Paso 1.Cargos (D): Suman al saldo.Abonos (H): Restan al saldo.Saldo Posterior: El resultado de la operación.3. Matriz de Relación de DatosEndpoint de OrigenCampo ClaveUso en el Reporte FinalGetCustomerscustomerIdIdentificador de la base de datos a consultar.GetCuentasNum_CtaParámetro de filtro para el condómino.GetSaldosInicial, CargoXX, AbonoXXCálculo del Saldo Inicial del mes.GetAuxiliarMontoMov, Debe_HaberDatos del movimiento y afectación al saldo.GetPolizasFecha_Pol, Concep_PoEncabezado y validación de auditoría.Ejemplo de flujo para el programador que consume tu API:Llama a /api/GetCustomers $\rightarrow$ Recibe lista de edificios.Llama a /api/GetAccountsByCustomer?customerId=SG-001 $\rightarrow$ Recibe lista de departamentos.Llama a /api/GetEstadoCuenta?num_cta=200-001-001&periodo=1&year=2025 $\rightarrow$ Recibe el JSON detallado con movimientos y saldos por concepto.

✦ He completado la implementación y el registro del nuevo módulo de integración contable para Cobranza Haus.

Resumen Final:

1.  DTOs: Creados en AspelCobranzaHaus\DTOs\AspelCobranzaHausDTOs.cs.
2.  Interfaz de Servicio: Definida en AspelCobranzaHaus\Interfaces\IAspelCobranzaHausAppService.cs.
3.  Servicio de Aplicación: Implementado en AspelCobranzaHaus\Services\AspelCobranzaHausAppService.cs, siguiendo las reglas de:
    - Fórmula de Saldo Inicial Acumulado.
    - Join de Pólizas y Auxiliares por llave cuádruple.
    - Generación de Balance Progresivo fila por fila.
4.  Controlador: Implementado en AspelCobranzaHaus\Controller\AspelCobranzaController.cs con los endpoints:
    - GET /api/aspel-cobranza/customers
    - GET /api/aspel-cobranza/accounts
    - GET /api/aspel-cobranza/estado-cuenta
5.  Inyección de Dependencias: Registrado en DependencyInjection.Controllers.cs.
