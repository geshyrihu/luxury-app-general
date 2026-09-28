import { Component } from '@angular/core';

import { ChartistModule } from 'ng-chartist';

import { chart4 } from '../../../../shared/data/chart/charts/chartlist';

@Component({
  selector: 'app-bi-polar-line-chart',
  templateUrl: './bi-polar-line-chart.html',
  styleUrls: ['./bi-polar-line-chart.scss'],
  imports: [ChartistModule],
})
export class BiPolarLineChart {
  public chart4 = chart4;
}
