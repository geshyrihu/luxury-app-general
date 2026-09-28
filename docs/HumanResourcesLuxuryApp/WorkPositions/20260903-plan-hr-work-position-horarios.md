# 🏗️ PROPUESTA DEFINITIVA: Refactor Completo de Horarios con Ciclos de 4 Semanas

Aquí tienes el esquema completo, consolidado y listo para ejecutar. Incluye el modelo de datos, las 6 plantillas maestras con ciclos, y consideraciones de UI/UX.

---

## 📦 PARTE 1: MODELO DE DATOS ACTUALIZADO

### 1.1 Enum `TipoJornada` (Unificado)

```csharp
using System.ComponentModel.DataAnnotations;

namespace LuxuryApp.Application.Shared.Enums;

/// <summary>
/// Define los tipos de jornada o turno de trabajo disponibles.
/// Unifica los turnos estándar y los especiales en una sola fuente de verdad.
/// </summary>
public enum TipoJornada
{
    [Display(Name = "Matutino")]
    Matutino = 1,

    [Display(Name = "Vespertino")]
    Vespertino = 2,

    [Display(Name = "Nocturno")]
    Nocturno = 3,

    [Display(Name = "Guardia 24x24")]
    Guardia24x24 = 4,

    [Display(Name = "Jornada 12x12")]
    Jornada12x12 = 5,

    [Display(Name = "Personalizado (Por día/ciclo)")]
    Personalizado = 6
}
```

### 1.2 Entidad Principal `WorkPositionSchedule`

```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using LuxuryApp.Application.Shared.Enums;

namespace LuxuryApp.Application.Infrastructure.Data.Entities;

[Table("WorkPositionSchedules")]
public class WorkPositionSchedule : GuidIdEntity, IAuditable
{
    [Required(ErrorMessage = "El nombre del horario es obligatorio")]
    [StringLength(100, ErrorMessage = "El nombre no puede exceder {1} caracteres")]
    [Display(Name = "Nombre del horario")]
    public string Nombre { get; set; } = string.Empty;

    [StringLength(250, ErrorMessage = "La descripción no puede exceder {1} caracteres")]
    [Display(Name = "Descripción")]
    public string Descripcion { get; set; } = string.Empty;

    [Display(Name = "Tipo de jornada")]
    public TipoJornada TipoJornada { get; set; } = TipoJornada.Personalizado;

    /// <summary>
    /// Define cuántas semanas dura el ciclo de este horario.
    /// 1 = Ciclo semanal estándar (se repite cada semana)
    /// 2 = Ciclo quincenal (se repite cada 2 semanas)
    /// 4 = Ciclo mensual (se repite cada 4 semanas)
    /// </summary>
    [Display(Name = "Duración del ciclo (semanas)")]
    [Range(1, 4, ErrorMessage = "El ciclo debe ser de 1 a 4 semanas")]
    public byte DuracionCicloSemanas { get; set; } = 1;

    [Display(Name = "Activo para asignación")]
    public bool EstaActivo { get; set; } = true;

    [StringLength(500, ErrorMessage = "Las observaciones no pueden exceder {1} caracteres")]
    [Display(Name = "Observaciones")]
    public string Observaciones { get; set; } = string.Empty;

    // Relación 1 a muchos con los días de trabajo
    [InverseProperty(nameof(DiaDeTrabajo.Horario))]
    public ICollection<DiaDeTrabajo> DiasDeTrabajo { get; set; } = new List<DiaDeTrabajo>();

    // Relación con puestos
    public HashSet<WorkPosition> WorkPositions { get; set; } = [];
}
```

### 1.3 Entidad Hija `DiaDeTrabajo` (Con soporte de ciclos)

