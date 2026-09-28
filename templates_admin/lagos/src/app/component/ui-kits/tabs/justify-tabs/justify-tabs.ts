import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import * as Data from '../../../../shared/data/data/ui-kits/tab';

@Component({
  selector: 'app-justify-tabs',
  templateUrl: './justify-tabs.html',
  styleUrls: ['./justify-tabs.scss'],
  imports: [NgbModule],
})
export class JustifyTabs {
  public active = 2;
  public justifyTabData = Data.justifyTabData;
}
