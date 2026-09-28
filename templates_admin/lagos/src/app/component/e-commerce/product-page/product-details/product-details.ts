import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarRatingModule } from 'ngx-bar-rating';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.scss'],
  imports: [RouterModule, BarRatingModule],
})
export class ProductDetails {
  public rating = 2.6;
}
