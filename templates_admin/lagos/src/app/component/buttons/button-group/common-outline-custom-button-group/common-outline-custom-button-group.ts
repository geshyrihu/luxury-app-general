import { Component } from '@angular/core';

import * as Data from '../../../../shared/data/data/buttons/buttons';

@Component({
  selector: 'app-common-outline-custom-button-group',
  templateUrl: './common-outline-custom-button-group.html',
  styleUrls: ['./common-outline-custom-button-group.scss'],
  imports: [],
})
export class CommonOutlineCustomButtonGroup {
  public commonCustomOutlinedButtonData = Data.commonCustomOutlinedButtonData;
}
