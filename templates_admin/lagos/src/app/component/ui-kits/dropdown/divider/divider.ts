import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import * as Data from '../../../../shared/data/data/ui-kits/dropdown';

@Component({
  selector: 'app-divider',
  templateUrl: './divider.html',
  styleUrls: ['./divider.scss'],
  imports: [NgbModule],
})
export class Divider {
  public dividerDropdownDtaa = Data.dividerDropdownDtaa;
}
