import { Component } from '@angular/core';

import { BarRatingModule } from 'ngx-bar-rating';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.html',
  styleUrls: ['./star-rating.scss'],
  imports: [BarRatingModule],
})
export class StarRating {
  public cssRate = 2.6;
}
