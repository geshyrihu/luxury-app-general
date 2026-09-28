import { Component, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-result-modal',
  templateUrl: './result-modal.html',
  styleUrls: ['./result-modal.scss'],
  imports: [],
})
export class ResultModal {
  private modal = inject(NgbModal);

  close() {
    this.modal.dismissAll();
  }
}
