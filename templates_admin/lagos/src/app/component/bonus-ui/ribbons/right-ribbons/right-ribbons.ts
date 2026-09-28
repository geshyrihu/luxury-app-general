import { Component } from '@angular/core';

import * as Data from '../../../../shared/data/data/bonus-ui/ribbons';

@Component({
  selector: 'app-right-ribbons',
  templateUrl: './right-ribbons.html',
  styleUrls: ['./right-ribbons.scss'],
  imports: [],
})
export class RightRibbons {
  public rightRibbonData = Data.rightRibbonData;
}
