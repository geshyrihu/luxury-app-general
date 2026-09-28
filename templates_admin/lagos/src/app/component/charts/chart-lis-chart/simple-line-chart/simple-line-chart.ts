import { Component } from '@angular/core';

import { ChartistModule } from 'ng-chartist';

import { chart10 } from '../../../../shared/data/chart/charts/chartlist';

@Component({
  selector: 'app-simple-line-chart',
  templateUrl: './simple-line-chart.html',
  styleUrls: ['./simple-line-chart.scss'],
  imports: [ChartistModule],
})
export class SimpleLineChart {
  public chart10 = chart10;
}
