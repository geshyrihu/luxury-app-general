import { LowerCasePipe } from '@angular/common';
import { Component } from '@angular/core';

import * as Data from '../../../../shared/data/data/ui-kits/alert';

@Component({
  selector: 'app-light-theme',
  templateUrl: './light-theme.html',
  styleUrls: ['./light-theme.scss'],
  imports: [LowerCasePipe],
})
export class LightTheme {
  public lightThemeAlertData = Data.lightThemeAlertData;
}
