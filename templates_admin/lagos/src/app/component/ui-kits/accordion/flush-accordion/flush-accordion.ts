import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import * as Data from '../../../../shared/data/data/ui-kits/accordion';

@Component({
  selector: 'app-flush-accordion',
  templateUrl: './flush-accordion.html',
  styleUrls: ['./flush-accordion.scss'],
  imports: [NgbModule],
})
export class FlushAccordion {
  public flushAccordionData = Data.flushAccordionData;
}
