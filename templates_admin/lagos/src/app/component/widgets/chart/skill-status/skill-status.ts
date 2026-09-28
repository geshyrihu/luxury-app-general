import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import * as data from '../../../../shared/data/chart/widgets/apex-chart';

@Component({
  selector: 'app-skill-status',
  templateUrl: './skill-status.html',
  styleUrls: ['./skill-status.scss'],
  imports: [NgApexchartsModule],
})
export class SkillStatus {
  public cricleChart = data.cricleChart;
}
