import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FeatherIcons } from '../../../../shared/components/feather-icons/feather-icons';
import * as Data from '../../../../shared/data/data/ui-kits/accordion';

@Component({
  selector: 'app-simple-accordian',
  templateUrl: './simple-accordian.html',
  styleUrls: ['./simple-accordian.scss'],
  imports: [NgbModule, FeatherIcons],
})
export class SimpleAccordian {
  public simpleAccordionData = Data.simpleAccordionData;
}
