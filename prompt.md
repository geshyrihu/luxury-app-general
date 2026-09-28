Sigues siendo el agente EJECUTOR del plan de migración de activos de MaintenanceLuxuryApp.
R2 parcial (T-201/T-202/T-204/T-205) está aprobado. Ahora haces T-203: el PUNTO DE NO RETORNO del plan
(reapuntar las 12 FK de fuego hacia Equipment). Idioma: español.

LECTURA OBLIGATORIA
1. docs/MaintenanceLuxuryApp/Machinery/20260926-plan-maintenance-machinery.md (§4 T-203; §20 gate previo)
2. Los 12 archivos de entidad (ya verificados por el arquitecto, no re-descubras nada, solo confirma que
   coinciden antes de tocarlos):
   Infrastructure/Data/Entities/MaintenanceLuxuryApp/FireExtinguisherLog/BitacoraExtintor.cs
   Infrastructure/Data/Entities/MaintenanceLuxuryApp/HydrantLog/BitacoraHidrante.cs
   Infrastructure/Data/Entities/MaintenanceLuxuryApp/SmokeDetectorLog/BitacoraDetectorHumo.cs
   Infrastructure/Data/Entities/MaintenanceLuxuryApp/ManualCallPointLog/BitacoraEstacionManual.cs
   Infrastructure/Data/Entities/MaintenanceLuxuryApp/FireInspectionPeriods/FireInspectionPeriodExtinguisher.cs
   Infrastructure/Data/Entities/MaintenanceLuxuryApp/FireInspectionPeriods/FireInspectionPeriodHydrant.cs
   Infrastructure/Data/Entities/MaintenanceLuxuryApp/FireInspectionPeriods/FireInspectionPeriodDetector.cs
   Infrastructure/Data/Entities/MaintenanceLuxuryApp/FireInspectionPeriods/FireInspectionPeriodStation.cs
   Infrastructure/Data/Entities/MaintenanceLuxuryApp/FireInspectionPeriods/FireCycleInspectionExtinguisher.cs
   Infrastructure/Data/Entities/MaintenanceLuxuryApp/FireInspectionPeriods/FireCycleInspectionHydrant.cs
   Infrastructure/Data/Entities/MaintenanceLuxuryApp/FireInspectionPeriods/FireCycleInspectionDetector.cs
   Infrastructure/Data/Entities/MaintenanceLuxuryApp/FireInspectionPeriods/FireCycleInspectionStation.cs
3. Las 4 entidades de inventario (tienen una colección "Logs" que hay que retirar, ver TAREA 2):
   Infrastructure/Data/Entities/OperationsLuxuryApp/Inventory/InventarioExtintor.cs (Logs: HashSet<BitacoraExtintor>)
   Infrastructure/Data/Entities/OperationsLuxuryApp/Inventory/InventarioHidrante.cs (Logs: ICollection<BitacoraHidrante>)
   Infrastructure/Data/Entities/OperationsLuxuryApp/Inventory/InventarioDetectorHumo.cs (Logs: HashSet<BitacoraDetectorHumo>)
   Infrastructure/Data/Entities/OperationsLuxuryApp/Inventory/InventarioEstacionManual.cs (Logs: HashSet<BitacoraEstacionManual>)
4. api/LuxuryApp.Application/Modules/AdminLuxuryApp/Customers/Customers/Services/CustomerAppService.cs
   (ya tiene el fix de T-204 para EquipmentFireDetails, alrededor de la línea ~430; ver TAREA 3)
5. api/LuxuryApp.Application/Infrastructure/Data/ApplicationDbContext.cs (línea ~3475-3481: loop global que
   fuerza DeleteBehavior.Restrict a TODOS los FK — las 12 relaciones ya son Restrict hoy, se mantiene igual)

CONTEXTO YA VERIFICADO POR EL ARQUITECTO (no lo repitas, confía en esto):
- Las 12 relaciones hoy se configuran POR CONVENCIÓN (sin Fluent API explícita más allá de lo que el loop
  global aplica). 8 de las 12 (las FireInspectionPeriod* y FireCycleInspection*) son .WithMany() sin
  colección inversa. Las otras 4 (Bitacora*) son .WithMany("Logs") contra la colección Logs de su
  Inventario* correspondiente.
