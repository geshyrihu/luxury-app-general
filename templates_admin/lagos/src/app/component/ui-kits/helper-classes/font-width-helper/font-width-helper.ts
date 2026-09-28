import { Component } from '@angular/core';

import * as data from '../../../../shared/data/data/ui-kits/helper-class';

@Component({
  selector: 'app-font-width-helper',
  templateUrl: './font-width-helper.html',
  styleUrls: ['./font-width-helper.scss'],
  imports: [],
})
export class FontWidthHelper {
  public FontWeight = data.FontWeight;
}
