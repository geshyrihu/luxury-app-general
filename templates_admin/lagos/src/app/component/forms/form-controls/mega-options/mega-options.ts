import { Component } from '@angular/core';

import { DashedBorderStyle } from './dashed-border-style/dashed-border-style';
import { DefaultStyle } from './default-style/default-style';
import { HorizontalStyle } from './horizontal-style/horizontal-style';
import { InlineStyle } from './inline-style/inline-style';
import { OfferStyleBorder } from './offer-style-border/offer-style-border';
import { VariationCheckbox } from './variation-checkbox/variation-checkbox';
import { VariationRadio } from './variation-radio/variation-radio';
import { VerticalStyle } from './vertical-style/vertical-style';
import { WithoutBordersStyle } from './without-borders-style/without-borders-style';

@Component({
  selector: 'app-mega-options',
  templateUrl: './mega-options.html',
  styleUrls: ['./mega-options.scss'],
  imports: [
    DashedBorderStyle,
    DefaultStyle,
    VariationRadio,
    HorizontalStyle,
    InlineStyle,
    OfferStyleBorder,
    VariationCheckbox,
    VerticalStyle,
    WithoutBordersStyle,
  ],
})
export class MegaOptions {}
