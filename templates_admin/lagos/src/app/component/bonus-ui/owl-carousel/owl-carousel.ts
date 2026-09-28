import { Component } from '@angular/core';

import { AutoPlayVariant } from './auto-play-variant/auto-play-variant';
import { CrossFade } from './cross-fade/cross-fade';
import { DarkVariant } from './dark-variant/dark-variant';
import { MouseWheelVariant } from './mouse-wheel-variant/mouse-wheel-variant';
import { SlidesOnly } from './slides-only/slides-only';
import { WithCaptions } from './with-captions/with-captions';
import { WithControls } from './with-controls/with-controls';
import { WithIndicators } from './with-indicators/with-indicators';

@Component({
  selector: 'app-owl-carousel',
  templateUrl: './owl-carousel.html',
  styleUrls: ['./owl-carousel.scss'],
  imports: [
    AutoPlayVariant,
    CrossFade,
    DarkVariant,
    MouseWheelVariant,
    SlidesOnly,
    WithControls,
    WithCaptions,
    WithIndicators,
  ],
})
export class OwlCarousel {}
