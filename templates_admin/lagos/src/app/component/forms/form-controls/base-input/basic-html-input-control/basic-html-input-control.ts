import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { DateTime } from './date-time/date-time';

@Component({
  selector: 'app-basic-html-input-control',
  templateUrl: './basic-html-input-control.html',
  styleUrls: ['./basic-html-input-control.scss'],
  imports: [DateTime],
})
export class BasicHtmlInputControl {
  private router = inject(Router);
  submit() {
    this.router.navigate(['/form-controls/base-inputs']);
  }
}
