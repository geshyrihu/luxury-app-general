const fs = require('fs');
const f = 'D:/repos/luxuryapp-api/appsweb/angular/src/app/modules/human-resources.luxuryapp/salary-projections/salary-projections-detail/salary-projections-detail.ts';
let str = fs.readFileSync(f, 'utf8');

// 1. DatePipe
str = str.replace('import { DecimalPipe } from "@angular/common";', 'import { DatePipe, DecimalPipe } from "@angular/common";');
str = str.replace('DecimalPipe,', 'DatePipe,\n    DecimalPipe,');

// 2. ISalaryProjectionScenario
str = str.replace('  ISalaryProjectionItemSimulation,\n  ISalaryProjectionScenario,\n  salaryProjectionStateSeverity,', '  ISalaryProjectionItemSimulation,\n  salaryProjectionStateSeverity,');

// 3. Mojibake
str = str.replace('/** ?? Cola de simulacion con debounce para no saturar el backend. */', '/** ?? Cola de simulación con debounce para no saturar el backend. */');
str = str.replace('/** Control del panel lateral para edicion rapida. */', '/** Control del panel lateral para edición rápida. */');
str = str.replace('// Sidepanel de edicion de fila.', '// Sidepanel de edición de fila.');
str = str.replace('2. El escenario activo NO debe ser el escenario base (indice 0).', '2. El escenario activo NO debe ser el escenario base (índice 0).');
str = str.replace('/** ?? Cola de simulacin con debounce para no saturar el backend. */', '/** ?? Cola de simulación con debounce para no saturar el backend. */');
str = str.replace('/** Control del panel lateral para edicin rpida. */', '/** Control del panel lateral para edición rápida. */');
str = str.replace('// Sidepanel de edicin de fila.', '// Sidepanel de edición de fila.');
str = str.replace('2. El escenario activo NO debe ser el escenario base (indice 0).', '2. El escenario activo NO debe ser el escenario base (índice 0).');

// 4. tableRows
str = str.replace('return this.activeItems().sort((a, b) => {', 'return [...this.activeItems()].sort((a, b) => {');

// 5. Unused styles
const stylesToRemove = \      .comparison-bar {
        height: 6px;
        overflow: hidden;
        border-radius: 999px;
        background: var(--ds-bg-muted, #e9ecef);
      }
      .comparison-bar span {
        display: block;
        height: 100%;
        border-radius: inherit;
        background: var(--ds-action-primary, #0d6efd);
        transition: width 180ms ease-out;
      }
      .comparison-cell {
        cursor: pointer;
        transition: background-color 0.2s;
      }
      .comparison-cell:hover {
        background-color: var(--ds-bg-subtle, #f3f4f6);
      }\;
str = str.replace(stylesToRemove, '');

fs.writeFileSync(f, str, 'utf8');
