import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import * as data from '../../../../shared/data/chart/widgets/apex-chart';

@Component({
  selector: 'app-monthly-history',
  templateUrl: './monthly-history.html',
  styleUrls: ['./monthly-history.scss'],
  imports: [NgApexchartsModule],
})
export class MonthlyHistory {
  public chartWidget4 = data.chartWidget4;
}
