import { Component } from '@angular/core';

import { AreaChart1 } from './area-chart1/area-chart1';
import { AreaChart2 } from './area-chart2/area-chart2';
import { BarChart2 } from './bar-chart2/bar-chart2';
import { ColumnChart1 } from './column-chart1/column-chart1';
import { ColumnChart2 } from './column-chart2/column-chart2';
import { ComboChart } from './combo-chart/combo-chart';
import { LineChart } from './line-chart/line-chart';
import { PieChart1 } from './pie-chart1/pie-chart1';
import { PieChart2 } from './pie-chart2/pie-chart2';
import { PieChart3 } from './pie-chart3/pie-chart3';
import { PieChart4 } from './pie-chart4/pie-chart4';
import { WordTree } from './word-tree/word-tree';

@Component({
  selector: 'app-google-chart',
  templateUrl: './google-chart.html',
  styleUrls: ['./google-chart.scss'],
  imports: [
    AreaChart1,
    AreaChart2,
    PieChart1,
    PieChart2,
    PieChart3,
    PieChart4,
    WordTree,
    LineChart,
    ComboChart,
    ColumnChart1,
    ColumnChart2,
    ComboChart,
    BarChart2,
  ],
})
export class GoogleChart {}
