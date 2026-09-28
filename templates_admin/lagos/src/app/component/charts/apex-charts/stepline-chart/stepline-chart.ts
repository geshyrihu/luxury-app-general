import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { stepLineChart } from '../../../../shared/data/chart/charts/apex-chart';

@Component({
  selector: 'app-stepline-chart',
  templateUrl: './stepline-chart.html',
  styleUrls: ['./stepline-chart.scss'],
  imports: [NgApexchartsModule],
})
export class SteplineChart {
  public stepLineChart = stepLineChart;
}
