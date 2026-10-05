-- ============================================================================
-- Fix puntual: asigna cada criterio de inspección a su clasificación de equipo
-- (EquipmentClassificationId) para que el formulario "Agregar equipo" filtre
-- las revisiones por la misma EquipoClasificacion.
--
-- Idempotente: solo actualiza cuando la clasificación difiere.
-- Correr sobre la base transaccional (LuxuryBuildingGroup).
-- ============================================================================
SET NOCOUNT ON;

DECLARE @map TABLE ([Description] nvarchar(200), [ClassName] nvarchar(200));

INSERT INTO @map ([Description], [ClassName]) VALUES
-- Aire acondicionado
(N'AC - CONFIRMAR FUNCIONAMIENTO DE VENTILADORES Y MOTORES', N'Aire acondicionado'),
(N'AC - INSPECCIONAR ESTADO DE SERPENTINES Y FILTROS', N'Aire acondicionado'),
(N'AC - LECTURA DE MANÓMETROS (ALTA/BAJA PRESIÓN)', N'Aire acondicionado'),
(N'FILTRO DE AIRE', N'Aire acondicionado'),
(N'VERIFICACION DEL CONTROL DE TEMPERATURA', N'Aire acondicionado'),
-- Albercas y Jacuzzis
(N'ALBERCAR CONTROL DE INTERCAMBIADORES', N'Albercas y Jacuzzis'),
(N'ALBERCAS LIMPIEZA EN TANQUES DE RECUPERACION', N'Albercas y Jacuzzis'),
(N'CALIDAD DE AGUA', N'Albercas y Jacuzzis'),
(N'CLORADOR- NIVEL DE CLORO', N'Albercas y Jacuzzis'),
(N'FILTRO DE ARENA- CONEXIONES', N'Albercas y Jacuzzis'),
(N'FILTRO DE ARENA- FUGAS', N'Albercas y Jacuzzis'),
(N'FILTRO DE ARENA- LIMPIZA', N'Albercas y Jacuzzis'),
(N'FILTRO DE ARENA- POSICION DE CABEZAL', N'Albercas y Jacuzzis'),
(N'FILTRO DE CARTON- LIMPIEZA', N'Albercas y Jacuzzis'),
(N'FILTRO DE CARTON- SIN FUGAS', N'Albercas y Jacuzzis'),
(N'LIMPIEZA DE CANASTILLA', N'Albercas y Jacuzzis'),
(N'LIMPIEZA DE REJILLAS', N'Albercas y Jacuzzis'),
(N'VALVULA EN POSICION DE FILTRADO', N'Albercas y Jacuzzis'),
-- Sistema Hidrosanitario
(N'BA - INSPECCIONAR ESTADO DE VÁLVULAS DE RETENCIÓN Y DESCARGA', N'Sistema Hidrosanitario'),
(N'BOMBAS - ANCLAJE DE TUBERIAS Y EQUIPOS', N'Sistema Hidrosanitario'),
(N'BOMBAS - LIMPIEZA GENERAL', N'Sistema Hidrosanitario'),
(N'BOMBAS- SOBRECALENTAMIENTO', N'Sistema Hidrosanitario'),
(N'BOMBAS- SUCCION Y DESCARGA DE AGUA', N'Sistema Hidrosanitario'),
(N'BOMBAS- VALVULAS Y FILTROS', N'Sistema Hidrosanitario'),
(N'CARCAMOS- FUNCIONAMIENTO BOMBA ACHIQUE', N'Sistema Hidrosanitario'),
(N'FUGAS DE LIQUIDOS', N'Sistema Hidrosanitario'),
(N'PERCEPCION DE RUIDOS ANORMALES', N'Sistema Hidrosanitario'),
(N'REVISION DE FUGAS', N'Sistema Hidrosanitario'),
(N'REVISION DEL FLOTADOR', N'Sistema Hidrosanitario'),
(N'REVISION DEL PRESOSTATO', N'Sistema Hidrosanitario'),
(N'SITEMA BOMBEO - INSPECCIONAR VÁLVULAS DE CONTROL Y BYPASS', N'Sistema Hidrosanitario'),
(N'SITEMA BOMBEO - PRESION MANOMETRO AGUA', N'Sistema Hidrosanitario'),
(N'SITEMA BOMBEO - VERIFICAR FUNCIONAMIENTO DE BOMBAS PRINCIPALES Y ALTERNAS', N'Sistema Hidrosanitario'),
-- Acceso
(N'CA - FUNCIONAMIENTO DE CONTROLADORES EN LÍNEA DE CONTROL DE ACCESOS', N'Acceso'),
(N'CA - FUNCIONAMIENTO DE EQUIPO CENTRAL DE CONTROL DE ACCESOS', N'Acceso'),
(N'CA - FUNCIONAMIENTO DE SOFTWARE DE CONTROL DE ACCESOS', N'Acceso'),
-- Instalación de gas
(N'CALDERAS- MEDIDOR DE GAS', N'Instalación de gas'),
(N'CALENTADOR- CONEXIONES DE GAS', N'Instalación de gas'),
(N'CALENTADOR- OPERACION EN AUTOMATICO', N'Instalación de gas'),
(N'REVISION DEL QUEMADOR', N'Instalación de gas'),
(N'SERVICIO- PRESION MANOMETRO GAS', N'Instalación de gas'),
(N'SOPLADOR EN AUTOMÁTICO Y FUNCIONANDO', N'Instalación de gas'),
(N'VERIFICACION DE PILOTO ENCENDIDO', N'Instalación de gas'),
-- Sistema de audio y video
(N'CCCTV - FUNCIONAMIENTO DE SOFTWARE DE CCTV', N'Sistema de audio y video'),
(N'CCTV - FUNCIONAMIENTO CORRECTO.', N'Sistema de audio y video'),
(N'CCTV - FUNCIONAMIENTO DE DVR''S', N'Sistema de audio y video'),
(N'CCTV - FUNCIONAMIENTO DE ESTACIONES DE TRABAJO', N'Sistema de audio y video'),
(N'CCTV - FUNCIONAMIENTO DE MINISPLIT', N'Sistema de audio y video'),
(N'CCTV - FUNCIONAMIENTO DE MONITORES', N'Sistema de audio y video'),
(N'VOZ-DATOS - FUNCIONAMIENTO DE RACK DE VOZ/DATOS', N'Sistema de audio y video'),
-- Sistema de agua potable
(N'CISTERNA - PORCENTAJE DE AGUA', N'Sistema de agua potable'),
(N'CISTERNA - VERIFICAR AUSENCIA DE FUGAS O GRIETAS EN ESTRUCTURA', N'Sistema de agua potable'),
(N'REVISION DEL CONTENEDOR DE SAL', N'Sistema de agua potable'),
(N'TINACOS - INSPECCIONAR TAPAS DE TINACOS', N'Sistema de agua potable'),
(N'TINACOS - NIVEL DE AGUA', N'Sistema de agua potable'),
(N'TINACOS - VERIFICAR POSIBLES FUGAS EN TUBERÍAS', N'Sistema de agua potable'),
-- Cuarto de Maquinas
(N'CM - ACCESO EN BUEN ESTADO', N'Cuarto de Maquinas'),
(N'CM - CONFIRMAR FUNCIONAMIENTO DE VENTILACIÓN Y EXTRACCIÓN DE AIRE', N'Cuarto de Maquinas'),
(N'CM - INSPECCIONAR BANDEJAS DE GOTEO Y DRENAJES', N'Cuarto de Maquinas'),
(N'CM - PINTURA EN BUEN ESTADO', N'Cuarto de Maquinas'),
(N'CM - REVISAR NIVELES DE ACEITE Y REFRIGERANTE EN EQUIPOS CRÍTICOS', N'Cuarto de Maquinas'),
(N'CM - VERIFICAR ESTADO GENERAL DE EQUIPOS (VIBRACIONES, RUIDOS ANORMALES, FUGAS)', N'Cuarto de Maquinas'),
-- Elevadores
(N'EL - CUALQUIER ANOMALÍA REPORTAR A PROVEEDOR SCHINDLER', N'Elevadores'),
(N'EL - ESTADO DEL ALUMBRADO INTERNO E INDICADORES DE PISOS', N'Elevadores'),
(N'EL - FUNCIONAMIENTO DE CONTROLADORES EN LÍNEA DE CONTROLES DE ACCESO', N'Elevadores'),
(N'EL - FUNCIONAMIENTO NORMAL DE PUERTAS Y CONTROLES INTERNOS/EXTERNOS', N'Elevadores'),
(N'EL - REVISIÓN DE CONTROLES DE ACCESO (TARJETAS, BIOMÉTRICO)', N'Elevadores'),
(N'EL - VERIFICAR AUSENCIA DE RUIDOS O VIBRACIONES ANÓMALAS', N'Elevadores'),
-- Sistemas Electrico
(N'ESTADO DE BATERIAS', N'Sistemas Electrico'),
(N'REVISION DE ANTENA DEL PARARRAYOS', N'Sistemas Electrico'),
(N'REVISION DE CONTINUIDAD DE CABLEADO DEL PARARRAYOS', N'Sistemas Electrico'),
(N'REVISION DE FUNCIONAMIENTO ENCENDIDO/APAGADO', N'Sistemas Electrico'),
(N'REVISION DE RESISTENCIAS', N'Sistemas Electrico'),
(N'REVISION DEL DISPLAY ENCENDIDOS', N'Sistemas Electrico'),
(N'REVISION DEL GUARDAMOTOR', N'Sistemas Electrico'),
(N'REVISION TIRANTES DE ACERO DEL PARARRAYO', N'Sistemas Electrico'),
(N'TABLERO ELECTRICO- FUNCIONAMIENTO CONTROL DE HORARIO', N'Sistemas Electrico'),
(N'TABLERO ELECTRICO- ON-OFF-AUTO', N'Sistemas Electrico'),
(N'TABLERO ELECTRICO- OPERACION EN AUTOMATICO', N'Sistemas Electrico'),
(N'TABLERO ELECTRICO- REVISION DE AMPERAJE', N'Sistemas Electrico'),
(N'TABLERO ELECTRICO- REVISION DE FRECUENCIA', N'Sistemas Electrico'),
(N'TABLERO ELECTRICO- REVISION DE INTERRUPTORES', N'Sistemas Electrico'),
(N'TABLERO ELECTRICO- REVISION DE VOLTAJE', N'Sistemas Electrico'),
(N'TABLERO ELECTRICO- REVISION VARIADOR DE FRECUENCIA', N'Sistemas Electrico'),
(N'TABLEROS ELECTRICOS- NOMENCLATURA DE PASTILLAS', N'Sistemas Electrico'),
-- Extraccion Aire
(N'EXTRACCION - CONFIRMAR FUNCIONAMIENTO DE VENTILADORES Y EXTRACTORES DE AIRE', N'Extraccion Aire'),
(N'EXTRACCION - REVISAR INFORME DE PROVEEDOR CYVSA (PRESIONES, FLUJO DE AIRE)', N'Extraccion Aire'),
(N'VERIFICACION DE BANDAS', N'Extraccion Aire'),
-- Sistema Contra Incendio
(N'PCI - PRUEBA OPERATIVA DE BOMBA JOCKEY (ARRANQUE POR PÉRDIDA DE PRESIÓN)', N'Sistema Contra Incendio'),
(N'PCI - REVISIÓN DE BOMBA ELÉCTRICA Y MOTOR DIÉSEL (NIVEL DE COMBUSTIBLE, ACEITE)', N'Sistema Contra Incendio'),
(N'PCI - VERIFICAR ESTADO DE VÁLVULAS Y TUBERÍAS', N'Sistema Contra Incendio'),
(N'PCI - VERIFICAR NIVELES DE CISTERNAS', N'Sistema Contra Incendio'),
(N'PCI- FUGA DE LIQUIDOS', N'Sistema Contra Incendio'),
(N'PCI- LIMPIEZA', N'Sistema Contra Incendio'),
(N'PCI- NIVEL DE ACEITE', N'Sistema Contra Incendio'),
(N'PCI- NIVEL DE ANTICONGELANTE', N'Sistema Contra Incendio'),
(N'PCI- NIVEL DE DIESEL', N'Sistema Contra Incendio'),
(N'PCI- PARO EN PRESION DEMANDADA', N'Sistema Contra Incendio'),
(N'PCI- PRESION DE AGUA EN TABLERO', N'Sistema Contra Incendio'),
(N'PCI- PRESION LINE DE 12KCM2', N'Sistema Contra Incendio'),
(N'PCI- REVISION DE PRECALENTADOR', N'Sistema Contra Incendio'),
(N'PCI- TUBERIAS Y CONEXIONES', N'Sistema Contra Incendio'),
-- Planta de Tratamiento de Aguas
(N'PTAR - CALIDAD DE BACTERIA', N'Planta de Tratamiento de Aguas'),
(N'PTAR AJUSTE DE TUBO DE DESNATADOR', N'Planta de Tratamiento de Aguas'),
(N'PTAR CLARIFICACIÓN DE CAMARA', N'Planta de Tratamiento de Aguas'),
(N'PTAR CONEXIONES', N'Planta de Tratamiento de Aguas'),
(N'PTAR REVISION DE CLORADOR', N'Planta de Tratamiento de Aguas'),
(N'PTAR- REVISION DE RETORNO DE LODOS', N'Planta de Tratamiento de Aguas'),
(N'PTAR- TALLADO DE REACTORES (PAREDES)', N'Planta de Tratamiento de Aguas'),
(N'PTAR- VALVULAS CHECK', N'Planta de Tratamiento de Aguas'),
(N'TE - CORRECTO SUMINISTRO DE QUÍMICOS (INHIBIDORES, BIOCIDAS)', N'Planta de Tratamiento de Aguas'),
(N'TE - ESTADO DE BANDEJAS Y ELIMINACIÓN DE SEDIMENTOS', N'Planta de Tratamiento de Aguas'),
(N'TE - NIVEL DE AGUA EN TINAS Y FUNCIONAMIENTO DE VÁLVULAS DE LLENADO', N'Planta de Tratamiento de Aguas'),
(N'TE - REVISIÓN DE BOMBAS ASOCIADAS (PRESIÓN, RUIDOS, FUGAS)', N'Planta de Tratamiento de Aguas'),
-- Plantas de Emergencia
(N'INDICADOR DE REPOSO ENCENDIDO', N'Plantas de Emergencia'),
(N'NIVEL DE ACEITE', N'Plantas de Emergencia'),
(N'NIVEL DE ANTICONGELANTE', N'Plantas de Emergencia'),
(N'NIVEL DE COMBUSTIBLE', N'Plantas de Emergencia'),
(N'PRUEBA DE ARRANQUE CON CARGA', N'Plantas de Emergencia'),
(N'PRUEBA DE ARRANQUE MANUAL', N'Plantas de Emergencia'),
(N'PRUEBA DE ARRANQUE SIN CARGA', N'Plantas de Emergencia'),
(N'REVISION DE ENFRIAMIENTO', N'Plantas de Emergencia'),
(N'REVISION DE LA MARCHA DE MOTOR', N'Plantas de Emergencia'),
(N'TEMPERATURA DE MAQUINA', N'Plantas de Emergencia'),
(N'TEMPERATURA PRECALENTADOR', N'Plantas de Emergencia'),
-- Amenidades
(N'LIMPIEZA DE AREA', N'Amenidades'),
-- Sistema de Drenaje
(N'REVISION DE REGISTROS LIBRES Y LIMPIOS', N'Sistema de Drenaje');

-- Mapeo previsto
SELECT m.[ClassName], COUNT(*) AS Criterios
FROM @map m
GROUP BY m.[ClassName]
ORDER BY m.[ClassName];

-- Diagnóstico: descripciones del @map que no existen en el catálogo
SELECT m.[Description] AS NoEncontrada
FROM @map m
LEFT JOIN [dbo].[InspectionCriteria] c
    ON LTRIM(RTRIM(c.[Description])) = LTRIM(RTRIM(m.[Description]))
WHERE c.[Id] IS NULL;

-- Aplicar
UPDATE c
SET c.[EquipmentClassificationId] = ec.[Id]
FROM [dbo].[InspectionCriteria] c
INNER JOIN @map m
    ON LTRIM(RTRIM(c.[Description])) = LTRIM(RTRIM(m.[Description]))
INNER JOIN [dbo].[EquipmentClassifications] ec
    ON LTRIM(RTRIM(ec.[Description])) = LTRIM(RTRIM(m.[ClassName]))
WHERE c.[EquipmentClassificationId] <> ec.[Id];

SELECT @@ROWCOUNT AS CriteriosActualizados;
