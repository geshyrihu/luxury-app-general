import { Component } from '@angular/core';

import * as data from '../../../../../shared/data/data/forms/form-widgets';

@Component({
  selector: 'app-custom-switch',
  templateUrl: './custom-switch.html',
  styleUrls: ['./custom-switch.scss'],
  imports: [],
})
export class CustomSwitch {
  public defaultSwitchData = data.defaultSwitch;
}
