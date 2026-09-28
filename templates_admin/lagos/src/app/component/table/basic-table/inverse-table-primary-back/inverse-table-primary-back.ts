import { Component } from '@angular/core';

import * as data from '../../../../shared/data/data/table/bootstrap-table';

@Component({
  selector: 'app-inverse-table-primary-back',
  templateUrl: './inverse-table-primary-back.html',
  styleUrls: ['./inverse-table-primary-back.scss'],
  imports: [],
})
export class InverseTablePrimaryBack {
  public inverseTablebackground = data.inverseTablebackground;
}
