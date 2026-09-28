import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import * as data from '../../../../shared/data/chart/widgets/apex-chart';

@Component({
  selector: 'app-turn-over',
  templateUrl: './turn-over.html',
  styleUrls: ['./turn-over.scss'],
  imports: [NgApexchartsModule],
})
export class TurnOver {
  public turnOver = data.turnOver;
}
