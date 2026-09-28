import { Component } from '@angular/core';

import { BaseChartDirective } from 'ng2-charts';

import * as data from '../../../../shared/data/chart/charts/chartjs';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.html',
  styleUrls: ['./doughnut-chart.scss'],
  imports: [BaseChartDirective],
})
export class DoughnutChart {
  public doughnutChartLabels = data.doughnutChartLabels;
  public doughnutChartData = data.doughnutChartData;
  public doughnutChartType = data.doughnutChartType;
  public doughnutChartColors = data.doughnutChartColors;
  public doughnutChartOptions = data.doughnutChartOptions;
  public doughnutChartLegend = data.doughnutChartLegend;
}
