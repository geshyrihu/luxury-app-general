import { Component } from '@angular/core';

import { BaseChartDirective } from 'ng2-charts';

import * as data from '../../../../shared/data/chart/charts/chartjs';

@Component({
  selector: 'app-polar-chart',
  templateUrl: './polar-chart.html',
  styleUrls: ['./polar-chart.scss'],
  imports: [BaseChartDirective],
})
export class PolarChart {
  // polarChart
  public polarChartLabels = data.polarChartLabels;
  public polarChartData = data.polarChartData;
  public polarChartType = data.polarChartType;
  public polarChartColors = data.polarChartColors;
  public polarChartOptions = data.polarChartOptions;
  public polarChartLegend = data.polarChartLegend;
}
