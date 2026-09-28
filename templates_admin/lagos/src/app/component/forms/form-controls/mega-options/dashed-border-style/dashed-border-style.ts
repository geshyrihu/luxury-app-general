import { Component } from '@angular/core';

import * as data from '../../../../../shared/data/data/forms/forms-controls';

@Component({
  selector: 'app-dashed-border-style',
  templateUrl: './dashed-border-style.html',
  styleUrls: ['./dashed-border-style.scss'],
  imports: [],
})
export class DashedBorderStyle {
  public dashedBorderStyle = data.dashedBorderStyle;
}