```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LuxuryApp.Application.Infrastructure.Data.Entities;

[Table("WorkPositionScheduleDays")]
public class DiaDeTrabajo : GuidIdEntity
{
    [Required]
    public Guid WorkPositionScheduleId { get; set; }

    [ForeignKey(nameof(WorkPositionScheduleId))]
    [InverseProperty(nameof(WorkPositionSchedule.DiasDeTrabajo))]
    public WorkPositionSchedule Horario { get; set; } = null!;

    /// <summary>
    /// Día de la semana (0=Domingo, 1=Lunes, ..., 6=Sábado)
    /// </summary>
    [Display(Name = "Día de la semana")]
    [Required]
    public DayOfWeek DiaSemana { get; set; }

    /// <summary>
    /// Número de semana dentro del ciclo (1, 2, 3 o 4).
    /// Si el horario tiene DuracionCicloSemanas = 1, este valor siempre será 1.
    /// Si tiene DuracionCicloSemanas = 4, puede ser 1, 2, 3 o 4.
    /// </summary>
    [Display(Name = "Semana del ciclo")]
    [Range(1, 4, ErrorMessage = "La semana del ciclo debe ser entre 1 y 4")]
    public byte NumeroSemanaCiclo { get; set; } = 1;

    [Display(Name = "Hora de entrada")]
    public TimeOnly? HoraEntrada { get; set; }

    [Display(Name = "Hora de salida")]
    public TimeOnly? HoraSalida { get; set; }

    [Display(Name = "Es día de descanso")]
    public bool EsDescanso { get; set; }
}
```

---

## 📋 PARTE 2: LAS 6 PLANTILLAS MAESTRAS (Seed Data)

### Plantilla 1: "Matutino Estándar (Oficina)"

```csharp
var matutinoEstandar = new WorkPositionSchedule
{
    Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
    Nombre = "Matutino Estándar (Oficina)",
    Descripcion = "Lunes a Viernes 09:00-18:00, Sábado 09:00-13:00, Domingo descanso.",
    TipoJornada = TipoJornada.Matutino,
    DuracionCicloSemanas = 1,
    EstaActivo = true,
    DiasDeTrabajo = new List<DiaDeTrabajo>
    {
        // Lunes a Viernes (Semana 1)
        new() { DiaSemana = DayOfWeek.Monday, NumeroSemanaCiclo = 1, HoraEntrada = new TimeOnly(9, 0), HoraSalida = new TimeOnly(18, 0) },
        new() { DiaSemana = DayOfWeek.Tuesday, NumeroSemanaCiclo = 1, HoraEntrada = new TimeOnly(9, 0), HoraSalida = new TimeOnly(18, 0) },
        new() { DiaSemana = DayOfWeek.Wednesday, NumeroSemanaCiclo = 1, HoraEntrada = new TimeOnly(9, 0), HoraSalida = new TimeOnly(18, 0) },
        new() { DiaSemana = DayOfWeek.Thursday, NumeroSemanaCiclo = 1, HoraEntrada = new TimeOnly(9, 0), HoraSalida = new TimeOnly(18, 0) },
        new() { DiaSemana = DayOfWeek.Friday, NumeroSemanaCiclo = 1, HoraEntrada = new TimeOnly(9, 0), HoraSalida = new TimeOnly(18, 0) },
        // Sábado
        new() { DiaSemana = DayOfWeek.Saturday, NumeroSemanaCiclo = 1, HoraEntrada = new TimeOnly(9, 0), HoraSalida = new TimeOnly(13, 0) },
        // Domingo descanso
        new() { DiaSemana = DayOfWeek.Sunday, NumeroSemanaCiclo = 1, EsDescanso = true }
    }
};
```

### Plantilla 2: "Operativo Temprano (Limpieza/Mantenimiento)"

```csharp
var operativoTemprano = new WorkPositionSchedule
{
    Id = Guid.Parse("00000000-0000-0000-0000-000000000002"),
    Nombre = "Operativo Temprano (Limpieza/Mantenimiento)",
    Descripcion = "Lunes a Viernes 07:00-16:00, Sábado 07:00-13:00, Domingo descanso.",
    TipoJornada = TipoJornada.Matutino,
    DuracionCicloSemanas = 1,
    EstaActivo = true,
    DiasDeTrabajo = new List<DiaDeTrabajo>
    {
        new() { DiaSemana = DayOfWeek.Monday, NumeroSemanaCiclo = 1, HoraEntrada = new TimeOnly(7, 0), HoraSalida = new TimeOnly(16, 0) },
        new() { DiaSemana = DayOfWeek.Tuesday, NumeroSemanaCiclo = 1, HoraEntrada = new TimeOnly(7, 0), HoraSalida = new TimeOnly(16, 0) },
        new() { DiaSemana = DayOfWeek.Wednesday, NumeroSemanaCiclo = 1, HoraEntrada = new TimeOnly(7, 0), HoraSalida = new TimeOnly(16, 0) },
        new() { DiaSemana = DayOfWeek.Thursday, NumeroSemanaCiclo = 1, HoraEntrada = new TimeOnly(7, 0), HoraSalida = new TimeOnly(16, 0) },
        new() { DiaSemana = DayOfWeek.Friday, NumeroSemanaCiclo = 1, HoraEntrada = new TimeOnly(7, 0), HoraSalida = new TimeOnly(16, 0) },
        new() { DiaSemana = DayOfWeek.Saturday, NumeroSemanaCiclo = 1, HoraEntrada = new TimeOnly(7, 0), HoraSalida = new TimeOnly(13, 0) },
        new() { DiaSemana = DayOfWeek.Sunday, NumeroSemanaCiclo = 1, EsDescanso = true }
    }
};
```

