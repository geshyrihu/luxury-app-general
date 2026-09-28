import { Component } from '@angular/core';

import * as Data from '../../../../shared/data/data/bonus-ui/timeline';

@Component({
  selector: 'app-basic-timeline',
  templateUrl: './basic-timeline.html',
  styleUrls: ['./basic-timeline.scss'],
  imports: [],
})
export class BasicTimeline {
  public basicTimelineData = Data.basicTimelineData;
}
