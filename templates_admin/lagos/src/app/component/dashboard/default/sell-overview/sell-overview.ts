import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { sellOverview } from '../../../../shared/data/chart/general/apex-chart';
import { ClickOutsideDirective } from '../../../../shared/directive/click-outside.directive';

@Component({
  selector: 'app-sell-overview',
  templateUrl: './sell-overview.html',
  styleUrl: './sell-overview.scss',
  imports: [NgApexchartsModule, ClickOutsideDirective],
})
export class SellOverview {
  public isShow: boolean = false;
  public sellOverview = sellOverview;

  outSide() {
    this.isShow = false;
  }
}
