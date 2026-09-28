import { Component } from '@angular/core';

import * as Data from '../../../../shared/data/data/ui-kits/grid';

@Component({
  selector: 'app-grid-for-column',
  templateUrl: './grid-for-column.html',
  styleUrls: ['./grid-for-column.scss'],
  imports: [],
})
export class GridForColumn {
  public gridColumnData = Data.gridColumnData;
}
