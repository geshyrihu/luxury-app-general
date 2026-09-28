import { SlicePipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { NgbModule, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

import { jobCardsData, jobDetail } from '../../../shared/data/data/job-search/job-search';
import { JobFilter } from '../job-filter/job-filter';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.html',
  styleUrls: ['./job-details.scss'],
  imports: [JobFilter, NgbModule, SlicePipe],
})
export class JobDetails {
  public jobDetail = jobDetail;
  public jobCardsData = jobCardsData;

  public config = inject(NgbRatingConfig);

  constructor() {
    this.config.max = 5;
    this.config.readonly = true;
  }
}
