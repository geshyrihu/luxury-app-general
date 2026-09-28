import { Component } from '@angular/core';

import { AreaSpalineChart } from './area-spaline-chart/area-spaline-chart';
import { BarChart } from './bar-chart/bar-chart';
import { BasicAreaChart } from './basic-area-chart/basic-area-chart';
import { BubbleChart } from './bubble-chart/bubble-chart';
import { CandlestickChart } from './candlestick-chart/candlestick-chart';
import { ColumnChart } from './column-chart/column-chart';
import { ColumnChartTwo } from './column-chart-two/column-chart-two';
import { DonutChart } from './donut-chart/donut-chart';
import { MixedChart } from './mixed-chart/mixed-chart';
import { PieChart } from './pie-chart/pie-chart';
import { RadarChart } from './radar-chart/radar-chart';
import { RadialBarChart } from './radial-bar-chart/radial-bar-chart';
import { SteplineChart } from './stepline-chart/stepline-chart';

@Component({
  selector: 'app-apex-charts',
  templateUrl: './apex-charts.html',
  styleUrls: ['./apex-charts.scss'],
  imports: [
    AreaSpalineChart,
    BarChart,
    BasicAreaChart,
    BubbleChart,
    CandlestickChart,
    ColumnChart,
    ColumnChartTwo,
    DonutChart,
    MixedChart,
    PieChart,
    RadarChart,
    RadialBarChart,
    SteplineChart,
  ],
})
export class ApexCharts {}
