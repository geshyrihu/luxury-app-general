import { Component } from '@angular/core';

import { Ng2GoogleChartsModule } from 'ng2-google-charts';

import { pieChart1 } from '../../../../shared/data/chart/charts/google-chart';

@Component({
  selector: 'app-pie-chart1',
  templateUrl: './pie-chart1.html',
  styleUrls: ['./pie-chart1.scss'],
  imports: [Ng2GoogleChartsModule],
})
export class PieChart1 {
  public pieChart1 = pieChart1;
}
