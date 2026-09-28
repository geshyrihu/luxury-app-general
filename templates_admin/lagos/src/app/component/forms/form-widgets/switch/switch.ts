import { Component } from '@angular/core';

import { CommonSwitch } from './common-switch/common-switch';
import { CustomSwitch } from './custom-switch/custom-switch';
import { DisabledOutlineSwitch } from './disabled-outline-switch/disabled-outline-switch';
import { SwitchSizing } from './switch-sizing/switch-sizing';
import { SwitchWithIcons } from './switch-with-icons/switch-with-icons';
import { VariationOfSwitches } from './variation-of-switches/variation-of-switches';
import * as data from '../../../../shared/data/data/forms/form-widgets';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.html',
  styleUrls: ['./switch.scss'],
  imports: [
    CustomSwitch,
    CommonSwitch,
    DisabledOutlineSwitch,
    SwitchSizing,
    SwitchWithIcons,
    VariationOfSwitches,
  ],
})
export class Switch {
  public IconSwitchButton = data.iconSwitchButton;
  public uncheckedSwitchButton = data.uncheckedSwitch;
  public borderedIconButton = data.borderWithIcon;
}
