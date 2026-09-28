import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import * as Data from '../../../../shared/data/data/ui-kits/dropdown';

@Component({
  selector: 'app-alignments',
  templateUrl: './alignments.html',
  styleUrls: ['./alignments.scss'],
  imports: [NgbModule],
})
export class Alignments {
  public alignmentDropdownData = Data.alignmentDropdownData;
}
