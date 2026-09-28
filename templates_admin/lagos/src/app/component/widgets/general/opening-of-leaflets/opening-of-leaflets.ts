import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import * as data from '../../../../shared/data/chart/general/apex-chart';
import { ClickOutsideDirective } from '../../../../shared/directive/click-outside.directive';

@Component({
  selector: 'app-opening-of-leaflets',
  templateUrl: './opening-of-leaflets.html',
  styleUrls: ['./opening-of-leaflets.scss'],
  imports: [NgApexchartsModule, ClickOutsideDirective],
})
export class OpeningOfLeaflets {
  public isShow: boolean = false;
  public openingOfLeaflet = data.openingOfLeaflet;

  clickoutSide(): void {
    this.isShow = false;
  }
}
