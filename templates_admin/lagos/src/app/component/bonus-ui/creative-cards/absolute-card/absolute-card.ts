import { Component } from '@angular/core';

import * as Data from '../../../../shared/data/data/bonus-ui/basic-card';

@Component({
  selector: 'app-absolute-card',
  templateUrl: './absolute-card.html',
  styleUrls: ['./absolute-card.scss'],
  imports: [],
})
export class AbsoluteCard {
  public commonAbsoluteCardData = Data.commonAbsoluteCardData;
}
