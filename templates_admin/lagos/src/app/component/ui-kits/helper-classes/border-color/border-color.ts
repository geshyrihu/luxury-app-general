import { Component } from '@angular/core';

import * as data from '../../../../shared/data/data/ui-kits/helper-class';

@Component({
  selector: 'app-border-color',
  templateUrl: './border-color.html',
  styleUrls: ['./border-color.scss'],
  imports: [],
})
export class BorderColor {
  public borderColorData = data.borderColor;
}
