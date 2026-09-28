import { Component, inject, input } from '@angular/core';

import { NgbModule, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

import { featuredTutorial } from '../../../shared/data/data/faq/faq';

@Component({
  selector: 'app-featured-tutorials',
  templateUrl: './featured-tutorials.html',
  styleUrls: ['./featured-tutorials.scss'],
  imports: [NgbModule],
})
export class FeaturedTutorials {
  readonly data = input<featuredTutorial[]>();

  public config = inject(NgbRatingConfig);

  constructor() {
    this.config.max = 5;
    this.config.readonly = true;
  }
}
