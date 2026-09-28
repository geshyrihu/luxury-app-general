import { NgClass } from '@angular/common';
import { Component, output } from '@angular/core';

import { AdditionalOptions } from './additional-options/additional-options';
import { Inventory } from './inventory/inventory';
import { Shipping } from './shipping/shipping';

@Component({
  selector: 'app-advance',
  templateUrl: './advance.html',
  styleUrls: ['./advance.scss'],
  imports: [Shipping, AdditionalOptions, Inventory, NgClass],
})
export class Advance {
  public activeTab = 'inventory';
  readonly activeSteps = output<number>();
  public activeStep: number = 5;

  changeTab(value: string) {
    this.activeTab = value;
  }

  receiveChildData(step: number) {
    this.activeSteps.emit(step);
  }
}
