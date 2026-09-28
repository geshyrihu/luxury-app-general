import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import * as Data from '../../../../shared/data/data/ui-kits/dropdown';

@Component({
  selector: 'app-helper-card',
  templateUrl: './helper-card.html',
  styleUrls: ['./helper-card.scss'],
  imports: [NgbModule],
})
export class HelperCard {
  public helperCardData = Data.helperCardData;
}
