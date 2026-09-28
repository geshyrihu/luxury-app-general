import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pills-tabs',
  templateUrl: './pills-tabs.html',
  styleUrls: ['./pills-tabs.scss'],
  imports: [NgbModule],
})
export class PillsTabs {
  public active = 3;
}
