import { Component } from '@angular/core';

import * as Data from '../../../../shared/data/data/buttons/buttons';

@Component({
  selector: 'app-check-box-button-group',
  templateUrl: './check-box-button-group.html',
  styleUrls: ['./check-box-button-group.scss'],
  imports: [],
})
export class CheckBoxButtonGroup {
  public buttonData = Data.checkBoxData;
}
