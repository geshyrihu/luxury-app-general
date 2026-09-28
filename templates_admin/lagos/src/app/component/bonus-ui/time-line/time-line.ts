import { Component } from '@angular/core';

import { BasicTimeline } from './basic-timeline/basic-timeline';
import { HorizontalTimeline } from './horizontal-timeline/horizontal-timeline';
import { HoveringTimeline } from './hovering-timeline/hovering-timeline';
import { LagosTimeline } from './lagos-timeline/lagos-timeline';
import { VariationTimeline } from './variation-timeline/variation-timeline';

@Component({
  selector: 'app-time-line',
  templateUrl: './time-line.html',
  styleUrls: ['./time-line.scss'],
  imports: [BasicTimeline, HorizontalTimeline, HoveringTimeline, LagosTimeline, VariationTimeline],
})
export class TimeLine {}
