import { Component } from '@angular/core';

import { AnimatedButtons } from './animated-buttons/animated-buttons';
import { BasicRadioAndCheckbox } from './basic-radio-and-checkbox/basic-radio-and-checkbox';
import { CustomCheckbox } from './custom-checkbox/custom-checkbox';
import { CustomRadio } from './custom-radio/custom-radio';
import { DefaultCheckbox } from './default-checkbox/default-checkbox';
import { DefaultRadio } from './default-radio/default-radio';
import { DefaultSwitches } from './default-switches/default-switches';
import { ImagesWithCheckbox } from './images-with-checkbox/images-with-checkbox';
import { ImagesWithRadio } from './images-with-radio/images-with-radio';
import { InlineInputTypes } from './inline-input-types/inline-input-types';
import { OutlinedCheckboxStyles } from './outlined-checkbox-styles/outlined-checkbox-styles';
import { RadioToggleButtons } from './radio-toggle-buttons/radio-toggle-buttons';

@Component({
  selector: 'app-checkbox-radio',
  templateUrl: './checkbox-radio.html',
  styleUrls: ['./checkbox-radio.scss'],
  imports: [
    DefaultCheckbox,
    CustomCheckbox,
    DefaultRadio,
    CustomRadio,
    AnimatedButtons,
    BasicRadioAndCheckbox,
    DefaultSwitches,
    ImagesWithCheckbox,
    InlineInputTypes,
    OutlinedCheckboxStyles,
    RadioToggleButtons,
    ImagesWithRadio,
  ],
})
export class CheckboxRadio {}
