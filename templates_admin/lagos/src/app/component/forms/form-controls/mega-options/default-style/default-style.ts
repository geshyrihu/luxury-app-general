import { Component } from '@angular/core';

import * as data from '../../../../../shared/data/data/forms/forms-controls';

@Component({
  selector: 'app-default-style',
  templateUrl: './default-style.html',
  styleUrls: ['./default-style.scss'],
  imports: [],
})
export class DefaultStyle {
  public defaultStyle = data.defaultStyle;
}
