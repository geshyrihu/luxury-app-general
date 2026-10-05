https://luxurybuildingapp.com/api/aspel-cobranza/detalle-cobranza-rango?customerId=019c6bee-0305-7fbd-80e9-91ca348f903c&numCta=104-003-062-000

{
    "success": true,
    "message": "Operación exitosa",
    "data": {
        "numCtaBase": "104-003-062-000",
        "departamento": "O2-506 NAIRO VARGAS",
        "fechaInicio": "01/01/2026",
        "fechaFin": "08/07/2026",
        "saldoInicialTotal": 0.0,
        "totalCargos": 27991.0,
        "totalAbonos": 1000.0,
        "saldoFinalTotal": 26991.0,
        "totalAdelantos": 0.0,
        "totalConceptos": 3,
        "conceptos": [
            {
                "numCta": "104-003-062-001",
                "nombreCuenta": "CUOTA DE MTTO O2-506 NAIRO VARGAS",
                "concepto": "CUOTA DE MTTO",
                "saldoInicial": 0.0,
                "cargos": 27388.0,
                "abonos": 1000.0,
                "saldoFinal": 26388.0,
                "totalVencido": 26388.0,
                "adelanto": 0.0,
                "vencidos": [
                    {
                        "fechaCargo": "01/06/2026",
                        "conceptoDetalle": "CUOTA DE MANTENIMIENTO JUNIO 2026",
                        "saldoPendiente": 12694.0
                    },
                    {
                        "fechaCargo": "01/07/2026",
                        "conceptoDetalle": "CUOTA DE MANTENIMIENTO JULIO 2026",
                        "saldoPendiente": 13694.0
                    }
                ]
            },
            {
                "numCta": "104-003-062-004",
                "nombreCuenta": "INTERESES MORATORIOS O2-506 NAIRO VARGAS",
                "concepto": "INTERESES MORATORIOS",
                "saldoInicial": 0.0,
                "cargos": 103.0,
                "abonos": 0.0,
                "saldoFinal": 103.0,
                "totalVencido": 103.0,
                "adelanto": 0.0,
                "vencidos": [
                    {
                        "fechaCargo": "01/07/2026",
                        "conceptoDetalle": "INTERESES MORATORIOS 2026",
                        "saldoPendiente": 103.0
                    }
                ]
            },
            {
                "numCta": "104-003-062-005",
                "nombreCuenta": "PENA MORATORIA O2-506 NAIRO VARGAS",
                "concepto": "PENA MORATORIA",
                "saldoInicial": 0.0,
                "cargos": 500.0,
                "abonos": 0.0,
                "saldoFinal": 500.0,
                "totalVencido": 500.0,
                "adelanto": 0.0,
                "vencidos": [
                    {
                        "fechaCargo": "01/07/2026",
                        "conceptoDetalle": "PENA MORATORIA DE JUNIO 2026",
                        "saldoPendiente": 500.0
                    }
                ]
            }
        ]
    },
    "errors": [],
    "totalCount": null,
    "responseCode": 200,
    "timestamp": "2026-07-08T18:11:21.622039Z"
}
https://luxurybuildingapp.com/api/aspel-cobranza/estado-cuenta-rango?customerId=019c6bee-0305-7fbd-80e9-91ca348f903c&numCta=104-003-062-000&fechaInicio=2026-01-01&fechaFin=2026-07-20
{
    "success": true,
    "message": "Operación exitosa",
    "data": {
        "numCta": "104-003-062-000",
        "departamento": "O2-506 NAIRO VARGAS",
        "fechaInicio": "01/01/2026",
        "fechaFin": "20/07/2026",
        "saldoInicial": 0.0,
        "saldoFinal": 26991.0,
        "movimientos": [
            {
                "id": "ASP-2026-06-00001",
                "numCta": "104-003-062-001",
                "fecha": "01/06/2026",
                "tipo": "cargo",
                "concepto": "CUOTA DE MANTENIMIENTO JUNIO 2026",
                "monto": 13694.0,
                "saldoAnterior": 0.0,
                "saldoPosterior": 13694.0
            },
            {
                "id": "ASP-2026-07-00002",
                "numCta": "104-003-062-005",
                "fecha": "01/07/2026",
                "tipo": "cargo",
                "concepto": "PENA MORATORIA DE JUNIO 2026",
                "monto": 500.0,
                "saldoAnterior": 13694.0,
                "saldoPosterior": 14194.0
            },
            {
                "id": "ASP-2026-07-00003",
                "numCta": "104-003-062-004",
                "fecha": "01/07/2026",
                "tipo": "cargo",
                "concepto": "INTERESES MORATORIOS 2026",
                "monto": 103.0,
                "saldoAnterior": 14194.0,
                "saldoPosterior": 14297.0
            },
            {
                "id": "ASP-2026-07-00004",
                "numCta": "104-003-062-001",
                "fecha": "01/07/2026",
                "tipo": "cargo",
                "concepto": "CUOTA DE MANTENIMIENTO JULIO 2026",
                "monto": 13694.0,
                "saldoAnterior": 14297.0,
                "saldoPosterior": 27991.0
            },
            {
                "id": "ASP-2026-07-00005",
                "numCta": "104-003-062-001",
                "fecha": "01/07/2026",
                "tipo": "abono",
                "concepto": "DESCUENTO PRONTO PAGO JULIO 2026",
                "monto": 1000.0,
                "saldoAnterior": 27991.0,
                "saldoPosterior": 26991.0
            }
        ]
    },
    "errors": [],
    "totalCount": null,
    "responseCode": 200,
    "timestamp": "2026-07-08T18:10:52.9394567Z"
}
