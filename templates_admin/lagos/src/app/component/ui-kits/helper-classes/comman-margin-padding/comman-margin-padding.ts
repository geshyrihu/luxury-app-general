import { Component, input } from '@angular/core';

import * as data from '../../../../shared/data/data/ui-kits/helper-class';

@Component({
  selector: 'app-comman-margin-padding',
  templateUrl: './comman-margin-padding.html',
  styleUrls: ['./comman-margin-padding.scss'],
  imports: [],
})
export class CommanMarginPadding {
  readonly data = input<data.commanSide[]>();
}
