import { Component } from '@angular/core';

import * as Data from '../../../../shared/data/data/buttons/buttons';

@Component({
  selector: 'app-comman-default-button-group',
  templateUrl: './comman-default-button-group.html',
  styleUrls: ['./comman-default-button-group.scss'],
  imports: [],
})
export class CommanDefaultButtonGroup {
  public commonDefaultButtonGroupData = Data.commonDefaultButtonGroupData;
}
