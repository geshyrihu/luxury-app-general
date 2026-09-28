import { Component, inject, TemplateRef } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-centered-modal',
  templateUrl: './centered-modal.html',
  styleUrls: ['./centered-modal.scss'],
  imports: [],
})
export class CenteredModal {
  private modalService = inject(NgbModal);

  centeredModal(centeredModalContent: TemplateRef<NgbModal>) {
    this.modalService.open(centeredModalContent, { centered: true });
  }

  close() {
    this.modalService.dismissAll();
  }
}
