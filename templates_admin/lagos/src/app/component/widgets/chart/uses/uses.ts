import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import * as data from '../../../../shared/data/chart/widgets/apex-chart';

@Component({
  selector: 'app-uses',
  templateUrl: './uses.html',
  styleUrls: ['./uses.scss'],
  imports: [NgApexchartsModule],
})
export class Uses {
  public usesChart = data.usesChart;
}
