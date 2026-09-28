import { Component } from '@angular/core';

import { learningData, learningTopData } from '../../../shared/data/data/learning/learning';
import { LearningFilter } from '../learning-filter/learning-filter';

@Component({
  selector: 'app-learning-list',
  templateUrl: './learning-list.html',
  styleUrls: ['./learning-list.scss'],
  imports: [LearningFilter],
})
export class LearningList {
  public learningTopData = learningTopData;
  public learningData = learningData;
}
