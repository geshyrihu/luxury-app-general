import { Component } from '@angular/core';

import * as data from '../../../../shared/data/data/ui-kits/progres-bar';

@Component({
  selector: 'app-custom-height-progress',
  templateUrl: './custom-height-progress.html',
  styleUrls: ['./custom-height-progress.scss'],
})
export class CustomHeightProgress {
  public customHeightProgressBarData = data.customHeightProgressBarData;
}
