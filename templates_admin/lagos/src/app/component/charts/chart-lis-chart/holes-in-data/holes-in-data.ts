import { Component } from '@angular/core';

import { ChartistModule } from 'ng-chartist';

import { chart11 } from '../../../../shared/data/chart/charts/chartlist';

@Component({
  selector: 'app-holes-in-data',
  templateUrl: './holes-in-data.html',
  styleUrls: ['./holes-in-data.scss'],
  imports: [ChartistModule],
})
export class HolesInData {
  public chart11 = chart11;
}
