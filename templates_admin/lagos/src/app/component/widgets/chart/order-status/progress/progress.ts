import { Component, input } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { ProgressChartOptions } from '../../../../../shared/interface/widgets/chart';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.html',
  styleUrls: ['./progress.scss'],
  imports: [NgApexchartsModule],
})
export class Progress {
  readonly data = input<ProgressChartOptions>();
}
