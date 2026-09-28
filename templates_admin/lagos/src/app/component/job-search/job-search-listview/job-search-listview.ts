import { SlicePipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { NgbModule, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

import { jobCardsData } from '../../../shared/data/data/job-search/job-search';
import { JobFilter } from '../job-filter/job-filter';

@Component({
  selector: 'app-job-search-listview',
  templateUrl: './job-search-listview.html',
  styleUrls: ['./job-search-listview.scss'],
  imports: [NgbModule, JobFilter, SlicePipe],
})
export class JobSearchListview {
  public jobCardsData = jobCardsData;

  public config = inject(NgbRatingConfig);

  constructor() {
    this.config.max = 5;
    this.config.readonly = true;
  }
}
