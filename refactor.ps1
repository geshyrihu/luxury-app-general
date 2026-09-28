$files = Get-ChildItem -Path "appsweb\angular\src\app\modules\human-resources.luxuryapp\" -Recurse -Filter "*.ts"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw

    if ($content -match "SalaryProjectionsService") {
        $newContent = $content -replace 'import \{ SalaryProjectionsService \} from "\.\./salary-projections\.service";', "import { ApiResponseService } from `'@core/http/services/api-response.service`';`nimport { Endpoints } from `'@core/constants/endpoints/endpoints`';"
        $newContent = $newContent -replace 'import \{ SalaryProjectionsService \} from "\.\.\/\.\./salary-projections\.service";', "import { ApiResponseService } from `'@core/http/services/api-response.service`';`nimport { Endpoints } from `'@core/constants/endpoints/endpoints`';"

        $newContent = $newContent -replace 'private readonly service = inject\(SalaryProjectionsService\);', 'private readonly api = inject(ApiResponseService);'

        $newContent = $newContent -replace 'this\.service\.getList\(\)', 'this.api.onGetList<ISalaryProjection[]>(Endpoints.SalaryProjections.base)'
        $newContent = $newContent -replace 'this\.service\.getById\((.*?)\)', 'this.api.onGetItem<ISalaryProjection>(Endpoints.SalaryProjections.byId($1))'
        $newContent = $newContent -replace 'this\.service\.create\((.*?)\)', 'this.api.onPost<ISalaryProjection>(Endpoints.SalaryProjections.base, $1)'
        $newContent = $newContent -replace 'this\.service\.update\((.*?), (.*?)\)', 'this.api.onPut<ISalaryProjection>(Endpoints.SalaryProjections.byId($1), $2)'
        $newContent = $newContent -replace 'this\.service\.delete\((.*?)\)', 'this.api.onDelete(Endpoints.SalaryProjections.byId($1))'
        $newContent = $newContent -replace 'this\.service\.simulate\((.*?)\)', 'this.api.onPost<ISalaryProjectionItemSimulation[]>(Endpoints.SalaryProjections.simulate, $1)'

        $newContent = $newContent -replace 'this\.service\.getFederalVacationParameters\(\)', 'this.api.onGetList<IFederalVacationParameter[]>(Endpoints.SalaryProjections.federalVacationParameters)'
        $newContent = $newContent -replace 'this\.service\.createFederalVacationParameter\((.*?)\)', 'this.api.onPost<IFederalVacationParameter>(Endpoints.SalaryProjections.federalVacationParameters, $1)'
        $newContent = $newContent -replace 'this\.service\.updateFederalVacationParameter\((.*?), (.*?), (.*?)\)', 'this.api.onPut<IFederalVacationParameter>(Endpoints.SalaryProjections.federalVacationParameter($1, $2), { vacationDays: $3 })'
        $newContent = $newContent -replace 'this\.service\.deleteFederalVacationParameter\((.*?), (.*?)\)', 'this.api.onDelete(Endpoints.SalaryProjections.federalVacationDelete($1, $2))'

        $newContent = $newContent -replace 'this\.service\.getStateTaxParameters\(\)', 'this.api.onGetList<IStateTaxParameter[]>(Endpoints.SalaryProjections.stateTaxParameters)'
        $newContent = $newContent -replace 'this\.service\.createStateTaxParameter\((.*?)\)', 'this.api.onPost<IStateTaxParameter>(Endpoints.SalaryProjections.stateTaxParameters, $1)'
        $newContent = $newContent -replace 'this\.service\.updateStateTaxParameter\((.*?), (.*?), (.*?)\)', 'this.api.onPut<IStateTaxParameter>(Endpoints.SalaryProjections.stateTaxParameter($1, $2), { employerPayrollTaxPercentage: $3 })'
        $newContent = $newContent -replace 'this\.service\.deleteStateTaxParameter\((.*?), (.*?)\)', 'this.api.onDelete(Endpoints.SalaryProjections.stateTaxDelete($1, $2))'

        $newContent = $newContent -replace 'this\.service\.getFederalLaborLawParameters\(\)', 'this.api.onGetList<IFederalLaborLawParameter[]>(Endpoints.SalaryProjections.federalLaborLawParameters)'
        $newContent = $newContent -replace 'this\.service\.createFederalLaborLawParameter\((.*?)\)', 'this.api.onPost<IFederalLaborLawParameter>(Endpoints.SalaryProjections.federalLaborLawParameters, $1)'
        $newContent = $newContent -replace 'this\.service\.updateFederalLaborLawParameter\((.*?), (.*?)\)', 'this.api.onPut<IFederalLaborLawParameter>(Endpoints.SalaryProjections.federalLaborLawParameter($1), $2)'
        $newContent = $newContent -replace 'this\.service\.deleteFederalLaborLawParameter\((.*?)\)', 'this.api.onDelete(Endpoints.SalaryProjections.federalLaborLawParameter($1))'

        Set-Content -Path $file.FullName -Value $newContent
    }
}
