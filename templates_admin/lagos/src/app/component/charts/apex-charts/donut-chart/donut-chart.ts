import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { dountChart } from '../../../../shared/data/chart/charts/apex-chart';

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.html',
  styleUrls: ['./donut-chart.scss'],
  imports: [NgApexchartsModule],
})
export class DonutChart {
  public donutChart = dountChart;
}
