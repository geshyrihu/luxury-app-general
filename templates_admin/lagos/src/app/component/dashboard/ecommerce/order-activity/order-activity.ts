import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { orderActivity } from '../../../../shared/data/chart/general/apex-chart';
import { ClickOutsideDirective } from '../../../../shared/directive/click-outside.directive';

@Component({
  selector: 'app-order-activity',
  templateUrl: './order-activity.html',
  styleUrl: './order-activity.scss',
  imports: [NgApexchartsModule, ClickOutsideDirective],
})
export class OrderActivity {
  public isShow: boolean = false;
  public orderActivity = orderActivity;

  outSide() {
    this.isShow = false;
  }
}
