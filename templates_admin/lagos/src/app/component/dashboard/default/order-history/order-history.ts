import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { orderHistory } from '../../../../shared/data/data/dashboard/dashboard';
import { ClickOutsideDirective } from '../../../../shared/directive/click-outside.directive';

@Component({
  selector: 'app-order-history',
  imports: [ClickOutsideDirective, RouterModule],
  templateUrl: './order-history.html',
  styleUrl: './order-history.scss',
})
export class OrderHistory {
  public isShow: boolean = false;
  public orderHistory = orderHistory;

  outSide() {
    this.isShow = false;
  }
}
