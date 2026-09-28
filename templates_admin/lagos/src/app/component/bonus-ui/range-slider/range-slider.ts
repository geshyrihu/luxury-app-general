import { Component } from '@angular/core';

import { CustomSlider } from './custom-slider/custom-slider';
import { DefaultSlider } from './default-slider/default-slider';
import { DisabledSlider } from './disabled-slider/disabled-slider';
import { MinMaxValueSlider } from './min-max-value-slider/min-max-value-slider';
import { PrettifyNumberSlider } from './prettify-number-slider/prettify-number-slider';

@Component({
  selector: 'app-range-slider',
  templateUrl: './range-slider.html',
  styleUrls: ['./range-slider.scss'],
  imports: [CustomSlider, DefaultSlider, MinMaxValueSlider, PrettifyNumberSlider, DisabledSlider],
})
export class RangeSlider {}