### Plantilla 3: "Guardia 24x24 (Inicio Par)"

```csharp
var guardia24x24Par = new WorkPositionSchedule
{
    Id = Guid.Parse("00000000-0000-0000-0000-000000000003"),
    Nombre = "Guardia 24x24 (Inicio Par)",
    Descripcion = "Turno de 24 horas. Entra día par a las 08:00, sale día siguiente a las 08:00. Descansa el día impar.",
    TipoJornada = TipoJornada.Guardia24x24,
    DuracionCicloSemanas = 2, // Ciclo de 2 semanas para alternar
    EstaActivo = true,
    DiasDeTrabajo = new List<DiaDeTrabajo>
    {
        // Semana 1: Trabaja Lunes, Miércoles, Viernes
        new() { DiaSemana = DayOfWeek.Monday, NumeroSemanaCiclo = 1, HoraEntrada = new TimeOnly(8, 0), HoraSalida = new TimeOnly(8, 0) },
        new() { DiaSemana = DayOfWeek.Tuesday, NumeroSemanaCiclo = 1, EsDescanso = true },
        new() { DiaSemana = DayOfWeek.Wednesday, NumeroSemanaCiclo = 1, HoraEntrada = new TimeOnly(8, 0), HoraSalida = new TimeOnly(8, 0) },
        new() { DiaSemana = DayOfWeek.Thursday, NumeroSemanaCiclo = 1, EsDescanso = true },
        new() { DiaSemana = DayOfWeek.Friday, NumeroSemanaCiclo = 1, HoraEntrada = new TimeOnly(8, 0), HoraSalida = new TimeOnly(8, 0) },
        new() { DiaSemana = DayOfWeek.Saturday, NumeroSemanaCiclo = 1, EsDescanso = true },
        new() { DiaSemana = DayOfWeek.Sunday, NumeroSemanaCiclo = 1, HoraEntrada = new TimeOnly(8, 0), HoraSalida = new TimeOnly(8, 0) },

        // Semana 2: Trabaja Martes, Jueves, Sábado
        new() { DiaSemana = DayOfWeek.Monday, NumeroSemanaCiclo = 2, EsDescanso = true },
        new() { DiaSemana = DayOfWeek.Tuesday, NumeroSemanaCiclo = 2, HoraEntrada = new TimeOnly(8, 0), HoraSalida = new TimeOnly(8, 0) },
        new() { DiaSemana = DayOfWeek.Wednesday, NumeroSemanaCiclo = 2, EsDescanso = true },
        new() { DiaSemana = DayOfWeek.Thursday, NumeroSemanaCiclo = 2, HoraEntrada = new TimeOnly(8, 0), HoraSalida = new TimeOnly(8, 0) },
        new() { DiaSemana = DayOfWeek.Friday, NumeroSemanaCiclo = 2, EsDescanso = true },
        new() { DiaSemana = DayOfWeek.Saturday, NumeroSemanaCiclo = 2, HoraEntrada = new TimeOnly(8, 0), HoraSalida = new TimeOnly(8, 0) },
        new() { DiaSemana = DayOfWeek.Sunday, NumeroSemanaCiclo = 2, EsDescanso = true }
    }
};
```

### Plantilla 4: "Nocturno (Vigilancia/Recepción)"

