import { Component } from '@angular/core';

import { AbsoluteCard } from './absolute-card/absolute-card';
import { BorderBottom } from './border-bottom/border-bottom';
import { BorderLeft } from './border-left/border-left';
import { BorderLight } from './border-light/border-light';
import { BorderPrimaryState } from './border-primary-state/border-primary-state';
import { BorderSecondaryState } from './border-secondary-state/border-secondary-state';
import { BorderTop } from './border-top/border-top';
import { BorderWarningState } from './border-warning-state/border-warning-state';

@Component({
  selector: 'app-creative-cards',
  templateUrl: './creative-cards.html',
  styleUrls: ['./creative-cards.scss'],
  imports: [
    AbsoluteCard,
    BorderBottom,
    BorderLeft,
    BorderLight,
    BorderPrimaryState,
    BorderSecondaryState,
    BorderTop,
    BorderWarningState,
  ],
})
export class CreativeCards {}
