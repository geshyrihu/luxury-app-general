import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import * as data from '../../../../shared/data/data/table/bootstrap-table';

@Component({
  selector: 'app-responsive-tables-background',
  templateUrl: './responsive-tables-background.html',
  styleUrls: ['./responsive-tables-background.scss'],
  imports: [NgClass],
})
export class ResponsiveTablesBackground {
  public responsiveTablesBackground = data.responsiveTablesBackground;
}
