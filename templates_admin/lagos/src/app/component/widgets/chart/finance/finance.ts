import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import * as data from '../../../../shared/data/chart/widgets/apex-chart';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.html',
  styleUrls: ['./finance.scss'],
  imports: [NgApexchartsModule],
})
export class Finance {
  public finance = data.finance;
}
