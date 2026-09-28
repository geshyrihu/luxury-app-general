import { Component } from '@angular/core';

import * as data from '../../../../shared/data/data/ui-kits/helper-class';

@Component({
  selector: 'app-padding',
  templateUrl: './padding.html',
  styleUrls: ['./padding.scss'],
  imports: [],
})
export class Padding {
  public padding = data.padding;
}
