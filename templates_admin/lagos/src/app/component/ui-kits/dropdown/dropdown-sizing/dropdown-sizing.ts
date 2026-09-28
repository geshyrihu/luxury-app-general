import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import * as Data from '../../../../shared/data/data/ui-kits/dropdown';

@Component({
  selector: 'app-dropdown-sizing',
  templateUrl: './dropdown-sizing.html',
  styleUrls: ['./dropdown-sizing.scss'],
  imports: [NgbModule],
})
export class DropdownSizing {
  public sizingDropdownData = Data.sizingDropdownData;
}
