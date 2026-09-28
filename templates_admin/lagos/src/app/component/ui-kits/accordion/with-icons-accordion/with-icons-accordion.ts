import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FeatherIcons } from '../../../../shared/components/feather-icons/feather-icons';
import * as Data from '../../../../shared/data/data/ui-kits/accordion';

@Component({
  selector: 'app-with-icons-accordion',
  templateUrl: './with-icons-accordion.html',
  styleUrls: ['./with-icons-accordion.scss'],
  imports: [NgbModule, FeatherIcons],
})
export class WithIconsAccordion {
  public accordionWithIconData = Data.accordionWithIconData;
}
