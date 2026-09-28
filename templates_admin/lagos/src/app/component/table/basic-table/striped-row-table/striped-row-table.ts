import { Component } from '@angular/core';

import * as data from '../../../../shared/data/data/table/bootstrap-table';

@Component({
  selector: 'app-striped-row-table',
  templateUrl: './striped-row-table.html',
  styleUrls: ['./striped-row-table.scss'],
  imports: [],
})
export class StripedRowTable {
  public stripedRowTable = data.stripedRowTable;
}
