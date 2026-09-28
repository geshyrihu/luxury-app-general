import { Component } from '@angular/core';

import { CarouselModule } from 'ngx-owl-carousel-o';

import * as Data from '../../../../shared/data/data/bonus-ui/owl-carousel';

@Component({
  selector: 'app-with-indicators',
  templateUrl: './with-indicators.html',
  styleUrls: ['./with-indicators.scss'],
  imports: [CarouselModule],
})
export class WithIndicators {
  public withIndicatorOptions = Data.withIndicatorOptions;
  public withIndicatorData = Data.withIndicatorData;
}
