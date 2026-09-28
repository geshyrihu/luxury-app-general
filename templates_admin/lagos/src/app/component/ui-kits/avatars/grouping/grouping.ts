import { Component } from '@angular/core';

import { groupingData } from '../../../../shared/data/data/ui-kits/avatars';

@Component({
  selector: 'app-grouping',
  templateUrl: './grouping.html',
  styleUrls: ['./grouping.scss'],
  imports: [],
})
export class Grouping {
  public groupingData = groupingData;
}
