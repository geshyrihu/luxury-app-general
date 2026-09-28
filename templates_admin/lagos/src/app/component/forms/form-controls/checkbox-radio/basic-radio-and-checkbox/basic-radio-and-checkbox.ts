import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import * as Data from '../../../../../shared/data/data/forms/chechbox-radio';

@Component({
  selector: 'app-basic-radio-and-checkbox',
  templateUrl: './basic-radio-and-checkbox.html',
  styleUrls: ['./basic-radio-and-checkbox.scss'],
  imports: [FormsModule],
})
export class BasicRadioAndCheckbox {
  public basicRadioAndCheckbox = Data.basicRadioAndCheckbox;
}
