import { Component } from '@angular/core';

import { BaseChartDirective } from 'ng2-charts';

import * as chartData from '../../../../shared/data/chart/charts/chartjs';

@Component({
  selector: 'app-line-graph',
  templateUrl: './line-graph.html',
  styleUrls: ['./line-graph.scss'],
  imports: [BaseChartDirective],
})
export class LineGraph {
  public lineGraphOptions = chartData.lineGraphOptions;
  public lineGraphLabels = chartData.lineGraphLabels;
  public lineGraphType = chartData.lineGraphType;
  public lineGraphLegend = chartData.lineGraphLegend;
  public lineGraphData = chartData.lineGraphData;
}