- NINGÚN consumidor en Application/ ni en Tests/ accede a estas navegaciones (verificado con grep exhaustivo
  de ".Extinguisher.", ".Hydrant.", ".Detector.", ".Station." y de ".Logs" — cero resultados relevantes).
  Por eso el cambio es seguro a nivel de código: nadie hace .Include(x => x.Extinguisher) ni lee
  x.Extinguisher.AlgunaPropiedad ni itera InventarioExtintor.Logs.

PROHIBIDO
- Aplicar la migración a CUALQUIER base de datos real (dev, staging, producción). Solo genera la migración
  y su SQL (dotnet ef migrations script) para revisión. NO ejecutes dotnet ef database update.
- Tocar Program.cs.
- Desplegar nada.
- Tocar las 4 tablas de fuego (FireExtinguishers/Hydrants/SmokeDetectors/ManualCallPoints) ni sus datos.
- Modificar ningún DTO, EndPoint ni Mapper de los 4 módulos de fuego (esto es solo esquema + purga).

TAREA 1 — Retipar la navegación de los 12 dependientes hacia Equipment
Para cada uno de los 12 archivos listados arriba: cambia el TIPO de la propiedad de navegación (el nombre
de la propiedad NO cambia, el nombre de columna del FK -ExtinguisherId/HydrantId/DetectorId/StationId-
tampoco cambia). Ejemplo exacto en BitacoraExtintor.cs:
  ANTES: public InventarioExtintor Extinguisher { get; set; }
  DESPUÉS: public Equipment Extinguisher { get; set; }
Repite el patrón análogo en los 11 restantes (Hydrant->Equipment, Detector->Equipment, Station->Equipment),
conservando el nombre de propiedad tal cual está hoy en cada archivo (Extinguisher/Hydrant/Detector/Station).
NO agregues [ForeignKey] ni Fluent API nueva: la convención de EF debe seguir resolviendo el FK por el mismo
nombre de columna. Verifica el build tras este cambio.

TAREA 2 — Retirar la colección "Logs" huérfana de las 4 entidades de inventario
Tras la Tarea 1, InventarioExtintor.Logs (y las 3 análogas) ya NO tiene una relación inversa válida
(BitacoraExtintor.Extinguisher ahora apunta a Equipment, no a InventarioExtintor). Sin este paso, EF puede
fallar al construir el modelo (la app no arrancaría). Elimina la propiedad Logs de las 4 entidades:
  InventarioExtintor.cs      -> quitar "public HashSet<BitacoraExtintor> Logs { get; set; } = [];"
  InventarioHidrante.cs      -> quitar "public ICollection<BitacoraHidrante> Logs { get; set; } = [];" (o el tipo real que encuentres)
  InventarioDetectorHumo.cs  -> quitar "public HashSet<BitacoraDetectorHumo> Logs { get; set; } = [];"
  InventarioEstacionManual.cs-> quitar "public HashSet<BitacoraEstacionManual> Logs { get; set; } = [];"
Verifica con grep que ningún otro archivo (fuera de estos 4) referencia esa propiedad Logs de estos 4 tipos
antes de borrarla (el arquitecto ya verificó que no, pero confírmalo tú también antes de tocar código).
Si encuentras algo que SÍ la usa, DETENTE y reporta -- no la borres a ciegas.

TAREA 3 — Extender la purga de cliente para las 12 tablas dependientes
Con las 12 FK apuntando a Equipment (Restrict), purgar un cliente con activos de fuego que tengan bitácoras
o inspecciones registradas VA A FALLAR si no se borran esas 12 tablas antes de Equipment.RemoveRange. En
CustomerAppService.cs, en la MISMA región donde ya está el fix de T-204 (busca el comentario "T-204:" y el
bloque "if (machineryIds.Any())"), agrega el borrado de las 12 tablas por su FK (ExtinguisherId/HydrantId/
DetectorId/StationId contenido en machineryIds), ANTES de Equipment.RemoveRange:
  - BitacoraExtintor, BitacoraHidrante, BitacoraDetectorHumo, BitacoraEstacionManual (por su FK a Equipment)
  - FireInspectionPeriodExtinguisher, FireInspectionPeriodHydrant, FireInspectionPeriodDetector, FireInspectionPeriodStation
  - FireCycleInspectionExtinguisher, FireCycleInspectionHydrant, FireCycleInspectionDetector, FireCycleInspectionStation
