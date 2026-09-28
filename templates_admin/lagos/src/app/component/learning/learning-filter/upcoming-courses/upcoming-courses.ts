import { Component, inject } from '@angular/core';

import { NgbModule, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

import { upcomingCourse } from '../../../../shared/data/data/learning/learning';

@Component({
  selector: 'app-upcoming-courses',
  templateUrl: './upcoming-courses.html',
  styleUrls: ['./upcoming-courses.scss'],
  imports: [NgbModule],
})
export class UpcomingCourses {
  public upcomingCourse = upcomingCourse;

  public isCollapsed = false;

  public config = inject(NgbRatingConfig);

  constructor() {
    this.config.max = 5;
    this.config.readonly = true;
  }
}
