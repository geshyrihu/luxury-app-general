const fs = require('fs');
const file = 'D:/repos/luxuryapp-api/appsweb/angular/src/app/modules/human-resources.luxuryapp/salary-projections/salary-projections-detail/salary-projections-detail.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/readonly selectedScenarioIds = signal<string\[\]>\(\[\]\);\n/g, '');
content = content.replace(/interface ComparisonCell \{[\s\S]*?\}\n\ninterface ComparisonRow \{[\s\S]*?\}\n\n/g, '');
content = content.replace(/readonly comparedScenarios = computed\(\(\) => \{[\s\S]*?\}\);\n\n/g, '');
content = content.replace(/readonly comparisonRows = computed<ComparisonRow\[\]>\(\(\) => \{[\s\S]*?\}\);\n\n/g, '');
content = content.replace(/readonly comparisonScenarioTotals = computed\(\(\) =>[\s\S]*?\}\)\),\n  \);\n\n/g, '');
content = content.replace(/readonly comparisonMaxTotal = computed\(\(\) =>[\s\S]*?1,\n    \),\n  \);\n\n/g, '');
content = content.replace(/  toggleScenarioComparison\(scenarioId: string\): void \{[\s\S]*?\}\n\n/g, '');
content = content.replace(/  isScenarioSelected\(scenarioId: string\): boolean \{[\s\S]*?\}\n\n/g, '');
content = content.replace(/  comparisonBarWidth\(total: number\): string \{[\s\S]*?\}\n\n/g, '');
content = content.replace(/  scenarioItemCount\(scenario: ISalaryProjectionScenario\): number \{[\s\S]*?\}\n\n/g, '');
content = content.replace(/  selectScenario\(scenarioId: string\): void \{\n    this\.activeScenarioId\.set\(scenarioId\);\n    if \(\n      !this\.selectedScenarioIds\(\)\.includes\(scenarioId\) &&\n      this\.selectedScenarioIds\(\)\.length < 3\n    \) \{\n      this\.selectedScenarioIds\.update\(\(ids\) => \[\.\.\.ids, scenarioId\]\);\n    \}\n  \}/g, '  selectScenario(scenarioId: string): void {\n    this.activeScenarioId.set(scenarioId);\n  }');
content = content.replace(/  openEmployeeDetails\(row: ComparisonRow\): void \{\n    const item = row\.comparisons\[0\]\?\.item;\n    if \(item\?\.applicationUserId\) \{/g, '  openEmployeeDetails(item: ISalaryProjectionItem): void {\n    if (item?.applicationUserId) {');
content = content.replace(/        const availableIds = data\.scenarios[\s\S]*?this\.selectedScenarioIds\.set\(availableIds\);\n        \}/g, '');

const tableRowsCode = "  readonly tableRows = computed<ISalaryProjectionItem[]>(() => {\\n    return this.activeItems().sort((a, b) => {\\n      const depA = a.departament ?? 999;\\n      const depB = b.departament ?? 999;\\n      if (depA !== depB) {\\n        return depA - depB;\\n      }\\n      const orderA = a.sortOrder ?? 999;\\n      const orderB = b.sortOrder ?? 999;\\n      return orderA - orderB;\\n    });\\n  });";

content = content.replace(/readonly activeTotalCost = computed/g, tableRowsCode + '\n  readonly activeTotalCost = computed');

fs.writeFileSync(file, content);
