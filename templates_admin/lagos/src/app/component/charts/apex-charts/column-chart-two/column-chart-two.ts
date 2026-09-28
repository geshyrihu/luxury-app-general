import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { columnChart2 } from '../../../../shared/data/chart/charts/apex-chart';

@Component({
  selector: 'app-column-chart-two',
  templateUrl: './column-chart-two.html',
  styleUrls: ['./column-chart-two.scss'],
  imports: [NgApexchartsModule],
})
export class ColumnChartTwo {
  public columnChart2 = columnChart2;
}
