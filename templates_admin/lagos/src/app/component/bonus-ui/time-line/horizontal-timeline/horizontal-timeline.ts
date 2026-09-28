import { Component } from '@angular/core';

import { horizontialTimelineData } from '../../../../shared/data/data/bonus-ui/timeline';

@Component({
  selector: 'app-horizontal-timeline',
  templateUrl: './horizontal-timeline.html',
  styleUrls: ['./horizontal-timeline.scss'],
  imports: [],
})
export class HorizontalTimeline {
  public horizontialTimelineData = horizontialTimelineData;
}
