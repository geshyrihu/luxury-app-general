import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { columnChart } from '../../../../shared/data/chart/charts/apex-chart';

@Component({
  selector: 'app-column-chart',
  templateUrl: './column-chart.html',
  styleUrls: ['./column-chart.scss'],
  imports: [NgApexchartsModule],
})
export class ColumnChart {
  public columnChart = columnChart;
}
