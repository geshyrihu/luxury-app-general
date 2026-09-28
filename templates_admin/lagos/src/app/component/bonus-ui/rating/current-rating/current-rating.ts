import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, Validators } from '@angular/forms';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar, faStarHalfAlt, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BarRatingModule } from 'ngx-bar-rating';

@Component({
  selector: 'app-current-rating',
  templateUrl: './current-rating.html',
  styleUrls: ['./current-rating.scss'],
  imports: [FormsModule, NgbModule, BarRatingModule, FontAwesomeModule],
})
export class CurrentRating {
  public faoRate = 5.6;
  public faoRated = false;
  public library = inject(FaIconLibrary);

  onFaoRate(e: number) {
    this.faoRated = true;
    this.faoRate = e;
  }
  ctrl = new FormControl<number | null>(null, Validators.required);

  faoReset() {
    this.faoRated = false;
    this.faoRate = 5.6;
  }
  constructor() {
    this.library.addIcons(faStar, faStarHalfAlt, farStar, faTimesCircle);
  }
}
