import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import * as data from '../.././../../../shared/data/data/forms/chechbox-radio';

@Component({
  selector: 'app-default-checkbox',
  templateUrl: './default-checkbox.html',
  styleUrls: ['./default-checkbox.scss'],
  imports: [FormsModule],
})
export class DefaultCheckbox {
  public defaultCheckbox = data.defaultCheckbox;
}
