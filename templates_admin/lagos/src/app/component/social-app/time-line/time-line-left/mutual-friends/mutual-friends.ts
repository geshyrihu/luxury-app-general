import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import * as data from '../../../../../shared/data/data/social-app/social-app';

@Component({
  selector: 'app-mutual-friends',
  templateUrl: './mutual-friends.html',
  styleUrls: ['./mutual-friends.scss'],
  imports: [NgbModule],
})
export class MutualFriends {
  public isCollapsed = false;
  public mutualFriendsData = data.mutualFriendsData;
}
