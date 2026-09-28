import { Component } from '@angular/core';

import { ChartjsBarChart } from './chartjs-bar-chart/chartjs-bar-chart';
import { ChartjsLinechart } from './chartjs-linechart/chartjs-linechart';
import { DoughnutChart } from './doughnut-chart/doughnut-chart';
import { LineGraph } from './line-graph/line-graph';
import { PolarChart } from './polar-chart/polar-chart';
import { RadarGraph } from './radar-graph/radar-graph';

@Component({
  selector: 'app-chart-js-chart',
  templateUrl: './chart-js-chart.html',
  styleUrls: ['./chart-js-chart.scss'],
  imports: [RadarGraph, PolarChart, LineGraph, DoughnutChart, ChartjsLinechart, ChartjsBarChart],
})
export class ChartJSChart {}
