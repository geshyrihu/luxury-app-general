import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import * as data from '../../../../shared/data/chart/widgets/apex-chart';

@Component({
  selector: 'app-live-products',
  templateUrl: './live-products.html',
  styleUrls: ['./live-products.scss'],
  imports: [NgApexchartsModule],
})
export class LiveProducts {
  public liveProducts = data.liveProducts;
}
