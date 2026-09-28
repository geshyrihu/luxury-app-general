import { Component } from '@angular/core';

import * as data from '../../../../../shared/data/data/forms/form-widgets';

@Component({
  selector: 'app-switch-with-icons',
  templateUrl: './switch-with-icons.html',
  styleUrls: ['./switch-with-icons.scss'],
  imports: [],
})
export class SwitchWithIcons {
  public switchIcanSizingData = data.switchIcanSizingData;
}
