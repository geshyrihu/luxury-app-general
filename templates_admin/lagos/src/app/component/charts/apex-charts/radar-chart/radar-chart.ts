import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { radarChart } from '../../../../shared/data/chart/charts/apex-chart';

@Component({
  selector: 'app-radar-chart',
  templateUrl: './radar-chart.html',
  styleUrls: ['./radar-chart.scss'],
  imports: [NgApexchartsModule],
})
export class RadarChart {
  public radarChart = radarChart;
}
