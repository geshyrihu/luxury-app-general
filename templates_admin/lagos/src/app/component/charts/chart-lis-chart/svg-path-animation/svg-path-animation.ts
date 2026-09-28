import { Component } from '@angular/core';

import { ChartistModule } from 'ng-chartist';

import { chart2 } from '../../../../shared/data/chart/charts/chartlist';

@Component({
  selector: 'app-svg-path-animation',
  templateUrl: './svg-path-animation.html',
  styleUrls: ['./svg-path-animation.scss'],
  imports: [ChartistModule],
})
export class SVGPathAnimation {
  public chart2 = chart2;
}
