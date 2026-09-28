import { Component, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tooltips-popovers',
  templateUrl: './tooltips-popovers.html',
  styleUrls: ['./tooltips-popovers.scss'],
  imports: [],
})
export class TooltipsPopovers {
  private modal = inject(NgbModal);

  close() {
    this.modal.dismissAll();
  }
}
