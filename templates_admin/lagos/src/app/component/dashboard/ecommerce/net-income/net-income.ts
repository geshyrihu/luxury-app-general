import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { netIncome } from '../../../../shared/data/chart/general/apex-chart';
import { ClickOutsideDirective } from '../../../../shared/directive/click-outside.directive';

@Component({
  selector: 'app-net-income',
  templateUrl: './net-income.html',
  styleUrl: './net-income.scss',
  imports: [NgApexchartsModule, ClickOutsideDirective],
})
export class NetIncome {
  public isShow: boolean = false;
  public netIncome = netIncome;
  outSide() {
    this.isShow = false;
  }
}
