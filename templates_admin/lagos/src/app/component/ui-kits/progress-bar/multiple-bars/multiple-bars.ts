import { Component } from '@angular/core';

import * as Data from '../../../../shared/data/data/ui-kits/progres-bar';

@Component({
  selector: 'app-multiple-bars',
  templateUrl: './multiple-bars.html',
  styleUrls: ['./multiple-bars.scss'],
})
export class MultipleBars {
  public multipalBarData = Data.multipalBarData;
}
