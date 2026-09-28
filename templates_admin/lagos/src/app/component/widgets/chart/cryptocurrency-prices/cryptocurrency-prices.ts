import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import * as data from '../../../../shared/data/chart/widgets/apex-chart';

@Component({
  selector: 'app-cryptocurrency-prices',
  templateUrl: './cryptocurrency-prices.html',
  styleUrls: ['./cryptocurrency-prices.scss'],
  imports: [NgApexchartsModule],
})
export class CryptocurrencyPrices {
  public cryptoCurrencyPrices = data.cryptoCurrencyPrices;
}
