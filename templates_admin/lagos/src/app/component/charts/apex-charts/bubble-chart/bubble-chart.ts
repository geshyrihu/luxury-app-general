import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { bubbleChart } from '../../../../shared/data/chart/charts/apex-chart';

@Component({
  selector: 'app-bubble-chart',
  templateUrl: './bubble-chart.html',
  styleUrls: ['./bubble-chart.scss'],
  imports: [NgApexchartsModule],
})
export class BubbleChart {
  public bubbleChart = bubbleChart;
}
