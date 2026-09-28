import { Component } from '@angular/core';

import * as data from '../../../../../shared/data/data/forms/form-widgets';

@Component({
  selector: 'app-disabled-outline-switch',
  templateUrl: './disabled-outline-switch.html',
  styleUrls: ['./disabled-outline-switch.scss'],
  imports: [],
})
export class DisabledOutlineSwitch {
  public defaultSwitch = data.defaultSwitch;
}
