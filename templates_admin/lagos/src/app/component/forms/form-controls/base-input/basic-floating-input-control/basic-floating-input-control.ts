import { Component } from '@angular/core';

import { LayoutGroup } from './layout-group/layout-group';

@Component({
  selector: 'app-basic-floating-input-control',
  templateUrl: './basic-floating-input-control.html',
  styleUrls: ['./basic-floating-input-control.scss'],
  imports: [LayoutGroup],
})
export class BasicFloatingInputControl {
  public validate = false;
  constructor() {}

  public submit() {
    this.validate = !this.validate;
  }
}
