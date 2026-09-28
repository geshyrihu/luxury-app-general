import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import * as data from '../../../../../shared/data/data/forms/chechbox-radio';

@Component({
  selector: 'app-custom-radio',
  templateUrl: './custom-radio.html',
  styleUrls: ['./custom-radio.scss'],
  imports: [FormsModule],
})
export class CustomRadio {
  public BorderedRadio = data.BorderedRadio;
  public IconsRadio = data.IconsRadio;
  public FilledRadio = data.FilledRadio;
}
