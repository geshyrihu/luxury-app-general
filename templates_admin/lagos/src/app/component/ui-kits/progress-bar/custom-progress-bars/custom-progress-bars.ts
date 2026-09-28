import { Component } from '@angular/core';

import * as Data from '../../../../shared/data/data/ui-kits/progres-bar';

@Component({
  selector: 'app-custom-progress-bars',
  templateUrl: './custom-progress-bars.html',
  styleUrls: ['./custom-progress-bars.scss'],
})
export class CustomProgressBars {
  public customeProgressData = Data.customeProgressData;
}
