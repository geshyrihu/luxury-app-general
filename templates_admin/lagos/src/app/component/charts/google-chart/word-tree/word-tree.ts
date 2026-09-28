import { Component } from '@angular/core';

import { Ng2GoogleChartsModule } from 'ng2-google-charts';

import { wordTreeChart } from '../../../../shared/data/chart/charts/google-chart';

@Component({
  selector: 'app-word-tree',
  templateUrl: './word-tree.html',
  styleUrls: ['./word-tree.scss'],
  imports: [Ng2GoogleChartsModule],
})
export class WordTree {
  public wordTreeChart = wordTreeChart;
}