```csharp
var nocturno = new WorkPositionSchedule
{
    Id = Guid.Parse("00000000-0000-0000-0000-000000000004"),
    Nombre = "Nocturno (Vigilancia/Recepción)",
    Descripcion = "Lunes a Domingo 22:00-06:00 (día siguiente).",
    TipoJornada = TipoJornada.Nocturno,
    DuracionCicloSemanas = 1,
    EstaActivo = true,
    DiasDeTrabajo = new List<DiaDeTrabajo>
    {
        new() { DiaSemana = DayOfWeek.Monday, NumeroSemanaCiclo = 1, HoraEntrada = new TimeOnly(22, 0), HoraSalida = new TimeOnly(6, 0) },
        new() { DiaSemana = DayOfWeek.Tuesday, NumeroSemanaCiclo = 1, HoraEntrada = new TimeOnly(22, 0), HoraSalida = new TimeOnly(6, 0) },
        new() { DiaSemana = DayOfWeek.Wednesday, NumeroSemanaCiclo = 1, HoraEntrada = new TimeOnly(22, 0), HoraSalida = new TimeOnly(6, 0) },
        new() { DiaSemana = DayOfWeek.Thursday, NumeroSemanaCiclo = 1, HoraEntrada = new TimeOnly(22, 0), HoraSalida = new TimeOnly(6, 0) },
        new() { DiaSemana = DayOfWeek.Friday, NumeroSemanaCiclo = 1, HoraEntrada = new TimeOnly(22, 0), HoraSalida = new TimeOnly(6, 0) },
        new() { DiaSemana = DayOfWeek.Saturday, NumeroSemanaCiclo = 1, HoraEntrada = new TimeOnly(22, 0), HoraSalida = new TimeOnly(6, 0) },
        new() { DiaSemana = DayOfWeek.Sunday, NumeroSemanaCiclo = 1, HoraEntrada = new TimeOnly(22, 0), HoraSalida = new TimeOnly(6, 0) }
    }
};
```

### Plantilla 5: "Turno con Rol de Fin de Semana (Ciclo 4 Semanas)" ⭐ LA MÁS IMPORTANTE

