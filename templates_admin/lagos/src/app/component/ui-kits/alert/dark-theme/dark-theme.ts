import { LowerCasePipe } from '@angular/common';
import { Component } from '@angular/core';

import * as Data from '../../../../shared/data/data/ui-kits/alert';

@Component({
  selector: 'app-dark-theme',
  templateUrl: './dark-theme.html',
  styleUrls: ['./dark-theme.scss'],
  imports: [LowerCasePipe],
})
export class DarkTheme {
  public darkThemeAlertData = Data.darkThemeAlertData;
}
