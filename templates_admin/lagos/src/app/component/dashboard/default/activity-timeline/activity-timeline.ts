import { Component } from '@angular/core';

import { activityTimeline } from '../../../../shared/data/data/dashboard/dashboard';
import { ClickOutsideDirective } from '../../../../shared/directive/click-outside.directive';

@Component({
  selector: 'app-activity-timeline',
  imports: [ClickOutsideDirective],
  templateUrl: './activity-timeline.html',
  styleUrl: './activity-timeline.scss',
})
export class ActivityTimeline {
  public activityTimeline = activityTimeline;

  public isShow: boolean = false;

  outSide() {
    this.isShow = false;
  }
}
