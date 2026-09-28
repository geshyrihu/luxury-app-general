import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import * as Data from '../../../../shared/data/data/ui-kits/tab';

@Component({
  selector: 'app-material-style-tabs',
  templateUrl: './material-style-tabs.html',
  styleUrls: ['./material-style-tabs.scss'],
  imports: [NgbModule],
})
export class MaterialStyleTabs {
  public active = 1;
  public userDetailsData = Data.userDetailsData;
  public descriptionData = Data.descriptionData;
  public reviewData = Data.reviewData;
}
