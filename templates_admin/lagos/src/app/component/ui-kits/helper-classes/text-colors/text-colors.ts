import { Component } from '@angular/core';

import * as data from '../../../../shared/data/data/ui-kits/helper-class';

@Component({
  selector: 'app-text-colors',
  templateUrl: './text-colors.html',
  styleUrls: ['./text-colors.scss'],
  imports: [],
})
export class TextColors {
  public TextColorsData = data.TextColors;
}
