import { Component, inject } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-tag',
  templateUrl: './create-tag.html',
  styleUrls: ['./create-tag.scss'],
  imports: [],
})
export class CreateTag {
  public activeModal = inject(NgbActiveModal);
}
