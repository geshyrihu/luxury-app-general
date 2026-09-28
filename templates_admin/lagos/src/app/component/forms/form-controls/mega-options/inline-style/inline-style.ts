import { Component } from '@angular/core';

import * as data from '../../../../../shared/data/data/forms/forms-controls';

@Component({
  selector: 'app-inline-style',
  templateUrl: './inline-style.html',
  styleUrls: ['./inline-style.scss'],
  imports: [],
})
export class InlineStyle {
  public inliniStyle = data.inliniStyle;
}
