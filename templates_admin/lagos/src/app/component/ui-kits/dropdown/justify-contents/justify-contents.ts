import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import * as Data from '../../../../shared/data/data/ui-kits/dropdown';

@Component({
  selector: 'app-justify-contents',
  templateUrl: './justify-contents.html',
  styleUrls: ['./justify-contents.scss'],
  imports: [NgbModule],
})
export class JustifyContents {
  public justifyDropdownData = Data.justifyDropdownData;
}
