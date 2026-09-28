import { Component } from '@angular/core';

import { BarRatingModule } from 'ngx-bar-rating';

@Component({
  selector: 'app-square-rating',
  templateUrl: './square-rating.html',
  styleUrls: ['./square-rating.scss'],
  imports: [BarRatingModule],
})
export class SquareRating {
  public squareRate = 1;
}
