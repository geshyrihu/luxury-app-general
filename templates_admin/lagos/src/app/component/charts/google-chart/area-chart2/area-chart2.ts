import { Component } from '@angular/core';

import { Ng2GoogleChartsModule } from 'ng2-google-charts';

import { areaChart2 } from '../../../../shared/data/chart/charts/google-chart';

@Component({
  selector: 'app-area-chart2',
  templateUrl: './area-chart2.html',
  styleUrls: ['./area-chart2.scss'],
  imports: [Ng2GoogleChartsModule],
})
export class AreaChart2 {
  public areaChart2 = areaChart2;
}