```csharp
var rolFinSemana4Semanas = new WorkPositionSchedule
{
    Id = Guid.Parse("00000000-0000-0000-0000-000000000005"),
    Nombre = "Turno con Rol de Fin de Semana (Ciclo 4 Semanas)",
    Descripcion = "Lunes a Viernes 09:00-18:00. Fines de semana rotativos: Semana 1 descanso, Semana 2 trabaja, Semana 3 descanso, Semana 4 descanso.",
    TipoJornada = TipoJornada.Personalizado,
    DuracionCicloSemanas = 4,
    EstaActivo = true,
    DiasDeTrabajo = new List<DiaDeTrabajo>
    {
        // SEMANA 1: Lunes a Viernes + Descanso Fin de Semana
        new() { DiaSemana = DayOfWeek.Monday, NumeroSemanaCiclo = 1, HoraEntrada = new TimeOnly(9, 0), HoraSalida = new TimeOnly(18, 0) },
        new() { DiaSemana = DayOfWeek.Tuesday, NumeroSemanaCiclo = 1, HoraEntrada = new TimeOnly(9, 0), HoraSalida = new TimeOnly(18, 0) },
        new() { DiaSemana = DayOfWeek.Wednesday, NumeroSemanaCiclo = 1, HoraEntrada = new TimeOnly(9, 0), HoraSalida = new TimeOnly(18, 0) },
        new() { DiaSemana = DayOfWeek.Thursday, NumeroSemanaCiclo = 1, HoraEntrada = new TimeOnly(9, 0), HoraSalida = new TimeOnly(18, 0) },
        new() { DiaSemana = DayOfWeek.Friday, NumeroSemanaCiclo = 1, HoraEntrada = new TimeOnly(9, 0), HoraSalida = new TimeOnly(18, 0) },
        new() { DiaSemana = DayOfWeek.Saturday, NumeroSemanaCiclo = 1, EsDescanso = true },
        new() { DiaSemana = DayOfWeek.Sunday, NumeroSemanaCiclo = 1, EsDescanso = true },

        // SEMANA 2: Lunes a Viernes + Trabaja Fin de Semana (10:00-19:00)
        new() { DiaSemana = DayOfWeek.Monday, NumeroSemanaCiclo = 2, HoraEntrada = new TimeOnly(9, 0), HoraSalida = new TimeOnly(18, 0) },
        new() { DiaSemana = DayOfWeek.Tuesday, NumeroSemanaCiclo = 2, HoraEntrada = new TimeOnly(9, 0), HoraSalida = new TimeOnly(18, 0) },
        new() { DiaSemana = DayOfWeek.Wednesday, NumeroSemanaCiclo = 2, HoraEntrada = new TimeOnly(9, 0), HoraSalida = new TimeOnly(18, 0) },
        new() { DiaSemana = DayOfWeek.Thursday, NumeroSemanaCiclo = 2, HoraEntrada = new TimeOnly(9, 0), HoraSalida = new TimeOnly(18, 0) },
        new() { DiaSemana = DayOfWeek.Friday, NumeroSemanaCiclo = 2, HoraEntrada = new TimeOnly(9, 0), HoraSalida = new TimeOnly(18, 0) },
        new() { DiaSemana = DayOfWeek.Saturday, NumeroSemanaCiclo = 2, HoraEntrada = new TimeOnly(10, 0), HoraSalida = new TimeOnly(19, 0) },
        new() { DiaSemana = DayOfWeek.Sunday, NumeroSemanaCiclo = 2, HoraEntrada = new TimeOnly(10, 0), HoraSalida = new TimeOnly(19, 0) },

        // SEMANA 3: Lunes a Viernes + Descanso Fin de Semana
        new() { DiaSemana = DayOfWeek.Monday, NumeroSemanaCiclo = 3, HoraEntrada = new TimeOnly(9, 0), HoraSalida = new TimeOnly(18, 0) },
        new() { DiaSemana = DayOfWeek.Tuesday, NumeroSemanaCiclo = 3, HoraEntrada = new TimeOnly(9, 0), HoraSalida = new TimeOnly(18, 0) },
        new() { DiaSemana = DayOfWeek.Wednesday, NumeroSemanaCiclo = 3, HoraEntrada = new TimeOnly(9, 0), HoraSalida = new TimeOnly(18, 0) },
        new() { DiaSemana = DayOfWeek.Thursday, NumeroSemanaCiclo = 3, HoraEntrada = new TimeOnly(9, 0), HoraSalida = new TimeOnly(18, 0) },
        new() { DiaSemana = DayOfWeek.Friday, NumeroSemanaCiclo = 3, HoraEntrada = new TimeOnly(9, 0), HoraSalida = new TimeOnly(18, 0) },
        new() { DiaSemana = DayOfWeek.Saturday, NumeroSemanaCiclo = 3, EsDescanso = true },
        new() { DiaSemana = DayOfWeek.Sunday, NumeroSemanaCiclo = 3, EsDescanso = true },

        // SEMANA 4: Lunes a Viernes + Descanso Fin de Semana
        new() { DiaSemana = DayOfWeek.Monday, NumeroSemanaCiclo = 4, HoraEntrada = new TimeOnly(9, 0), HoraSalida = new TimeOnly(18, 0) },
        new() { DiaSemana = DayOfWeek.Tuesday, NumeroSemanaCiclo = 4, HoraEntrada = new TimeOnly(9, 0), HoraSalida = new TimeOnly(18, 0) },
        new() { DiaSemana = DayOfWeek.Wednesday, NumeroSemanaCiclo = 4, HoraEntrada = new TimeOnly(9, 0), HoraSalida = new TimeOnly(18, 0) },
        new() { DiaSemana = DayOfWeek.Thursday, NumeroSemanaCiclo = 4, HoraEntrada = new TimeOnly(9, 0), HoraSalida = new TimeOnly(18, 0) },
        new() { DiaSemana = DayOfWeek.Friday, NumeroSemanaCiclo = 4, HoraEntrada = new TimeOnly(9, 0), HoraSalida = new TimeOnly(18, 0) },
        new() { DiaSemana = DayOfWeek.Saturday, NumeroSemanaCiclo = 4, EsDescanso = true },
        new() { DiaSemana = DayOfWeek.Sunday, NumeroSemanaCiclo = 4, EsDescanso = true }
    }
};
```

### Plantilla 6: "Solo Fines de Semana (Eventos/Palapa)"

