import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { CommonSvgIcon } from '../../../../shared/components/common-svg-icon/common-svg-icon';
import * as data from '../../../../shared/data/chart/widgets/apex-chart';

@Component({
  selector: 'app-visitors',
  templateUrl: './visitors.html',
  styleUrls: ['./visitors.scss'],
  imports: [CommonSvgIcon, NgApexchartsModule],
})
export class Visitors {
  public isShow: boolean = false;
  public visitors = data.Visitors;

  clickoutSide(): void {
    this.isShow = false;
  }
}
