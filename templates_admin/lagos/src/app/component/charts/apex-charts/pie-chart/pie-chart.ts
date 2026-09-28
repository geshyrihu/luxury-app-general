import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { pieChart } from '../../../../shared/data/chart/charts/apex-chart';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.html',
  styleUrls: ['./pie-chart.scss'],
  imports: [NgApexchartsModule],
})
export class PieChart {
  public pieChart = pieChart;
}
