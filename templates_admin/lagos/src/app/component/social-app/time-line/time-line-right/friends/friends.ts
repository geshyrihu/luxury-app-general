import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import * as data from '../../../../../shared/data/data/social-app/social-app';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.html',
  styleUrls: ['./friends.scss'],
  imports: [NgbModule],
})
export class Friends {
  public isCollapsed = false;
  public Friends = data.Friends;
}
