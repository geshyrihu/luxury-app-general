import { Component, input } from '@angular/core';

import * as data from '../../../../../shared/data/data/forms/form-widgets';

@Component({
  selector: 'app-common-switch',
  templateUrl: './common-switch.html',
  styleUrls: ['./common-switch.scss'],
  imports: [],
})
export class CommonSwitch {
  readonly data = input<data.commonSwitch[]>();
}
