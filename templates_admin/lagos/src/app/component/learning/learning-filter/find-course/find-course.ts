import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FeatherIcons } from '../../../../shared/components/feather-icons/feather-icons';
import { findCourse } from '../../../../shared/data/data/learning/learning';

@Component({
  selector: 'app-find-course',
  templateUrl: './find-course.html',
  styleUrls: ['./find-course.scss'],
  imports: [FeatherIcons, NgbModule],
})
export class FindCourse {
  public findCourse = findCourse;
  public isCollapsed = false;
}
