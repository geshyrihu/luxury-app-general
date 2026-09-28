import { Component } from '@angular/core';

import { InvoiceTop } from './invoice-top/invoice-top';
import * as data from '../../../shared/data/data/invoice/invoice';

@Component({
  selector: 'app-invoice-one',
  templateUrl: './invoice-one.html',
  styleUrls: ['./invoice-one.scss'],
  imports: [InvoiceTop],
})
export class InvoiceOne {
  public invoice1 = data.invoice1;
}
