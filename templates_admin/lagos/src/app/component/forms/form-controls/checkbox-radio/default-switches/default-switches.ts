import { Component } from '@angular/core';

import { defaultSwitch } from '../../../../../shared/data/data/forms/chechbox-radio';

@Component({
  selector: 'app-default-switches',
  templateUrl: './default-switches.html',
  styleUrls: ['./default-switches.scss'],
  imports: [],
})
export class DefaultSwitches {
  public defaultSwitch = defaultSwitch;
}
