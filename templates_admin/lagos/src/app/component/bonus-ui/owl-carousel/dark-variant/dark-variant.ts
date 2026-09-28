import { Component } from '@angular/core';

import { CarouselModule } from 'ngx-owl-carousel-o';

import {
  darkVariantData,
  withIndicatorOptions,
} from '../../../../shared/data/data/bonus-ui/owl-carousel';

@Component({
  selector: 'app-dark-variant',
  templateUrl: './dark-variant.html',
  styleUrls: ['./dark-variant.scss'],
  imports: [CarouselModule],
})
export class DarkVariant {
  public darkVariantData = darkVariantData;
  public withIndicatorOptions = withIndicatorOptions;
}
