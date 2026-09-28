import { Component } from '@angular/core';

import { BorderColor } from './border-color/border-color';
import { CommanHelperClass } from './comman-helper-class/comman-helper-class';
import { CommanMarginPadding } from './comman-margin-padding/comman-margin-padding';
import { FontSizes } from './font-sizes/font-sizes';
import { FontStyle } from './font-style/font-style';
import { FontWidthHelper } from './font-width-helper/font-width-helper';
import { ImagesSizes } from './images-sizes/images-sizes';
import { Margin } from './margin/margin';
import { Padding } from './padding/padding';
import { TextColors } from './text-colors/text-colors';
import * as data from '../../../shared/data/data/ui-kits/helper-class';

@Component({
  selector: 'app-helper-classes',
  templateUrl: './helper-classes.html',
  styleUrls: ['./helper-classes.scss'],
  imports: [
    Padding,
    Margin,
    TextColors,
    ImagesSizes,
    FontWidthHelper,
    FontStyle,
    FontSizes,
    CommanHelperClass,
    CommanMarginPadding,
    BorderColor,
  ],
})
export class HelperClasses {
  public StyleBorderData = data.StyleBorderData;
  public BorderAndDisplayData = data.BorderAndDisplayData;
  public backgroundColorsData = data.backgroundColorsData;
  public SidePadding = data.SidePadding;
  public SideMargin = data.SideMargin;
}