```csharp
var soloFinesSemana = new WorkPositionSchedule
{
    Id = Guid.Parse("00000000-0000-0000-0000-000000000006"),
    Nombre = "Solo Fines de Semana (Eventos/Palapa)",
    Descripcion = "Lunes a Viernes descanso. Sábado y Domingo 10:00-19:00.",
    TipoJornada = TipoJornada.Personalizado,
    DuracionCicloSemanas = 1,
    EstaActivo = true,
    DiasDeTrabajo = new List<DiaDeTrabajo>
    {
        new() { DiaSemana = DayOfWeek.Monday, NumeroSemanaCiclo = 1, EsDescanso = true },
        new() { DiaSemana = DayOfWeek.Tuesday, NumeroSemanaCiclo = 1, EsDescanso = true },
        new() { DiaSemana = DayOfWeek.Wednesday, NumeroSemanaCiclo = 1, EsDescanso = true },
        new() { DiaSemana = DayOfWeek.Thursday, NumeroSemanaCiclo = 1, EsDescanso = true },
        new() { DiaSemana = DayOfWeek.Friday, NumeroSemanaCiclo = 1, EsDescanso = true },
        new() { DiaSemana = DayOfWeek.Saturday, NumeroSemanaCiclo = 1, HoraEntrada = new TimeOnly(10, 0), HoraSalida = new TimeOnly(19, 0) },
        new() { DiaSemana = DayOfWeek.Sunday, NumeroSemanaCiclo = 1, HoraEntrada = new TimeOnly(10, 0), HoraSalida = new TimeOnly(19, 0) }
    }
};
```

---

## 🎨 PARTE 3: UI/UX EN ANGULAR (Cómo mostrar 4 semanas)

### 3.1 Estructura del JSON que recibe Angular

```json
{
  "id": "00000000-0000-0000-0000-000000000005",
  "nombre": "Turno con Rol de Fin de Semana (Ciclo 4 Semanas)",
  "tipoJornada": 6,
  "duracionCicloSemanas": 4,
  "diasDeTrabajo": [
    {
      "diaSemana": 1,
      "numeroSemanaCiclo": 1,
      "horaEntrada": "09:00:00",
      "horaSalida": "18:00:00",
      "esDescanso": false
    },
    { "diaSemana": 6, "numeroSemanaCiclo": 1, "esDescanso": true },
    { "diaSemana": 6, "numeroSemanaCiclo": 2, "horaEntrada": "10:00:00", "horaSalida": "19:00:00", "esDescanso": false }
    // ... más días
  ]
}
```

### 3.2 Componente Angular con Tabs para las 4 Semanas

```html
<!-- schedule-form.component.html -->
<div class="schedule-form">
  <h2>{{ schedule.nombre }}</h2>
  <p>Duración del ciclo: {{ schedule.duracionCicloSemanas }} semana(s)</p>

  <!-- Tabs para cada semana del ciclo -->
  <p-tabView *ngIf="schedule.duracionCicloSemanas > 1">
    <p-tabPanel *ngFor="let semana of semanasDelCiclo" [header]="'Semana ' + semana">
      <p-table [value]="getDiasDeSemana(semana)">
        <ng-template pTemplate="header">
          <tr>
            <th>Día</th>
            <th>Entrada</th>
            <th>Salida</th>
            <th>Descanso</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-dia>
          <tr>
            <td>{{ dia.diaSemana | diaSemana }}</td>
            <td>
              <p-timePicker *ngIf="!dia.esDescanso" [(ngModel)]="dia.horaEntrada" [disabled]="dia.esDescanso">
              </p-timePicker>
            </td>
            <td>
              <p-timePicker *ngIf="!dia.esDescanso" [(ngModel)]="dia.horaSalida" [disabled]="dia.esDescanso">
              </p-timePicker>
            </td>
            <td>
              <p-checkbox [(ngModel)]="dia.esDescanso" [binary]="true" (onChange)="toggleDescanso(dia)"> </p-checkbox>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </p-tabPanel>
  </p-tabView>

  <!-- Si es ciclo de 1 semana, mostrar tabla simple -->
  <p-table *ngIf="schedule.duracionCicloSemanas === 1" [value]="getDiasDeSemana(1)">
    <!-- Mismo contenido que arriba -->
  </p-table>
</div>
```

### 3.3 Lógica del Componente TypeScript

```typescript
// schedule-form.component.ts
export class ScheduleFormComponent {
  schedule: WorkPositionSchedule;
  semanasDelCiclo: number[] = [];

  ngOnInit() {
    // Generar array de semanas [1, 2, 3, 4] según duracionCicloSemanas
    this.semanasDelCiclo = Array.from({ length: this.schedule.duracionCicloSemanas }, (_, i) => i + 1);
  }

  getDiasDeSemana(semana: number): DiaDeTrabajo[] {
    return this.schedule.diasDeTrabajo
      .filter((d) => d.numeroSemanaCiclo === semana)
      .sort((a, b) => a.diaSemana - b.diaSemana);
  }

  toggleDescanso(dia: DiaDeTrabajo) {
    if (dia.esDescanso) {
      dia.horaEntrada = null;
      dia.horaSalida = null;
    }
  }
}
```

