import { Component } from '@angular/core';

import * as data from '../../../../shared/data/data/ui-kits/list';

@Component({
  selector: 'app-disabled-lists',
  templateUrl: './disabled-lists.html',
  styleUrls: ['./disabled-lists.scss'],
  imports: [],
})
export class DisabledLists {
  public disableData = data.disable;
}
