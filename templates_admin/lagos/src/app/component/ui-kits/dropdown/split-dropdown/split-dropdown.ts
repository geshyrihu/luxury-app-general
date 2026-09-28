import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import * as Data from '../../../../shared/data/data/ui-kits/dropdown';

@Component({
  selector: 'app-split-dropdown',
  templateUrl: './split-dropdown.html',
  styleUrls: ['./split-dropdown.scss'],
  imports: [NgbModule],
})
export class SplitDropdown {
  public splitDropdownData = Data.splitDropdownData;
}
