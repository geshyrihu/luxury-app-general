import { Component } from '@angular/core';

import { CommanChart } from './comman-chart/comman-chart';
import { CommanEducationData } from './comman-education-data/comman-education-data';
import { CommanSocialMedia } from './comman-social-media/comman-social-media';
import { OpeningOfLeaflets } from './opening-of-leaflets/opening-of-leaflets';
import { UpcomingAppointments } from './upcoming-appointments/upcoming-appointments';
import { Visitors } from './visitors/visitors';
import { WebsiteDesign } from './website-design/website-design';
import * as chart from '../../../shared/data/chart/general/apex-chart';
import * as social from '../../../shared/data/chart/widgets/apex-chart';
import * as data from '../../../shared/data/data/widgets/general';

@Component({
  selector: 'app-general',
  templateUrl: './general.html',
  styleUrls: ['./general.scss'],
  imports: [
    CommanChart,
    WebsiteDesign,
    Visitors,
    OpeningOfLeaflets,
    UpcomingAppointments,
    CommanSocialMedia,
    CommanEducationData,
  ],
})
export class General {
  public FacebookChart = social.facebookChart;
  public InstagramChart = social.instagramChart;
  public TwitterChart = social.twitterChart;
  public YoutubeChart = social.youtubeChart;
  public totalSells = data.totalSells;
  public TotalSellsChart = chart.totalSells;
  public dailyOrders = data.dailyOrders;
  public dailyOrdersChart = chart.dailyOrders;
  public ordersValue = data.ordersValue;
  public ordersValueChart = chart.ordersValue;
  public dailyRevenue = data.dailyRevenue;
  public dailyRevenueChart = chart.dailyRevenue;
}
