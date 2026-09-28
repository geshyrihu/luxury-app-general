import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-material-style-left-tabs',
  templateUrl: './material-style-left-tabs.html',
  styleUrls: ['./material-style-left-tabs.scss'],
  imports: [NgbModule],
})
export class MaterialStyleLeftTabs {
  public active = 1;
}
