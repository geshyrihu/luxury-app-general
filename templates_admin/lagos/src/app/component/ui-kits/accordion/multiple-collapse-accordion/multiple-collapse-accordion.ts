import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-multiple-collapse-accordion',
  templateUrl: './multiple-collapse-accordion.html',
  styleUrls: ['./multiple-collapse-accordion.scss'],
  imports: [NgbModule],
})
export class MultipleCollapseAccordion {
  public isPrimary: boolean = false;
  public isWarning: boolean = false;
}
