import { Component } from '@angular/core';

import * as data from '../../../../shared/data/data/table/bootstrap-table';

@Component({
  selector: 'app-basic-table-with-border-bottom-color',
  templateUrl: './basic-table-with-border-bottom-color.html',
  styleUrls: ['./basic-table-with-border-bottom-color.scss'],
  imports: [],
})
export class BasicTableWithBorderBottomColor {
  public tableData = data.basicTableBottomColor;
}
