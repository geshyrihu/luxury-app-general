import { Component } from '@angular/core';

import * as Data from '../../../../shared/data/data/buttons/buttons';

@Component({
  selector: 'app-common-large-button-group',
  templateUrl: './common-large-button-group.html',
  styleUrls: ['./common-large-button-group.scss'],
  imports: [],
})
export class CommonLargeButtonGroup {
  public commonLargeButtonGroupData = Data.commonLargeButtonGroupData;
}
