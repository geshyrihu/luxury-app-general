import { Component } from '@angular/core';

import { CarouselModule } from 'ngx-owl-carousel-o';

import * as Data from '../../../../shared/data/data/bonus-ui/owl-carousel';

@Component({
  selector: 'app-slides-only',
  templateUrl: './slides-only.html',
  styleUrls: ['./slides-only.scss'],
  imports: [CarouselModule],
})
export class SlidesOnly {
  public slidesOnlyOptions = Data.slidesOnlyOptions;
  public slidesOnlyData = Data.slidesOnlyData;
}
