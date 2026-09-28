import { Component } from '@angular/core';

import * as Data from '../../../../shared/data/data/ui-kits/grid';

@Component({
  selector: 'app-grid-options',
  templateUrl: './grid-options.html',
  styleUrls: ['./grid-options.scss'],
  imports: [],
})
export class GridOptions {
  public gridOptionData = Data.gridOptionData;
  public gridOptionData2 = Data.gridOptionData2;
  public gridOptionData3 = Data.gridOptionData3;
}
