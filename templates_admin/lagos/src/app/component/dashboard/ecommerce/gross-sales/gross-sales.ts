import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgApexchartsModule } from 'ng-apexcharts';

import { grossSales } from '../../../../shared/data/data/dashboard/ecommerce';
import { ClickOutsideDirective } from '../../../../shared/directive/click-outside.directive';

@Component({
  selector: 'app-gross-sales',
  templateUrl: './gross-sales.html',
  styleUrl: './gross-sales.scss',
  imports: [NgApexchartsModule, ClickOutsideDirective, RouterModule],
})
export class GrossSales {
  public grossSales = grossSales;

  public isShow: boolean = false;

  outSide() {
    this.isShow = false;
  }
}
