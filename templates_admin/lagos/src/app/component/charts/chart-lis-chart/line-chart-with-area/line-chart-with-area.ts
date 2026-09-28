import { Component } from '@angular/core';

import { ChartistModule } from 'ng-chartist';

import { chart5 } from '../../../../shared/data/chart/charts/chartlist';

@Component({
  selector: 'app-line-chart-with-area',
  templateUrl: './line-chart-with-area.html',
  styleUrls: ['./line-chart-with-area.scss'],
  imports: [ChartistModule],
})
export class LineChartWithArea {
  public chart5 = chart5;
}
