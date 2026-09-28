import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-border-tabs',
  templateUrl: './border-tabs.html',
  styleUrls: ['./border-tabs.scss'],
  imports: [NgbModule],
})
export class BorderTabs {
  public active = 2;
}
