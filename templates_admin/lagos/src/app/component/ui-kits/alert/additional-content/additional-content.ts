import { Component } from '@angular/core';

import * as Data from '../../../../shared/data/data/ui-kits/alert';

@Component({
  selector: 'app-additional-content',
  templateUrl: './additional-content.html',
  styleUrls: ['./additional-content.scss'],
  imports: [],
})
export class AdditionalContent {
  public additionalContentData = Data.additionalContentData;
}
