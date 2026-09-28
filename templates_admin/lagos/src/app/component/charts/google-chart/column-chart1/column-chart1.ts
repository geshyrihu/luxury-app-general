import { Component } from '@angular/core';

import { Ng2GoogleChartsModule } from 'ng2-google-charts';

import { columnChart1 } from '../../../../shared/data/chart/charts/google-chart';

@Component({
  selector: 'app-column-chart1',
  templateUrl: './column-chart1.html',
  styleUrls: ['./column-chart1.scss'],
  imports: [Ng2GoogleChartsModule],
})
export class ColumnChart1 {
  public columnChart1 = columnChart1;
}