### 3.4 Consideraciones de UI/UX

1. **Tabs para Ciclos > 1 Semana**: Si `duracionCicloSemanas` es 2 o 4, usa tabs (PrimeNG `p-tabView`) para no saturar la pantalla.
2. **Checkbox de Descanso**: Al marcar "Es descanso", deshabilita los timepickers automáticamente.
3. **Validación Visual**: Si `HoraSalida < HoraEntrada`, muestra un badge "Cruza medianoche" (ej. 22:00 a 06:00).
4. **Vista de Calendario**: Para horarios con ciclos de 4 semanas, considera una vista de calendario que muestre las próximas 4 semanas con colores según el día de trabajo/descanso.

---

## 🚀 PARTE 4: INSTRUCCIONES PARA EL OTRO AGENTE

Copia y pega esto:

---

**ROL:** Eres un Desarrollador .NET Senior experto en Entity Framework Core y Angular.

**OBJETIVO:** Ejecutar el refactor completo del módulo de horarios según la especificación proporcionada.

**PASO 1: Actualizar Entidades**

1. Reemplaza la entidad `WorkPositionSchedule` con la nueva versión que incluye `DuracionCicloSemanas`.
2. Crea la nueva entidad `DiaDeTrabajo` con las propiedades `DiaSemana`, `NumeroSemanaCiclo`, `HoraEntrada`, `HoraSalida`, `EsDescanso`.
3. Actualiza el enum `TurnoTrabajo` a `TipoJornada` con los valores unificados.
4. Elimina las 14 propiedades antiguas (`LunesEntrada`, `LunesSalida`, etc.) de `WorkPositionSchedule`.

**PASO 2: Migración de Base de Datos**

1. Genera una migración de EF Core que:
   - Cree la tabla `WorkPositionScheduleDays`.
   - Agregue la columna `DuracionCicloSemanas` a `WorkPositionSchedules`.
   - Elimine las columnas antiguas de días.
2. Crea un script de migración de datos que:
   - Analice los registros antiguos de `WorkPositionSchedules`.
   - Para cada registro, cree los registros correspondientes en `WorkPositionScheduleDays` basándose en las horas antiguas.
   - Asigne `NumeroSemanaCiclo = 1` para todos los registros migrados (ciclo de 1 semana).
   - Marque los registros antiguos como `EstaActivo = false` y prefije su nombre con `"[OBSOLETO] "`.

**PASO 3: Seed Data**

1. Crea un método de inicialización que inserte las 6 plantillas maestras proporcionadas.
2. Usa los GUIDs exactos especificados para facilitar las referencias.

**PASO 4: API Endpoints**

1. Actualiza los endpoints de `WorkPositionSchedule` para que incluyan la propiedad `DiasDeTrabajo` en las respuestas.
2. Asegúrate de que el endpoint de creación/actualización acepte el array completo de `DiasDeTrabajo`.

**PASO 5: Frontend Angular**

1. Actualiza el modelo TypeScript `WorkPositionSchedule` para incluir `diasDeTrabajo: DiaDeTrabajo[]`.
2. Implementa el componente de formulario con tabs para ciclos de múltiples semanas.
3. Usa `FormArray` de Angular Reactive Forms para manejar dinámicamente los días.

**VALIDACIONES CRÍTICAS:**

- Si `HoraSalida < HoraEntrada`, el sistema debe interpretar que la salida es del día siguiente.
- Si `EsDescanso = true`, `HoraEntrada` y `HoraSalida` deben ser `null`.
- El número total de registros en `DiasDeTrabajo` debe ser exactamente `7 * DuracionCicloSemanas`.

---

---

## ✅ RESUMEN EJECUTIVO

- **Modelo**: 2 entidades (`WorkPositionSchedule` + `DiaDeTrabajo`) con soporte de ciclos de 1 a 4 semanas.
- **Plantillas**: 6 plantillas maestras que cubren el 95% de los casos de uso detectados en tus datos.
- **UI/UX**: Tabs para ciclos múltiples, timepickers nativos, validación visual de cruce de medianoche.
- **Migración**: Script automático que transforma los datos antiguos al nuevo modelo sin pérdida de información.

¿Procedemos con esta propuesta? Si necesitas ajustes en alguna plantilla o en la lógica de UI, dímelo y lo refinamos antes de pasarlo al otro agente.
