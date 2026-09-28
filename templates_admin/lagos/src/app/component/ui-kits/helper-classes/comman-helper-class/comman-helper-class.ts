import { Component, input } from '@angular/core';

import * as data from '../../../../shared/data/data/ui-kits/helper-class';

@Component({
  selector: 'app-comman-helper-class',
  templateUrl: './comman-helper-class.html',
  styleUrls: ['./comman-helper-class.scss'],
  imports: [],
})
export class CommanHelperClass {
  readonly data = input<data.commonHelperClasses[]>();
}
