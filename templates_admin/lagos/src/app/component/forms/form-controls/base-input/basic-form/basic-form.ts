import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-basic-form',
  templateUrl: './basic-form.html',
  styleUrls: ['./basic-form.scss'],
  imports: [],
})
export class BasicForm {
  private router = inject(Router);

  submit() {
    this.router.navigate(['/form-controls/base-inputs']);
  }
}
