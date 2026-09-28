import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import * as Data from '../../../../../shared/data/data/forms/forms-controls';

@Component({
  selector: 'app-custom-checkbox',
  templateUrl: './custom-checkbox.html',
  styleUrls: ['./custom-checkbox.scss'],
  imports: [FormsModule],
})
export class CustomCheckbox {
  public borderedCheckBox = Data.borderedCheckBox;
  public iconCheckBox = Data.iconCheckBox;
  public filledCheckBox = Data.filledCheckBox;
}
