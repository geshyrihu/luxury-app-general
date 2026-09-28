import { Component } from '@angular/core';

import { InvoiceThreeTop } from './invoice-three-top/invoice-three-top';
import { TopHeader } from './top-header/top-header';
import * as data from '../../../shared/data/data/invoice/invoice';

@Component({
  selector: 'app-invoice-three',
  templateUrl: './invoice-three.html',
  styleUrls: ['./invoice-three.scss'],
  imports: [TopHeader, InvoiceThreeTop],
})
export class InvoiceThree {
  public invoice3 = data.invoice3;
}
