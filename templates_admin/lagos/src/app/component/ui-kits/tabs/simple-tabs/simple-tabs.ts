import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-simple-tabs',
  templateUrl: './simple-tabs.html',
  styleUrls: ['./simple-tabs.scss'],
  imports: [NgbModule],
})
export class SimpleTabs {
  public active = 2;
}
