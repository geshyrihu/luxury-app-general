import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import * as Data from '../../../../shared/data/data/ui-kits/dropdown';

@Component({
  selector: 'app-rounded',
  templateUrl: './rounded.html',
  styleUrls: ['./rounded.scss'],
  imports: [NgbModule],
})
export class Rounded {
  public roundedDropdownData = Data.roundedDropdownData;
}
