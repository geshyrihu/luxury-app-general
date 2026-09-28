import { Component } from '@angular/core';

import { horizontialListData } from '../../../../shared/data/data/ui-kits/list';

@Component({
  selector: 'app-horizontal-lists',
  templateUrl: './horizontal-lists.html',
  styleUrls: ['./horizontal-lists.scss'],
  imports: [],
})
export class HorizontalLists {
  public horizontialListData = horizontialListData;
}
