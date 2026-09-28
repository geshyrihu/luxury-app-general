import { Component, inject } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-category',
  templateUrl: './view-category.html',
  styleUrls: ['./view-category.scss'],
  imports: [],
})
export class ViewCategory {
  public activeModal = inject(NgbActiveModal);
}
