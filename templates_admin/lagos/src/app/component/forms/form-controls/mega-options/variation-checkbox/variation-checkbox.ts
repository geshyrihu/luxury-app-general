import { Component } from '@angular/core';

import * as data from '../../../../../shared/data/data/forms/forms-controls';

@Component({
  selector: 'app-variation-checkbox',
  templateUrl: './variation-checkbox.html',
  styleUrls: ['./variation-checkbox.scss'],
  imports: [],
})
export class VariationCheckbox {
  public variationCheckbox = data.variationCheckbox;
  public themeSale = data.themeSale;
}
