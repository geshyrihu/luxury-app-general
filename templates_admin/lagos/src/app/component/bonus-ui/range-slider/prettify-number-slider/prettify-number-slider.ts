import { Component } from '@angular/core';

import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-prettify-number-slider',
  templateUrl: './prettify-number-slider.html',
  styleUrls: ['./prettify-number-slider.scss'],
  imports: [NgxSliderModule],
})
export class PrettifyNumberSlider {
  public value: number = 1000;
  public options: Options = {
    floor: 1000,
    ceil: 10000,
    showTicksValues: true,
    tickStep: 3000,
    tickValueStep: 100,
  };
}
