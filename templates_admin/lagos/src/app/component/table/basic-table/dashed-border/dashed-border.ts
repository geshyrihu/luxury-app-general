import { Component } from '@angular/core';

import * as data from '../../../../shared/data/data/table/bootstrap-table';

@Component({
  selector: 'app-dashed-border',
  templateUrl: './dashed-border.html',
  styleUrls: ['./dashed-border.scss'],
  imports: [],
})
export class DashedBorder {
  public dashboardBorder = data.dashboardBorder;
}
