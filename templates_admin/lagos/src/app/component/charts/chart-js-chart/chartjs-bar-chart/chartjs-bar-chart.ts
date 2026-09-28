import { Component } from '@angular/core';

import { BaseChartDirective } from 'ng2-charts';

import * as data from '../../../../shared/data/chart/charts/chartjs';

@Component({
  selector: 'app-chartjs-bar-chart',
  templateUrl: './chartjs-bar-chart.html',
  styleUrls: ['./chartjs-bar-chart.scss'],
  imports: [BaseChartDirective],
})
export class ChartjsBarChart {
  public barChart = data.barChart;
}
