import { Component, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AngularEditorModule } from '@kolkov/angular-editor';

import { CommonSvgIcon } from '../../../../shared/components/common-svg-icon/common-svg-icon';

@Component({
  selector: 'app-add-product-details',
  templateUrl: './add-product-details.html',
  styleUrls: ['./add-product-details.scss'],
  imports: [AngularEditorModule, ReactiveFormsModule, FormsModule, CommonSvgIcon],
})
export class AddProductDetails {
  public htmlContent = '';
  public activeStep: number = 1;
  public validate: boolean = false;
  public productForm: FormGroup;

  readonly activeSteps = output<number>();

  constructor() {
    this.productForm = new FormGroup({
      product_Title: new FormControl('', Validators.required),
      text: new FormControl(''),
    });
  }

  next() {
    if (this.productForm.invalid) {
      this.validate = true;
    } else {
      const number = this.activeStep + 1;
      this.activeSteps.emit(number);
    }
  }

  get productTitle() {
    return this.productForm.get('product_Title');
  }
}
