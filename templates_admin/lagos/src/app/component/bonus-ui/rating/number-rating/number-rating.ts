import { Component } from '@angular/core';

import { BarRatingModule } from 'ngx-bar-rating';

@Component({
  selector: 'app-number-rating',
  templateUrl: './number-rating.html',
  styleUrls: ['./number-rating.scss'],
  imports: [BarRatingModule],
})
export class NumberRating {
  public faRate = 7;
}
