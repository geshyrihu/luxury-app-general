import { Component, input } from '@angular/core';

import { CommonSvgIcon } from '../../../../shared/components/common-svg-icon/common-svg-icon';
import { addProduct } from '../../../../shared/data/data/ecommerce/add-product';

@Component({
  selector: 'app-add-product-tab',
  templateUrl: './add-product-tab.html',
  styleUrls: ['./add-product-tab.scss'],
  imports: [CommonSvgIcon],
})
export class AddProductTab {
  readonly data = input<addProduct[]>();
  readonly activeSteps = input.required<number>();
}
