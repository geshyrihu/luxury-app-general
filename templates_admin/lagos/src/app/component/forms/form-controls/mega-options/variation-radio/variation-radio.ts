import { Component } from '@angular/core';

import * as data from '../../../../../shared/data/data/forms/forms-controls';

@Component({
  selector: 'app-variation-radio',
  templateUrl: './variation-radio.html',
  styleUrls: ['./variation-radio.scss'],
  imports: [],
})
export class VariationRadio {
  public variationRadioPayment = data.variationRadioPaymentData;
  public variationRadioDesign = data.variationRadioDesign;
  public variationRadioIcon = data.variationRadioIcon;
}
