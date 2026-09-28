import { Component } from '@angular/core';

import { BarRatingModule } from 'ngx-bar-rating';

@Component({
  selector: 'app-horizontal-rating',
  templateUrl: './horizontal-rating.html',
  styleUrls: ['./horizontal-rating.scss'],
  imports: [BarRatingModule],
})
export class HorizontalRating {
  public verticalRate = 1;
}
