import { Component } from '@angular/core';

import * as data from '../../../../shared/data/data/ui-kits/helper-class';

@Component({
  selector: 'app-font-sizes',
  templateUrl: './font-sizes.html',
  styleUrls: ['./font-sizes.scss'],
  imports: [],
})
export class FontSizes {
  public fontSizeData = data.fontSizeData;
}
