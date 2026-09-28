const fs = require('fs');
const file = 'D:/repos/luxuryapp-api/appsweb/angular/src/app/modules/human-resources.luxuryapp/salary-projections/salary-projections-detail/salary-projections-detail.html';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/  @if \(scenarios\(\)\.length > 1\) \{[\s\S]*?  \}\n\n/g, '');

const headerStr = `  <div class="d-flex flex-wrap align-items-center gap-2">
    @for (scenario of scenarios(); track scenario.id) {
    <il-button [label]="scenario.name" [severity]="scenario.id === activeScenarioId() ? 'primary' : 'secondary'" [variant]="scenario.id === activeScenarioId() ? 'filled' : 'outline'" size="small" (clicked)="selectScenario(scenario.id)" />
    }
    <span class="ms-auto text-body-secondary text-sm">
      @if (isEditable()) {
      Escenario editable: <strong>{{ activeScenario()?.name ?? "—" }}</strong> · Costo total: <strong>{{ activeTotalCost() | number: "1.2-2" }}</strong>
      } @else {
      Escenario activo: <strong>{{ activeScenario()?.name ?? "—" }}</strong> (Solo lectura)
      }
    </span>
  </div>`;

const newTableStr = `  <div class="card p-0 mt-4">
    <app-table [value]="tableRows()" [loading]="loading()" [paginator]="false" styleClass="p-datatable-sm" [showCurrentPageReport]="false">
      <ng-template #header>
        <tr>
          <th class="text-start">CLAVE</th>
          <th class="text-start">NOMBRE</th>
          <th class="text-start">PUESTO</th>
          <th class="text-center" title="Horas Semanales">HRS / SEM</th>
          <th class="text-start">FECHA INICIAL</th>
          <th class="text-end">AÑOS</th>
          <th class="text-end">DÍAS CORRESP.</th>
          <th class="text-end">SALARIO</th>
          <th class="text-end fw-bold">SUELDO</th>
          <th class="text-end opacity-75 fw-normal text-sm">PRIMA VACAC.</th>
          <th class="text-end opacity-75 fw-normal text-sm">DÍAS FESTIVOS</th>
          <th class="text-end opacity-75 fw-normal text-sm">PRIMA DOM.</th>
          <th class="text-end opacity-75 fw-normal text-sm">AGUINALDO</th>
          <th class="text-end fw-bold">TOTAL</th>
          <th class="text-end opacity-75 fw-normal text-sm" title="Retiro, Cesantía y Vejez">RETIRO, CESANTÍA Y VEJEZ</th>
          <th class="text-end opacity-75 fw-normal text-sm">INFONAVIT</th>
          <th class="text-end opacity-75 fw-normal text-sm">CUOTA IMSS</th>
          <th class="text-end opacity-75 fw-normal text-sm" title="Impuesto Sobre Nómina">IMPUESTO SOBRE NÓMINA</th>
          <th class="text-end fw-bold">CARGA LABORAL</th>
        </tr>
      </ng-template>

      <ng-template #body let-item>
        <tr (click)="isEditable() && openEditor(item)" class="cursor-pointer hover:bg-body-tertiary transition-colors">
          <td>{{ item.numberEmployee ?? '' }}</td>
          <td>
            <div class="text-primary hover:text-primary-emphasis transition-colors d-inline-block" (click)="openEmployeeDetails(item); $event.stopPropagation()">
              {{ item.employeeName || "VACANTE" }}
            </div>
          </td>
          <td class="fw-semibold">{{ item.positionTitle }}</td>
          <td class="text-center">
            @if (item.workPositionId; as wpId) {
            <lx-tag
              [value]="(item.weeklyHours || '-') + ' hrs'"
              icon="material-symbols-light:calendar-month"
              severity="secondary"
              class="cursor-pointer hover:bg-body-secondary transition-colors transition-duration-150 rounded"
              lxTooltip="Ver detalles del horario"
              (click)="openScheduleDetails(wpId, item.positionTitle); $event.stopPropagation()"
            />
            } @else {
            <span class="text-body-secondary">{{ item.weeklyHours || "-" }}</span>
            }
          </td>
          <td>{{ item.dateAdmission ? (item.dateAdmission | date:'dd/MM/yyyy') : '' }}</td>
          <td class="text-end">{{ simulationOf(item.id)?.seniorityYears ?? 0 }}</td>
          <td class="text-end">{{ simulationOf(item.id)?.vacationDays ?? 0 }}</td>
          <td class="text-end">{{ simulationOf(item.id)?.dailySalary ?? 0 | number: "1.2-2" }}</td>
          <td class="text-end fw-semibold">{{ item.netMonthlySalary ?? 0 | number: "1.2-2" }}</td>
          <td class="text-end text-sm">{{ simulationOf(item.id)?.vacationPremium ?? 0 | number: "1.2-2" }}</td>
          <td class="text-end text-sm">{{ simulationOf(item.id)?.holidayPremium ?? 0 | number: "1.2-2" }}</td>
          <td class="text-end text-sm">{{ simulationOf(item.id)?.sundayPremium ?? 0 | number: "1.2-2" }}</td>
          <td class="text-end text-sm">{{ simulationOf(item.id)?.christmasBonus ?? 0 | number: "1.2-2" }}</td>
          <td class="text-end fw-semibold text-primary">{{ simulationOf(item.id)?.monthlyPerceptions ?? 0 | number: "1.2-2" }}</td>
          <td class="text-end text-sm">{{ item.rcvEmployerFee ?? 0 | number: "1.2-2" }}</td>
          <td class="text-end text-sm">{{ item.infonavitEmployerFee ?? 0 | number: "1.2-2" }}</td>
          <td class="text-end text-sm">{{ item.imssEmployerFee ?? 0 | number: "1.2-2" }}</td>
          <td class="text-end text-sm">{{ simulationOf(item.id)?.employerPayrollTax ?? 0 | number: "1.2-2" }}</td>
          <td class="text-end fw-bold text-success">
            <div class="d-flex align-items-center justify-content-end gap-2">
              {{ simulationOf(item.id)?.totalEmployerCost ?? 0 | number: "1.2-2" }}
              @if (isEditable()) {
                <il-button iconClass="material-symbols-light:edit" severity="secondary" variant="text" size="small" (clicked)="openEditor(item); $event.stopPropagation()" />
                <il-button iconClass="material-symbols-light:delete" severity="danger" variant="text" size="small" (clicked)="removeItem(item.id); $event.stopPropagation()" />
              }
            </div>
          </td>
        </tr>
      </ng-template>

      <ng-template #footer>
        @if (activeScenarioId(); as sid) {
        <tr>
          <td colspan="5" class="text-end fw-bold">TOTALES</td>
          <td class="text-end"></td>
          <td class="text-end"></td>
          <td class="text-end"></td>
          <td class="text-end fw-bold">{{ scenarioTotals()[sid]?.netMonthlySalary | number: "1.2-2" }}</td>
          <td class="text-end fw-bold text-sm">{{ scenarioTotals()[sid]?.vacationPremium | number: "1.2-2" }}</td>
          <td class="text-end fw-bold text-sm">{{ scenarioTotals()[sid]?.holidayPremium | number: "1.2-2" }}</td>
          <td class="text-end fw-bold text-sm">{{ scenarioTotals()[sid]?.sundayPremium | number: "1.2-2" }}</td>
          <td class="text-end fw-bold text-sm">{{ scenarioTotals()[sid]?.christmasBonus | number: "1.2-2" }}</td>
          <td class="text-end fw-bold text-primary">{{ scenarioTotals()[sid]?.monthlyPerceptions | number: "1.2-2" }}</td>
          <td class="text-end fw-bold text-sm">{{ scenarioTotals()[sid]?.rcvEmployerFee | number: "1.2-2" }}</td>
          <td class="text-end fw-bold text-sm">{{ scenarioTotals()[sid]?.infonavitEmployerFee | number: "1.2-2" }}</td>
          <td class="text-end fw-bold text-sm">{{ scenarioTotals()[sid]?.imssEmployerFee | number: "1.2-2" }}</td>
          <td class="text-end fw-bold text-sm">{{ scenarioTotals()[sid]?.employerPayrollTax | number: "1.2-2" }}</td>
          <td class="text-end fw-bold text-success">{{ scenarioTotals()[sid]?.totalEmployerCost | number: "1.2-2" }}</td>
        </tr>
        }
      </ng-template>

      <ng-template #emptymessage>
        <app-table-empty-message [colspan]="19" />
      </ng-template>
    </app-table>
  </div>`;

content = content.replace(/  <div class="d-flex flex-wrap align-items-center gap-2">[\s\S]*?<\/div>\n<\/div>/, headerStr + '\n' + newTableStr + '\n</div>');
fs.writeFileSync(file, content);
