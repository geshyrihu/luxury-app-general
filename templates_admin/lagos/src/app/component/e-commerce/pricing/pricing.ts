import { Component } from '@angular/core';

import * as data from '../../../shared/data/data/ecommerce/ecommerce';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.html',
  styleUrls: ['./pricing.scss'],
  imports: [],
})
export class Pricing {
  public simplePricingCard = data.simplePricingCard;
  public pricing = data.pricing;
}
