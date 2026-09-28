import { Component } from '@angular/core';

import { BasicInputGroups } from './basic-input-groups/basic-input-groups';
import { ButtonAddons } from './button-addons/button-addons';
import { ButtonsWithDropdowns } from './buttons-with-dropdowns/buttons-with-dropdowns';
import { CheckboxesAndRadios } from './checkboxes-and-radios/checkboxes-and-radios';
import { CustomFileInput } from './custom-file-input/custom-file-input';
import { CustomForms } from './custom-forms/custom-forms';
import { MultipleInputs } from './multiple-inputs/multiple-inputs';
import { SegmentedButtons } from './segmented-buttons/segmented-buttons';
import { Sizing } from './sizing/sizing';
import { VariationOfAddons } from './variation-of-addons/variation-of-addons';

@Component({
  selector: 'app-input-groups',
  templateUrl: './input-groups.html',
  styleUrls: ['./input-groups.scss'],
  imports: [
    BasicInputGroups,
    ButtonAddons,
    ButtonsWithDropdowns,
    CheckboxesAndRadios,
    CustomFileInput,
    MultipleInputs,
    SegmentedButtons,
    VariationOfAddons,
    CustomForms,
    Sizing,
  ],
})
export class InputGroups {}
