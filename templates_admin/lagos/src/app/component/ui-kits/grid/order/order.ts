import { Component } from '@angular/core';

import * as Data from '../../../../shared/data/data/ui-kits/grid';

@Component({
  selector: 'app-order',
  templateUrl: './order.html',
  styleUrls: ['./order.scss'],
  imports: [],
})
export class Order {
  public orderGridData = Data.orderGridData;
}
