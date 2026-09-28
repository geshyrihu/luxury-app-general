import { Component } from '@angular/core';

import { smallProgressBarData } from '../../../../shared/data/data/ui-kits/progres-bar';

@Component({
  selector: 'app-small-progress-bars',
  templateUrl: './small-progress-bars.html',
  styleUrls: ['./small-progress-bars.scss'],
})
export class SmallProgressBars {
  public smallProgressBarData = smallProgressBarData;
}
