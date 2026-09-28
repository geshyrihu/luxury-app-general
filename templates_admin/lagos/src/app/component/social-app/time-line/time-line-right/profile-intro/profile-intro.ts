import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile-intro',
  templateUrl: './profile-intro.html',
  styleUrls: ['./profile-intro.scss'],
  imports: [NgbModule],
})
export class ProfileIntro {
  public isCollapsed = false;
}
