import { Component } from '@angular/core';

import { CarouselModule } from 'ngx-owl-carousel-o';

import * as Data from '../../../../shared/data/data/bonus-ui/owl-carousel';

@Component({
  selector: 'app-with-captions',
  templateUrl: './with-captions.html',
  styleUrls: ['./with-captions.scss'],
  imports: [CarouselModule],
})
export class WithCaptions {
  public withIndicatorOptions = Data.withIndicatorOptions;
  public withCaptionData = Data.withCaptionData;
}
