import { Component } from '@angular/core';

import * as data from '../.././../../../shared/data/data/forms/form-widgets';

@Component({
  selector: 'app-common-touchspin',
  templateUrl: './common-touchspin.html',
  styleUrls: ['./common-touchspin.scss'],
  imports: [],
})
export class CommonTouchspin {
  public touchspinData = data.touchspin;

  decrement(i: number, n: number) {
    if (this.touchspinData[i].data[n].value > 0) {
      this.touchspinData[i].data[n].value -= 1;
    }
  }

  increment(i: number, n: number) {
    this.touchspinData[i].data[n].value += 1;
  }
}
