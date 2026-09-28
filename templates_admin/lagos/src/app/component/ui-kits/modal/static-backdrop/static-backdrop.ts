import { Component, inject, TemplateRef } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-static-backdrop',
  templateUrl: './static-backdrop.html',
  styleUrls: ['./static-backdrop.scss'],
  imports: [],
})
export class StaticBackdrop {
  private modalService = inject(NgbModal);

  openStaticModal(staticContent: TemplateRef<NgbModal>) {
    this.modalService.open(staticContent);
  }

  close() {
    this.modalService.dismissAll();
  }
}
