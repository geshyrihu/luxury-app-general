import { Component, input } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { commonTopData } from '../../../../shared/data/data/dashboard/ecommerce';
import { ClickOutsideDirective } from '../../../../shared/directive/click-outside.directive';
import { GeneralChartOptions } from '../../../../shared/interface/widgets/chart';

@Component({
  selector: 'app-comman-chart',
  templateUrl: './comman-chart.html',
  styleUrls: ['./comman-chart.scss'],
  imports: [ClickOutsideDirective, NgApexchartsModule],
})
export class CommanChart {
  public isShow: boolean = false;
  readonly chatData = input<GeneralChartOptions>();
  readonly item = input<commonTopData[]>();

  clickoutSide(): void {
    this.isShow = false;
  }
}
