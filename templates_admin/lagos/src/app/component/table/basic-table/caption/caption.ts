import { Component } from '@angular/core';

import * as data from '../../../../shared/data/data/table/bootstrap-table';

@Component({
  selector: 'app-caption',
  templateUrl: './caption.html',
  styleUrls: ['./caption.scss'],
  imports: [],
})
export class Caption {
  public caption = data.caption;
}
