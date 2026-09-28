import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import * as Data from '../../../../shared/data/data/ui-kits/dropdown';

@Component({
  selector: 'app-basic',
  templateUrl: './basic.html',
  styleUrls: ['./basic.scss'],
  imports: [NgbModule],
})
export class Basic {
  public basicDropdownData = Data.basicDropdownData;
}
