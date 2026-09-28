import { Component } from '@angular/core';

import { FeatherIcons } from '../../../../shared/components/feather-icons/feather-icons';
import * as data from '../../../../shared/data/data/table/bootstrap-table';

@Component({
  selector: 'app-hoverable-rows-border',
  templateUrl: './hoverable-rows-border.html',
  styleUrls: ['./hoverable-rows-border.scss'],
  imports: [FeatherIcons],
})
export class HoverableRowsBorder {
  public hoverableRowsBorder = data.hoverableRowsBorder;
}
