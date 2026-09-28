import { Component } from '@angular/core';

import { InvoiceDetals } from './invoice-detals/invoice-detals';
import { InvoiceFiveTop } from './invoice-five-top/invoice-five-top';
import * as data from '../../../shared/data/data/invoice/invoice';

@Component({
  selector: 'app-invoice-five',
  templateUrl: './invoice-five.html',
  styleUrls: ['./invoice-five.scss'],
  imports: [InvoiceFiveTop, InvoiceDetals],
})
export class InvoiceFive {
  public invoice4 = data.invoice4;
}
