import { Component, inject, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TagInputModule } from 'ngx-chips';

import { CreateNewCategory } from './create-new-category/create-new-category';
import { CommonSvgIcon } from '../../../../shared/components/common-svg-icon/common-svg-icon';

@Component({
  selector: 'app-product-categories',
  templateUrl: './product-categories.html',
  styleUrls: ['./product-categories.scss'],
  imports: [FormsModule, ReactiveFormsModule, TagInputModule, CommonSvgIcon],
})
export class ProductCategories {
  readonly activeSteps = output<number>();
  public activeStep: number = 3;
  public validate: boolean = false;
  public categoryForm: FormGroup;
  public items = [];
  public modal = inject(NgbModal);

  constructor() {
    this.categoryForm = new FormGroup({
      add_Category: new FormControl('', Validators.required),
      add_Tag: new FormControl('', Validators.required),
      publish_Status: new FormControl('', Validators.required),
      publish_Date_Tile: new FormControl('', Validators.required),
    });
  }

  category() {
    this.modal.open(CreateNewCategory, { size: 'lg' });
  }

  previous() {
    const number = this.activeStep - 1;
    this.activeSteps.emit(number);
  }

  next() {
    this.validate = true;
    if (this.categoryForm.valid) {
      const number = this.activeStep + 1;
      this.activeSteps.emit(number);
    }
  }

  get addCategory() {
    return this.categoryForm.get('add_Category');
  }
  get addTag() {
    return this.categoryForm.get('add_Tag');
  }
  get publishStatus() {
    return this.categoryForm.get('publish_Status');
  }
  get publishDateTile() {
    return this.categoryForm.get('publish_Date_Tile');
  }
}
