import { Component, input } from '@angular/core';

import * as feather from 'feather-icons';

@Component({
  selector: 'app-feather-icons',
  imports: [],
  templateUrl: './feather-icons.html',
  styleUrls: ['./feather-icons.scss'],
})
export class FeatherIcons {
  readonly icons = input<string>();
  readonly class = input<string>();

  ngAfterViewInit() {
    feather.replace();
  }
}
