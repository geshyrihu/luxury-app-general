import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-twostepverification',
    templateUrl: './twostepverification.component.html',
    styleUrls: ['./twostepverification.component.scss'],
    standalone: false
})

/**
 * Two Step Verification Component
 */
export class TwostepverificationComponent implements OnInit {

  // set the currenr year
  year: number = new Date().getFullYear();
  // Carousel navigation arrow show
  showNavigationArrows: any;

  /**
   * Confirm Otp Verification
   */
  config = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px'
    }
  };

  constructor() { }

  ngOnInit(): void {
  }

}
