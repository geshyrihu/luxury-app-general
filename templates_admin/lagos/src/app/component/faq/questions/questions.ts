import { Component, inject } from '@angular/core';

import { NgbAccordionConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FeatherIcons } from '../../../shared/components/feather-icons/feather-icons';
import { questionData } from '../../../shared/data/data/faq/faq';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.html',
  styleUrls: ['./questions.scss'],
  imports: [FeatherIcons, NgbModule],
})
export class Questions {
  public questionData = questionData;

  public config = inject(NgbAccordionConfig);

  constructor() {
    this.config.closeOthers = true;
  }
}
