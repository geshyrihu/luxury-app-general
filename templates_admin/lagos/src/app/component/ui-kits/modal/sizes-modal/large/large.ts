import { Component, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FeatherIcons } from '../../../../../shared/components/feather-icons/feather-icons';

@Component({
  selector: 'app-large',
  templateUrl: './large.html',
  styleUrls: ['./large.scss'],
  imports: [FeatherIcons],
})
export class Large {
  private modal = inject(NgbModal);

  close() {
    this.modal.dismissAll();
  }
}
