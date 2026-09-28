import { Component } from '@angular/core';

import { BasicProgressBars } from './basic-progress-bars/basic-progress-bars';
import { CommanProgressBar } from './comman-progress-bar/comman-progress-bar';
import { CustomHeightProgress } from './custom-height-progress/custom-height-progress';
import { CustomProgressBars } from './custom-progress-bars/custom-progress-bars';
import { LargeProgressBars } from './large-progress-bars/large-progress-bars';
import { MultipleBars } from './multiple-bars/multiple-bars';
import { ProgressWithNumberSteps } from './progress-with-number-steps/progress-with-number-steps';
import { SmallProgressBars } from './small-progress-bars/small-progress-bars';
import * as Data from '../../../shared/data/data/ui-kits/progres-bar';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.html',
  styleUrls: ['./progress-bar.scss'],
  imports: [
    BasicProgressBars,
    CommanProgressBar,
    CustomProgressBars,
    CustomHeightProgress,
    MultipleBars,
    ProgressWithNumberSteps,
    SmallProgressBars,
    LargeProgressBars,
  ],
})
export class ProgressBar {
  public stripedData = Data.stripedData;
  public stripedAnimatedData = Data.stripedAnimatedData;
}
