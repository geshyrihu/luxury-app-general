import { Component } from '@angular/core';

import { commentsData } from '../../../shared/data/data/learning/learning';
import { Comment } from '../comment/comment';
import { LearningFilter } from '../learning-filter/learning-filter';

@Component({
  selector: 'app-detailed-course',
  templateUrl: './detailed-course.html',
  styleUrls: ['./detailed-course.scss'],
  imports: [Comment, LearningFilter],
})
export class DetailedCourse {
  public commentsData = commentsData;
}
