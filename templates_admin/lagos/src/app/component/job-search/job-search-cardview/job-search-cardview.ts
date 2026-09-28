import { Component, inject } from '@angular/core';

import { NgbModule, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

import { jobCardsData } from '../../../shared/data/data/job-search/job-search';
import { JobFilter } from '../job-filter/job-filter';

@Component({
  selector: 'app-job-search-cardview',
  templateUrl: './job-search-cardview.html',
  styleUrls: ['./job-search-cardview.scss'],
  imports: [NgbModule, JobFilter],
})
export class JobSearchCardview {
  public jobCardsData = jobCardsData;

  public config = inject(NgbRatingConfig);

  constructor() {
    this.config.max = 5;
    this.config.readonly = true;
  }
}
