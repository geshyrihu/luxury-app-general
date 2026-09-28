import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import * as data from '../../../../shared/data/data/table/bootstrap-table';

@Component({
  selector: 'app-sizing-tables',
  templateUrl: './sizing-tables.html',
  styleUrls: ['./sizing-tables.scss'],
  imports: [NgClass],
})
export class SizingTables {
  public sizingTable = data.sizingTable;
}
