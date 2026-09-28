import { Component, input, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import { BarRatingModule } from 'ngx-bar-rating';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

import * as data from '../../../../shared/data/data/ecommerce/ecommerce';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.html',
  styleUrls: ['./product-filter.scss'],
  imports: [CarouselModule, FormsModule, ReactiveFormsModule, NgxSliderModule, BarRatingModule],
})
export class ProductFilter {
  public filterData = data.filterData;
  public maxvalue: number = 70;
  public value2: number = 100;
  public rating = 2.6;
  public productFilter = data.productFilter;
  readonly show = input<boolean>(false);
  readonly childEvent = output<boolean>();

  customOptions: OwlOptions = {
    items: 1,
    margin: 30,
    loop: true,
    dots: false,
    nav: true,
  };

  options: Options = {
    floor: 0,
    ceil: 1000,
    showTicksValues: true,
    tickStep: 250,
  };

  Outside(value: boolean) {
    value = false;
    this.childEvent.emit(value);
  }
}
