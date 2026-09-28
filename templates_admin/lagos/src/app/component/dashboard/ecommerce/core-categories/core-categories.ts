import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { codeCategory } from '../../../../shared/data/chart/general/apex-chart';
import { ClickOutsideDirective } from '../../../../shared/directive/click-outside.directive';

@Component({
  selector: 'app-core-categories',
  templateUrl: './core-categories.html',
  styleUrl: './core-categories.scss',
  imports: [NgApexchartsModule, ClickOutsideDirective],
})
export class CoreCategories {
  public isShow: boolean = false;
  public codeCategory = codeCategory;
  outSide() {
    this.isShow = false;
  }
}
