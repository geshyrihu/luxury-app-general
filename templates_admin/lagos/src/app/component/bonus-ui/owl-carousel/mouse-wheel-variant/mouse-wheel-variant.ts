import { Component } from '@angular/core';

import { CarouselModule } from 'ngx-owl-carousel-o';

import * as Data from '../../../../shared/data/data/bonus-ui/owl-carousel';

@Component({
  selector: 'app-mouse-wheel-variant',
  templateUrl: './mouse-wheel-variant.html',
  styleUrls: ['./mouse-wheel-variant.scss'],
  imports: [CarouselModule],
})
export class MouseWheelVariant {
  public autoPlayOptions = Data.autoPlayOptions;
  public autoPlayData = Data.autoPlayData;
}
