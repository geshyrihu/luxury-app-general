import { Component } from '@angular/core';

import { ActivityFeed } from './activity-feed/activity-feed';
import { MutualFriends } from './mutual-friends/mutual-friends';
import { MyProfile } from './my-profile/my-profile';

@Component({
  selector: 'app-time-line-left',
  templateUrl: './time-line-left.html',
  styleUrls: ['./time-line-left.scss'],
  imports: [ActivityFeed, MyProfile, MutualFriends],
})
export class TimeLineLeft {}
