import { Component } from '@angular/core';

import { BarRatingModule } from 'ngx-bar-rating';

import * as data from '../../../shared/data/data/ecommerce/ecommerce';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.html',
  styleUrls: ['./wishlist.scss'],
  imports: [BarRatingModule],
})
export class Wishlist {
  public wishList = data.wishlist;
}
