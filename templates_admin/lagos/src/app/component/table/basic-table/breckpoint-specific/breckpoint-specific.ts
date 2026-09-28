import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';

import * as data from '../../../../shared/data/data/table/bootstrap-table';

@Component({
  selector: 'app-breckpoint-specific',
  templateUrl: './breckpoint-specific.html',
  styleUrls: ['./breckpoint-specific.scss'],
  imports: [DecimalPipe],
})
export class BreckpointSpecific {
  public breckpointSpecific = data.breckpointSpecific;
}
