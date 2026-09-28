import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tooltip-form',
  templateUrl: './tooltip-form.html',
  styleUrls: ['./tooltip-form.scss'],
  imports: [FormsModule, ReactiveFormsModule],
})
export class TooltipForm {
  public validate = false;
  public tooltipForm = new FormGroup({});

  public form() {
    if (!this.tooltipForm.valid) {
      this.validate = false;
    } else {
      this.validate = true;
    }
  }
}
