import { Component } from '@angular/core';

import { ActivityTimeline } from './activity-timeline/activity-timeline';
import { ClientData } from './client-data/client-data';
import { ExploringBoundaries } from './exploring-boundaries/exploring-boundaries';
import { OrderHistory } from './order-history/order-history';
import { OverallAppointment } from './overall-appointment/overall-appointment';
import { OverviewMonthly } from './overview-monthly/overview-monthly';
import { ProductRevenue } from './product-revenue/product-revenue';
import { ProfileGreeting } from './profile-greeting/profile-greeting';
import { SellOverview } from './sell-overview/sell-overview';
import { StatisticalAnalysis } from './statistical-analysis/statistical-analysis';

@Component({
  selector: 'app-default',
  templateUrl: './default.html',
  styleUrls: ['./default.scss'],
  imports: [
    ActivityTimeline,
    ClientData,
    ExploringBoundaries,
    OrderHistory,
    OverallAppointment,
    OverviewMonthly,
    ProductRevenue,
    ProfileGreeting,
    SellOverview,
    StatisticalAnalysis,
  ],
})
export class Default {
  public data = [
    {
      class: 'primary',
      name: 'Clients',
      point: '2.536',
      icons: 'male',
      image: [
        {
          url: 'assets/images/dashboard/user/1.png',
        },
        {
          url: 'assets/images/dashboard/user/2.png',
        },
        {
          url: 'assets/images/dashboard/user/3.png',
        },
        {
          url: 'assets/images/dashboard/user/4.png',
        },
        {
          url: 'assets/images/dashboard/user/5.png',
        },
      ],
      rate: '4.6',
    },
    {
      class: 'secondary',
      name: 'Earnings',
      point: '$6.642',
      icons: 'money',
      rate: '3.5',
    },
  ];
}
