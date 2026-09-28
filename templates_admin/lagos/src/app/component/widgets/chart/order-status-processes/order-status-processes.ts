import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import * as data from '../../../../shared/data/chart/widgets/apex-chart';

@Component({
  selector: 'app-order-status-processes',
  templateUrl: './order-status-processes.html',
  styleUrls: ['./order-status-processes.scss'],
  imports: [NgApexchartsModule],
})
export class OrderStatusProcesses {
  public orderStatusProcesses = data.orderStatusProcesses;
}
