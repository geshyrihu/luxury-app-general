import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { monthlyOverview } from '../../../../shared/data/chart/general/apex-chart';
import { ClickOutsideDirective } from '../../../../shared/directive/click-outside.directive';

@Component({
  selector: 'app-overview-monthly',
  templateUrl: './overview-monthly.html',
  styleUrl: './overview-monthly.scss',
  imports: [ClickOutsideDirective, NgApexchartsModule],
})
export class OverviewMonthly {
  public isShow: boolean = false;
  public monthlyOverview = monthlyOverview;

  outSide() {
    this.isShow = false;
  }
}
