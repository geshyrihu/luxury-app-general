import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { statisticalAnalysis } from '../../../../shared/data/chart/general/apex-chart';
import { ClickOutsideDirective } from '../../../../shared/directive/click-outside.directive';

@Component({
  selector: 'app-statistical-analysis',
  templateUrl: './statistical-analysis.html',
  styleUrl: './statistical-analysis.scss',
  imports: [NgApexchartsModule, ClickOutsideDirective],
})
export class StatisticalAnalysis {
  public isShow: boolean = false;
  public statisticalAnalysis = statisticalAnalysis;

  outSide() {
    this.isShow = false;
  }
}
