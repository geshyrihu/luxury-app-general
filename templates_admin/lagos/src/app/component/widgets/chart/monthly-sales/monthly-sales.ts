import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import * as data from '../../../../shared/data/chart/widgets/apex-chart';

@Component({
  selector: 'app-monthly-sales',
  templateUrl: './monthly-sales.html',
  styleUrls: ['./monthly-sales.scss'],
  imports: [NgApexchartsModule],
})
export class MonthlySales {
  public monthySales = data.monthySales;
}
