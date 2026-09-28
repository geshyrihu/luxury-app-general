import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-raise-input-style',
  templateUrl: './raise-input-style.html',
  styleUrls: ['./raise-input-style.scss'],
  imports: [],
})
export class RaiseInputStyle {
  private router = inject(Router);

  submit() {
    this.router.navigate(['/form-controls/base-inputs']);
  }
}
