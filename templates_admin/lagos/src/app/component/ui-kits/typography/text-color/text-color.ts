import { Component } from '@angular/core';

import * as data from '../../../../shared/data/data/ui-kits/typography';

@Component({
  selector: 'app-text-color',
  templateUrl: './text-color.html',
  styleUrls: ['./text-color.scss'],
  imports: [],
})
export class TextColor {
  public textColorData = data.textColorData;
}
