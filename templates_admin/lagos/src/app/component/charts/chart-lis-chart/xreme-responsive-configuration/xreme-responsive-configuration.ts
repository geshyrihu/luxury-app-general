import { Component } from '@angular/core';

import { ChartistModule } from 'ng-chartist';

import { chart9 } from '../../../../shared/data/chart/charts/chartlist';

@Component({
  selector: 'app-xreme-responsive-configuration',
  templateUrl: './xreme-responsive-configuration.html',
  styleUrls: ['./xreme-responsive-configuration.scss'],
  imports: [ChartistModule],
})
export class XremeResponsiveConfiguration {
  public chart9 = chart9;
}
