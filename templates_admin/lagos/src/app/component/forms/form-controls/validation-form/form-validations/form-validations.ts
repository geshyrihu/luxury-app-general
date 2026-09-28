import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-validations',
  templateUrl: './form-validations.html',
  styleUrls: ['./form-validations.scss'],
  imports: [FormsModule, ReactiveFormsModule],
})
export class FormValidations {
  public validate = false;

  public submit() {
    this.validate = !this.validate;
  }
}
