import { Component, input } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { ChartWidgetOptions } from '../../../../shared/interface/widgets/chart';

@Component({
  selector: 'app-comman-top-chart',
  templateUrl: './comman-top-chart.html',
  styleUrls: ['./comman-top-chart.scss'],
  imports: [NgApexchartsModule],
})
export class CommanTopChart {
  readonly item = input<ChartWidgetOptions>();
}
