import { Component, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-label',
  templateUrl: './add-label.html',
  styleUrls: ['./add-label.scss'],
  imports: [],
})
export class AddLabel {
  private modal = inject(NgbModal);

  close() {
    this.modal.dismissAll();
  }
}
