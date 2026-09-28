import { Component } from '@angular/core';

import { TimeLineCenter } from './time-line-center/time-line-center';
import { TimeLineLeft } from './time-line-left/time-line-left';
import { TimeLineRight } from './time-line-right/time-line-right';

@Component({
  selector: 'app-time-line',
  templateUrl: './time-line.html',
  styleUrls: ['./time-line.scss'],
  imports: [TimeLineRight, TimeLineLeft, TimeLineCenter],
})
export class TimeLine {}
