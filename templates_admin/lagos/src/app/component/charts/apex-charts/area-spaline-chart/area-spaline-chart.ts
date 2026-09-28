import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { areaSpaline } from '../../../../shared/data/chart/charts/apex-chart';

@Component({
  selector: 'app-area-spaline-chart',
  templateUrl: './area-spaline-chart.html',
  styleUrls: ['./area-spaline-chart.scss'],
  imports: [NgApexchartsModule],
})
export class AreaSpalineChart {
  public areaSpalineChart = areaSpaline;
}
