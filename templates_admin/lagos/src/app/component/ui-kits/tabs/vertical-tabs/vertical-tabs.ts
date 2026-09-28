import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-vertical-tabs',
  templateUrl: './vertical-tabs.html',
  styleUrls: ['./vertical-tabs.scss'],
  imports: [NgbModule],
})
export class VerticalTabs {
  public active = 'component';
}
