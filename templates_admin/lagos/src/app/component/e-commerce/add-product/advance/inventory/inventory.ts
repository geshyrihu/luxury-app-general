import { Component, input, output } from '@angular/core';

import { CommonSvgIcon } from '../../../../../shared/components/common-svg-icon/common-svg-icon';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.html',
  styleUrls: ['./inventory.scss'],
  imports: [CommonSvgIcon],
})
export class Inventory {
  readonly activeSteps = output<number>();
  readonly activeStep = input<number>();

  previous() {
    const number = this.activeStep()! - 1;
    this.activeSteps.emit(number);
  }
}
