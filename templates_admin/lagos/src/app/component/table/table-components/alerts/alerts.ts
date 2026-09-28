import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.html',
  styleUrls: ['./alerts.scss'],
  imports: [NgClass],
})
export class Alerts {
  public isDisable: boolean = false;
  public isDisable1: boolean = false;

  close() {
    this.isDisable = true;
  }

  close1() {
    this.isDisable1 = true;
  }
}
