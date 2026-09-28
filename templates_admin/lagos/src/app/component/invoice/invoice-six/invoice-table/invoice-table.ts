import { Component } from '@angular/core';

import * as data from '../../../../shared/data/data/invoice/invoice';

@Component({
  selector: 'app-invoice-table',
  templateUrl: './invoice-table.html',
  styleUrls: ['./invoice-table.scss'],
  imports: [],
})
export class InvoiceTable {
  public invoice6 = data.invoice6;
}
