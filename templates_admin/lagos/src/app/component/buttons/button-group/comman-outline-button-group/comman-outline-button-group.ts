import { Component } from '@angular/core';

import * as Data from '../../../../shared/data/data/buttons/buttons';

@Component({
  selector: 'app-comman-outline-button-group',
  templateUrl: './comman-outline-button-group.html',
  styleUrls: ['./comman-outline-button-group.scss'],
  imports: [],
})
export class CommanOutlineButtonGroup {
  public commonOutlinedButtonGroupData = Data.commonOutlinedButtonGroupData;
}
