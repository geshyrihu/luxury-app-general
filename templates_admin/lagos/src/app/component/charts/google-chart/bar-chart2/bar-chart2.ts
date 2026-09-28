import { Component } from '@angular/core';

import { Ng2GoogleChartsModule } from 'ng2-google-charts';

import { barChart } from '../../../../shared/data/chart/charts/google-chart';

@Component({
  selector: 'app-bar-chart2',
  templateUrl: './bar-chart2.html',
  styleUrls: ['./bar-chart2.scss'],
  imports: [Ng2GoogleChartsModule],
})
export class BarChart2 {
  public barChart = barChart;
}
