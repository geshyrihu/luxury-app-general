import { Component } from '@angular/core';

import { ChartistModule } from 'ng-chartist';

import { chart1 } from '../../../../shared/data/chart/charts/chartlist';

@Component({
  selector: 'app-advanced-smil-animations',
  templateUrl: './advanced-smil-animations.html',
  styleUrls: ['./advanced-smil-animations.scss'],
  imports: [ChartistModule],
})
export class AdvancedSMILAnimations {
  public chart1 = chart1;
}
