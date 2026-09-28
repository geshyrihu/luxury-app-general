import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgApexchartsModule } from 'ng-apexcharts';

import { productRevenue } from '../../../../shared/data/data/dashboard/dashboard';

@Component({
  selector: 'app-product-revenue',
  templateUrl: './product-revenue.html',
  styleUrl: './product-revenue.scss',
  imports: [NgApexchartsModule, RouterModule],
})
export class ProductRevenue {
  public productRevenue = productRevenue;

  public isShow: boolean = false;

  outSide() {
    this.isShow = false;
  }
}
