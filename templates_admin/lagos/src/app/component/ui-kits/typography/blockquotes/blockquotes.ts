import { Component } from '@angular/core';

import * as data from '../../../../shared/data/data/ui-kits/typography';

@Component({
  selector: 'app-blockquotes',
  templateUrl: './blockquotes.html',
  styleUrls: ['./blockquotes.scss'],
  imports: [],
})
export class Blockquotes {
  public blockQuotesData = data.blockQuotesData;
}
