import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { radialBarChart } from '../../../../shared/data/chart/charts/apex-chart';

@Component({
  selector: 'app-radial-bar-chart',
  templateUrl: './radial-bar-chart.html',
  styleUrls: ['./radial-bar-chart.scss'],
  imports: [NgApexchartsModule],
})
export class RadialBarChart {
  public radialBarChart = radialBarChart;
}
