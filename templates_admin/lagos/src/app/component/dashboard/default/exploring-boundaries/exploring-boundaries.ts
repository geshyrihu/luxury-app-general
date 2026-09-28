import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { exploringBoundaries } from '../../../../shared/data/chart/general/apex-chart';

@Component({
  selector: 'app-exploring-boundaries',
  templateUrl: './exploring-boundaries.html',
  styleUrl: './exploring-boundaries.scss',
  imports: [NgApexchartsModule],
})
export class ExploringBoundaries {
  public exploringBoundaries = exploringBoundaries;

  public user = [
    {
      src: 'assets/images/dashboard/beyond-line/1.png',
    },
    {
      src: 'assets/images/dashboard/beyond-line/2.png',
    },
    {
      src: 'assets/images/dashboard/beyond-line/3.png',
    },
    {
      src: 'assets/images/dashboard/beyond-line/4.png',
    },
  ];
}
