import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';

import * as data from '../../../../shared/data/data/table/bootstrap-table';

@Component({
  selector: 'app-inverse-table',
  templateUrl: './inverse-table.html',
  styleUrls: ['./inverse-table.scss'],
  imports: [DecimalPipe],
})
export class InverseTable {
  public tableInvoice = data.tableInvoice;
}
