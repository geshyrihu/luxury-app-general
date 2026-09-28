import { Component } from '@angular/core';

import * as data from '../../../../../shared/data/data/forms/form-widgets';

@Component({
  selector: 'app-switch-sizing',
  templateUrl: './switch-sizing.html',
  styleUrls: ['./switch-sizing.scss'],
  imports: [],
})
export class SwitchSizing {
  public switchSizingData = data.switchSizing;
}
