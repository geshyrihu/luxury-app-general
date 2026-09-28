import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import * as data from '../../../../../shared/data/data/social-app/social-app';

@Component({
  selector: 'app-followings',
  templateUrl: './followings.html',
  styleUrls: ['./followings.scss'],
  imports: [NgbModule],
})
export class Followings {
  public isCollapsed = false;
  public Following = data.Following;
}
