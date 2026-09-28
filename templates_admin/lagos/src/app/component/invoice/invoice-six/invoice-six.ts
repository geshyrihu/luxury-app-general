import { Component } from '@angular/core';

import { InvoiceTable } from './invoice-table/invoice-table';

@Component({
  selector: 'app-invoice-six',
  templateUrl: './invoice-six.html',
  styleUrls: ['./invoice-six.scss'],
  imports: [InvoiceTable],
})
export class InvoiceSix {}
