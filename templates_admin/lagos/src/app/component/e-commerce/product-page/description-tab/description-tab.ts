import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-description-tab',
  templateUrl: './description-tab.html',
  styleUrls: ['./description-tab.scss'],
  imports: [NgbModule, NgClass],
})
export class DescriptionTab {
  public openTab: string = 'febric';

  public tabbed(val: string) {
    this.openTab = val;
  }
}
