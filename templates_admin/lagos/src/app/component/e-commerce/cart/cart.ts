import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FeatherIcons } from '../../../shared/components/feather-icons/feather-icons';
import * as data from '../../../shared/data/data/ecommerce/ecommerce';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss'],
  imports: [RouterModule, FeatherIcons],
})
export class Cart {
  public cartItem = data.cartItem;

  public increment(item: number) {
    this.cartItem[item].counter += 1;
  }

  public decrement(item: number) {
    if (this.cartItem[item].counter > 1) {
      this.cartItem[item].counter -= 1;
    }
  }
}
