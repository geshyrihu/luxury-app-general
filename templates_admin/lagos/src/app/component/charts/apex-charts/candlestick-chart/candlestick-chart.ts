import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { candelsStickChart } from '../../../../shared/data/chart/charts/apex-chart';

@Component({
  selector: 'app-candlestick-chart',
  templateUrl: './candlestick-chart.html',
  styleUrls: ['./candlestick-chart.scss'],
  imports: [NgApexchartsModule],
})
export class CandlestickChart {
  public candlestickChart = candelsStickChart;
}
