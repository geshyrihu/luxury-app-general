import { Component } from '@angular/core';

import { CurrentRating } from './current-rating/current-rating';
import { HorizontalRating } from './horizontal-rating/horizontal-rating';
import { MovieRating } from './movie-rating/movie-rating';
import { NumberRating } from './number-rating/number-rating';
import { SquareRating } from './square-rating/square-rating';
import { StarRating } from './star-rating/star-rating';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.html',
  styleUrls: ['./rating.scss'],
  imports: [CurrentRating, HorizontalRating, MovieRating, NumberRating, SquareRating, StarRating],
})
export class Rating {}
