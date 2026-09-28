import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-new-category',
  templateUrl: './create-new-category.html',
  styleUrls: ['./create-new-category.scss'],
  imports: [NgbModule, AngularEditorModule, FormsModule, ReactiveFormsModule],
})
export class CreateNewCategory {
  public htmlContent = '';

  public modal = inject(NgbModal);

  close() {
    this.modal.dismissAll();
  }
}
