import { Component } from '@angular/core';

import { CoreCategories } from './core-categories/core-categories';
import { GrossSales } from './gross-sales/gross-sales';
import { NetIncome } from './net-income/net-income';
import { OpenInvoices } from './open-invoices/open-invoices';
import { OrderActivity } from './order-activity/order-activity';
import { SpecialWeekendOffer } from './special-weekend-offer/special-weekend-offer';
import { TopCharts } from './top-charts/top-charts';
import { TrendingProduct } from './trending-product/trending-product';
import { topChart } from '../../../shared/data/data/dashboard/ecommerce';

@Component({
  selector: 'app-ecommerce',
  imports: [
    CoreCategories,
    GrossSales,
    NetIncome,
    OpenInvoices,
    OrderActivity,
    SpecialWeekendOffer,
    TopCharts,
    TrendingProduct,
  ],
  templateUrl: './ecommerce.html',
  styleUrls: ['./ecommerce.scss'],
})
export class Ecommerce {
  public topChart = topChart;
}
