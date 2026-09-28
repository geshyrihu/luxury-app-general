import { Component } from '@angular/core';

import { InvoiceTwoBottom } from './invoice-two-bottom/invoice-two-bottom';
import { InvoiceTwoTop } from './invoice-two-top/invoice-two-top';
import * as data from '../../../shared/data/data/invoice/invoice';

@Component({
  selector: 'app-invoice-two',
  templateUrl: './invoice-two.html',
  styleUrls: ['./invoice-two.scss'],
  imports: [InvoiceTwoTop, InvoiceTwoBottom],
})
export class InvoiceTwo {
  public invoice2 = data.invoice2;
}
