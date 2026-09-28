import { Component } from '@angular/core';

import * as data from '../../../../shared/data/data/ui-kits/progres-bar';

@Component({
  selector: 'app-basic-progress-bars',
  templateUrl: './basic-progress-bars.html',
  styleUrls: ['./basic-progress-bars.scss'],
})
export class BasicProgressBars {
  public basicProgressBarData = data.basicProgressBarData;
}
