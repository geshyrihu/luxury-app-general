import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { BarRatingModule } from 'ngx-bar-rating';

import { trendingProduct } from '../../../../shared/data/data/dashboard/ecommerce';

@Component({
  selector: 'app-trending-product',
  templateUrl: './trending-product.html',
  styleUrl: './trending-product.scss',
  imports: [BarRatingModule, FormsModule, RouterModule],
})
export class TrendingProduct {
  public isShow: boolean = false;
  public trendingProduct = trendingProduct;

  outSide() {
    this.isShow = false;
  }
}
