import { Component } from '@angular/core';

import * as Data from '../../../../shared/data/data/ui-kits/grid';

@Component({
  selector: 'app-horizontal-alignment',
  templateUrl: './horizontal-alignment.html',
  styleUrls: ['./horizontal-alignment.scss'],
  imports: [],
})
export class HorizontalAlignment {
  public horizontialAlinmentData = Data.alignmentData;
}
