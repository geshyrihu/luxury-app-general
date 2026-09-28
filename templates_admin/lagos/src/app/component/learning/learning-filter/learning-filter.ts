import { Component } from '@angular/core';

import { Categories } from './categories/categories';
import { FindCourse } from './find-course/find-course';
import { UpcomingCourses } from './upcoming-courses/upcoming-courses';

@Component({
  selector: 'app-learning-filter',
  templateUrl: './learning-filter.html',
  styleUrls: ['./learning-filter.scss'],
  imports: [FindCourse, UpcomingCourses, Categories],
})
export class LearningFilter {
  public isOpen: boolean = false;

  outSide() {
    this.isOpen = false;
  }
}
