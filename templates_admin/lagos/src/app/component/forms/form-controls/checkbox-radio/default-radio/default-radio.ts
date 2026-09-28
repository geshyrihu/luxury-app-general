import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import * as data from '../../../../../shared/data/data/forms/chechbox-radio';

@Component({
  selector: 'app-default-radio',
  templateUrl: './default-radio.html',
  styleUrls: ['./default-radio.scss'],
  imports: [FormsModule],
})
export class DefaultRadio {
  public defaultRedio = data.defaultRedio;
}
