import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FeatherIcons } from '../../../shared/components/feather-icons/feather-icons';
import { filterChackBox, filterData } from '../../../shared/data/data/job-search/job-search';

@Component({
  selector: 'app-job-filter',
  templateUrl: './job-filter.html',
  styleUrls: ['./job-filter.scss'],
  imports: [FeatherIcons, NgbModule],
})
export class JobFilter {
  public filterData = filterData;
  public filterChackBox = filterChackBox;
  public isCollapsed = false;
  public isOpen: boolean = false;

  outSide() {
    this.isOpen = false;
  }
}
