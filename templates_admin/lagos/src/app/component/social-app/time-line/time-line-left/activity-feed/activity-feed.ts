import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import * as data from '../../../../../shared/data/data/social-app/social-app';

@Component({
  selector: 'app-activity-feed',
  templateUrl: './activity-feed.html',
  styleUrls: ['./activity-feed.scss'],
  imports: [NgbModule],
})
export class ActivityFeed {
  public isCollapsed = false;
  public activityFeedData = data.activityFeedData;
}
