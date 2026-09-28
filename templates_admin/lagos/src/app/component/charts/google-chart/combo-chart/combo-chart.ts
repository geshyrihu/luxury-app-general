import { Component } from '@angular/core';

import { Ng2GoogleChartsModule } from 'ng2-google-charts';

import { comboChart } from '../../../../shared/data/chart/charts/google-chart';

@Component({
  selector: 'app-combo-chart',
  templateUrl: './combo-chart.html',
  styleUrls: ['./combo-chart.scss'],
  imports: [Ng2GoogleChartsModule],
})
export class ComboChart {
  public comboChart = comboChart;
}
