import { Component } from '@angular/core';

import { BarRatingModule } from 'ngx-bar-rating';

@Component({
  selector: 'app-movie-rating',
  templateUrl: './movie-rating.html',
  styleUrls: ['./movie-rating.scss'],
  imports: [BarRatingModule],
})
export class MovieRating {
  public movieRate = 2;
}
