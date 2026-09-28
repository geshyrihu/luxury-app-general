import { Component } from '@angular/core';

import { BaseChartDirective } from 'ng2-charts';

import * as chartData from '../../../../shared/data/chart/charts/chartjs';

@Component({
  selector: 'app-radar-graph',
  templateUrl: './radar-graph.html',
  styleUrls: ['./radar-graph.scss'],
  imports: [BaseChartDirective],
})
export class RadarGraph {
  public radarGraphOptions = chartData.radarGraphOptions;
  public radarGraphLabels = chartData.radarGraphLabels;
  public radarGraphType = chartData.radarGraphType;
  public radarGraphLegend = chartData.radarGraphLegend;
  public radarGraphData = chartData.radarGraphData;
}
