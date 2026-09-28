import { Component } from '@angular/core';

import { CommanTopChart } from './comman-top-chart/comman-top-chart';
import { CryptoAnnotations } from './crypto-annotations/crypto-annotations';
import { CryptocurrencyPrices } from './cryptocurrency-prices/cryptocurrency-prices';
import { Finance } from './finance/finance';
import { LiveProducts } from './live-products/live-products';
import { MonthlyHistory } from './monthly-history/monthly-history';
import { MonthlySales } from './monthly-sales/monthly-sales';
import { OrderStatus } from './order-status/order-status';
import { OrderStatusProcesses } from './order-status-processes/order-status-processes';
import { SkillStatus } from './skill-status/skill-status';
import { StockMarket } from './stock-market/stock-market';
import { TurnOver } from './turn-over/turn-over';
import { Uses } from './uses/uses';
import * as data from '../../../shared/data/chart/widgets/apex-chart';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.html',
  styleUrls: ['./chart.scss'],
  imports: [
    CommanTopChart,
    MonthlyHistory,
    MonthlySales,
    OrderStatus,
    LiveProducts,
    SkillStatus,
    StockMarket,
    Uses,
    OrderStatusProcesses,
    Finance,
    CryptoAnnotations,
    CryptocurrencyPrices,
    TurnOver,
  ],
})
export class Chart {
  public chartWidget1 = data.chartWidget1;
  public chartWidget2 = data.chartWidget2;
  public chartWidget3 = data.chartWidget3;
}
