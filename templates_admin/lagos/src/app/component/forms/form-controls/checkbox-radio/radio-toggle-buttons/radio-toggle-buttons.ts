import { Component } from '@angular/core';

import * as data from '../../../../../shared/data/data/forms/chechbox-radio';

@Component({
  selector: 'app-radio-toggle-buttons',
  templateUrl: './radio-toggle-buttons.html',
  styleUrls: ['./radio-toggle-buttons.scss'],
  imports: [],
})
export class RadioToggleButtons {
  public RadioToggleButtons = data.RadioToggleButtons;
}
