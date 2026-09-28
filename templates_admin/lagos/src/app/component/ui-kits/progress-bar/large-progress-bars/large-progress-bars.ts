import { Component } from '@angular/core';

import { largeProgressBarData } from '../../../../shared/data/data/ui-kits/progres-bar';

@Component({
  selector: 'app-large-progress-bars',
  templateUrl: './large-progress-bars.html',
  styleUrls: ['./large-progress-bars.scss'],
})
export class LargeProgressBars {
  public largeProgressBarData = largeProgressBarData;
}
