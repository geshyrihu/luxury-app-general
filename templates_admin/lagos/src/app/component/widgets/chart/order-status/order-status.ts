import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Progress } from './progress/progress';
import * as data from '../../../../shared/data/chart/widgets/apex-chart';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.html',
  styleUrls: ['./order-status.scss'],
  imports: [NgApexchartsModule, Progress],
})
export class OrderStatus {
  public isShow: boolean = false;

  public progress1 = data.progress1;
  public progress2 = data.progress2;
  public progress3 = data.progress3;
  public progress4 = data.progress4;
  public progress5 = data.progress5;
}
