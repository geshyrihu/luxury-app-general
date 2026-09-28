import { Component } from '@angular/core';

import { Ng2GoogleChartsModule } from 'ng2-google-charts';

import { pieChart3 } from '../../../../shared/data/chart/charts/google-chart';

@Component({
  selector: 'app-pie-chart3',
  templateUrl: './pie-chart3.html',
  styleUrls: ['./pie-chart3.scss'],
  imports: [Ng2GoogleChartsModule],
})
export class PieChart3 {
  public pieChart3 = pieChart3;
}
