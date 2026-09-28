import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edges-input-style',
  templateUrl: './edges-input-style.html',
  styleUrls: ['./edges-input-style.scss'],
  imports: [],
})
export class EdgesInputStyle {
  private router = inject(Router);

  submit() {
    this.router.navigate(['/form-controls/base-inputs']);
  }
}
