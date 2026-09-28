import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FeatherIcons } from '../../../../shared/components/feather-icons/feather-icons';
import * as Data from '../../../../shared/data/data/ui-kits/accordion';

@Component({
  selector: 'app-outline-accordion',
  templateUrl: './outline-accordion.html',
  styleUrls: ['./outline-accordion.scss'],
  imports: [NgbModule, FeatherIcons],
})
export class OutlineAccordion {
  public simpleAccordionData = Data.simpleAccordionData;
}
