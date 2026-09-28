import { Component } from '@angular/core';

import { Followers } from './followers/followers';
import { Followings } from './followings/followings';
import { Friends } from './friends/friends';
import { LatestPhotos } from './latest-photos/latest-photos';
import { ProfileIntro } from './profile-intro/profile-intro';

@Component({
  selector: 'app-time-line-right',
  templateUrl: './time-line-right.html',
  styleUrls: ['./time-line-right.scss'],
  imports: [ProfileIntro, Followers, Followings, Friends, LatestPhotos],
})
export class TimeLineRight {}
