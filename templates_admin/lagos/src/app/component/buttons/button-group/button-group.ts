import { Component } from '@angular/core';

import { CheckBoxButtonGroup } from './check-box-button-group/check-box-button-group';
import { CommanDefaultButtonGroup } from './comman-default-button-group/comman-default-button-group';
import { CommanOutlineButtonGroup } from './comman-outline-button-group/comman-outline-button-group';
import { CommonLargeButtonGroup } from './common-large-button-group/common-large-button-group';
import { CommonOutlineCustomButtonGroup } from './common-outline-custom-button-group/common-outline-custom-button-group';
import { Nesting } from './nesting/nesting';
import { RadioButtonGroup } from './radio-button-group/radio-button-group';
import { Vertical } from './vertical/vertical';

@Component({
  selector: 'app-button-group',
  templateUrl: './button-group.html',
  styleUrls: ['./button-group.scss'],
  imports: [
    CheckBoxButtonGroup,
    CommanDefaultButtonGroup,
    CommanOutlineButtonGroup,
    CommonLargeButtonGroup,
    CommonOutlineCustomButtonGroup,
    Nesting,
    Vertical,
    RadioButtonGroup,
  ],
})
export class ButtonGroup {}
