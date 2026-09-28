import { Component } from '@angular/core';

import { ChartistModule } from 'ng-chartist';

import { chart6 } from '../../../../shared/data/chart/charts/chartlist';

@Component({
  selector: 'app-bi-polar-bar-chart',
  templateUrl: './bi-polar-bar-chart.html',
  styleUrls: ['./bi-polar-bar-chart.scss'],
  imports: [ChartistModule],
})
export class BiPolarBarChart {
  public chart6 = chart6;
}
