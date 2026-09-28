import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import * as data from '../../../../shared/data/chart/widgets/apex-chart';

@Component({
  selector: 'app-stock-market',
  templateUrl: './stock-market.html',
  styleUrls: ['./stock-market.scss'],
  imports: [NgApexchartsModule],
})
export class StockMarket {
  public stokeMarket = data.stokeMarket;
}
