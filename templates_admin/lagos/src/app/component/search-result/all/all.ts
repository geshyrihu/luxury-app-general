import { Component, inject } from '@angular/core';

import { NgbModule, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

import * as data from '../../../shared/data/data/search-result/search-result';

@Component({
  selector: 'app-all',
  templateUrl: './all.html',
  styleUrls: ['./all.scss'],
  imports: [NgbModule],
})
export class All {
  public allData = data.allData;

  public config = inject(NgbRatingConfig);

  constructor() {
    this.config.max = 5;
    this.config.readonly = true;
  }
}
