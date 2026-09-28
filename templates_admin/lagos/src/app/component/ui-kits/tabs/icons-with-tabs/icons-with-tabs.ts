import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-icons-with-tabs',
  templateUrl: './icons-with-tabs.html',
  styleUrls: ['./icons-with-tabs.scss'],
  imports: [NgbModule],
})
export class IconsWithTabs {
  public active = 1;
}