Usa el mismo patrón DeleteEntitiesAsync que ya usa el resto del método (revisa la firma en el propio
archivo). El orden entre estas 12 no importa entre sí (ninguna depende de otra), pero TODAS deben ir antes
de EquipmentFireDetails y de Equipment.RemoveRange.
PRUEBA: extiende o crea un test de purga (mismo patrón que CustomerPurgeFireDetailsTests) que siembre un
activo de fuego migrado (Equipment+EquipmentFireDetails) CON al menos una fila de cada una de las 12 tablas
apuntando a él, corra CustomerAppService.DeleteAsync, y confirme 0 filas huérfanas en las 12 + en
EquipmentFireDetails + en Equipment. Nota: con el proveedor InMemory las FK no se validan de verdad, así
que esta prueba valida el ORDEN Y COMPLETITUD del borrado en código, no la restricción de BD en sí (eso lo
valida el CHECK real de SQL Server al aplicar la migración, fuera de esta ronda).

TAREA 4 — Generar la migración EF y su SQL
Genera la migración `dotnet ef migrations add SwitchFireForeignKeysToEquipment` (SOLO generar, NO aplicar
a ninguna BD). Antes de aceptarla:
- Compara el diff de ApplicationDbContextModelSnapshot.cs: debe contener EXCLUSIVAMENTE:
  (a) las 12 relaciones cambiando su tabla/entidad referenciada de Inventario* a Equipment (mismo nombre
      de columna FK, mismo DeleteBehavior.Restrict, mismo IsRequired), y
  (b) la desaparición de las 4 navegaciones "Logs" en los Inventario*.
  Si aparece CUALQUIER otro cambio ajeno (el modelo puede tener cambios pendientes de otro trabajo en
  curso), DETENTE y repórtalo; no lo incluyas ni lo borres de la migración.
- Revisa Up()/Down() a mano: solo debe haber DROP CONSTRAINT + ADD CONSTRAINT (FK) por cada una de las 12,
  nada de ADD/DROP COLUMN, nada de CREATE/DROP TABLE, nada de INSERT/UPDATE. Down() debe revertir
  exactamente a las 12 FK originales hacia las tablas de fuego.
- Genera también el SQL con `dotnet ef migrations script <migración anterior> SwitchFireForeignKeysToEquipment`
  para revisión del arquitecto (no lo ejecutes).

TAREA 5 — Query de pre-vuelo (para el Tech Lead, NO la ejecutes tú)
Escribe (no ejecutes) una consulta de solo lectura que, para cada una de las 12 tablas, cuente las filas
cuyo valor de FK (ExtinguisherId/HydrantId/DetectorId/StationId) NO exista en Equipment con
InventoryCategory = FireProtection. El resultado esperado en cualquier entorno ya migrado (D1 ejecutado) es
0 en las 12. Entrega esta query en un bloque de código en tu reporte final; el Tech Lead la correrá en
producción ANTES de desplegar esta migración.

REGLAS GENERALES (igual que siempre)
- Verifica cada archivo:línea antes de editar. Si algo no coincide, DETENTE y reporta.
- Build + TODAS las pruebas de LuxuryApp.Tests en verde. Línea base conocida: 16 fallas preexistentes
  (mismos nombres del gate de R2 parcial, §20 del plan). Cualquier falla NUEVA bloquea -- y en particular,
  si el modelo de EF no construye bien tras las Tareas 1-2, es probable que MUCHAS pruebas existentes
  fallen de golpe (todas usan InMemoryDbContextFactory.Create()); si eso pasa, es la señal de que algo del
  retipado quedó mal, no lo ignores ni lo "arregles" ocultando el síntoma.
- node scripts/audit-conventions-backend.mjs (en api/) no debe empeorar ninguna regla crítica.
- Commits por tarea. git add archivo por archivo, NUNCA git add -A. Sin push.
- NO toques appsweb/angular.

ENTREGABLE FINAL (mismo formato de siempre)
1. Tabla Tarea 1-5: estado, archivos:líneas, evidencia
2. Confirmación de que ningún consumidor rompió al recompilar (o el detalle si algo sí lo hizo)
3. Diff completo del snapshot (pega el diff real, no un resumen) + el SQL generado de la migración
4. La query de pre-vuelo de la Tarea 5, lista para el Tech Lead
5. Resultado de la prueba de purga extendida
6. Build, pruebas (comparado con la línea base) y gate de convenciones
7. Hashes de commits
8. Discrepancias y preguntas abiertas
Detente al terminar. NO se despliega nada de esto sin la aprobación explícita del arquitecto sobre el
diff de la migración y sin que el Tech Lead confirme la query de pre-vuelo en 0 en producción.
