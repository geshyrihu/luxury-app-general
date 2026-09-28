import { Component } from '@angular/core';

import * as Data from '../../../../shared/data/data/buttons/buttons';

@Component({
  selector: 'app-radio-button-group',
  templateUrl: './radio-button-group.html',
  styleUrls: ['./radio-button-group.scss'],
  imports: [],
})
export class RadioButtonGroup {
  public buttonData = Data.buttonData;
}
