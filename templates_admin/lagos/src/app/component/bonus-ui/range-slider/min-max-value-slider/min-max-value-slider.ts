import { Component } from '@angular/core';

import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-min-max-value-slider',
  templateUrl: './min-max-value-slider.html',
  styleUrls: ['./min-max-value-slider.scss'],
  imports: [NgxSliderModule],
})
export class MinMaxValueSlider {
  public value: number = 100;
  public maxvalue: number = 70;
  public options: Options = {
    floor: 0,
    ceil: 200,
  };
}
