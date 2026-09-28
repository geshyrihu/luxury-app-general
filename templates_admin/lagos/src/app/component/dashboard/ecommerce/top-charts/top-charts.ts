import { Component, input } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { CommonSvgIcon } from '../../../../shared/components/common-svg-icon/common-svg-icon';
import { TopChartItem } from '../../../../shared/interface/widgets/chart';

@Component({
  selector: 'app-top-charts',
  templateUrl: './top-charts.html',
  styleUrl: './top-charts.scss',
  imports: [NgApexchartsModule, CommonSvgIcon],
})
export class TopCharts {
  readonly data = input<TopChartItem>();
}
