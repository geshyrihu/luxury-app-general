import { Component } from '@angular/core';

import * as Data from '../../../../shared/data/data/ui-kits/grid';

@Component({
  selector: 'app-offset',
  templateUrl: './offset.html',
  styleUrls: ['./offset.scss'],
  imports: [],
})
export class Offset {
  public offsetGridData = Data.offsetGridData;
}
