import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.html',
  styleUrls: ['./my-profile.scss'],
  imports: [NgbModule],
})
export class MyProfile {
  public isCollapsed = false;
}
