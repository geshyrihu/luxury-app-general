import { Component } from '@angular/core';

import * as Data from '../../../../shared/data/data/bonus-ui/basic-card';

@Component({
  selector: 'app-info-color-cards',
  templateUrl: './info-color-cards.html',
  styleUrls: ['./info-color-cards.scss'],
  imports: [],
})
export class InfoColorCards {
  public commonInfoColorCardData = Data.commonInfoColorCardData;
}
