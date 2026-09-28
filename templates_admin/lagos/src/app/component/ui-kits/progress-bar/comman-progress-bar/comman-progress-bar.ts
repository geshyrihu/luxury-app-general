import { Component, input } from '@angular/core';

import * as Data from '../../../../shared/data/data/ui-kits/progres-bar';

@Component({
  selector: 'app-comman-progress-bar',
  templateUrl: './comman-progress-bar.html',
  styleUrls: ['./comman-progress-bar.scss'],
})
export class CommanProgressBar {
  readonly data = input<Data.progresBar[]>();
}
