import { Component, inject } from '@angular/core';

import { NgbModule, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

import * as data from '../../../../../shared/data/data/forms/forms-controls';

@Component({
  selector: 'app-horizontal-style',
  templateUrl: './horizontal-style.html',
  styleUrls: ['./horizontal-style.scss'],
  imports: [NgbModule],
})
export class HorizontalStyle {
  public deliveryOption = data.deliveryOption;
  public buyingOption = data.buyingOption;
  public config = inject(NgbRatingConfig);

  constructor() {
    this.config.max = 5;
    this.config.readonly = true;
  }
}
