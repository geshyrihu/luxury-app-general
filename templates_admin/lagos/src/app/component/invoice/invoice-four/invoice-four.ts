import { Component } from '@angular/core';

import { InvoiceFourTop } from './invoice-four-top/invoice-four-top';
import * as data from '../../../shared/data/data/invoice/invoice';

@Component({
  selector: 'app-invoice-four',
  templateUrl: './invoice-four.html',
  styleUrls: ['./invoice-four.scss'],
  imports: [InvoiceFourTop],
})
export class InvoiceFour {
  public invoice4 = data.invoice4;
}
