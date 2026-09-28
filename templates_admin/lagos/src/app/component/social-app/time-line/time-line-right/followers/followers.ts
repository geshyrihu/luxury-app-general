import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import * as data from '../../../../../shared/data/data/social-app/social-app';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.html',
  styleUrls: ['./followers.scss'],
  imports: [NgbModule],
})
export class Followers {
  public isCollapsed = false;
  public Followers = data.Followers;
}
